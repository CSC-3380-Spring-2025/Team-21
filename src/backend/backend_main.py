from flask import Flask
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from utils.serp_data_parser import extract_event_data
from utils.db_operations import insert_events_to_supabase, prompt_user_for_event_data, search_from_db
import ast
from datetime import datetime
from api_tools import fetch_event_data, add_lat_lng_to_events
import requests
from typing import List, Dict, Union
import googlemaps

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
        # search database for event data. if no matches call SERPapi
        search_term = input("Enter a search term to find events: ")
        
        print(f"Searching database for: {search_term}")
        results = search_from_db(search_term)
        
        if results:
            print("Search results:")
            for result in results:
                print(result)
        else:
            print("No results found in the database. Fetching new event data...")

            # Fetch event data from external source
            fetched_data = fetch_event_data()

            if fetched_data:
                print("New events fetched from the external source.")
                
                # Now process the fetched data using extract_event_data
                event_data = extract_event_data(fetched_data)  # Assuming extract_event_data processes the fetched data

                if event_data:
                    print("Processed events:")
                    for event in event_data:
                        print(event)

                    # Optionally, insert the new events into the database
                    insert_events_to_supabase(event_data)
                else:
                    print("No valid events found after extraction.")
            else:
                print("No new events found.")
    
    else:
        print("Invalid choice please enter 1 or 2.")

main()


main()
