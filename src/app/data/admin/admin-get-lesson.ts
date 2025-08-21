import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { db } from "@/db";
import { lesson } from "@/db/schema";
import { requireAdmin } from "./require-admin";

export async function adminGetLesson(id: string) {
  await requireAdmin();

  const data = await db.query.lesson.findFirst({
    where: eq(lesson.id, id),
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;
