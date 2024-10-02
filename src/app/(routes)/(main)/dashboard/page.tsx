import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { CourseProgressCard } from "@/components/course-progress-card";
import { db } from "@/lib/db";
import {
  chapterTable,
  enrollmentTable,
  userProgressTable,
} from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export default async function HomePage() {
  const { user } = await validateRequest();
  if (!user) return redirect("/");

  // Get all enrolled courses with chapters
  const enrolledCourses = await db.query.enrollmentTable.findMany({
    where: eq(enrollmentTable.userId, user.id),
    with: {
      course: {
        with: {
          chapters: {
            where: eq(chapterTable.status, "PUBLISHED"),
          },
        },
      },
    },
  });

  // Get completed chapters for the user
  const completedChapters = await db.query.userProgressTable.findMany({
    where: and(
      eq(userProgressTable.userId, user.id),
      eq(userProgressTable.isCompleted, true),
    ),
  });

  // Map enrolled courses to calculate progress
  const courseProgress = enrolledCourses.map((enrollment) => {
    const totalChapters = enrollment?.course?.chapters.length || 0;
    const completedChaptersCount = completedChapters.filter(
      (progress) =>
        progress.chapterId &&
        enrollment?.course?.chapters.some(
          (chapter) => chapter.id === progress.chapterId,
        ),
    ).length;

    const progressPercentage =
      totalChapters > 0 ? (completedChaptersCount / totalChapters) * 100 : 0;

    return {
      id: enrollment.courseId,
      title: enrollment?.course?.title,
      thumbnailUrl: enrollment?.course?.thumbnailUrl,
      progressPercentage,
    };
  });

  return (
    <div className="w-full">
      <div className="flex min-h-screen flex-col overflow-hidden p-4">
        <main className="flex h-auto w-full flex-grow flex-col items-center justify-start gap-10 px-5">
          <div className="mx-auto my-5 grid w-full grid-cols-1 gap-x-5 gap-y-12 px-6 md:grid-cols-2 md:px-8 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {courseProgress.map((course) => (
              <CourseProgressCard
                key={course.id}
                {...course}
                progressPercentage={course.progressPercentage}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
