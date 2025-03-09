from flask import Flask
import os
from dotenv import load_dotenv
from supabase import create_client, client




load_dotenv()


app = Flask (__name__)

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")
print("Loaded API Key:", GOOGLE_MAPS_API_KEY) 

@app.route('/')
def home():
    return f"[2cleart]Backend is running!!:) API KEY{GOOGLE_MAPS_API_KEY}"

if __name__== '__main__':
    app.run(debug =True)


SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")


# create a supabase client
supabase : client = create_client(SUPABASE_URL, SUPABASE_KEY)

simple_event = {
    "Event_Id": "0",  # Check if this matches the expected type (e.g., integer, string, etc.)
    "Event_Date": "2025-03-12 19:00:00",  # Ensure this matches the timestamp format
    "Event_Name": "Test Event",  # Ensure the column name is correct
    "Event_Location": "Test Location",
    "Event_Description": "Test Description",
    "Event_Link": "http://testevent.com",
    "Ticket_Info": "Test Ticket Info",
    "Venue_Rating": 4.0,  # Ensure this is a numeric value
    "Venue_Link": "http://testvenue.com",
    "Event_Price": "10"
}

# Query all events from the 'EventData' table
response = supabase.table('EventData').select('*').execute()

# Query all events from the 'EventData' table
response = supabase.table('EventData').select('*').execute()

# Check if data was returned
if response.data:
    print("Query successful!")
    print(response.data)  # This will print the data returned from the query
else:
    print("Query failed!")
    print(response.error_message)