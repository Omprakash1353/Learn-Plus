import { count, countDistinct, eq } from "drizzle-orm";

import { db } from "@/db";
import { chapter, course, enrollment, lesson } from "@/db/schema";
import { requireInstructor } from "./require-instructor";

export async function instructorGetDashboardStats() {
  const session = await requireInstructor();

  const [totalCustomers, totalCourses, totalLessons] = await Promise.all([
    db
      .select({ count: countDistinct(enrollment.userId) })
      .from(enrollment)
      .innerJoin(course, eq(enrollment.courseId, course.id))
      .where(eq(course.userId, session.user.id)),

    db
      .select({ count: count() })
      .from(course)
      .where(eq(course.userId, session.user.id)),

    db
      .select({ count: count() })
      .from(lesson)
      .innerJoin(chapter, eq(lesson.chapterId, chapter.id))
      .innerJoin(course, eq(chapter.courseId, course.id))
      .where(eq(course.userId, session.user.id)),
  ]);
  return {
    totalCourses: totalCourses[0].count,
    totalCustomers: totalCustomers[0].count,
    totalLessons: totalLessons[0].count,
  };
}
