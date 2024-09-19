"use server";

import { eq } from "drizzle-orm";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export const getUserProfileAction = async () => {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("User not authorized");
    }

    const userProfileData = await db.query.userTable.findFirst({
      where: eq(userTable.id, user.id),
      columns: {
        isEmailVerified: false,
        hashedPassword: false,
        createdAt: false,
        updatedAt: false,
      },
      with: { instructor: true },
    });

    return {
      success: true,
      data: userProfileData,
      message: "User profile fetched successfully",
      error: "",
    };
  } catch (error: unknown) {
    return {
      success: false,
      data: null,
      message: "",
      error: getErrorMessage(error),
    };
  }
};
