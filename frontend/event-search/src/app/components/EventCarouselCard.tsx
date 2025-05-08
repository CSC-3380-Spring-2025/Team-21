import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import Link from "next/link";  

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
    <Card className="w-72 m-2 flex flex-col justify-between">
      <CardHeader>
        {eventData.thumbnail ? (
          <img
            src={eventData.thumbnail}
            alt={eventData.eventname}
            className="w-full h-40 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
            No Thumbnail
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between">
        <div>
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {eventData.eventname}
          </CardTitle>

          <CardDescription className="text-sm text-gray-500 line-clamp-1">
            {eventData.eventlocation}
          </CardDescription>

          <p className="mt-2 text-sm line-clamp-1">
            <strong>Date:</strong> {eventData.eventdate}
          </p>

          <p className="mt-2 text-sm line-clamp-2">
            {eventData.eventdescription}
          </p>
        </div>
      </CardContent>

      <CardFooter className="mt-auto">
        <Link href={`/event-details/${eventData.eventid}`} passHref>
          <Button variant="outline" className="w-full">
            See Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
