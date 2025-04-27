from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
from supabase import create_client, Client
from api_tools import fetch_event_data, add_lat_lng_to_events
from utils.serp_data_parser import extract_event_data, parse_event_datetime
from utils.db_operations import insert_events_to_supabase, search_from_db, get_all_events
import googlemaps
from flask_cors import CORS






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
    search_term = request.args.get("query")  # Get search query from URL parameters
    if not search_term:
        return jsonify({"error": "No search term provided"}), 400

    print(f"Searching database for: {search_term}")

    # Search in the database
    db_results = search_from_db(search_term)

    if db_results:
        print(f"Found {len(db_results)} event(s) in the database for '{search_term}'.")
        print(f"DB results: {db_results}")
        return jsonify(db_results)  # Return the found events from the database

    # If no results were found, proceed to fetch new data
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

    return jsonify(datetimed_events)  # Return the new events fetched from the API



@app.route("/api/events/sort", methods=["GET"])
def sort_events_route():

    events = get_all_events(supabase)

    sorted_events = sort_events(events)
    
    return jsonify(sorted_events)


@app.route("/api/CreateEvent", methods=["POST"])
def create_event():
    # 1) Get the data from the request
    data = request.json
    event_name = data.get("eventname")
    event_location = data.get("eventlocation")
    thumbnail = data.get("thumbnail")
    event_description = data.get("eventdescription")
    eventdate = data.get("eventdate")  # Get eventdate directly from the payload
    eventday = eventdate  # Ensure eventday matches eventdate, map them correctly

    print(f"Received data: {data}")

    # 2) Geocode the event location
    geocode_results = gmaps.geocode(event_location)
    if geocode_results and isinstance(geocode_results, list) and len(geocode_results) > 0:
        location = geocode_results[0]["geometry"]["location"]
        latitude, longitude = location["lat"], location["lng"]
    else:
        print(f"Geocode failed for address: {event_location}")
        return jsonify({"error": "Failed to geocode location"}), 400

    # 3) Add to Supabase (ensure both eventdate and eventday are saved)
    new_event = {
        "eventname": event_name,
        "eventlocation": event_location,
        "latitude": latitude,
        "longitude": longitude,
        "thumbnail": thumbnail,
        "eventdescription": event_description,
        "eventdate": eventdate,  # Store eventdate
        "eventday": eventday  # Store eventday as well
    }

    insert_events_to_supabase([new_event])

    # 4) Respond with success and the event data, including eventdate and eventday
    return jsonify({
        "success": "Event created successfully",
        "event": new_event  # Include eventdate and eventday in the response payload
    })



if __name__ == "__main__":
    app.run(debug=True)
