"use client";

import Image from "next/image";
import Link from "next/link";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface Props {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: Props) {
  const thumbnailUrl = useConstructUrl(data.course.fileKey);

  const adaptedCourse = {
    ...data.course,
    chapters: data.course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      position: chapter.position,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        position: lesson.position,
        lessonProgresses: lesson.lessonProgresses,
      })),
    })),
  };

  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({ courseData: adaptedCourse });

  return (
    <Card className="group relative gap-0 py-0">
      <Badge className="top-2 right-2 z-10 absolute">{data.course.level}</Badge>
      <Image
        src={thumbnailUrl}
        alt="Thumbnail Image of Course"
        width={600}
        height={400}
        className="rounded-t-xl w-full h-full object-cover aspect-video"
      />
      <CardContent className="p-4">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="font-medium group-hover:text-primary text-lg hover:underline line-clamp-2 transition-colors"
        >
          {data.course.title}
        </Link>
        <p className="mt-2 text-muted-foreground text-sm line-clamp-2 leading-tight">
          {data.course.smallDescription}
        </p>

        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress: </p>
            <p className="font-medium">{progressPercentage}%</p>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />

          <p className="mt-1 text-muted-foreground text-xs">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.course.slug}`}
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
