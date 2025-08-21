"use server";

import { request } from "@arcjet/next";

import { requireInstructor } from "@/app/data/instructor/require-instructor";
import { db } from "@/db";
import { course } from "@/db/schema";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { courseSchema, CourseSchemaType } from "@/lib/validation";
import { ApiResponse } from "@/types/api-response";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function CreateCourse(
  data: CourseSchemaType
): Promise<ApiResponse> {
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

    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await db.insert(course).values({
      userId: session.user.id,
      ...validation.data,
    });

    return {
      status: "success",
      message: "Course created successfully !",
    };
  } catch (error) {
    console.error("CREATE COURSE ERROR", error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
