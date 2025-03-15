from flask import Flask
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from utils.serp_data_parser import extract_event_data, insert_events_to_supabase
import ast
from datetime import datetime
from api_tools import fetch_event_data
import requests
from typing import List, Dict, Union

load_dotenv()

app: Flask = Flask(__name__)

SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_API_KEY")

# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

SERP_DATA: Dict = fetch_event_data()

events_list: List[Dict] = SERP_DATA.get('events_results', [])

extracted_events: List[Dict[str, Union[str, float]]] = []

for event in events_list:
    extracted_event: Dict[str, Union[str, float]] = extract_event_data(event)
    extracted_events.append(extracted_event)

print(extracted_events)

insert_events_to_supabase(extracted_events)
