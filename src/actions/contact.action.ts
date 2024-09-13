"use server";

import { generateId } from "lucia";
import { z } from "zod";

import { contactUsForm } from "@/app/(routes)/(default)/form";
import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { problemTable } from "@/lib/db/schema";
import Email from "@/service/email";

export const contactAction = async (values: z.infer<typeof contactUsForm>) => {
  try {
    const problemId = generateId(15);

    await db.transaction(async (trx) => {
      await trx.insert(problemTable).values({
        id: problemId,
        problemQuestion: values.message,
        email: values.email,
      });

      const mailRes = await Email.sendEmail({
        html: `<div>
                <p>Your problem will be solved shortly</p>
                <p>Thanks for contacting us</p>
              </div>`,
        subject: "Contact Us",
        to: values.email,
      });

      if (mailRes.accepted.length === 0) {
        trx.rollback();
      }

      console.log(
        "[MAIL_RESPONSE]",
        mailRes.accepted,
        mailRes.rejected,
        mailRes.envelopeTime,
        mailRes.messageId,
        mailRes.response,
      );
    });

    return {
      success: true,
      error: "",
      message: "Message sent successfully",
    };
  } catch (error: unknown) {
    console.debug(error);
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};
