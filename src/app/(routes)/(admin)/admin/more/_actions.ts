"use server";

import { eq } from "drizzle-orm";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { tagTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";
import { Tag } from "./_components/tag-manage";

type DbOperationResult<T> = {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
};

const checkAuthorization = async () => {
  const { user } = await validateRequest();
  if (!user || user.role !== "ADMIN") {
    throw new Error("User not authorized");
  }
};

const handleDbOperation = async <T>(
  operation: () => Promise<T>,
  successMessage: string,
): Promise<DbOperationResult<T>> => {
  try {
    await checkAuthorization();
    const data = await operation();
    return {
      success: true,
      data,
      message: successMessage,
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

export const addTag = async (
  tag: Tag,
): Promise<DbOperationResult<{ id: string; name: string }>> => {
  return handleDbOperation(
    () =>
      db
        .insert(tagTable)
        .values(tag)
        .returning({ id: tagTable.id, name: tagTable.name })
        .then((result) => result[0]),
    "Tag added successfully",
  );
};

export const deleteTag = async (
  id: string,
): Promise<DbOperationResult<{ id: string }>> => {
  return handleDbOperation(
    () =>
      db
        .delete(tagTable)
        .where(eq(tagTable.id, id))
        .returning({ id: tagTable.id })
        .then((result) => result[0]),
    "Tag deleted successfully",
  );
};

export const updateTag = async (
  tag: Tag,
): Promise<DbOperationResult<{ id: string; name: string }>> => {
  return handleDbOperation(
    () =>
      db
        .update(tagTable)
        .set({ name: tag.name })
        .where(eq(tagTable.id, tag.id))
        .returning({ id: tagTable.id, name: tagTable.name })
        .then((result) => result[0]),
    "Tag updated successfully",
  );
};

export const fetchTags = async (): Promise<DbOperationResult<Tag[]>> => {
  return handleDbOperation(
    () => db.select().from(tagTable).orderBy(tagTable.name),
    "Tags fetched successfully",
  );
};
