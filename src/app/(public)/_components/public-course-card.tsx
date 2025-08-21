import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface Props {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: Props) {
  const thumbnailUrl = useConstructUrl(data.fileKey);

  return (
    <Card className="group relative gap-0 py-0">
      <Badge className="top-2 right-2 z-10 absolute">{data.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail Image of Course"
        width={600}
        height={400}
        className="rounded-t-xl w-full h-full object-cover aspect-video"
      />
      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium group-hover:text-primary text-lg hover:underline line-clamp-2 transition-colors"
        >
          {data.title}
        </Link>
        <p className="mt-2 text-muted-foreground text-sm line-clamp-2 leading-tight">
          {data.smallDescription}
        </p>

        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="bg-primary/10 p-1 rounded-md size-6 text-primary" />
            <p className="text-muted-foreground text-sm">{data.duration}</p>
          </div>
          <div className="flex items-center gap-x-2">
            <School className="bg-primary/10 p-1 rounded-md size-6 text-primary" />
            <p className="text-muted-foreground text-sm">{data.category}</p>
          </div>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({ className: "w-full mt-4" })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative gap-0 py-0">
      <div className="top-2 right-2 z-10 absolute flex items-center">
        <Skeleton className="rounded-full w-20 h-6" />
      </div>
      <div className="relative w-full h-fit">
        <Skeleton className="rounded-t-xl w-full aspect-video" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Skeleton className="w-full h-6" />
          <Skeleton className="w-3/4 h-6" />
        </div>

        <div className="flex items-center gap-x-5 mt-4">
          <div className="flex items-center gap-x-2">
            <Skeleton className="rounded-md size-6" />
            <Skeleton className="w-8 h-4" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="rounded-md size-6" />
            <Skeleton className="w-8 h-4" />
          </div>
        </div>

        <Skeleton className="mt-4 rounded-md w-full h-10" />
      </CardContent>
    </Card>
  );
}
