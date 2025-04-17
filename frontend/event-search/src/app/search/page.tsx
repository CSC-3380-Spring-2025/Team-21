import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

const SearchResultsPage = () => {
  const searchResults = 12;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Enter your address"
            className="w-full rounded-lg bg-background pl-10 pr-4 py-3 text-lg shadow-sm"
            
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: searchResults }).map((_, index) => (
          <SearchCard key={index} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage