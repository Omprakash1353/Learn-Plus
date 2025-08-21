import { desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { requireInstructor } from "./require-instructor";
import { course as courseTable } from "@/db/schema";

export async function instructorGetRecentCourses() {
  const session = await requireInstructor();

  const data = await db.query.course.findMany({
    orderBy: desc(courseTable.createdAt),
    columns: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      category: true,
    },
    limit: 2,
    where: eq(courseTable.userId, session.user.id),
  });

  return data;
}
