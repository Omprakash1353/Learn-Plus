"use server";

import { and, asc, eq, gt, sql } from "drizzle-orm";
import { generateId } from "lucia";
import { z } from "zod";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { chapterTable, courseTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { chaptersSchema } from "./_components/course-edit-form";
import { revalidatePath } from "next/cache";

export const courseByIdAction = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const course = await db.query.courseTable.findFirst({
      where: eq(courseTable.id, courseId),
      with: {
        tags: {
          with: {
            tag: true,
          },
          columns: {
            tagId: false,
            courseId: false,
          },
        },
        images: {
          columns: {
            secure_url: true,
          },
        },
      },
      columns: {
        id: true,
        title: true,
        description: true,
        price: true,
        status: true,
      },
    });

    if (course === null) throw new Error("Course not found");

    const parsedCourse = {
      id: course?.id,
      title: course?.title,
      description: course?.description,
      price: course?.price,
      thumbnailUrl: course?.images?.secure_url,
      status: course?.status,
      tags: course?.tags.map((tag) => tag.tag),
    };

    return {
      success: true,
      message: "Course fetched successfully",
      data: parsedCourse,
      error: null,
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error), message: null };
  }
};

export const createChapter = async (courseId: string, chapterName: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const id = generateId(15);
    const chapterOrder = await db.query.chapterTable.findMany({
      where: eq(chapterTable.courseId, courseId),
    });

    const [chapter] = await db
      .insert(chapterTable)
      .values({
        id,
        title: chapterName,
        courseId,
        order: (chapterOrder.length || 0) + 1,
      })
      .returning({ id: chapterTable.id });

    if (!chapter) {
      throw new Error("Chapter not created");
    }

    return {
      success: true,
      message: "Chapter created successfully",
      data: chapter.id,
    };
  } catch (error: unknown) {
    console.error("Error creating chapter:", error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};

export const getCourseChaptersById = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const chapters = await db.query.chapterTable.findMany({
      where: eq(chapterTable.courseId, courseId),
      columns: {
        id: true,
        title: true,
        order: true,
        status: true,
      },
      orderBy: [asc(chapterTable.order)],
    });

    if (!chapters) throw new Error("Chapters not found");

    return {
      success: true,
      message: "Chapters fetched successfully",
      data: chapters,
    };
  } catch (error: unknown) {
    console.error("Error fetching chapters:", error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const deleteChapterById = async (chapterId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const chapter = await db
      .delete(chapterTable)
      .where(eq(chapterTable.id, chapterId))
      .returning({
        id: chapterTable.id,
        order: chapterTable.order,
        courseId: chapterTable.courseId,
      });

    if (!chapter) throw new Error("Chapter not found");
    if (!chapter[0].courseId) throw new Error("Course not found");

    await db
      .update(chapterTable)
      .set({ order: sql`${chapterTable.order} - 1` })
      .where(
        and(
          eq(chapterTable.courseId, chapter[0].courseId),
          gt(chapterTable.order, chapter[0].order),
        ),
      );

    const coursePublish = await db.query.courseTable.findFirst({
      where: eq(courseTable.id, chapter[0].courseId),
      columns: {
        status: true,
      },
      with: {
        chapters: {
          columns: {
            id: true,
            status: true,
          },
        },
      }
    })

    if (coursePublish?.status === "PUBLISHED" && (coursePublish?.chapters.length === 0 || !coursePublish?.chapters.some(chp => chp.status === "PUBLISHED"))) {
      await db.update(courseTable).set({ status: "DRAFT" }).where(eq(courseTable.id, chapter[0].courseId))
    }

    return {
      success: true,
      message: "Chapter deleted successfully",
      error: "",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};

export const editCourseTitleById = async (chapterId: string, title: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const chapter = await db
      .update(chapterTable)
      .set({ title })
      .where(eq(chapterTable.id, chapterId))
      .returning({ id: chapterTable.id, title: chapterTable.title });

    if (!chapter) throw new Error("Chapter not found");

    return {
      success: true,
      message: "Chapter updated successfully",
      error: "",
      data: chapter[0].title,
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};

export const reorderChaptersById = async (
  courseId: string,
  values: z.infer<typeof chaptersSchema>,
) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const chapters = await Promise.all(
      values.map((chp) =>
        db
          .update(chapterTable)
          .set({ order: chp.order })
          .where(
            and(
              eq(chapterTable.id, chp.id),
              eq(chapterTable.courseId, courseId),
            ),
          )
          .returning({ id: chapterTable.id, order: chapterTable.order }),
      ),
    );

    if (!chapters) throw new Error("Chapters not found");

    return {
      success: true,
      message: "Chapters updated successfully",
    };
  } catch (error: unknown) {
    console.error("Error creating chapter:", error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};

export const publishCourseById = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const course = await db
      .update(courseTable)
      .set({ status: "PUBLISHED" })
      .where(eq(courseTable.id, courseId))
      .returning({ id: courseTable.id, status: courseTable.status });

    if (!course) throw new Error("Course not found");

    revalidatePath(`instructor/courses/${courseId}`);

    return {
      success: true,
      message: "Course published successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};

export const unpublishCourseById = async (courseId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("User unauthorized");
    }

    const course = await db
      .update(courseTable)
      .set({ status: "DRAFT" })
      .where(eq(courseTable.id, courseId))
      .returning({ id: courseTable.id, status: courseTable.status });

    if (!course) throw new Error("Course not found");

    revalidatePath(`instructor/courses/${courseId}`);

    return {
      success: true,
      message: "Course published successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};
