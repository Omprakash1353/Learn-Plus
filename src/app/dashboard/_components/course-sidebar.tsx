"use client";

import { ChevronDown, Play } from "lucide-react";
import { usePathname } from "next/navigation";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { LessonItem } from "./lesson-item";
import { useCourseProgress } from "@/hooks/use-course-progress";

export function CourseSidebar({
  course,
}: {
  course: CourseSidebarDataType["course"];
}) {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();

  const { completedLessons, progressPercentage, totalLessons } =
    useCourseProgress({ courseData: course });

  return (
    <div className="flex flex-col h-full">
      <div className="pr-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex justify-center items-center bg-primary/10 rounded-lg size-10 shrink-0">
            <Play className="size-5 text-primary" />
          </div>
          <div className="flex1 min-w-0">
            <h1 className="font-semibold text-base truncate leading-tight">
              {course.title}
            </h1>
            <p className="mt-1 text-muted-foreground text-xs truncate">
              {course.category}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-muted-foreground text-xs">
            {progressPercentage}% complete
          </p>
        </div>
      </div>
      <div className="space-y-3 py-4 pr-4">
        {course.chapters.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 p-3 w-full h-auto"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {chapter.position}: {chapter.title}
                  </p>
                  <p className="font-medium text-[10px] text-muted-foreground truncate">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-3 pl-6 border-l-2">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.id}
                  lesson={lesson}
                  slug={course.slug}
                  isActive={currentLessonId === lesson.id}
                  completed={
                    lesson.lessonProgresses.find(
                      (progress) => progress.lessonId === lesson.id
                    )?.completed || false
                  }
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
