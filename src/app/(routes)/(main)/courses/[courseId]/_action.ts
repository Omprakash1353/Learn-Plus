"use server";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import {
  chapterTable,
  courseTable,
  enrollmentTable,
  paymentTable,
  userProgressTable,
} from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { and, eq } from "drizzle-orm";
import { generateId } from "lucia";

export const enrollCourse = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("User unauthorized");

    // Get the course price
    const amount = await db.query.courseTable.findFirst({
      where: eq(courseTable.id, courseId),
      columns: {
        price: true,
      },
    });

    // Create the payment entry
    const payment = await db.insert(paymentTable).values({
      id: generateId(15),
      userId: user.id,
      courseId,
      paymentStatus: amount?.price !== undefined ? "COMPLETED" : "FAILED",
      amount: amount?.price ? amount.price : 0,
    });

    if (!payment) {
      throw new Error("Failed to create payment");
    }

    // Begin transaction
    await db.transaction(async (trx) => {
      // Insert the enrollment
      const enroll = await trx.insert(enrollmentTable).values({
        id: generateId(15),
        userId: user.id,
        courseId,
      });

      if (!enroll) {
        throw new Error("Failed to enroll");
      }

      // Fetch all chapters for the course
      const chapters = await db.query.chapterTable.findMany({
        where: eq(chapterTable.courseId, courseId),
        columns: {
          id: true,
        },
      });

      if (!chapters || chapters.length === 0) {
        throw new Error("No chapters found for this course");
      }

      // Insert progress for each chapter
      for (const chapter of chapters) {
        await trx.insert(userProgressTable).values({
          id: generateId(15),
          userId: user.id,
          chapterId: chapter.id, // Correctly referencing `chapterId`
          isCompleted: false, // Initialize with incomplete progress
        });
      }
    });

    return { success: true, message: "Enrolled successfully" };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const hasEnrolled = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user) throw new Error("User unauthorized");

    const hasEnrolled = await db.query.enrollmentTable.findFirst({
      where: and(
        eq(enrollmentTable.userId, user.id),
        eq(enrollmentTable.courseId, courseId),
      ),
      with: {
        course: {
          with: {
            chapters: {
              where: and(
                eq(chapterTable.status, "PUBLISHED"),
                eq(chapterTable.order, 1),
              ),
            },
          },
        },
      },
    });

    console.log(!!hasEnrolled)

    return {
      success: true,
      hasEnrolled: !!hasEnrolled,
      data: { currentChapter: hasEnrolled?.course?.chapters[0].id },
    };
  } catch (error: unknown) {
    console.log(error);
    return { success: false, error: getErrorMessage(error) };
  }
};
