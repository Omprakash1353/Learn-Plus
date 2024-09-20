"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { profileFormSchema } from "@/app/(routes)/(main)/u/_components/profile-form";
import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { instructorTable, userTable } from "@/lib/db/schema";
import { validateRequest } from "@/lib/lucia";

export async function deleteUserAction({ id }: { id: string }) {
  try {
    const { user } = await validateRequest();
    if (!user || user.role !== "ADMIN") {
      return { success: false, message: "", error: "User is not authorized" };
    }

    await db.transaction(async (tx) => {
      const resUser = await db
        .delete(userTable)
        .where(eq(userTable.id, id))
        .returning({ deletedId: userTable.id, deletedRole: userTable.role });

      const resInstructor = await Promise.all(
        resUser.map((instructor) =>
          db
            .delete(instructorTable)
            .where(eq(instructorTable.id, instructor.deletedRole))
            .returning({ deletedId: instructorTable.id }),
        ),
      );

      if (resUser.length !== resInstructor.length) {
        tx.rollback();
        return {
          success: false,
          error: "Internal Server Error",
          message: "Failed to delete user",
        };
      }
    });
    revalidatePath("/admin/users");

    return { success: true, message: "User deleted successfully", error: "" };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Internal Server Error",
      error: getErrorMessage(error),
    };
  }
}

export async function updateUserProfile(
  values: z.infer<typeof profileFormSchema>,
) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return { success: false, message: "", error: "User is not authorized" };
    }

    const res = await db
      .update(userTable)
      .set({
        name: values.name,
        email: values.email,
        bio: values.bio,
        linkedin: values.linkedin,
        qualification: values.qualification,
        expertize: values.expertize,
      })
      .where(eq(userTable.id, user.id))
      .returning({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
      });

    if (res[0].role === "INSTRUCTOR") {
      await db
        .update(instructorTable)
        .set({ experience: Number(values.experience) })
        .where(eq(instructorTable.id, res[0].id));
    }

    revalidatePath("/u");

    return {
      success: true,
      message: "Profile updated successfully",
      error: "",
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: "Internal Server Error",
      error: getErrorMessage(error),
    };
  }
}
