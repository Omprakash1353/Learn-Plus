import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import { enrollment, lessonProgress } from "@/db/schema";
import { requireUser } from "./require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await db.query.enrollment.findMany({
    where: and(eq(enrollment.userId, user.id), eq(enrollment.status, "Active")),
    with: {
      course: {
        columns: {
          id: true,
          smallDescription: true,
          title: true,
          fileKey: true,
          level: true,
          slug: true,
          duration: true,
          category: true,
        },
        with: {
          chapters: {
            with: {
              lessons: {
                with: {
                  lessonProgresses: {
                    where: eq(lessonProgress.userId, user.id),
                    columns: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
