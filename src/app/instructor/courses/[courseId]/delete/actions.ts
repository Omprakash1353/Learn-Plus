"use server";

import { request } from "@arcjet/next";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireInstructor } from "@/app/data/instructor/require-instructor";
import { db } from "@/db";
import { course } from "@/db/schema";
import arcjet, { fixedWindow } from "@/lib/arcjet";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function deleteCourse(courseId: string) {
  try {
    const session = await requireInstructor();
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return { status: "error", message: "To many request" };
      }
      return { status: "error", message: "Malicious user" };
    }

    await db.delete(course).where(eq(course.id, courseId));

    revalidatePath("/admin/courses");

    return { status: "success", message: "Course deleted successfully" };
  } catch (error) {
    console.error('DELETE COURSE ERROR', error)
    return { status: "error", message: "Failed to delete course" };
  }
}
