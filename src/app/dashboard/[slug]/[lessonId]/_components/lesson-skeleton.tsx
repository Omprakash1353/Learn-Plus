import { Skeleton } from "@/components/ui/skeleton";

export function LessonSkeleton() {
  return (
    <div className="flex flex-col p-6 h-full">
      <div className="relative bg-muted rounded-lg aspect-video">
        <Skeleton className="w-full h-full" />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-8" />
          <Skeleton className="w-3/4 h-8" />
        </div>
        <div className="space-y-3">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-5/6 h-4" />
          <Skeleton className="w-4/6 h-4" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-5/24 h-10" />
        </div>
      </div>
    </div>
  );
}
