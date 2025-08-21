import { and, asc, eq, gte } from "drizzle-orm";

import { db } from "@/db";
import {
  course as courseTable,
  enrollment as enrollmentTable,
  user as userTable,
} from "@/db/schema";
import { requireInstructor } from "./require-instructor";

export async function instructorGetEnrollmentStats() {
  const session = await requireInstructor();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const enrollments = await db
    .select({
      createdAt: enrollmentTable.createdAt,
    })
    .from(enrollmentTable)
    .innerJoin(courseTable, eq(enrollmentTable.courseId, courseTable.id))
    .innerJoin(userTable, eq(courseTable.userId, userTable.id))
    .where(
      and(
        eq(userTable.id, session.user.id),
        gte(enrollmentTable.createdAt, thirtyDaysAgo)
      )
    )
    .orderBy(asc(enrollmentTable.createdAt));

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
