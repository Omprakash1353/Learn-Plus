"use server";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { courseTable, courseTagsTable, imageTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import cloudinaryService from "@/service/cloudinary";
import { and, eq, inArray, ne } from "drizzle-orm";
import { generateId } from "lucia";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const createCourse = async (data: { title: string }) => {
  try {
    const { user, session } = await validateRequest();
    if (
      !user ||
      !session ||
      !user.role ||
      !["INSTRUCTOR", "ADMIN"].includes(user.role)
    ) {
      return {
        success: false,
        message: "User is not authorized",
        error: "Unauthorized",
      };
    }

    const { title } = data;

    const id = generateId(15);
    const course = await db
      .insert(courseTable)
      .values({ id, title, instructorId: user.id })
      .returning({ id: courseTable.id });

    return {
      success: true,
      message: "Course created successfully",
      data: { courseId: course[0].id },
    };
  } catch (error: unknown) {
    return { success: false, message: "", error: getErrorMessage(error) };
  }
};

export const editCourse = async (formData: FormData) => {
  try {
    console.info("Received formData:", formData);

    const courseId = formData.get("id") as string;
    console.info("Processing course ID:", courseId);

    const courseData: Partial<{
      title: string;
      description?: string;
      price?: number;
      status: "PUBLISHED" | "DRAFT";
      tags: string[];
      thumbnail?: File;
    }> = {
      title: formData.get("title")
        ? (formData.get("title") as string)
        : undefined,
      description: formData.get("description")
        ? (formData.get("description") as string)
        : undefined,
      price: formData.get("price")
        ? parseFloat(formData.get("price") as string)
        : undefined,
      status: formData.get("isPublished") === "true" ? "PUBLISHED" : "DRAFT",
      tags: (formData.getAll("tag") as string[]).filter((tag) => tag !== ""),
      thumbnail: formData.get("thumbnail")
        ? (formData.get("thumbnail") as File)
        : undefined,
    };

    if (!courseId) {
      return {
        success: false,
        message: "Insufficient Data",
        error: "Course ID is not present",
      };
    }

    console.info("Validating course data:", courseData);

    const validCourseData = Object.fromEntries(
      Object.entries(courseData).filter(
        ([key, value]) => value !== undefined && key !== "tags",
      ),
    );

    console.info(
      "Validated course data without undefined fields or tags:",
      validCourseData,
    );

    await db.transaction(async (tx) => {
      let imageRes;
      if (courseData.thumbnail instanceof File) {
        console.info("Uploading new thumbnail image...");

        const thumbnailRes = await cloudinaryService.uploadImage(
          courseData.thumbnail,
          "LEARNPLUS_COURSE_THUMBNAILS",
        );

        console.info("Checking existing thumbnail for the course...");

        const existingImage = await tx.query.courseTable.findFirst({
          where: eq(imageTable.id, courseId),
          columns: {
            thumbnailUrl: true,
          },
        });

        if (existingImage?.thumbnailUrl) {
          console.info("Existing thumbnail found, deleting from Cloudinary...");

          const imagePublicId = await tx.query.imageTable.findFirst({
            where: eq(imageTable.id, existingImage?.thumbnailUrl),
            columns: {
              public_id: true,
            },
          });

          if (imagePublicId?.public_id) {
            await cloudinaryService.deleteImage(imagePublicId.public_id);
            await tx
              .delete(imageTable)
              .where(eq(imageTable.id, existingImage?.thumbnailUrl));

            console.info("Old thumbnail deleted from Cloudinary.");
          }
        }

        imageRes = await tx
          .insert(imageTable)
          .values({
            id: thumbnailRes.secure_url,
            secure_url: thumbnailRes.secure_url,
            public_id: thumbnailRes.public_id,
            asset_id: thumbnailRes.asset_id,
          })
          .returning({ id: imageTable.id });

        console.info("New thumbnail uploaded and saved.");

        if (!imageRes) {
          console.error("Failed to upload thumbnail");
          tx.rollback();
          throw new Error("Failed to upload thumbnail");
        }

        validCourseData.thumbnailUrl = imageRes[0].id;
      }

      console.info("Processing tags...");

      const newTags = (formData.getAll("tag") as string[]).filter(
        (tag) => tag !== "",
      );

      if (newTags.length > 0) {
        console.info("Checking existing tags for the course...");

        const existingTags = await tx.query.courseTagsTable.findMany({
          where: eq(courseTagsTable.courseId, courseId),
        });

        const existingTagIds = existingTags.map((t) => t.tagId);

        const tagsToInsert = newTags.filter(
          (tag) => !existingTagIds.includes(tag),
        );
        const tagsToDelete = existingTagIds.filter(
          (tagId) => !newTags.includes(tagId),
        );

        console.info("Tags to delete", tagsToDelete);
        console.info("Tags to insert", tagsToInsert);

        if (tagsToInsert.length > 0) {
          console.info("Inserting new tags...");

          const tagsToInsertData = tagsToInsert.map((tagId) => ({
            courseId,
            tagId,
          }));

          await tx.insert(courseTagsTable).values(tagsToInsertData);

          console.info("New tags inserted successfully.");
        }

        if (tagsToDelete.length > 0) {
          await tx
            .delete(courseTagsTable)
            .where(
              and(
                eq(courseTagsTable.courseId, courseId),
                inArray(courseTagsTable.tagId, tagsToDelete),
              ),
            );
          console.info("Old tags deleted successfully.");
        }
      }

      if (Object.keys(validCourseData).length > 0) {
        console.info("Updating course details...", validCourseData);

        const course = await tx
          .update(courseTable)
          .set({ ...validCourseData, updatedAt: new Date() })
          .where(eq(courseTable.id, courseId))
          .returning({ id: courseTable.id });

        console.log(course);
        revalidatePath(`/courses/${course[0].id}`, "page");
        revalidatePath(`/instructor/courses`, "page");

        if (!course) {
          console.error("Failed to update course");
          tx.rollback();
          throw new Error("Failed to update course.");
        }
        console.info("Course updated successfully.");
      } else {
        console.info(
          "No updates made to the course as no valid data was provided.",
        );
      }
    });

    return {
      success: true,
      message: "Course updated successfully!",
    };
  } catch (error: unknown) {
    console.error("Error updating course:", error);
    return {
      success: false,
      message: "Failed to update course.",
      error: getErrorMessage(error),
    };
  }
};
