from flask import Flask, render_template, request, jsonify
import openai, time, paramiko, json


# Set OpenAI API key
openai.api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxx"
# Set your assistant ID
assistant_id = "asst_xxxxxxxxxxxxxxxxxxxxxxxxxxx"


app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/new_thread", methods=["POST"])
def new_thread():
    try:
        thread = openai.beta.threads.create()
        return jsonify({"thread_id": thread.id})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/send", methods=["POST"])
def send():
    thread_id = request.json.get("thread_id")
    prompt = request.json.get("prompt")

    if not prompt:
        return jsonify("No prompt"), 400
    if thread_id == "None":
        return jsonify("No thread"), 400

    try:
        openai.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=prompt
        )

        run = openai.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=assistant_id
        )

        while run.status != "completed" and run.status != "failed":
            print("Run Status: " + run.status)
            run = openai.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run.id
            )

            # TODO handle functions
            if run.status == "requires_action":
                print(run.required_action.submit_tool_outputs.tool_calls)

            time.sleep(10) # Sleep and check run status again

        print("Run Status: " + run.status)

        if run.status == "failed":
            return jsonify(str(run.last_error.message)), 500

        msgs = openai.beta.threads.messages.list(thread_id)

        return jsonify(msgs.data[0].content[0].text.value)
    except Exception as e:
        print(str(e))
        return jsonify(str(e)), 500


if __name__ == "__main__":
    app.run(debug=True)

