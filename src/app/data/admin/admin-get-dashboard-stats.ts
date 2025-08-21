import { count, countDistinct } from "drizzle-orm";

import { db } from "@/db";
import { course, enrollment, lesson, user } from "@/db/schema";
import { requireAdmin } from "./require-admin";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalSignUps, totalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      db.select({ count: count() }).from(user),
      db.select({ count: countDistinct(enrollment.userId) }).from(enrollment),
      db.select({ count: count() }).from(course),
      db.select({ count: count() }).from(lesson),
    ]);

  return {
    totalSignUps: totalSignUps[0].count,
    totalCourses: totalCourses[0].count,
    totalCustomers: totalCustomers[0].count,
    totalLessons: totalLessons[0].count,
  };
}
