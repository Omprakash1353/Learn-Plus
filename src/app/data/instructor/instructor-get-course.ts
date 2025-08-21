import "server-only";

import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { chapter, course } from "@/db/schema";
import { requireInstructor } from "./require-instructor";

export async function instructorGetCourse(id: string) {
  const session = await requireInstructor();

  const row = await db.query.course.findFirst({
    where: and(eq(course.id, id), eq(course.userId, session.user.id)),
    with: {
      chapters: {
        with: {
          lessons: true,
        },
        orderBy: asc(chapter.position),
      },
    },
  });

  if (!row) return notFound();

  return row;
}

export type InstructorCourseType = Awaited<
  ReturnType<typeof instructorGetCourse>
>;
