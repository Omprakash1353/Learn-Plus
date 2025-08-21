import "server-only";

import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { chapter, course } from "@/db/schema";
import { requireAdmin } from "./require-admin";

export async function adminGetCourse(id: string) {
  await requireAdmin();

  const row = await db.query.course.findFirst({
    where: eq(course.id, id),
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

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourse>>;
