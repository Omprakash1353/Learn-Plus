import { desc } from "drizzle-orm";

import { db } from "@/db";
import { course } from "@/db/schema";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await requireAdmin();

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
    .orderBy(desc(course.createdAt));

  return data;
}

export type AdminCoursesType = Awaited<ReturnType<typeof adminGetCourses>>[0];
