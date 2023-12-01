let currentThreadId = null;

function disableSendButton() {
    const sendButton = document.getElementById("send-btn");
    sendButton.innerHTML = "Loading";
    sendButton.disabled = true;
}

function enableSendButton() {
    const sendButton = document.getElementById("send-btn");
    sendButton.innerHTML = "Send";
    sendButton.disabled = false;
}

function sendPrompt(threadId, prompt) {
    disableSendButton();
    appendMessage("User", prompt);

    fetch("/send", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt, thread_id: threadId }),
    })
    .then(response => response.json())
    .then(data => {
        enableSendButton();
        appendMessage("Assistant", data);
    })
    .catch((error) => {
        enableSendButton();
        console.error("Error: ", error);
        appendLog("Error sending message");
    });
}

document.getElementById("send-btn").addEventListener("click", function() {
    const promptInput = document.getElementById("prompt-input");
    const prompt = promptInput.value;
    if (!prompt)
        return;

    if (!currentThreadId) {
        fetch("/new_thread", {
           method: "POST"
        })
        .then(response => response.json())
        .then(data => {
            if(data.thread_id) {
                currentThreadId = data.thread_id;
                sendPrompt(data.thread_id, prompt);
            }
            else
                appendLog("Error creating thread");
        })
        .catch((error) => {
            console.error("Error: ", error);
            appendLog("Error creating thread");
        });
    }
    else
        sendPrompt(currentThreadId, prompt);

    promptInput.value = "";
});

document.getElementById("prompt-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("send-btn").click();
    }
});

document.getElementById("new-thread-btn").addEventListener("click", function() {
    fetch("/new_thread", {
        method: "POST"
    })
    .then(response => response.json())
    .then(data => {
        if (data.thread_id) {
            currentThreadId = data.thread_id;
            document.getElementById("prompt-input").value = "";
            document.getElementById("message-container").innerHTML = "";
        } else
            appendLog("Error creating thread");
    })
    .catch((error) => {
        console.error("Error: ", error);
        appendLog("Error creating thread");
    });
});

function appendMessage(role, message) {
    const messagesContainer = document.getElementById("message-container");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message-entry");
    if (role === "Assistant")
        message = formatResponse(message);
    messageDiv.innerHTML = `<div class="message-from">${role}</div><div class="message-content">${message}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollIntoView({ behavior: "smooth", block: "end" });
}

function appendLog(message) {
    const messagesContainer = document.getElementById("message-container");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message-entry");
    messageDiv.classList.add("message-error-entry");
    messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollIntoView({ behavior: "smooth", block: "end" });
}

function formatResponse(responseText) {
    // Replace triple backtick blocks with <pre><code> tags
    let formattedText = responseText.replace(/```(.*?)```/gs, "<pre>$1</pre>");
    // Replace single backticks with <code> tags for inline code
    formattedText = formattedText.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Convert line breaks to <br> tags for the remaining text
    formattedText = formattedText.replace(/\n/g, "<br>");
    return formattedText;
}


window.onload = function() {
    document.getElementById("prompt-input").focus();
};