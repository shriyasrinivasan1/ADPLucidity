from fastapi import FastAPI, WebSocket
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import requests
from employee_bot_1 import employee_chatbot
from sent_pipeline import chatbot_response, happiness_index, summarize_ollama
from sent_pipeline_test_2 import analyze_sentiment, get_sentiment_response
import os

# Webex API URL and Bot Access Token
WEBEX_ACCESS_TOKEN = 'YzQ0ZmNkZGItMWU1Ny00MTViLTliMjEtZDhmZTkzZWJhYmQyOTgzNTJhOTktNjdm_PF84_4b2ccbc6-286b-4822-8df0-406a0a012d52'
WEBEX_API_URL = 'https://webexapis.com/v1/messages'

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domains in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Webex bot is up and running! Waiting for user messages...")

first_interaction = True  

@app.post("/webex-webhook")
async def webhook(event: dict):
    global first_interaction  # Use the global flag
    print(event)

    if 'data' in event: 
        person_id = event['data']['personId']

        # Ignore messages from the bot itself
        if person_id != 'Y2lzY29zcGFyazovL3VzL0FQUExJQ0FUSU9OL2M0YTE1MTg1LTBhNDItNDkzZS05ZDRjLWI1OWY3ZGJkMmMxZg':  # Replace with your bot's ID
            
            # Fetch the actual message details from Webex using message ID
            message_id = event['data']['id']
            message = get_message_text(message_id)

            if message:
                if first_interaction:  
                    response_message = employee_chatbot()
                    first_interaction = False  # Mark that the first message was sent
                    print("First-time interaction - No input sent.")
                else:
                    print(f"User said: {message}")
                    response_message = employee_chatbot(message)  # Normal chatbot response
                
                send_message_to_webex(person_id, response_message)

    return {"status": "OK"}

@app.get("/happiness")
async def get_happiness_score():
    number = happiness_index()
    print(number)
    return JSONResponse(content={"percentage": 75})

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
    
@app.websocket("/ws/chat")
async def chat(websocket: WebSocket):
    await websocket.accept()
    while True:
        try:
            # Receive message from the client
            message = await websocket.receive_text()
            print(f"Received message: {message}")

        
            message_data = json.loads(message) 
            message_text = message_data.get("message", "")

            print(message_text)
            
            # Process the message (you can integrate with your LLM here)
            response = chatbot_response(message_text)  # Replace with LLM response

            # Send the processed response back to the client
            await websocket.send_text(json.dumps({"message": response}))
        
        except Exception as e:
            print(f"Error: {e}")
            break
    await websocket.close()

