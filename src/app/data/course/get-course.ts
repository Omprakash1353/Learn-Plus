import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { chapter, course, lesson } from "@/db/schema";

export async function getIndividualCourse(slug: string) {
  const data = await db.query.course.findFirst({
    where: eq(course.slug, slug),
    with: {
      chapters: {
        orderBy: asc(chapter.position),
        with: {
          lessons: {
            orderBy: asc(lesson.position),
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}
