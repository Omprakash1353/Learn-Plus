import { desc } from "drizzle-orm";

import { db } from "@/db";
import { requireAdmin } from "./require-admin";
import { course as courseTable } from "@/db/schema";

export async function adminGetRecentCourses() {
  await requireAdmin();

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
  });

  return data;
}
