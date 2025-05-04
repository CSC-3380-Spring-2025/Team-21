import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type EventFormData = {
  thumbnail?: string;
  name: string;
  date: string;
  description?: string;
  address: string;
};

interface UserEventsFormProps {
  onClose: () => void; // Function to close the form
  onSubmit: (data: EventFormData) => void; // Function to handle form submission
}

const UserEventsForm: React.FC<UserEventsFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: "",
    date: "",
    address: "",
    thumbnail: "",
    description: "",
  });

  const [message, setMessage] = useState<string | null>(null); // For success or error messages
  const [isError, setIsError] = useState<boolean>(false); // To track if it's an error or success

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Split the datetime-local value into eventday & timePart
    const [eventday, timePart] = formData.date.split("T");
    const starttime = `${timePart}:00`;  // append seconds

    // 2) Set the eventdate to be the same as eventday
    const eventdate = eventday;  // Same as eventday

    // 3) Build the payload with eventdate
    const payload = {
      eventname: formData.name,
      eventlocation: formData.address,  // Send the address
      thumbnail: formData.thumbnail,
      eventdescription: formData.description,
      eventday,     // e.g. "2025-05-10"
      starttime,    // e.g. "18:30:00"
      eventdate,    // e.g. "2025-05-10" (same as eventday)
    };

    console.log('Payload sent to Next.js API:', payload);  // Log the payload before sending

    // 4) Send to backend
    try {
      const response = await fetch('/api/CreateEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log('Server responded:', result);  // Log the server response

      // Show success message…
      setMessage('Event created successfully!');
      setIsError(false);
    } catch (err) {
      console.error('Error submitting event:', err);
      // Show error message…
      setMessage('Failed to create event.');
      setIsError(true);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 z-50">
        <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>

        {/* Display Success or Error Message */}
        {message && (
          <div className={`p-2 mt-4 ${isError ? 'bg-red-500' : 'bg-green-500'} text-white rounded`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              type="text"
              name="name"
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="datetime-local"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="address"
              placeholder="Event Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="thumbnail"
              placeholder="Thumbnail URL (Optional)"
              value={formData.thumbnail}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <Input
              type="text"
              name="description"
              placeholder="Event Description (Optional)"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between">
            <Button type="button" onClick={onClose} className="bg-gray-400 text-white">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-500 text-white">
              Create Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEventsForm;
