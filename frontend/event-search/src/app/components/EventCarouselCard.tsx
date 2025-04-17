
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";  // Add Link import

type Event = {
  eventid: number;
  eventname: string;
  eventdate: string;
  eventlocation: string;
  eventdescription: string;
  thumbnail?: string | null; // Optional thumbnail field
};

type Props = {
  eventData: Event;
};

const EventCard: React.FC<Props> = ({ eventData }) => {
  return (
    <Card className="w-72 m-2">
      <CardHeader>
        {/* Conditionally render the event thumbnail */}
        {eventData.thumbnail ? (
          <img
            src={eventData.thumbnail}
            alt={eventData.eventname}
            className="w-full h-40 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md">No Thumbnail</div> // Placeholder if no thumbnail
        )}
      </CardHeader>

      <CardContent>
        <CardTitle className="text-lg font-semibold">{eventData.eventname}</CardTitle>
        <CardDescription className="text-sm text-gray-500">{eventData.eventlocation}</CardDescription>

        {/* Move the date above the description */}
        <p className="mt-2 text-sm">
          <strong>Date:</strong> {eventData.eventdate}
        </p>

        {/* Shorten the description if it's too long */}
        <p className="truncate">{eventData.eventdescription}</p>
      </CardContent>

      <CardFooter className="flex justify-end mt-auto">
        <Link href={`/event-details/${eventData.eventid}`} passHref>
        console.log("eventid going to link:", event.eventid);
          <Button variant="outline">See Details</Button> {/* Updated button to link to event details */}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
