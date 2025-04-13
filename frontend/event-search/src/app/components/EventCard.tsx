import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader,CardContent } from "@/components/ui/card";



const SearchCard = () => {
    return (
      <Card className="flex flex-col h-80">
        {" "}
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-1/2" />
        </CardHeader>
        <CardContent className="flex-grow">
          {" "}
          <div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
      </Card>
    );
  };