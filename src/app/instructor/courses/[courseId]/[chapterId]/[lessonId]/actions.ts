"use server";

import { eq } from "drizzle-orm";

import { requireInstructor } from "@/app/data/instructor/require-instructor";
import { db } from "@/db";
import { lesson } from "@/db/schema";
import { deleteFileFromS3 } from "@/lib/s3-client";
import { lessonSchema, LessonSchemaType } from "@/lib/validation";
import { ApiResponse } from "@/types/api-response";

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireInstructor();

  try {
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const existingLesson = await db.query.lesson.findFirst({
      where: eq(lesson.id, lessonId),
      columns: { thumbnailKey: true, videoKey: true },
    });

    if (!existingLesson) {
      return { status: "error", message: "Lesson not found" };
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

    if (
      result.data.thumbnailKey &&
      existingLesson.thumbnailKey &&
      result.data.thumbnailKey !== existingLesson.thumbnailKey
    ) {
      await deleteFileFromS3(existingLesson.thumbnailKey);
    }

    if (
      result.data.videoKey &&
      existingLesson.videoKey &&
      result.data.videoKey !== existingLesson.videoKey
    ) {
      await deleteFileFromS3(existingLesson.videoKey);
    }

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
