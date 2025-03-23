import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, List, Union



load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def extract_event_data(event: Dict) -> Dict[str, Union[str, float]]:
    event_data = {
        "eventname": event.get("title", ""),
        "eventdate": f"{event['date']['when']}",
        "eventlocation": ", ".join(event.get('address', [])),
        "eventdescription": event.get('description', 'No description available'),
        "eventlink": event.get('link', ''),
        "ticketinfo": "; ".join([ticket.get('link', '') for ticket in event.get('ticket_info', [])]),
        "venuelink": event.get('event_location_map', {}).get('link', ''),
        "eventprice": event.get('event_price', 0.0),  # float type
        "thumbnail": event.get('image', ''),
        "longitude": None,
        "latitude": None
    }
    print(f"Extracted event data: {event_data}")  # Debugging: print the event data extracted
    return event_data

