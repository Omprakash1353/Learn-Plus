"use server";

import { and, asc, desc, eq } from "drizzle-orm";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { db } from "@/db";
import { chapter, course, lesson } from "@/db/schema";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/validation";
import { ApiResponse } from "@/types/api-response";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  try {
    const session = await requireAdmin();
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

    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return { status: "error", message: "Invalid data" };
    }

    await db
      .update(course)
      .set({ ...result.data })
      .where(and(eq(course.id, courseId), eq(course.userId, session.user.id)));

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    console.error("EDIT COURSE ERROR", error);
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    await db.transaction(async (tx) => {
      await Promise.all(
        lessons.map((ls) =>
          tx
            .update(lesson)
            .set({ position: ls.position })
            .where(and(eq(lesson.id, ls.id), eq(lesson.chapterId, chapterId)))
        )
      );
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    console.error("REORDER LESSONS ERROR", error);
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }

    await db.transaction(async (tx) => {
      await Promise.all(
        chapters.map((chp) =>
          tx
            .update(chapter)
            .set({ position: chp.position })
            .where(and(eq(chapter.id, chp.id), eq(chapter.courseId, courseId)))
        )
      );
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return { status: "success", message: "Chapters reordered successfully" };
  } catch (error) {
    console.error('REORDER CHAPTERS ERROR', error)
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    await db.transaction(async (tx) => {
      const maxPos = await tx.query.chapter.findFirst({
        where: eq(chapter.courseId, result.data.courseId),
        orderBy: desc(chapter.position),
        columns: { position: true },
      });

      await tx.insert(chapter).values({
        title: result.data.name,
        courseId: result.data.courseId,
        position: (maxPos?.position ?? 0) + 1,
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch (error) {
    console.error('CREATE CHAPTER ERROR', error)
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    await db.transaction(async (tx) => {
      const maxPos = await tx.query.lesson.findFirst({
        where: eq(lesson.chapterId, result.data.chapterId),
        orderBy: desc(lesson.position),
        columns: { position: true },
      });

      await tx.insert(lesson).values({
        title: result.data.name,
        description: result.data.description,
        videoKey: result.data.videoKey,
        thumbnailKey: result.data.thumbnailKey,
        chapterId: result.data.chapterId,
        position: (maxPos?.position ?? 0) + 1,
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch (error) {
    console.error('CREATE LESSON ERROR', error)
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const chapterWithLessons = await db.query.chapter.findFirst({
      where: eq(chapter.id, chapterId),
      with: {
        lessons: {
          orderBy: asc(lesson.position),
          columns: { id: true, position: true },
        },
      },
    });

    if (!chapterWithLessons) {
      return { status: "error", message: "Chapter not found" };
    }

    const lessonToDelete = chapterWithLessons.lessons.find(
      (lesson) => lesson.id === lessonId
    );

    if (!lessonToDelete) {
      return { status: "error", message: "Lesson not found in the chapter" };
    }

    const remainingLessons = chapterWithLessons.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );

    await db.transaction(async (tx) => {
      await Promise.all(
        remainingLessons.map((ls, index) =>
          tx
            .update(lesson)
            .set({ position: index + 1 })
            .where(eq(lesson.id, ls.id))
        )
      );

      await tx
        .delete(lesson)
        .where(and(eq(lesson.id, lessonId), eq(lesson.chapterId, chapterId)));
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted and positions reordered successfully",
    };
  } catch (error) {
    console.error('DELETE LESSON ERROR', error)
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();
  try {
    const courseWithChapters = await db.query.course.findFirst({
      where: eq(course.id, courseId),
      with: {
        chapters: {
          columns: { id: true, position: true },
          orderBy: asc(chapter.position),
        },
      },
    });

    if (!courseWithChapters) {
      return { status: "error", message: "Course not found" };
    }

    const chapterToDelete = courseWithChapters.chapters.find(
      (ch) => ch.id === chapterId
    );

    if (!chapterToDelete) {
      return { status: "error", message: "Chapter not found in the course" };
    }

    const remainingChapters = courseWithChapters.chapters.filter(
      (ch) => ch.id !== chapterId
    );

    await db.transaction(async (tx) => {
      await Promise.all(
        remainingChapters.map((chp, index) =>
          tx
            .update(chapter)
            .set({ position: index + 1 })
            .where(eq(chapter.id, chp.id))
        )
      );

      await tx.delete(chapter).where(eq(chapter.id, chapterId));
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    console.error('DELETE CHAPTER ERROR', error)
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}
