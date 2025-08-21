import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="top-2 right-2 z-10 absolute flex items-center gap-2">
        <Skeleton className="rounded-full w-16 h-6" />
        <Skeleton className="rounded-md size-8" />
      </div>
      <div className="relative w-full h-fit">
        <Skeleton className="rounded-t-lg w-full h-[250px] object-cover aspect-video"></Skeleton>
      </div>
      <CardContent className="p-4">
        <Skeleton className="mb-2 rounded w-3/4 h-6" />
        <Skeleton className="mb-4 rounded w-full h-4" />
        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            <Skeleton className="rounded-md size-6" />
            <Skeleton className="rounded w-10 h-4" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="rounded-md size-6" />
            <Skeleton className="rounded w-10 h-4" />
          </div>
        </div>
        <Skeleton className="mt-4 rounded w-full h-10" />
      </CardContent>
    </Card>
  );
}
