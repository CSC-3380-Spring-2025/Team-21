from flask import Flask
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from utils.serp_data_parser import extract_event_data, parse_event_datetime
from utils.db_operations import insert_events_to_supabase, prompt_user_for_event_data, search_from_db
import ast
from datetime import datetime
from api_tools import fetch_event_data, add_lat_lng_to_events
import requests
from typing import List, Dict, Union, Tuple, Optional
import googlemaps
import time
import re

load_dotenv()

app: Flask = Flask(__name__)

SUPABASE_URL: str = os.getenv("SUPABASE_URL")
SUPABASE_KEY: str = os.getenv("SUPABASE_API_KEY")

# Create a Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

def main():
    # preset choices
    choice = input("What would you like to do?\n1) Post an event\n2) Search events\n")

    event_data = None  # Initialize event_data to avoid UnboundLocalError

    if choice == '1':
        # call function to post to database
        event_data = prompt_user_for_event_data()

        if event_data:  # Check if event_data is returned
            insert_events_to_supabase([event_data])

    elif choice == '2':
        search_term = input("what ya looking for?")

        db_results = search_from_db(search_term)

        if db_results:
            print("Found:")

            for result in db_results:
                print(result)

        else:
            print("One moment")
            
            #hit the api to get new data on the serch term(incase its not already in the database)
            fetched_data: Dict = fetch_event_data(search_term)
            
            events_list: List[Dict] = fetched_data.get('events_results', [])
            
            extracted_events = []
            for event in events_list:
                try:
                    extracted_event_data = extract_event_data(event)
                    if extracted_event_data:
                        extracted_events.append(extracted_event_data)
                    else:
                        print(f"FAILED TO EXTRACT EVENT DATA")
                except Exception as e:
                    print(f"Error processing event {event} : {e}" )

            
            events_with_coords = add_lat_lng_to_events(extracted_events, gmaps)
            datetimed_events = parse_event_datetime(events_with_coords)
            
            insert_events_to_supabase(datetimed_events)
            print(datetimed_events)
            
            
main()