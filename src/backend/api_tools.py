import os
import requests
from dotenv import load_dotenv
import random
from typing import Optional, Dict, Union, List
import googlemaps

# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from environment variables
SERP_API_KEY = os.getenv("SERPAPI_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

# Ensure the key is being loaded correctly
if not SERP_API_KEY:
    raise ValueError("Error: SERPAPI_KEY not found in .env file.")
else:
    print("API key successfully loaded.")

# Define the function to fetch event data
def fetch_event_data(query: str) -> Optional[Dict]:
    """
    Fetches event data from the SERP API with randomized pagination.

    Returns:
        Optional[Dict]: Parsed JSON response or None if the request fails.
    """
    


    # Generate a random page number between 1 and 10
    random_page = random.randint(1, 10)

    # Calculate the 'start' parameter for pagination (0 for page 1, 10 for page 2, etc.)
    start_index = (random_page - 1) * 10

    # Set up the search parameters
    params = {
        "engine": "google_events",
        "q": query,
        "hl": "en",
        "api_key": SERP_API_KEY,
        "start": start_index
    }

    try:
        # Make the API request
        response = requests.get("https://serpapi.com/search", params=params)
        response.raise_for_status()  # Raise an exception for HTTP errors

        # Return the parsed JSON data if successful
        return response.json()

    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None  # Return None if the request fails


def add_lat_lng_to_events(events: List[Dict[str, Union[str, float]]], gmaps) -> List[Dict[str, Union[str, float]]]:
    updated_events = []
    for event in events:
        print(f"Processing event: {event}")  # Debugging: print the event data before processing
        
        address = event.get("eventlocation")
        
        if address:
            print(f"Attempting to geocode address: {address}")  # Debugging: print the address being geocoded

            try:
                geocode_results = gmaps.geocode(address)
                print(f"Geocode results: {geocode_results}")  # Debugging: print geocode results
                
                if geocode_results and isinstance(geocode_results, list) and len(geocode_results) > 0:
                    location = geocode_results[0]["geometry"]["location"]
                    event["latitude"] = location["lat"]
                    event["longitude"] = location["lng"]
                    print(f"Latitude: {event['latitude']}, Longitude: {event['longitude']}")  # Debugging: print lat/lng
                else:
                    print(f"Geocode failed for address: {address}")
                    event["latitude"] = None
                    event["longitude"] = None
            except Exception as e:
                print(f"Error fetching lat/lng for address '{address}': {e}")
                event["latitude"] = None
                event["longitude"] = None
        else:
            print(f"No address provided for event: {event['eventname']}")  # Debugging: if no address exists
        
        updated_events.append(event)
    
    print(f"Updated events with coordinates: {updated_events}")  # Debugging: print events after lat/lng update
    return updated_events


'''
test_event = {
    "eventname": "Test Event",
    "eventlocation": "1600 Amphitheatre Parkway, Mountain View, CA",  # Sample address (Google headquarters)
    "eventdate": "2025-03-21T10:00:00",
    "eventdescription": "Sample event description.",
    "eventlink": "https://example.com",
    "ticketinfo": "https://example.com/tickets",
    "venuelink": "https://example.com/venue",
    "eventprice": 10.0,
    "thumbnail": "https://example.com/thumbnail.jpg"
}
        
events_list = [test_event]
updated_events = add_lat_lng_to_events(events_list, gmaps)
print(updated_events)
'''



