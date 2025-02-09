from fastapi import FastAPI
import requests

# Webex API URL and Bot Access Token
WEBEX_ACCESS_TOKEN = 'YzQ0ZmNkZGItMWU1Ny00MTViLTliMjEtZDhmZTkzZWJhYmQyOTgzNTJhOTktNjdm_PF84_4b2ccbc6-286b-4822-8df0-406a0a012d52'
WEBEX_API_URL = 'https://webexapis.com/v1/messages'

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("Webex bot is up and running! Waiting for user messages...")

@app.post("/webex-webhook")
async def webhook(event: dict):
    print(event)
    if 'data' in event: 
        person_id = event['data']['personId']
        
        # Ignore messages from the bot itself
        if person_id != 'Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL2M0YTE1MTg1LTBhNDItNDkzZS05ZDRjLWI1OWY3ZGJkMmMxZg':  # Replace with your bot's ID
            
            # Fetch the actual message details from Webex using message ID
            message_id = event['data']['id']
            message = get_message_text(message_id)

            if message:
                # Parse the command and respond accordingly
                if message.startswith('/feedback'):
                    response_message = handle_feedback_command(message)
                else:
                    response_message = f"Received your message: {message}"
                
                send_message_to_webex(person_id, response_message)

    return {"status": "OK"}

def handle_feedback_command(message: str) -> str:
    """Handles the /feedback command."""
    # Extract the feedback after the command
    feedback = message[len('/feedback'):].strip()
    if feedback:
        return f"Thank you for your feedback: '{feedback}'"
    else:
        return "Please provide feedback after the /feedback command."

def send_message_to_webex(user_id, message):
    payload = {
        'toPersonId': user_id,
        'text': message
    }
    headers = {
        'Authorization': f'Bearer {WEBEX_ACCESS_TOKEN}'
    }
    
    response = requests.post(WEBEX_API_URL, json=payload, headers=headers)
    if response.status_code == 200:
        print(f"Message sent to {user_id}: {message}")
    else:
        print(f"Failed to send message: {response.status_code}, {response.text}")

def get_message_text(message_id: str) -> str:
    url = f"{WEBEX_API_URL}/{message_id}"
    headers = {
        'Authorization': f'Bearer {WEBEX_ACCESS_TOKEN}'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        message_data = response.json()
        return message_data.get('text', '')
    else:
        print(f"Failed to fetch message text: {response.status_code}, {response.text}")
        return ""

# Run FastAPI app using Uvicorn
# To run, use the following command:
# uvicorn main:app --reload
