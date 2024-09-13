import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { courseTable, enrollmentTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
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
      <CoursesTable coursesData={parseCourseType} />
    </div>
  );
}

const coursesData = [
  {
    id: 1,
    title: "Introduction to React",
    status: "Published",
    students: 150,
    price: 49.99,
    rating: 4.5,
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    status: "Draft",
    students: 0,
    price: 79.99,
    rating: 0,
  },
  {
    id: 3,
    title: "Web Design Fundamentals",
    status: "Published",
    students: 75,
    price: 0,
    rating: 4.2,
  },
  {
    id: 4,
    title: "Python for Beginners",
    status: "Published",
    students: 200,
    price: 39.99,
    rating: 4.8,
  },
  {
    id: 5,
    title: "Data Science Essentials",
    status: "Draft",
    students: 0,
    price: 89.99,
    rating: 0,
  },
];
