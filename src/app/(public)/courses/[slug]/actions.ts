"use server";

import { request } from "@arcjet/next";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireUser } from "@/app/data/user/require-user";
import { db } from "@/db";
import {
  course as courseTable,
  enrollment as enrollmentTable,
  payment as paymentTable,
  user as userTable,
} from "@/db/schema";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { ApiResponse } from "@/types/api-response";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function enrollInCourse(courseId: string): Promise<ApiResponse> {
  try {
    const user = await requireUser();
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { status: "error", message: "To many request" };
      }
      return { status: "error", message: "Malicious user" };
    }

    const course = await db.query.course.findFirst({
      where: eq(courseTable.id, courseId),
      columns: {
        id: true,
        title: true,
        price: true,
        slug: true,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }

    // GET THE PAYMENT_ID
    let paymentId: string;
    const userWithPaymentId = await db.query.user.findFirst({
      where: eq(userTable.id, user.id),
      columns: {
        paymentId: true,
      },
    });

    if (userWithPaymentId?.paymentId) {
      paymentId = userWithPaymentId.paymentId;
    } else {
      const customer = await db
        .insert(paymentTable)
        .values({
          email: user.email,
        })
        .returning();

      paymentId = customer[0].id;

      await db
        .update(userTable)
        .set({ paymentId })
        .where(eq(userTable.id, user.id));
    }

    // ENROLLMENT TRANSACTION
    await db.transaction(async (tx) => {
      const existingEnrollment = await tx.query.enrollment.findFirst({
        where: and(
          eq(enrollmentTable.userId, user.id),
          eq(enrollmentTable.courseId, courseId)
        ),
        columns: { status: true, id: true },
      });

      if (existingEnrollment?.status === "Active") {
        return {
          status: "success",
          message: "You are already enrolled in the course",
        };
      }

      if (existingEnrollment) {
       await tx
          .update(enrollmentTable)
          .set({
            amount: course.price,
            status: "Active",
            updatedAt: new Date(),
          })
          .where(eq(enrollmentTable.id, existingEnrollment.id));
      } else {
        await tx.insert(enrollmentTable).values({
          userId: user.id,
          courseId,
          amount: course.price,
          status: "Active",
        });
      }
    });

    revalidatePath(`courses/${course.slug}`);

    return {
      status: "success",
      message: "Enrolled successfully",
    };
  } catch (error) {
    console.error('ENROLL IN COURSE ERROR', error)
    return { status: "error", message: "Failed to enroll in course" };
  }
}
