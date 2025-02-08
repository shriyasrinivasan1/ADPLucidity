import requests
import os

# Azure credentials (make sure these are correct)
tenant_id = os.getenv("AZURE_TENANT_ID", "7748c3ae-c280-4797-ba9e-224b5d517852")
client_id = os.getenv("AZURE_CLIENT_ID", "bfabffce-cc81-4af0-b582-4884814ae2a2")
client_secret = os.getenv("AZURE_CLIENT_SECRET", "IG98Q~Qhtu3cFGNJ8mnOqNhBpQXSd92QUQYf8dqn")

# URL for getting the access token
token_url = f"https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token"

# Data to request the token
data = {
    "client_id": client_id,
    "client_secret": client_secret,
    "grant_type": "client_credentials",
    "scope": "https://graph.microsoft.com/.default"  # Using .default scope for client credentials flow
}

try:
    # Get the access token
    response = requests.post(token_url, data=data)
    response.raise_for_status()  # This will raise an error for HTTP 400+
    token = response.json()
    access_token = token["access_token"]
    print("Access Token:", access_token)

    # Use the token to call the Microsoft Graph API to read emails
    graph_url = "https://graph.microsoft.com/v1.0/me/messages"  # Or use /users/{id}/messages for a specific user
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Send GET request to fetch emails
    email_response = requests.get(graph_url, headers=headers)
    email_response.raise_for_status()  # Check if the request was successful
    emails = email_response.json()

    # Print out the email subjects as an example
    if "value" in emails:
        for email in emails["value"]:
            print(f"Subject: {email['subject']}")
    else:
        print("No emails found")

except requests.exceptions.RequestException as e:
    print("Error:", e)
    if 'response' in locals():
        print("Response:", response.text)  # Print detailed error message
