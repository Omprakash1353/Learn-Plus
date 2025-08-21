"use server";

import { eq } from "drizzle-orm";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { db } from "@/db";
import { lesson } from "@/db/schema";
import { lessonSchema, LessonSchemaType } from "@/lib/validation";
import { ApiResponse } from "@/types/api-response";

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await db
      .update(lesson)
      .set({
        title: result.data.name,
        description: result.data.description,
        thumbnailKey: result.data.thumbnailKey,
        videoKey: result.data.videoKey,
      })
      .where(eq(lesson.id, lessonId));

    return {
      status: "success",
      message: "Lesson updated successfully !",
    };
  } catch (error) {
    console.error('UPDATE LESSON ERROR', error)
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}
