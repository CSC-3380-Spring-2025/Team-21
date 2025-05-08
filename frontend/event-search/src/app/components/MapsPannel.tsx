import React, { useState } from 'react';

interface MapsPanelProps {
  destinationLat: number;
  destinationLng: number;
}

const MapsPanel: React.FC<MapsPanelProps> = ({ destinationLat, destinationLng }) => {
  const [startLocation, setStartLocation] = useState<string>('');

  const handleGetDirections = () => {
    if (!startLocation) {
      alert('Please enter a starting location.');
      return;
    }

    // Open Google Maps in a new tab with directions
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLocation}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className="maps-panel mt-4">
      <div className="controls">
        <input
          type="text"
          placeholder="Enter start location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)} 
          className="border p-2 w-full mb-4"
        />
        <button
          onClick={handleGetDirections}
          className="bg-blue-500 text-white p-2 rounded w-full"
        >
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default MapsPanel;
