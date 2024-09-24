"use server";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { validateRequest } from "@/lib/lucia";

export const getProblems = async () => {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "ADMIN") throw new Error("User unauthorized");

    const problemData = await db.query.problemTable.findMany({});

    if (!problemData) throw new Error("Problems not found");

    return {
      success: true,
      message: "Problems fetched successfully !!!",
      data: problemData,
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
};
