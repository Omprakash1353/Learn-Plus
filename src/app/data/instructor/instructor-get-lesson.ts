import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import {
  chapter as chapterTable,
  course as courseTable,
  lesson as lessonTable,
} from "@/db/schema";
import { requireInstructor } from "./require-instructor";

export async function instructorGetLesson(id: string) {
  const session = await requireInstructor();

  const [data] = await db
    .select({ lesson: lessonTable })
    .from(lessonTable)
    .innerJoin(chapterTable, eq(lessonTable.chapterId, chapterTable.id))
    .innerJoin(courseTable, eq(chapterTable.courseId, courseTable.id))
    .where(and(eq(lessonTable.id, id), eq(courseTable.userId, session.user.id)))
    .limit(1);

  if (!data) {
    return notFound();
  }

  return data.lesson;
}

export type InstructorLessonType = Awaited<
  ReturnType<typeof instructorGetLesson>
>;
