from typing import List, Dict, Union
from supabase import create_client, Client
import os
from supabase import create_client
from dotenv import load_dotenv
import requests



load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def insert_events_to_supabase(events: List[Dict[str, Union[str, float]]]) -> None:
    for event in events:
        try:
            print(f"Preparing to insert event: {event}")  # Debugging: print the event data before insertion

            existing_event = supabase.table("eventdata").select("eventname").eq("eventname", event["eventname"]).execute()

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
                    "thumbnail": event["thumbnail"],
                    "latitude": event["latitude"],
                    "longitude": event["longitude"]
                }

                response = supabase.table("eventdata").insert(data).execute()
                print(f"Inserted response: {response.data}")  # Debugging: print the response from the insert
            else:
                print(f"Event '{event['eventname']}' already exists. Skipping insert.")
        except Exception as e:
            print(f"Error inserting event: {e}")

def prompt_user_for_event_data() -> Dict[str, Union[str, float]]:
    print("* denotes required field")
    
    event_data = {}
    
    # Prompt for required fields
    while True:
        event_data["eventname"] = input("Event Name *: ")
        if event_data["eventname"]:
            break
        else:
            print("Event Name is required! Please enter a valid event name.")

    while True:
        event_data["eventdate"] = input("Event Date (YYYY-MM-DD) *: ")
        if event_data["eventdate"]:
            break
        else:
            print("Event Date is required! Please enter a valid event date.")

    while True:
        event_data["eventlocation"] = input("Event Location *: ")
        if event_data["eventlocation"]:
            break
        else:
            print("Event Location is required! Please enter a valid event location.")

    while True:
        event_data["eventdescription"] = input("Event Description *: ")
        if event_data["eventdescription"]:
            break
        else:
            print("Event Description is required! Please enter a valid event description.")

    while True:
        event_data["eventlink"] = input("Event Link *: ")
        if event_data["eventlink"]:
            break
        else:
            print("Event Link is required! Please enter a valid event link.")

    while True:
        event_data["ticketinfo"] = input("Ticket Info *: ")
        if event_data["ticketinfo"]:
            break
        else:
            print("Ticket Info is required! Please enter valid ticket information.")

    while True:
        event_data["venuelink"] = input("Venue Link *: ")
        if event_data["venuelink"]:
            break
        else:
            print("Venue Link is required! Please enter a valid venue link.")

    while True:
        event_price_input = input("Event Price (e.g., 25.99) *: ")
        if event_price_input:
            try:
                event_data["eventprice"] = float(event_price_input)
                break
            except ValueError:
                print("Invalid input for event price. Please enter a valid number.")
        else:
            print("Event Price is required! Please enter a valid event price.")
    
    # Optional fields: thumbnail, latitude, and longitude
    event_data["thumbnail"] = input("Thumbnail URL (Press Enter to skip): ") or None

    latitude_input = input("Latitude (Press Enter to skip): ")
    event_data["latitude"] = float(latitude_input) if latitude_input else None

    longitude_input = input("Longitude (Press Enter to skip): ")
    event_data["longitude"] = float(longitude_input) if longitude_input else None

    print(f"Event data collected: {event_data}")
    return event_data




'''
def test_user_input():
    event_data = prompt_user_for_event_data()

    if event_data:
        insert_events_to_supabase([event_data])
 '''
def search_from_db(search_term: str) -> List[Dict[str, Union[str, float]]]:
    try:
        print(f"Searching database for: {search_term}")
        
        # Perform individual searches on each field and combine the results
        query = supabase.table("eventdata").select("*")
        
        # Search for the term in each of the three fields
        name_results = query.ilike("eventname", f"%{search_term}%").execute().data or []
        location_results = query.ilike("eventlocation", f"%{search_term}%").execute().data or []
        description_results = query.ilike("eventdescription", f"%{search_term}%").execute().data or []

        # Combine all results (ensuring no duplicates based on Event_Id)
        all_results = name_results + location_results + description_results

        # Use a dictionary to remove duplicates based on Event_Id
        unique_results = {result['Event_Id']: result for result in all_results}

        # Return unique results
        return list(unique_results.values())

    except Exception as e:
        print(f"Error searching database: {e}")
        return []  # Return an empty list in case of error

'''  
search_term = input("What ya lookin for?")

results = search_from_db(search_term)

if results:
    print("Search results: ")
    for result in results:
        print(result)
else:
    print("no results found.")

    '''
