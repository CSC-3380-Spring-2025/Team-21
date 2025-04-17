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
CORS(app)
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
    events = search_from_db(supabase, query)  
    return jsonify(events)


@app.route("/api/events/sort", methods=["GET"])
def sort_events_route():

    events = get_all_events(supabase)

    sorted_events = sort_events(events)
    
    return jsonify(sorted_events)







if __name__ == "__main__":
    app.run(debug=True)
