"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import EventCarousel from "./components/EventCarousel";

export default function Home() {
  return (
    <main className="container mx-auto px-4 ">
      <div className="mt-40 flex flex-col items-center gap-8 ">
        <div className="text-5xl font-semibold text-black">
          <h1 className="">
            Discover your next local <span className="bg-amber-500">event</span>
          </h1>
        </div>

        <div className="w-full max-w-2x1">
          <div className="border-1 border-black border-solid p-4 rounded-lg">
            <div className="w-128 mx-auto">
              <form method="get" className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                  className="p-2 border rounded w-full"
                />
                <Input
                  type="date"
                  name="date"
                  className="p-2 border rounded w-full"
                />
                <Input
                  type="text"
                  name="category"
                  placeholder="Event Type"
                  className="p-2 border rounded w-full"
                />
                <Button>Search</Button>
              </form>
            </div>
            <div className="mt-8">
              <EventCarousel />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
