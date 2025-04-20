import { Event } from "@/types"; 


export const fetchEvents = async (query: string = ""): Promise<Event[]> => {
  try {
    // Use the search route if a search query is provided
    const url = query
      ? `http://127.0.0.1:5000/api/events/search?query=${encodeURIComponent(query)}`
      : "http://127.0.0.1:5000/api/events";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch events: ${response.statusText}`);
    }
    const data = await response.json();
    return data.events || data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

