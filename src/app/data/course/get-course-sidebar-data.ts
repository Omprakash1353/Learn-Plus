import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import {
  chapter as chapterTable,
  course as courseTable,
  enrollment as enrollmentTable,
  lessonProgress as lessonProgressTable,
  lesson as lessonTable,
} from "@/db/schema";
import { requireUser } from "../user/require-user";

export async function getCourseSidebarData(slug: string) {
  const user = await requireUser();

  const course = await db.query.course.findFirst({
    where: eq(courseTable.slug, slug),
    columns: {
      id: true,
      title: true,
      fileKey: true,
      duration: true,
      level: true,
      category: true,
      slug: true,
    },
    with: {
      chapters: {
        columns: {
          id: true,
          title: true,
          position: true,
        },
        orderBy: asc(chapterTable.position),
        with: {
          lessons: {
            orderBy: asc(lessonTable.position),
            columns: {
              id: true,
              title: true,
              position: true,
              description: true,
            },
            with: {
              lessonProgresses: {
                where: eq(lessonProgressTable.userId, user.id),
                columns: {
                  completed: true,
                  id: true,
                  lessonId: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  const enrollment = await db.query.enrollment.findFirst({
    where: and(
      eq(enrollmentTable.courseId, course.id),
      eq(enrollmentTable.userId, user.id)
    ),
  });

  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }

  return { course };
}

export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
