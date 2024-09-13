"use server";

import { courseCreate } from "@/app/(routes)/(instructor)/instructor/courses/create/page";
import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";

export const createCourse = async (data: z.infer<typeof courseCreate>) => {
  try {
    const { user, session } = await validateRequest();
    if (
      !user ||
      !session ||
      !user.role ||
      !["INSTRUCTOR", "ADMIN"].includes(user.role)
    ) {
      return {
        success: false,
        message: "User is not authorized",
        error: "Unauthorized",
      };
    }

    const { title } = data;

    const id = generateId(15);
    const course = await db
      .insert(courseTable)
      .values({ id, title, instructorId: user.id })
      .returning({ id: courseTable.id });

    return {
      success: true,
      message: "Course created successfully",
      data: { courseId: course[0].id },
    };
  } catch (error: unknown) {
    return { success: false, message: "", error: getErrorMessage(error) };
  }
};

export const editCourse = async (formData: FormData) => {
  try {
    const courseData: Partial<{
      id: string;
      title: string;
      description?: string;
      price?: number;
      isPublished: boolean;
      tags: string[];
      thumbnail?: File;
    }> = {
      id: formData.get("id") as string,
      title: formData.get("title")
        ? (formData.get("title") as string)
        : undefined,
      description: formData.get("description")
        ? (formData.get("description") as string)
        : undefined,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : undefined,
      isPublished: formData.get("isPublished") === "true",
      tags: (formData.getAll("tags") as string[]) || [],
      thumbnail: formData.get("thumbnail")
        ? (formData.get("thumbnail") as File)
        : undefined,
    };

    if (courseData.id === undefined || courseData.id === "undefined")
      return {
        success: false,
        message: "Insufficient Data",
        error: "Course ID is not present",
      };

    const validCourseData = Object.fromEntries(
      Object.entries(courseData).filter(([_, v]) => v !== undefined),
    );

    console.log(validCourseData);

    const course = await db
      .update(courseTable)
      .set(validCourseData)
      .where(eq(courseTable.id, courseData.id))
      .returning({ id: courseTable.id, description: courseTable.description });

    console.info(course);

    return {
      success: true,
      message: "Course updated successfully!",
      courseId: "123",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Failed to update course.",
      error: getErrorMessage(error),
    };
  }
};
