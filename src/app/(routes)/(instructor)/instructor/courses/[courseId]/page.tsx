import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { CourseEditForm } from "./_components/course-edit-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Create New Course
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
