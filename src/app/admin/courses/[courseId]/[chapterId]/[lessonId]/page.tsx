import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import { LessonForm } from "./_components/lesson-form";

export default async function LessonIdPage({
  params,
}: {
  params: Promise<{ chapterId: string; lessonId: string; courseId: string }>;
}) {
  const { chapterId, courseId, lessonId } = await params;
  const lesson = await adminGetLesson(lessonId);

  return (
    <div>
      <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />
    </div>
  );
}
