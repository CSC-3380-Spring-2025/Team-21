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


const eventList: {
  name: string;
  date: string;
  location: string;
  description: string;
}[] = [
  {
    name: "20th Annual Zapp's International Beerfest",
    date: "March 22",
    location: "Baton Rouge",
    description:
      "Raise your glass and join the celebration at the 20th Annual Zapp’s International Beerfest, hosted by the Friends of LSU Rural Life Museum and proudly sponsored by Utz Brands! This beloved Baton Rouge tradition offers an incredible opportunity to sample over 200 domestic and international beers and ales, including crowd-favorite homebrews.",
  },
  {
    name: "Louisiana Red Beans and Rice Heritage and Music Festival Kickoff Brunch",
    date: "March 22",
    location: "Baton Rouge",
    description:
      "Join us for the 2025 LRBR Red Beans ans Rice Heritage and Music Festival Kickoff Brunch featuring the *Lil Nate and The Zydeco Big Timers.",
  },
  {
    name: "R&B KARAOKE NIGHT",
    date: "March 22",
    location: "Baton Rouge",
    description:
      "🔉 BOOSIE BASH 2025 🔉Let’s Get It!! Boosie Bash 6 Will Be Nothing Short Of AMAZING!!! We’re Giving You THREE Action-Packed Days & Nights Of Electric, Star-Studded Events!! Make Plans To Stay In Baton Rouge The ENTIRE WEEKEND!!!!For Our FIRST NIGHT… We’re Gonna Have Some Grown Folks FUN!!",
  },
  {
    name: "The Silly Rabbit Comedy Club Presents: Mighty King",
    date: "March 21",
    location: "Baton Rouge",
    description:
      "Get ready for a MIGHTY night at The Silly Rabbit Comedy Club. Drinks, Laughter & a Great Night! Grab your tickets TODAY!",
  },
  {
    name: "The Turner-Fischer Center Presents: Candide",
    date: "March 23",
    location: "Baton Rouge",
    description:
      "Join us as we seek the Best of All Possible Worlds, as the Turner-Fischer Center for Opera presents composer Leonard Bernstein and Co.'s legendary and entertaining Candide!",
  },
  {
    name: "FEMPROV (Part of That Time of the Month: Celebrating Women in Comedy)",
    date: "March 22",
    location: "Baton Rouge",
    description:
      "Monthly women's improv show the fourth Saturday at 9 p.m. featuring some of the funniest comedians around.",
  },
];

export default function EventCarousel() {
  return (
    <div className="relative px-10">
      <Carousel
        opts={{
          align: "center",
        }}
        className=""
      >
        <CarouselContent>
          {eventList.map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="h-96 flex flex-col">
                  <CardHeader className="">
                    <CardTitle className="text-3xl">
                      {_.name}
                    </CardTitle>
                    <CardDescription className="overflow-auto">
                      {_.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between mt-auto">
                    <p>{_.date}, {_.location}</p>
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
}
