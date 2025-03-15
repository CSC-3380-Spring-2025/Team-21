import json
import os
import sqlite3
import re
import ast
from supabase import create_client, Client
from dotenv import load_dotenv
from datetime import datetime
from typing import Dict, List, Union

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def extract_event_data(event: Dict) -> Dict[str, Union[str, float]]:
    return {
        "eventname": event.get("title", ""),
        "eventdate": f"{event['date']['when']}",
        "eventlocation": ", ".join(event.get('address', [])),
        "eventdescription": event.get('description', 'No description available'),
        "eventlink": event.get('link', ''),
        "ticketinfo": "; ".join([ticket.get('link', '') for ticket in event.get('ticket_info', [])]),
        "venuelink": event.get('event_location_map', {}).get('link', ''),
        "eventprice": event.get('event_price', 0.0),  # float type
        "thumbnail": event.get('image', '')
    }


def insert_events_to_supabase(events: List[Dict[str, Union[str, float]]]) -> None:
    for event in events:
        try:
            # Check if the event already exists by its name
            existing_event = supabase.table("eventdata").select("eventname").eq("eventname", event["eventname"]).execute()

            # If no event with the same name exists, insert it
            if not existing_event.data:
                data = {
                    "eventname": event.get("eventname", "No Name"),
                    "eventdate": event["eventdate"],
                    "eventlocation": event["eventlocation"],
                    "eventdescription": event["eventdescription"],
                    "eventlink": event["eventlink"],
                    "ticketinfo": event["ticketinfo"],
                    "venuelink": event["venuelink"],
                    "eventprice": event["eventprice"],
                    "thumbnail": event["thumbnail"]
                }

                response = supabase.table("eventdata").insert(data).execute()

                print(f"Inserted: {response.data}")
            else:
                print(f"Event '{event['eventname']}' already exists. Skipping insert.")

        except Exception as e:
            print(f"Error inserting event: {e}")
