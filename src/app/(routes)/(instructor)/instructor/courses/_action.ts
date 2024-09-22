"use server";

import { eq, sql } from "drizzle-orm";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { courseTable, enrollmentTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export const getInstructorCourses = async () => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR")
      throw new Error("User Unauthorized");

    const courseData = await db.query.courseTable.findMany({
      where: eq(courseTable.instructorId, user.id),
      with: {
        enrollments: {
          columns: {
            courseId: true,
          },
          where: eq(courseTable.id, enrollmentTable.courseId),
        },
      },
      columns: {
        id: true,
        title: true,
        status: true,
        price: true,
        rating: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: (courseTable, { desc }) => [desc(courseTable.updatedAt)],
    });

    if (!courseData) throw new Error("Course not found");

    const parseCourseType = courseData.map((crs) => ({
      id: crs.id,
      title: crs.title,
      status: crs.status,
      students: crs.enrollments.length,
      price: crs.price,
      rating: crs.rating,
      createdAt: crs.createdAt,
      updatedAt: crs.updatedAt,
    }));

    return {
      success: true,
      data: parseCourseType,
      message: "Courses fetched successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
};
