// components/Card.tsx
import React from "react";

type CardProps = {
  title: string;
  description: string;
  imageUrl?: string;
  button1Label: string;
  button2Label: string;
};

const Card = ({ title, description, imageUrl, button1Label, button2Label }: CardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <div className="mt-4 flex gap-4">
          <button className="bg-blue-500 text-white p-2 rounded w-full">{button1Label}</button>
          <button className="bg-gray-500 text-white p-2 rounded w-full">{button2Label}</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
