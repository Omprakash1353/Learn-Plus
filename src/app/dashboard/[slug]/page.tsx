import { redirect } from "next/navigation";

import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

export default async function CourseSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseSidebarData(slug);

  const firstChapter = course.course.chapters[0];
  const firstLesson = firstChapter.lessons[0];

  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }

  return (
    <div className="flex justify-center items-center h-full text-center">
      <h2 className="mb-2 font-bold text-2xl">No lessons available</h2>
      <p className="text-muted-foreground">This course does not have any lessons yet!</p>
    </div>
  );
}
