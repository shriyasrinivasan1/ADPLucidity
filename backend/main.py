import requests
import webbrowser
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
import csv

# Your Webex App's client ID, client secret, and redirect URI
CLIENT_ID = 'C4b9242b68105c5692559d82edf879f45edc93c13388ce20481cfeeaeff0c0f1e'
CLIENT_SECRET = '14baf600ac7b0f2403d9eb6fd5c3c4456b15f48ffa19697b1fa55bd5e8d26913'
REDIRECT_URI = 'http://localhost:8000/callback'  # Local redirect URI for OAuth

app = FastAPI()

# Global variable to store authorization code and to track the page opening
authorization_code = None
authorization_page_opened = False  # Flag to track if the authorization page has already been opened

# Redirect URL to be opened in the browser for the user to authorize
authorization_url = (
    f'https://webexapis.com/v1/authorize?client_id=C4b9242b68105c5692559d82edf879f45edc93c13388ce20481cfeeaeff0c0f1e&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback&scope=spark-compliance%3Ameetings_write%20meeting%3Arecordings_read%20analytics%3Aread_all%20meeting%3Aparticipants_read%20meeting%3Aadmin_participants_read%20spark-admin%3Aevents_read%20spark-compliance%3Ameetings_read%20meeting%3Aadmin_recordings_read%20meeting%3Atranscripts_read%20spark%3Amessages_read%20spark-compliance%3Aevents_read%20spark-compliance%3Arooms_read%20spark-compliance%3Ateam_memberships_read%20spark-compliance%3Ateam_memberships_write%20spark%3Akms%20meeting%3Acontrols_write%20spark%3Arooms_read%20spark-admin%3Amessages_read%20meeting%3Acontrols_read%20spark-compliance%3Ateams_read%20spark-compliance%3Arooms_write%20spark-compliance%3Arecordings_read%20spark-admin%3Apeople_read%20meeting%3Aadmin_transcripts_read'
)

@app.get("/")
async def root():
    global authorization_page_opened
    # Open the Webex OAuth authorization page only once
    if not authorization_page_opened:
        webbrowser.open(authorization_url)  # Open the authorization URL in the browser
        authorization_page_opened = True  # Mark as opened
        return {"message": "Please check your browser for the Webex OAuth authorization page."}
    else:
        return {"message": "The authorization page has already been opened. Please proceed with the authorization process."}


@app.get("/callback")
async def callback(request: Request):
    global authorization_code
    # Extract the authorization code from the URL query parameters
    authorization_code = request.query_params.get('code')
    print(f"Authorization code received: {authorization_code}")

    # Exchange the authorization code for an access token
    access_token = await get_access_token(authorization_code)
    
    if access_token:
        rooms = await get_rooms(access_token)
        if rooms:
            # Get the first room's ID automatically
            room_id = rooms[0]['id']
            await get_messages_from_all_rooms(access_token)
        else:
            print("No rooms found.")
    else:
        print("Access token retrieval failed, aborting.")

    # Confirmation message for successful authorization and token retrieval
    return {"message": "Authorization successful! You can now interact with Webex API."}

# Step 2: Exchange the authorization code for an access token
async def get_access_token(authorization_code):
    token_url = 'https://webexapis.com/v1/access_token'
    
    # Prepare the data for the token request
    data = {
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': authorization_code,
        'redirect_uri': REDIRECT_URI,
        'grant_type': 'authorization_code',
    }
    
    # Make the request to get the access token
    response = requests.post(token_url, data=data)
    
    if response.status_code == 200:
        # Extract the access token from the response
        access_token = response.json()['access_token']
        print("Access token successfully retrieved!")
        return access_token
    else:
        print("Failed to get access token:", response.text)
        return None

# Step 3: Get rooms (and their room IDs)
async def get_rooms(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    response = requests.get('https://webexapis.com/v1/rooms', headers=headers)
    
    if response.status_code == 200:
        rooms = response.json()['items']
        print("List of rooms:")
        for room in rooms:
            print(f"Room Name: {room['title']}, Room ID: {room['id']}")
        return rooms
    else:
        print("Failed to fetch rooms:", response.text)
        return None

# Function to write messages to a CSV file
async def write_messages_to_csv(messages):
    with open('webex_messages.csv', mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Message Content'])  # Header for the CSV file
        for message in messages:
            writer.writerow([message])  # Write each message

async def get_messages_from_all_rooms(access_token):
    headers = {
        'Authorization': f'Bearer {access_token}',
    }
    
    # Fetch rooms first
    rooms_response = requests.get('https://webexapis.com/v1/rooms', headers=headers)
    
    if rooms_response.status_code == 200:
        rooms = rooms_response.json()['items']
        print("Fetching messages from all rooms...")
        
        all_messages = []  # To store all the messages from the rooms
        
        for room in rooms:
            room_id = room['id']
            # Fetch messages from each room
            response = requests.get(f'https://webexapis.com/v1/messages', headers=headers, params={'roomId': room_id})
            
            if response.status_code == 200:
                messages = response.json()
                print(f"Messages from room {room['title']} (ID: {room_id}):")
                if messages['items']:
                    for message in messages['items']:
                        all_messages.append(message['text'])  # Append message content to the list
                else:
                    print("No messages found in this room.")
            else:
                print(f"Failed to fetch messages from room {room_id}: {response.text}")
        
        # Once all messages are gathered, write them to the CSV
        await write_messages_to_csv(all_messages)
    else:
        print("Failed to fetch rooms:", rooms_response.text)

        