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
    events = search_from_db(query)  
    return jsonify(events)


@app.route("/api/events/sort", methods=["GET"])
def sort_events_route():

    events = get_all_events(supabase)

    sorted_events = sort_events(events)
    
    return jsonify(sorted_events)

@app.route("/api/auth/register", methods=["POST"])
def register_user_route():
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        name = data.get("name")
    
        if not email or not password or not name:
            return jsonify({"error": "Missing required fields"}), 400

        response = register_user(email, password, name, supabase)


        if response["success"]:
            supabase_response =  response["data"]
            user_info = supabase_response.user
            session_info = supabase_response.session
            # Extract user data and session data so we can serialize it to JSON
            # https://supabase.com/docs/reference/python/auth-api for response structure
            serialized_user_data = {
                "user": {
                    "id": user_info.id,
                    "email": user_info.email,
                },
                "session": {
                    "access_token": session_info.access_token,
                    "refresh_token": session_info.refresh_token,
                    "expires_at": session_info.expires_at
                }
            }



            response_data = {
                "message": "User registered successfully",
                "userData": serialized_user_data,
                
            }
            return jsonify(response_data), 201
        else:
            return jsonify({"error": response["error"]}), 400

@app.route("/api/auth/login", methods=["POST"])
def login_user_route():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    response = login_user(email, password, supabase)

    if response["success"]:
        supabase_response =  response["data"]
        user_info = supabase_response.user
        session_info = supabase_response.session
        # Extract user data and session data so we can serialize it to JSON
        # https://supabase.com/docs/reference/python/auth-api for response structure
        serialized_user_data = {
            "user": {
                "id": user_info.id,
                "email": user_info.email,
            },
            "session": {
                "access_token": session_info.access_token,
                "refresh_token": session_info.refresh_token,
                "expires_at": session_info.expires_at
            }
        }

        response_data = {
            "message": "User logged in successfully",
            "userData": serialized_user_data,
            
        }
        return jsonify(response_data), 200
    else:
        return jsonify({"error": response["error"]}), 400








if __name__ == "__main__":
    app.run(debug=True)
