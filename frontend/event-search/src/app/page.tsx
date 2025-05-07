"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventCarousel from "./components/EventCarousel";
import { useRouter } from 'next/navigation'; // 

import { fetchEvents } from "./utils/pythonFetch"; // Refactor the fetch function to a separate file so database is not exposed to the frontend
import { Event } from "@/types"; // Import the moved event type


export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
