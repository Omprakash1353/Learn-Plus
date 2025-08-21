import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { course } from "@/db/schema";

export async function getAllCourses() {
  const data = await db.query.course.findMany({
    where: eq(course.status, "Published"),
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    orderBy: desc(course.createdAt),
  });

  return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
