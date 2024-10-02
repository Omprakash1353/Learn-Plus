"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { userProgressTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export const handleMarkChapterComplete = async (
  courseId: string,
  chapterId: string,
) => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("User unauthorized");

    const chapter = await db
      .update(userProgressTable)
      .set({ isCompleted: true })
      .where(
        and(
          eq(userProgressTable.userId, user.id),
          eq(userProgressTable.chapterId, chapterId),
        ),
      );

    if (!chapter) {
      throw new Error("Failed to mark chapter as completed");
    }

    revalidatePath(`/courses/${courseId}/${chapterId}`);

    return {
      success: true,
      message: "Chapter marked as completed successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
};
