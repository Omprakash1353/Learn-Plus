import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { db } from "@/lib/db";
import { chapterTable, courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { ChapterEditForm } from "./_components/chapter-edit-form";
import { PublishChapter } from "./_components/publish-chapter";
import { ChapterVideoEdit } from "./_components/chapter-video-edit";

export default async function SectionPage({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { user } = await validateRequest();
  if (!user || user.role !== "INSTRUCTOR") return redirect("/");

  const courseName = await db.query.courseTable.findFirst({
    where: eq(courseTable.id, params.courseId),
    columns: {
      title: true,
    },
  });

  const chapter = await db.query.chapterTable.findFirst({
    where: eq(chapterTable.id, params.chapterId),
  });

  if (!courseName || !chapter) return <div>Chapter Not Found</div>;

  return (
    <div className="mx-auto max-w-full px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/instructor/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/instructor/courses/${params.courseId}`}>
              {courseName?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Chapter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-8 mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Edit Chapter
        </h1>
        <PublishChapter chapterId={params.chapterId} status={chapter?.status} />
      </div>
      <ChapterVideoEdit courseId={params.courseId} chapterId={params.chapterId} />

      <ChapterEditForm
        chapterId={params.chapterId}
        courseId={params.courseId}
      />
    </div>
  );
}
