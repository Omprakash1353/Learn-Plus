"use server";

import { db } from "@/db";
import { user } from "@/db/schema";
import { ApiResponse } from "@/types/api-response";
import { requireUser } from "../data/user/require-user";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function updateRoleToInstructor(): Promise<ApiResponse> {
  const session = await requireUser();
  if (session.role === "instructor") {
    return { status: "success", message: "Role is already instructor." };
  }

  try {
    await db
      .update(user)
      .set({ role: "instructor" })
      .where(eq(user.id, session.id));

    revalidatePath("/dashboard");

    return {
      status: "success",
      message: "Role updated to instructor.",
    };
  } catch (error) {
    console.error("UPDATE ROLE ERROR", error);
    return {
      status: "error",
      message: "Failed to update role",
    };
  }
}
