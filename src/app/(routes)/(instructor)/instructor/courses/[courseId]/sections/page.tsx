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

export default async function SectionPage({
  params,
}: {
  params: { courseId: string };
}) {
  const { user } = await validateRequest();
  if (!user || user.role !== "INSTRUCTOR") return redirect("/");

  const courseName = await db.query.courseTable.findFirst({
    where: eq(courseTable.id, params.courseId),
    columns: {
      title: true,
    },
  });

  return (
    <div className="mx-auto max-w-full px-4 py-12 sm:px-6 lg:px-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/instructor/courses">Courses</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/instructor/${params.courseId}`}>
              {courseName?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Modules & Sections</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mb-8 mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Edit Modules & Sections
        </h1>
      </div>
    </div>
  );
}
