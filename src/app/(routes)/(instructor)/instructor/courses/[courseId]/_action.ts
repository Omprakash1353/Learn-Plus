"use server";

import { eq } from "drizzle-orm";
import { generateId } from "lucia";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { chapterTable, courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export const courseByIdAction = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const course = await db.query.courseTable.findFirst({
      where: eq(courseTable.id, courseId),
      with: {
        tags: {
          with: {
            tag: true,
          },
          columns: {
            tagId: false,
            courseId: false,
          },
        },
        images: {
          columns: {
            secure_url: true,
          },
        },
        chapters: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
      columns: {
        id: true,
        title: true,
        description: true,
        price: true,
        status: true,
      },
    });

    if (course === null) throw new Error("Course not found");

    const parsedCourse = {
      id: course?.id,
      title: course?.title,
      description: course?.description,
      price: course?.price,
      thumbnailUrl: course?.images?.secure_url,
      status: course?.status,
      tags: course?.tags.map((tag) => tag.tag),
      chapters: course?.chapters,
    };

    return {
      success: true,
      message: "Course fetched successfully",
      data: parsedCourse,
      error: null,
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error), message: null };
  }
};

export const createChapter = async (courseId: string, chapterName: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      return { success: false, error: "Unauthorized", message: null };
    }

    const id = generateId(15);
    const chapterOrder = await db.query.chapterTable.findMany({
      where: eq(chapterTable.courseId, courseId),
    });

    const [chapter] = await db
      .insert(chapterTable)
      .values({
        id,
        title: chapterName,
        courseId,
        order: (chapterOrder.length || 0) + 1,
      })
      .returning({ id: chapterTable.id });

    if (!chapter) {
      return {
        success: false,
        error: "Chapter creation failed (possible conflict)",
        message: null,
      };
    }

    return {
      success: true,
      message: "Chapter created successfully",
      data: chapter.id,
    };
  } catch (error: unknown) {
    console.error("Error creating chapter:", error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};
