import { Suspense } from "react";

import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { CourseContent } from "./_components/course-content";
import { LessonSkeleton } from "./_components/lesson-skeleton";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);

  return <CourseContent data={data} />;
}
