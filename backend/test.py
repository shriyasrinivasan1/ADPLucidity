import os
import pickle
import google.auth
import base64
import csv
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request


# If modifying or deleting your Gmail, you'll need different scopes:
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send']

def authenticate_gmail():
    """Authenticate and get Gmail service."""
    creds = None

    # Token file stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.pkl'):
        with open('token.pkl', 'rb') as token:
            creds = pickle.load(token)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                '/Users/ayushpatel/lucid/backend/creds.json', SCOPES)
            creds = flow.run_local_server(port=8000)

        # Save the credentials for the next run.
        with open('token.pkl', 'wb') as token:
            pickle.dump(creds, token)

    try:
        # Build the Gmail API service
        service = build('gmail', 'v1', credentials=creds)

        return service

    except HttpError as error:
        print(f'An error occurred: {error}')
        return None
import os
import pickle
import google.auth
import csv
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from google.auth.transport.requests import Request


# If modifying or deleting your Gmail, you'll need different scopes:
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def authenticate_gmail():
    """Authenticate and get Gmail service."""
    creds = None

    # Token file stores the user's access and refresh tokens, and is created automatically when the authorization flow completes for the first time.
    if os.path.exists('token.pkl'):
        with open('token.pkl', 'rb') as token:
            creds = pickle.load(token)

    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                '/Users/ayushpatel/lucid/backend/creds.json', SCOPES)
            creds = flow.run_local_server(port=8000)

        # Save the credentials for the next run.
        with open('token.pkl', 'wb') as token:
            pickle.dump(creds, token)

    try:
        # Build the Gmail API service
        service = build('gmail', 'v1', credentials=creds)

        return service

    except HttpError as error:
        print(f'An error occurred: {error}')
        return None

def get_email_body(message):
    """Extract the body content of the email."""
    for part in message['payload']['parts']:
        if part['mimeType'] == 'text/plain':
            return part['body']['data']
    return None

def list_emails(service):
    """List the first 10 emails from the inbox and save their contents to a CSV."""
    try:
        # Call the Gmail API to fetch the messages
        results = service.users().messages().list(userId='me', labelIds=['INBOX']).execute()
        messages = results.get('messages', [])

        if not messages:
            print('No new messages.')
        else:
            print('Messages:')
            
            # Open the CSV file for writing
            with open('emails.csv', mode='w', newline='', encoding='utf-8') as file:
                writer = csv.writer(file)
                # Write the header row
                writer.writerow(['Message ID', 'Email Content'])

                for message in messages[:10]:
                    msg = service.users().messages().get(userId='me', id=message['id']).execute()

                    # Extract the email body
                    body = get_email_body(msg)
                    if body:
                        # Decode the base64 encoded body
                        body_decoded = base64.urlsafe_b64decode(body).decode('utf-8')
                    else:
                        body_decoded = 'No body content available'
                    
                    # Write the email message and body to the CSV
                    writer.writerow([message['id'], body_decoded])

            print("Emails have been written to 'emails.csv'.")

    except HttpError as error:
        print(f'An error occurred: {error}')

def main():
    """Main function to authenticate and fetch emails."""
    service = authenticate_gmail()
    if service:
        list_emails(service)

if __name__ == '__main__':
    main()
