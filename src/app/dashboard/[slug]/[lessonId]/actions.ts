"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/app/data/user/require-user";
import { db } from "@/db";
import { lessonProgress as lessonProgressTable } from "@/db/schema";
import { ApiResponse } from "@/types/api-response";

export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  const session = await requireUser();

  try {
    await db
      .insert(lessonProgressTable)
      .values({
        lessonId,
        userId: session.id,
        completed: true,
      })
      .onConflictDoUpdate({
        target: [lessonProgressTable.userId, lessonProgressTable.lessonId],
        set: { completed: true },
      });

    revalidatePath(`/dashboard/${slug}`);

    return { status: "success", message: "Progress updated" };
  } catch (error) {
    console.error('MARK LESSON COMPLETE ERROR', error)
    return { status: "error", message: "Failed to mark lesson as complete" };
  }
}
