import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import {
  enrollment as enrollmentTable,
  lessonProgress as lessonProgressTable,
  lesson as lessonTable,
} from "@/db/schema";
import { requireUser } from "../user/require-user";

export async function getLessonContent(lessonId: string) {
  const session = await requireUser();

  const lesson = await db.query.lesson.findFirst({
    where: eq(lessonTable.id, lessonId),
    columns: {
      id: true,
      title: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      position: true,
    },
    with: {
      chapter: {
        columns: {
          courseId: true,
        },
        with: {
          course: {
            columns: {
              slug: true,
            },
          },
        },
      },
      lessonProgresses: {
        where: eq(lessonProgressTable.userId, session.id),
        columns: {
          completed: true,
          lessonId: true,
        },
      },
    },
  });

  if (!lesson) {
    return notFound();
  }

  const enrollment = await db.query.enrollment.findFirst({
    where: and(
      eq(enrollmentTable.userId, session.id),
      eq(enrollmentTable.courseId, lesson.chapter.courseId)
    ),
    columns: {
      status: true,
    },
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
