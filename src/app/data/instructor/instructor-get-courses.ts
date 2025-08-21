import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { course } from "@/db/schema";
import { requireInstructor } from "./require-instructor";

export async function instructorGetCourses() {
  const session = await requireInstructor();

  const data = await db
    .select({
      id: course.id,
      title: course.title,
      smallDescription: course.smallDescription,
      duration: course.duration,
      level: course.level,
      status: course.status,
      price: course.price,
      fileKey: course.fileKey,
      slug: course.slug,
      category: course.category,
    })
    .from(course)
    .orderBy(desc(course.createdAt))
    .where(eq(course.userId, session.user.id));

  return data;
}

export type InstructorCoursesType = Awaited<ReturnType<typeof instructorGetCourses>>[0];
