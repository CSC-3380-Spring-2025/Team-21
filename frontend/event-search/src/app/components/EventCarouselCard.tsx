import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

type Event = {
  
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
        <CardTitle>{eventData.eventname}</CardTitle>
        <CardDescription>{eventData.eventlocation}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{eventData.eventdescription}</p>
        <p>
          <strong>Date:</strong> {eventData.eventdate}
        </p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
