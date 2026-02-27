"use server";

import { request } from "@arcjet/next";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { requireInstructor } from "@/app/data/instructor/require-instructor";
import { db } from "@/db";
import { course } from "@/db/schema";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { deleteFileFromS3 } from "@/lib/s3-client";

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

    const courseToDelete = await db.query.course.findFirst({
      where: eq(course.id, courseId),
      with: {
        chapters: {
          with: {
            lessons: true,
          },
        },
      },
    });

    if (!courseToDelete) {
      return { status: "error", message: "Course not found" };
    }

    await db.delete(course).where(eq(course.id, courseId));

    // Cleanup S3
    const keysToDelete: string[] = [];
    if (courseToDelete.fileKey) keysToDelete.push(courseToDelete.fileKey);

    courseToDelete.chapters.forEach((chp) => {
      chp.lessons.forEach((ls) => {
        if (ls.thumbnailKey) keysToDelete.push(ls.thumbnailKey);
        if (ls.videoKey) keysToDelete.push(ls.videoKey);
      });
    });

    if (keysToDelete.length > 0) {
      await Promise.all(keysToDelete.map((key) => deleteFileFromS3(key)));
    }

    revalidatePath("/instructor/courses");

    return { status: "success", message: "Course deleted successfully" };
  } catch (error) {
    console.error('DELETE COURSE ERROR', error)
    return { status: "error", message: "Failed to delete course" };
  }
}
