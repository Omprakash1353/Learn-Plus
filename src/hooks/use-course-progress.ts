"use client";

import { useMemo } from "react";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";

interface CourseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export function useCourseProgress({
  courseData,
}: {
  courseData: CourseSidebarDataType["course"];
}): CourseProgressResult {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;

        const isCompleted = lesson.lessonProgresses.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );

        if (isCompleted) {
          completedLessons++;
        }
      });
    });

    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return { totalLessons, completedLessons, progressPercentage };
  }, [courseData]);
}
