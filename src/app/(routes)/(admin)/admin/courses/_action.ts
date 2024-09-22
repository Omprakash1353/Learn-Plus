"use server";

import { eq } from "drizzle-orm";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { courseTable, enrollmentTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export const getAdminCourses = async () => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "ADMIN") throw new Error("User unauthorized");

    const courseData = await db.query.courseTable.findMany({
      with: {
        enrollments: {
          columns: {
            courseId: true,
          },
          where: eq(courseTable.id, enrollmentTable.courseId),
        },
        instructor: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                profilePictureUrl: true,
                createdAt: true,
              },
            },
          },
          columns: {
            id: true,
          },
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
    });

    const parsedCourseData = courseData.map((crs) => ({
      id: crs.id,
      title: crs.title,
      status: crs.status,
      price: crs.price,
      enrollments: crs.enrollments.length,
      rating: crs.rating,
      instructor: {
        id: crs.instructor?.id,
        name: crs.instructor?.user?.name,
        profilePictureUrl: crs.instructor?.user?.profilePictureUrl,
      },
      createdAt: crs.createdAt,
      updatedAt: crs.updatedAt,
    }));

    return {
      success: true,
      data: parsedCourseData,
      message: "Courses fetched successfully !!!",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
};
