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
import { courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { CourseEditForm } from "./_components/course-edit-form";
import { PublishCourse } from "./_components/publish-course";

export type courseType = {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  tags: string[];
};

export default async function CourseEditPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { user } = await validateRequest();
  if (!user || user.role !== "INSTRUCTOR") {
    return redirect("/");
  }

  const course = await db.query.courseTable.findFirst({
    where: eq(courseTable.id, params.courseId),
    columns: { status: true },
    with: {
      chapters: {
        columns: { status: true },
      },
    },
  });
  const tags = await db.query.tagTable.findMany({});

  return (
    <div className="mx-auto max-w-full px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/instructor/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Course</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-8 mt-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Edit Course
        </h1>
        <PublishCourse courseId={params.courseId} course={course} />
      </div>
      <CourseEditForm courseId={params.courseId} tags={tags} />
    </div>
  );
}
