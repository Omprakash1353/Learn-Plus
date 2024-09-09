"use server";

import { courseCreate } from "@/app/(routes)/(instructor)/instructor/courses/create/page";
import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
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

export const editCourse = async () => {
  try {
    return {
      success: true,
      message: "Course Updated successfully !!!",
    };
  } catch (error: unknown) {
    return { success: false, message: "", error: getErrorMessage(error) };
  }
};
