import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from environment variables
SERP_API_KEY = os.getenv("SERPAPI_KEY")

# Ensure the key is being loaded correctly
if SERP_API_KEY is None:
    print("Error: SERPAPI_KEY not found in .env file.")
else:
    print("API key successfully loaded.")

# Set up the search parameters
params = {
    "engine" : "google_events",
    "q" : "events near me",
    "hl" : "en",
    "api_key" : SERP_API_KEY
}

# Make the API request
response = requests.get("https://serpapi.com/search", params=params)

# Check if the response is successful
if response.status_code == 200:
    print(response.json())
else:
    print(f"Request failed with status code {response.status_code}")
