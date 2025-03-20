import os
import requests
from dotenv import load_dotenv
import random
from typing import Optional, Dict

# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from environment variables
SERP_API_KEY = os.getenv("SERPAPI_KEY")

# Ensure the key is being loaded correctly
if not SERP_API_KEY:
    raise ValueError("Error: SERPAPI_KEY not found in .env file.")
else:
    print("API key successfully loaded.")

# Define the function to fetch event data
def fetch_event_data() -> Optional[Dict]:
    """
    Fetches event data from the SERP API with randomized pagination.

    Returns:
        Optional[Dict]: Parsed JSON response or None if the request fails.
    """
    

    search: str = input("What kind of event would you like to see?")

    # Generate a random page number between 1 and 10
    random_page = random.randint(1, 10)

    # Calculate the 'start' parameter for pagination (0 for page 1, 10 for page 2, etc.)
    start_index = (random_page - 1) * 10

    # Set up the search parameters
    params = {
        "engine": "google_events",
        "q": search,
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
