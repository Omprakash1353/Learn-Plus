"use server";

import { eq } from "drizzle-orm";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { courseTable, tagTable } from "@/lib/db/schema";
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
