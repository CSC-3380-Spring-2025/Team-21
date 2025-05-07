import {
    Card,
    CardContent,
    CardHeader,
  } from "@/components/ui/card";
  import { Skeleton } from "@/components/ui/skeleton";


const SearchLoadingSkeletons = ({ count = 6 }: { count?: number }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="flex flex-col h-80">
          {" "}
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              {" "}
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  export default SearchLoadingSkeletons; 