import { asc, gte } from "drizzle-orm";

import { db } from "@/db";
import { requireAdmin } from "./require-admin";
import { enrollment as enrollmentTable } from "@/db/schema";

export async function adminGetEnrollmentStats() {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await db.query.enrollment.findMany({
    where: gte(enrollmentTable.createdAt, thirtyDaysAgo),
    orderBy: asc(enrollmentTable.createdAt),
    columns: { createdAt: true },
  });

  const last30Days: { date: string; enrollments: number }[] = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();

    date.setDate(date.getDate() - i);
    last30Days.push({ date: date.toISOString().split("T")[0], enrollments: 0 }); // yyyy-mm-dd
  }

  enrollments.forEach((enrollment) => {
    const enrollmentDate = enrollment.createdAt?.toISOString().split("T")[0];
    const dayIndex = last30Days.findIndex((day) => day.date === enrollmentDate);

    if (dayIndex !== -1) {
      last30Days[dayIndex].enrollments++;
    }
  });

  return last30Days;
}
