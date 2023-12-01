# OpenAI Assistant Demo

Author: An IT-a

Feel free to subscribe my [Youtube channel](http://www.youtube.com/@an.it.a).

And follow my [Instagram account](https://www.instagram.com/iam.an.it.a/).

## Prerequisites

- Python 3
- Flask
- OpenAI API key
- Assistant ID

## OpenAI API key
Create your API key at https://platform.openai.com/api-keys

## Create Assistant
Create your assistant at https://platform.openai.com/assistants

## Installation

1. Set Up a Virtual Environment (Optional but recommended)
   ```
   python -m venv venv
   ```
   For Linux / Mac:
   ```
   source venv/bin/activate
   ```
   For Windows:
   ```
   venv\Scripts\activate
   ```

2. Install Dependencies
   ```
   pip install Flask openai paramiko
   ```

3. Update your Variables
   
   In file `app.py` line 5-8:

   ```
   # Set OpenAI API key
   openai.api_key = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxx"
   # Set your assistant ID
   assistant_id = "asst_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

4. Run the Application
   ```
   python app.py
   ```
