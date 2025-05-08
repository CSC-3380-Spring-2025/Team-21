from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from api_tools import fetch_event_data, add_lat_lng_to_events
from utils.serp_data_parser import extract_event_data, parse_event_datetime
from utils.db_operations import insert_events_to_supabase, search_from_db, get_all_events
from utils.account_utils import register_user, login_user
import googlemaps
from flask_cors import CORS
from datetime import datetime






load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
GOOGLE_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
gmaps = googlemaps.Client(key=GOOGLE_API_KEY)

@app.route("/api/events" , methods=["GET"])
def get_event_route():
    events = get_all_events(supabase)
    return jsonify(events)



@app.route("/api/events/search", methods=["GET"])
def search_events_route():
    query = request.args.get("query")  # Get search query from URL parameters
    events = search_from_db(query)  
    return jsonify(events)
    search_term = request.args.get("query")  
    if not search_term:
        return jsonify({"error": "No search term provided"}), 400

    print(f"Searching database for: {search_term}")

    # Search in the database
    db_results = search_from_db(search_term)

    if db_results:
        print(f"Found {len(db_results)} event(s) in the database for '{search_term}'.")
        print(f"DB results: {db_results}")
        return jsonify(db_results)  

    # If no results found fetch new data
    print(f"No results found in the database for '{search_term}'. Fetching new data...")

    fetched_data: Dict = fetch_event_data(search_term)
    events_list: List[Dict] = fetched_data.get('events_results', [])

    extracted_events = []
    for event in events_list:
        try:
            extracted_event_data = extract_event_data(event)
            if extracted_event_data:
                extracted_events.append(extracted_event_data)
            else:
                print(f"Failed to extract event data for {event}")
        except Exception as e:
            print(f"Error processing event {event}: {e}")

    # Add coordinates and parse event datetime
    events_with_coords = add_lat_lng_to_events(extracted_events, gmaps)
    datetimed_events = parse_event_datetime(events_with_coords)

    # Insert new events into the database
    insert_events_to_supabase(datetimed_events)

    print(f"Inserted {len(datetimed_events)} new event(s) into the database.")

    return jsonify(datetimed_events)  



@app.route("/api/events/sort", methods=["GET"])
def sort_events_route():

    events = get_all_events(supabase)

    sorted_events = sort_events(events)
    
    return jsonify(sorted_events)


@app.route("/api/CreateEvent", methods=["POST"])
def create_event():
    data = request.json

    

    

    new_event = {
        "eventname":     data.get("eventname"),
        "eventlocation": data.get("eventlocation"),
        "latitude":      (data.get("latitude")),
        "longitude":     (data.get("longitude")),
        "thumbnail":     data.get("thumbnail", ""),
        "eventdescription": data.get("eventdescription", ""),
        "eventdate":     data.get("eventdate"),
        "eventday":      data.get("eventdate"),
        "starttime":     data.get("starttime"),
        "venuelink":     data.get("venue_link", ""),
        "eventlink":     data.get("eventlink", ""),
        "ticketinfo":    data.get("ticket_info", ""),
        "eventprice":    (data.get("eventprice")) or 0.0,
    }

    print("Preparing to insert event:", new_event)
    event_with_coords = add_lat_lng_to_events([new_event], gmaps)
    insert_events_to_supabase(event_with_coords)
    return jsonify({"success": "Event created", "event": new_event})


if __name__ == "__main__":
    app.run(debug=True)
