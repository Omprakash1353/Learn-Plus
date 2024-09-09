"use server";

import { generateId } from "lucia";
import { z } from "zod";

import { contactUsForm } from "@/app/(routes)/(default)/form";
import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { problemTable } from "@/lib/db/schema";
import Email from "@/lib/email";

export const contactAction = async (values: z.infer<typeof contactUsForm>) => {
  try {
    const problemId = generateId(15);

    await db
      .insert(problemTable)
      .values({ id: problemId, problemQuestion: values.message });

    await Email.sendEmail({
      html: `<div>
        <p>Your problem will be solved shortly</p>
        <p>Thanks for contacting us</p>
      </div>`,
      subject: "Contact Us",
      to: values.email,
    });

    return {
      success: true,
      error: "",
      message: "Message received successfully",
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};
