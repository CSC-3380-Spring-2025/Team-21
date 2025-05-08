import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import MapsPanel from "../components/MapsPannel";

import { Event } from "@/types"; // Import the Event type I also merged the two types into one
interface EventCarouselProps {
  events: Event[];
}

const EventCarousel: React.FC<EventCarouselProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [showMap, setShowMap] = React.useState<boolean>(false);

  const handleDetailsClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
    setShowMap(false); // Hide the map when closing the modal
  };

  const handleGetDirectionsClick = () => {
    setShowMap(true); 
  };

  return (
    <div className="relative px-10">
      <Carousel opts={{ align: "center" }}>
        <CarouselContent>
          {events.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="flex flex-col h-full">
                  <CardHeader className="flex-shrink-0">
                    {event.thumbnail ? (
                      <img
                        src={event.thumbnail}
                        alt={event.eventname}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
                        No Thumbnail
                      </div>
                    )}
                    <CardTitle className="text-2xl truncate">{event.eventname}</CardTitle>
                    <p className="mt-2 text-sm truncate">
                      <strong>Date:</strong> {event.eventdate}
                    </p>
                    <CardDescription className="mt-2 text-ellipsis overflow-hidden line-clamp-2">
                      {event.eventdescription}
                    </CardDescription>
                  </CardHeader>

                  <CardFooter className="flex justify-between items-end mt-auto">
                    <p className="truncate text-sm">{event.eventlocation}</p>
                    <Button onClick={() => handleDetailsClick(event)} className="ml-2 self-end">
                      See details
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      {/* Modal */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-5xl w-full mx-4 sm:mx-0 overflow-hidden">
            {/* Thumbnail */}
            {selectedEvent.thumbnail ? (
              <img
                src={selectedEvent.thumbnail}
                alt={selectedEvent.eventname}
                className="w-full h-72 object-cover"
              />
            ) : (
              <div className="w-full h-72 bg-gray-300 flex items-center justify-center text-gray-600">
                No Thumbnail Available
              </div>
            )}

            {/* Modal Content */}
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-2">{selectedEvent.eventname}</h2>
              <p className="text-md text-gray-600 mb-4">
                <strong>Date:</strong> {selectedEvent.eventdate}
              </p>

              <p className="text-gray-800 mb-6 whitespace-pre-line">
                {selectedEvent.eventdescription}
              </p>

              <div className="mb-4">
                <p className="text-gray-700">
                  <strong>Location:</strong> {selectedEvent.eventlocation}
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Tickets:</strong> General Admission – $25
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-4 pt-6 border-t mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Buy Tickets
                </button>
                <button
                  onClick={handleGetDirectionsClick}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Get directions
                </button>
              </div>

              {showMap && (
                <MapsPanel
                  destinationLat={selectedEvent.latitude}
                  destinationLng={selectedEvent.longitude}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCarousel;
