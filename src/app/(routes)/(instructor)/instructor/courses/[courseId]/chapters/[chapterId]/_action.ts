"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { chapterTable, courseTable, videoTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import MuxServiceInstance from "@/service/mux";
import { generateId } from "lucia";
import cloudinaryService from "@/service/cloudinary";

export const chapterByIdAction = async (
  courseId: string,
  chapterId: string,
) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const chapter = await db.query.chapterTable.findFirst({
      where: and(
        eq(chapterTable.id, chapterId),
        eq(chapterTable.courseId, courseId),
      ),
      with: {
        video: {
          columns: {
            id: true,
            asset_id: true,
            playbackId: true,
          },
        },
      },
      columns: {
        id: true,
        title: true,
        description: true,
        isFree: true,
        status: true,
      },
    });

    if (!chapter) throw new Error("Chapter not found");

    console.debug(chapter);

    return {
      success: true,
      data: chapter,
      message: "Chapter fetched successfully",
      error: "",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
      message: "",
    };
  }
};

export const chapterUpdateByIdAction = async (
  courseId: string,
  chapterId: string,
  formData: FormData,
) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const chapterData: Partial<{
      title: string;
      description?: string;
      status: "PUBLISHED" | "DRAFT";
      isFree: boolean;
    }> = {
      title: formData.get("title")
        ? (formData.get("title") as string)
        : undefined,
      description: formData.get("description")
        ? (formData.get("description") as string)
        : undefined,
      status: formData.get("isPublished") === "true" ? "PUBLISHED" : "DRAFT",
      isFree: formData.get("isFree") === "true" ? true : false,
    };

    const validCourseData = Object.fromEntries(
      Object.entries(chapterData).filter(([key, value]) => value !== undefined),
    );

    console.debug(validCourseData);

    const chapter = await db
      .update(chapterTable)
      .set(validCourseData)
      .where(
        and(
          eq(chapterTable.id, chapterId),
          eq(chapterTable.courseId, courseId),
        ),
      )
      .returning({ id: chapterTable.id });

    if (!chapter) throw new Error("Chapter not found");

    return {
      success: true,
      data: chapter,
      message: "Chapter updated successfully",
      error: "",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
      message: "",
    };
  }
};

export const chapterPublishById = async (chapterId: string) => {
  try {
    const { user } = await validateRequest();

    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("Unauthorized");
    }

    const chapter = await db
      .update(chapterTable)
      .set({ status: "PUBLISHED" })
      .where(eq(chapterTable.id, chapterId))
      .returning({ id: chapterTable.id, courseId: chapterTable.courseId });

    if (!chapter) {
      throw new Error("Chapter not found");
    }

    revalidatePath(
      `/instructor/courses/${chapter[0].courseId}/chapters/${chapter[0].id}`,
    );
    revalidatePath(`/instructor/courses/${chapter[0].courseId}`);

    return {
      success: true,
      data: chapter,
      message: "Chapter published successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
      message: "",
    };
  }
};

export const chapterUnpublishById = async (chapterId: string) => {
  try {
    const { user } = await validateRequest();

    if (!user || user.role !== "INSTRUCTOR") {
      throw new Error("Unauthorized");
    }

    const chapter = await db
      .update(chapterTable)
      .set({ status: "DRAFT" })
      .where(eq(chapterTable.id, chapterId))
      .returning({ id: chapterTable.id, courseId: chapterTable.courseId });

    if (!chapter) {
      throw new Error("Chapter not found");
    }

    const checkChapterPublish = await db.query.courseTable.findFirst({
      where: and(
        eq(courseTable.id, chapter[0].courseId!),
        eq(courseTable.status, "PUBLISHED"),
      ),
      with: {
        chapters: {
          columns: {
            status: true,
          },
        },
      },
      columns: {
        id: true,
      },
    });

    if (
      (checkChapterPublish && checkChapterPublish.chapters.length === 0) ||
      !checkChapterPublish?.chapters.some((chp) => chp.status === "PUBLISHED")
    ) {
      await db
        .update(courseTable)
        .set({ status: "DRAFT" })
        .where(eq(courseTable.id, chapter[0].courseId!))
        .returning({ id: courseTable.id });
    }

    revalidatePath(
      `/instructor/courses/${chapter[0].courseId}/chapters/${chapter[0].id}`,
    );
    revalidatePath(`/instructor/courses/${chapter[0].courseId}`);

    return {
      success: true,
      data: chapter,
      message: "Chapter unpublished successfully",
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
      message: "",
    };
  }
};

export const chapterVideoUpload = async (
  formdata: FormData,
  courseId: string,
  chapterId: string,
) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");
    const file = formdata.get("video") as unknown as File;

    const checkCourse = await db.query.courseTable.findFirst({
      where: and(
        eq(courseTable.id, courseId),
        eq(courseTable.instructorId, user.id),
      ),
    });
    console.log("CHECK_COURSE", checkCourse);

    if (!checkCourse) throw new Error("Course not found");

    const checkChapter = await db.query.chapterTable.findFirst({
      where: and(eq(chapterTable.id, chapterId)),
    });
    console.log("CHECK_CHAPTER", checkChapter);

    if (!checkChapter) throw new Error("Chapter not found");

    if (!file) throw new Error("Video File not found");

    const existingVideo = await db.query.chapterTable.findFirst({
      with: {
        video: true,
      },
    });
    console.log("EXISTING_VIDEO", existingVideo);

    if (existingVideo && existingVideo.video) {
      await MuxServiceInstance.deleteVideo(existingVideo.video.asset_id);

      await cloudinaryService.deleteVideo(
        existingVideo.video.storage_public_id,
      );

      await db
        .delete(videoTable)
        .where(eq(videoTable.id, existingVideo.video.id));
    }

    console.log(file);

    const result = await cloudinaryService.uploadVideo(
      file,
      "LEARNPLUS_COURSE_VIDEOS",
    );

    const asset = await MuxServiceInstance.createVideoAsset(result.secure_url);
    console.log("ASSET", asset);

    const video = await db
      .insert(videoTable)
      .values({
        id: generateId(15),
        asset_id: asset.id,
        storage_public_id: result.public_id,
        playbackId: asset.playback_ids?.[0]?.id,
      })
      .returning({ id: videoTable.id });
    console.log("VIDEO", video);

    await db
      .update(chapterTable)
      .set({ videoId: video[0].id })
      .where(eq(chapterTable.id, chapterId));

    return { success: true, message: "File Uploaded successfully" };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};

export const getChapterVideo = async (courseId: string, chapterId: string) => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "INSTRUCTOR") throw new Error("Unauthorized");

    const checkCourse = await db.query.chapterTable.findFirst({
      where: and(eq(chapterTable.id, chapterId)),
      with: {
        video: true,
      },
      columns: {
        videoId: true,
      },
    });

    if (!checkCourse) throw new Error("Chapter not found");

    return {
      success: true,
      message: "Chapter video fetched successfully",
      data: checkCourse,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
};
