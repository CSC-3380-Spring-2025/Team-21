import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, List, Union, Tuple, Optional
import time
from datetime import datetime
import re




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
    #print(f"Extracted event data: {event_data}")  # Debugging: print the event data extracted
    return event_data


def parse_event_datetime(events: List[Dict[str, str]]) -> List[Dict[str, Union[str, None]]]:
    """
    Parses event date strings into sortable components: event day and start time for each event.

    :param events: A list of dictionaries where each dictionary contains an event with a 'eventdate' string.
    :return: A list of dictionaries, each containing the event with parsed 'eventday' and 'starttime'.
    """
    timed_event = []  # Use timed_event to store the updated event dictionaries with parsed datetimes
    for event in events:
        try:
            event_date_str = event.get("eventdate", "")
            event_day = None
            start_time = None
            
            # Assume the year is 2025 for date parsing
            assumed_year = "2025"

            # Extract the date part (assumes date is before time)
            date_match = re.search(r"([A-Za-z]+, \s*[A-Za-z]+ \d{1,2})", event_date_str)
            if date_match:
                event_day_str = f"{date_match.group(1)} {assumed_year}"
                event_day = datetime.strptime(event_day_str, "%a, %b %d %Y").strftime("%Y-%m-%d")

            # Extract the start time part after the second comma
            time_match = re.search(r",\s*(\d{1,2}(:\d{2})?)(\s*(AM|PM))?", event_date_str)
            if time_match:
                start_time_str = time_match.group(1)
                am_pm = time_match.group(4)  # AM/PM if available

                # If AM/PM is found with the first time number
                if am_pm:
                    start_time = datetime.strptime(start_time_str + " " + am_pm, "%I:%M %p" if ":" in start_time_str else "%I %p").strftime("%H:%M:%S")
                else:
                    # If no AM/PM found, check further down the string
                    further_am_pm = re.search(r"(AM|PM)", event_date_str)
                    if further_am_pm:
                        # Use the found AM/PM to convert the time
                        start_time = datetime.strptime(start_time_str + " " + further_am_pm.group(1), "%I:%M %p" if ":" in start_time_str else "%I %p").strftime("%H:%M:%S")
                    else:
                        start_time = None  # Time without AM/PM is unsortable

            # Append the event with parsed datetime info to the timed_event list
            timed_event.append({
                **event,  # Keep all original event data
                "eventday": event_day,
                "starttime": start_time,
            })
        
        except Exception as e:
            print(f"Error parsing event date '{event.get('eventname', '')}': {e}")
            # If there's an error parsing, still add the event with None values for datetime
            timed_event.append({
                **event,  # Keep all original event data
                "eventday": None,
                "starttime": None,
            })

    return timed_event


'''
# Example Tests
test_cases = [
    "Sat, Mar 29, 2 – 6 AM",  # First time has AM
    "Sat, Mar 29",  # No time, no sorting
    "Sat, Mar 29, 8 PM",  # First time has PM
    "Mon, Apr 1, 5:30 – 9 PM",  # First time has no AM/PM, but found later
    "Fri, May 10, 10 AM – 12 PM",  # First time has AM
    "Mon, Apr 2, 9-5"  # No AM/PM in time range
]

for test in test_cases:
    print(parse_event_datetime(test))
'''