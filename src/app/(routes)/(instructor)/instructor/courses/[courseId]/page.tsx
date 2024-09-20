import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/lucia";
import Link from "next/link";
import { CourseEditForm } from "./_components/course-edit-form";

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
        <Button asChild className="self-end">
          <Link href={`/instructor/courses/${params.courseId}/sections`}>
            Add Modules and Sections
          </Link>
        </Button>
      </div>
      <CourseEditForm courseId={params.courseId} tags={tags} />
    </div>
  );
}
