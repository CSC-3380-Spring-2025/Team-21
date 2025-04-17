"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventCarousel from "./components/EventCarousel";
import Link from "next/link";

// Define the Event type matching the backend response
type Event = {
  eventid: number;
  eventname: string;
  eventdate: string;
  eventlocation: string;
  eventdescription: string;
  eventthumbnail?: string | null;
  ticketLink: string;
};

// Function to fetch events from the backend.
// If a query is provided, this fetches filtered events from the search route.
const fetchEvents = async (query: string = ""): Promise<Event[]> => {
  try {
    // Use the search route if a search query is provided
    const url = query
      ? `http://127.0.0.1:5000/api/events/search?query=${encodeURIComponent(query)}`
      : "http://127.0.0.1:5000/api/events";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch events");
    const data = await response.json();
    // Assuming that your backend returns an object with an "events" key.
    // If it returns an array directly, replace "data.events" with "data".
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

  // On initial render, fetch all events (no search filter)
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
  // fetch events based on the provided search query.
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    try {
      const fetchedEvents = await fetchEvents(searchQuery);
      setEvents(fetchedEvents);
    } catch (err) {
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4">
      <div className="mt-40 flex flex-col items-center gap-8">
        <div className="text-5xl font-semibold text-black">
          <h1>
            Discover your next local <span className="bg-amber-500">event</span>
          </h1>
        </div>
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
