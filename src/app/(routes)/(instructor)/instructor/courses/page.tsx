import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { courseTable, enrollmentTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { CourseCreate } from "./_components/course-create-form";
import { coursesDataType, CoursesTable } from "./_components/courses-table";

export default async function InstructorDashboard() {
  const { user } = await validateRequest();
  if (!user || user.role !== "INSTRUCTOR") return redirect("/");

  const courseData = await db.query.courseTable.findMany({
    where: eq(courseTable.instructorId, user.id),
    with: {
      enrollments: {
        columns: {
          courseId: true,
        },
        where: eq(courseTable.id, enrollmentTable.courseId),
      },
    },
    columns: {
      id: true,
      title: true,
      status: true,
      price: true,
      rating: true,
    },
  });

  const parseCourseType = courseData as unknown as coursesDataType[];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
        <div className="flex items-center space-x-2">
          <CourseCreate />
        </div>
      </div>
      <CoursesTable coursesData={parseCourseType} />
    </div>
  );
}
