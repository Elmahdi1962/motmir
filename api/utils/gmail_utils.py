from __future__ import print_function

import os.path
from os import getenv

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import base64
from email.mime.image import MIMEImage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.audio import MIMEAudio
from email.mime.base import MIMEBase
import mimetypes

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def get_gmail_service():
    """Creates a gmail api service
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.json'):
        creds = Credentials.from_authorized_user_file('token.json', SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=8080)
        # Save the credentials for the next run
        with open('token.json', 'w') as token:
            token.write(creds.to_json())

    try:
        # Call the Gmail API
        service = build('gmail', 'v1', credentials=creds)
        return service

    except HttpError as error:
        # TODO(developer) - Handle errors from gmail API.
        print(f'An error occurred: {error}')
        

def send_gmail_message(service, user_id, message):
    '''sends a message using gmail api service'''
    try:
        message = service.users().messages().send(userId=user_id, body=message).execute()
        print(f'message ID: {message["id"]}')
    except Exception as e:
        print(f'Error occured when trying to send message : {e}')


def create_gmail_message(to, subject, body, file=None):
    '''creates a message object with or with out an attachement'''
    message = MIMEMultipart()
    message['to'] = to
    message['from'] = getenv('GMAIL_SENDER_EMAIL')
    message['subject'] = subject
    
    msg =MIMEText(body)
    message.attach(msg)
    
    if file is not None:
        (content_type, encoding) = mimetypes.guess_type(file)
        
        if content_type is None or encoding is not None:
            content_type = 'application/octet-stream'
            
        (main_type, sub_type) = content_type.split('/', 1)
        
        if main_type == 'text':
            with open(file, 'rb') as f:
                msg = MIMEText(f.read().decode('utf-8'), _subtype=sub_type)
        
        elif main_type == 'image':
            with open(file, 'rb') as f:
                msg = MIMEImage(f.read(), _subtype=sub_type)

        elif main_type == 'audio':
            with open(file, 'rb') as f:
                msg = MIMEAudio(f.read(), _subtype=sub_type)
    
        else:
            with open(file, 'rb') as f:
                msg = MIMEBase(main_type, sub_type)
                msg.set_payload(f.read())
                
        filename = os.path.basename(file)
        msg.add_header('Content-Disposition', 'attachment', filename=filename)
        message.attach(msg)

    raw_msg = base64.urlsafe_b64encode(message.as_string().encode('utf-8'))
    
    return {'raw': raw_msg.decode('utf-8')}
