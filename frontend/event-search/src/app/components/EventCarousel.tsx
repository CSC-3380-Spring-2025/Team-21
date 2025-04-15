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

// Define the event type matching database fields
type Event = {
  eventname: string;
  eventdate: string;
  eventlocation: string;
  eventdescription: string;
  thumbnail?: string | null; // Optional thumbnail field
};

interface EventCarouselProps {
  events: Event[];
}

const EventCarousel: React.FC<EventCarouselProps> = ({ events }) => {
  console.log("Events passed to EventCarousel: ", events);
  return (
    <div className="relative px-10">
      <Carousel opts={{ align: "center" }}>
        <CarouselContent>
          {events.map((event, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-96 flex flex-col">
                  <CardHeader>
                    {/* Conditionally render the event thumbnail */}
                    {event.thumbnail ? (
                      <img
                        src={event.thumbnail}
                        alt={event.eventname}
                        className="w-full h-40 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-md">No Thumbnail</div> // Placeholder if no thumbnail
                    )}
                    <CardTitle className="text-3xl">{event.eventname}</CardTitle>
                    <CardDescription className="overflow-auto">
                      {event.eventdescription}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between mt-auto">
                    <p>
                      {event.eventdate}, {event.eventlocation}
                    </p>
                    <Button>Directions</Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default EventCarousel;
