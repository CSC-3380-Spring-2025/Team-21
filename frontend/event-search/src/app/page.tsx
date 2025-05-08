"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventCarousel from "./components/EventCarousel";
import EventCreationForm from "./components/UserEventsForm";
import Link from "next/link";

// Define the Event type matching the backend response
type Event = {
  eventid: number;
  eventname: string;
  eventdate: string;
  eventlocation: string;
  eventdescription: string;
  thumbnail?: string | null; // Optional thumbnail field
  latitude: number;  
  longitude: number; 
  ticketinfo: string; 
};

const fetchEvents = async (query: string = ""): Promise<Event[]> => {
  try {
    const url = query
      ? `http://127.0.0.1:5000/api/events/search?query=${encodeURIComponent(query)}`
      : "http://127.0.0.1:5000/api/events";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();
    return data.events || data;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false); // Manage visibility of the form
  const router = useRouter();

  // Fetch events on initial render
  useEffect(() => {
    const getEvents = async () => {
      try {
        const fetchedEvents = await fetchEvents();
        setEvents(fetchedEvents);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, []);

  // Handle search: when the user clicks the Search button,
  // fetch events based on the provided search text.
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!searchQuery.trim()) {
      console.log("Search query is empty.");
      return;
    }

    // Navigate to the search results page, passing the query
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  // Handle event form submission
  const handleEventSubmit = (data: any) => {
    console.log("Event data submitted:", data);
    setShowForm(false); // Close the form after submission
  };

  return (
    <main className="container mx-auto px-4">
      <div className="mt-40 flex flex-col items-center gap-8">
        <div className="text-5xl font-semibold text-black">
          <h1>Discover your next local event</h1>
        </div>

        {/* "+" Button to add a new event */}
        <Button 
          onClick={() => setShowForm(true)} // Show form when clicked
          className="bg-black text-white p-4 rounded-full fixed bottom-10 right-12 z-50"
        >
          +
        </Button>

        {/* Conditionally render the EventCreationForm */}
        {showForm && (
          <EventCreationForm 
            onClose={() => setShowForm(false)} 
            onSubmit={handleEventSubmit}
          />
        )}

        <div className="w-full max-w-2x1">
          <div className="border-1 border-black border-solid p-4 rounded-lg">
            <div className="w-128 mx-auto">
              {/* Search form integrated into the homepage */}
              <form className="flex flex-col md:flex-row gap-4" onSubmit={handleSearch}>
                <Input
                  type="text"
                  name="location"
                  placeholder="Enter search term"
                  className="p-2 border rounded w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit">Search</Button>
              </form>
            </div>
            <div className="mt-8">
              {loading ? (
                <p>Loading events...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : events.length === 0 ? (
                <p>No events available at the moment.</p>
              ) : (
                <EventCarousel events={events} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
