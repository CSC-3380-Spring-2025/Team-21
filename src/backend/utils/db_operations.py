from typing import List, Dict, Union
from supabase import create_client, Client
import os
from supabase import create_client
from dotenv import load_dotenv
import requests
import re
from datetime import datetime



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
                    "longitude": event["longitude"],
                    "eventday" : event["eventday"],
                    "starttime" : event["starttime"]
                }

                response = supabase.table("eventdata").insert(data).execute()
                #print(f"Inserted response: {response.data}")  # Debugging: print the response from the insert
                print(f"Insert response from Supabase: {response}")

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
            # Enforce YYYY-MM-DD format
            if re.match(r"\d{4}-\d{2}-\d{2}", event_data["eventdate"]):
                break
            else:
                print("Invalid date format. Please use YYYY-MM-DD.")
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
    
    # optional field: Event Start Time
    while True:
        event_start_time_input = input("Event Start Time (HH:MM, 24-hour format, Press Enter to skip): ")
        if event_start_time_input:
            if re.match(r"([01]?[0-9]|2[0-3]):([0-5][0-9])", event_start_time_input):
                event_data["starttime"] = event_start_time_input
                break
            else:
                print("Invalid time format. Please enter time in HH:MM format.")
        else:
            event_data["starttime"] = None
            break
    
    #required field: Event Day
    while True:
        event_day_input = input("Event Day (YYYY-MM-DD) *: ")
        if event_day_input:
            # Enforce YYYY-MM-DD format
            if re.match(r"\d{4}-\d{2}-\d{2}", event_day_input):
                event_data["eventday"] = event_day_input
                break
            else:
                print("Invalid date format. Please use YYYY-MM-DD.")
        else:
            print("Event Day is required! Please enter a valid event day.")

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

def fetch_events():
    response = supabase.table('eventdata').select('eventid', 'eventday', 'starttime').execute()

   # Supabase's response might not have an explicit `error` attribute; use a try/except block to catch errors.
    try:
        if response.data:
            return response.data
        else:
            print("No data fetched from Supabase.")
            return []
    except Exception as e:
        print(f"Error fetching data from Supabase: {e}")
        return []


def sort_events(events):
    def get_sort_key(event):
        event_day = datetime.strptime(event['eventday'], '%Y-%m-%d')
        
        event_time = None
        if event.get('starttime'):
            try:
                event_time = datetime.strptime(event['starttime'], '%H:%M:%S') if event.get('starttime') else None
            except ValueError:
                pass

        if event_time is None:
            event_time = datetime.strptime('00:00', '%H:%M')

        return (event_day, event_time, event['eventid'])

    sorted_events = sorted(events, key=get_sort_key)
    return sorted_events



'''
def test_sort():
    events = fetch_events()
    if events:
        sorted_events = sort_events(events)
        print("Sorted Events:")
        for event in sorted_events:
            print(event)


test_sort()
'''

def get_all_events(supabase: Client):
    try:
        events = supabase.table("eventdata").select("*").execute()
        print("Fetched events from DB:", events.data)
        return {"events" : events.data}

    except Exception as e:
        print(f"Error fetching events: {e}")
        return[]    

def insert_profile_to_supabase(profile_data: Dict[str, str], supabase:Client) -> Dict[str, str]:
    try:
        print(f"Preparing to insert profile: {profile_data}")  # Debugging: print the profile data before insertion
        # Check if the profile already exists
        existing_profile = supabase.table("profiles").select("email").eq("email", profile_data["email"]).execute()

        if not existing_profile.data:
            response = supabase.table("profiles").insert(profile_data).execute()
            print(f"Inserted response: {response.data}")  # Debugging: print the response from the insert
            return {
                "success": True,
                "message": f"Profile with email '{profile_data['email']}' inserted successfully."
            }
        else:
            print(f"Profile with email '{profile_data['email']}' already exists. Skipping insert.")
            return {
                "success": False,
                "message": f"Profile with email '{profile_data['email']}' already exists."
            }
    except Exception as e:
        print(f"Error inserting profile: {e}")
        return {
            "success": False,
            "message": f"Error inserting profile: {e}"
        }