"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// --- Import Type and Fetch Function ---
import type { SerpApiEvent } from "@/types"; 

const fetchEvents = async (query: string): Promise<SerpApiEvent[]> => {
  if (!query) {
    console.warn("fetchEvents called without a query.");
    return [];
  }
  try {
    const url = `/api/events?query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      let errorMsg = `API route failed: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch (e) {
        /* Ignore */
      }
      throw new Error(`Failed to fetch events: ${errorMsg}`);
    }
    const data: SerpApiEvent[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error; // Re-throw to be caught by the component
  }
};
// Skeleton Loader Component
const LoadingSkeletons = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <Card key={index} className="flex flex-col h-80">
        {" "}
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-2">
            {" "}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// SeacrhResults Component
const SearchResults = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || ""; // Get initial query from URL

  const [events, setEvents] = useState<SerpApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [currentQuery, setCurrentQuery] = useState(initialQuery); // State for the input field

  useEffect(() => {
    // Fetch events when the component mounts or initialQuery changes
    if (initialQuery) {
      setLoading(true);
      setError(null);
      setEvents([]); // Clear previous results

      fetchEvents(initialQuery)
        .then((fetchedEvents) => {
          setEvents(fetchedEvents);
        })
        .catch((err) => {
          setError(
            err instanceof Error ? err.message : "Failed to load search results"
          );
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // No initial query provided
      setLoading(false);
      setError("No search query provided.");
      setEvents([]);
    }
  }, [initialQuery]);

  // Handle search form submission on this page
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentQuery.trim() || currentQuery === initialQuery) {
      return; // Dont search if empty or same query
    }
    // Update the url, which will trigger the useEffect via initialQuery change
    router.push(`/search?q=${encodeURIComponent(currentQuery)}`);
  };

  const selectedEvent =
    selectedCardIndex !== null ? events[selectedCardIndex] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8 flex justify-center">
        <form
          onSubmit={handleSearchSubmit}
          className="relative w-full max-w-xl"
        >
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            placeholder="Search for events..."
            value={currentQuery}
            onChange={(e) => setCurrentQuery(e.target.value)}
            className="w-full rounded-lg bg-background pl-10 pr-4 py-3 text-lg shadow-sm"
            aria-label="Search for events"
          />
        </form>
      </div>

      {/* Results Area */}
      {loading && <LoadingSkeletons />}

      {!loading && error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && events.length === 0 && initialQuery && (
        <p className="text-center text-muted-foreground">
          No events found matching "{initialQuery}".
        </p>
      )}

      {!loading && !error && events.length === 0 && !initialQuery && (
        <p className="text-center text-muted-foreground">
          Please enter a search term above to find events.
        </p>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <motion.div
              key={event.title + index}
              layoutId={`card-${index}`}
              onClick={() => setSelectedCardIndex(index)}
              className="cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="flex flex-col h-full min-h-[20rem]">
                {" "}
                {event.thumbnail && (
                  <div className="relative h-40 w-full">
                    {" "}
                    <Image
                      src={event.thumbnail}
                      alt={event.title}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader className={!event.thumbnail ? "pt-6" : ""}>
                  {" "}
                  <CardTitle className="text-lg line-clamp-2">
                    {" "}
                    {event.title}
                  </CardTitle>
                  <CardDescription className="text-sm pt-1">
                    {event.date?.when}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {event.venue?.name || event.address?.[0]}
                  </p>

                  <p className="text-sm mt-2 line-clamp-3">
                    {event.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="link"
                    size="sm"
                    asChild
                    className="p-0 h-auto"
                  >
                    <a
                      href={event.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      More Info
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal for Selected Card */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setSelectedCardIndex(null)} // Close on overlay click (idk if it actaully needs all three?)
            />
            {/* Modal Content */}
            <div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCardIndex(null)}
            >
              {" "}
              {/* Centering container */}
              <motion.div
                layoutId={`card-${selectedCardIndex}`}
                onClick={(e) => e.stopPropagation()}
                className="relative z-50 w-full max-w-2xl bg-card rounded-lg shadow-xl overflow-hidden" // Use Card background
              >
                <Card className="relative flex flex-col max-h-[80vh] overflow-y-auto">
                  {" "}
                  {/* Max height and scroll */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 z-10 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCardIndex(null);
                    }}
                    aria-label="Close event details"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  {/* Modal Header with Image */}
                  {selectedEvent.thumbnail && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={selectedEvent.thumbnail}
                        alt={selectedEvent.title}
                        fill
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  )}
                  {/* Modal Content */}
                  <CardHeader
                    className={!selectedEvent.thumbnail ? "pt-6" : ""}
                  >
                    <CardTitle className="text-xl">
                      {selectedEvent.title}
                    </CardTitle>
                    <CardDescription className="text-base pt-1">
                      {selectedEvent.date?.when}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    {/* Venue/Address */}
                    {(selectedEvent.venue ||
                      selectedEvent.address?.length > 0) && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Location</h4>
                        <p className="text-muted-foreground text-sm">
                          {selectedEvent.address?.join(", ")}
                        </p>
                        {/* Optional: Map Link */}
                        {selectedEvent.event_location_map?.link && (
                          <Button
                            variant="link"
                            size="sm"
                            asChild
                            className="p-0 h-auto mt-1"
                          >
                            <a
                              href={selectedEvent.event_location_map.link}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Map
                            </a>
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    {selectedEvent.description && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          Description
                        </h4>
                        <p className="text-sm whitespace-pre-wrap">
                          {selectedEvent.description}
                        </p>{" "}
                        {/* Preserve whitespace */}
                      </div>
                    )}

                    {/* Ticket Info */}
                    {selectedEvent.ticket_info &&
                      selectedEvent.ticket_info.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm mb-1">
                            Tickets/Info
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.ticket_info.map((ticket, idx) => (
                              <Button key={idx} size="sm" asChild>
                                <a
                                  href={ticket.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {ticket.source || ticket.link_type || "View"}
                                </a>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                  </CardContent>
                  {/* Footer for main event link */}
                  <CardFooter>
                    <Button asChild className="w-full">
                      <a
                        href={selectedEvent.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Event Source
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


// Wrap the component that uses useSearchParams in Suspense so that it will be skeletons when loading :)
export default function SearchResultsPage() {
  return (
    <Suspense fallback={<LoadingSkeletons />}>
      {" "}
      {/* Show skeletons during initial load */}
      <SearchResults />
    </Suspense>
  );
}
