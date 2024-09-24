"use server";

import { and, eq } from "drizzle-orm";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { chapterTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { z } from "zod";
import { chapterEditSchema } from "./_components/chapter-edit-form";

export const chapterByIdAction = async (
  courseId: string,
  chapterId: string,
) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const chapter = await db.query.chapterTable.findFirst({
      where: and(
        eq(chapterTable.id, chapterId),
        eq(chapterTable.courseId, courseId),
      ),
      with: {
        video: {
          columns: {
            id: true,
            asset_id: true,
            playbackId: true,
          },
        },
      },
      columns: {
        id: true,
        title: true,
        description: true,
        isFree: true,
        status: true,
      },
    });

    if (!chapter) throw new Error("Chapter not found");

    return {
      success: true,
      data: chapter,
      message: "Chapter fetched successfully",
      error: "",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
      message: "",
    };
  }
};

export const chapterUpdateByIdAction = async (
  courseId: string,
  chapterId: string,
  formData: FormData,
) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const chapterData: Partial<{
      title: string;
      description?: string;
      status: "PUBLISHED" | "DRAFT";
      isFree: boolean;
    }> = {
      title: formData.get("title")
        ? (formData.get("title") as string)
        : undefined,
      description: formData.get("description")
        ? (formData.get("description") as string)
        : undefined,
      status: formData.get("isPublished") === "true" ? "PUBLISHED" : "DRAFT",
      isFree: formData.get("isFree") === "true" ? true : false,
    };

    const validCourseData = Object.fromEntries(
      Object.entries(chapterData).filter(([key, value]) => value !== undefined),
    );

    const chapter = await db
      .update(chapterTable)
      .set(validCourseData)
      .where(
        and(
          eq(chapterTable.id, chapterId),
          eq(chapterTable.courseId, courseId),
        ),
      )
      .returning({ id: chapterTable.id });

    if (!chapter) throw new Error("Chapter not found");

    return {
      success: true,
      data: chapter,
      message: "Chapter updated successfully",
      error: "",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
      message: "",
    };
  }
};
