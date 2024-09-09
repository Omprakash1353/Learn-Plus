import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { getErrorMessage } from "@/helpers/errorHandler";
import { lucia } from "@/lib/lucia";
import { db } from "@/lib/db";
import { emailVerificationTable, lower, userTable } from "@/lib/db/schema";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return Response.json({ error: "Token doesn't exists" }, { status: 400 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      email: string;
      userId: string;
      code: string;
    };

    const emailVerificationQueryResult =
      await db.query.emailVerificationTable.findFirst({
        where:
          eq(emailVerificationTable.userId, decoded.userId) &&
          eq(emailVerificationTable.code, decoded.code),
      });

    console.log(decoded, emailVerificationQueryResult);

    if (!emailVerificationQueryResult) {
      return Response.json(
        { success: false, error: "Invalid token" },
        { status: 400 }
      );
    }

    await db
      .delete(emailVerificationTable)
      .where(eq(emailVerificationTable.userId, decoded.userId));

    await db
      .update(userTable)
      .set({ isEmailVerified: true })
      .where(eq(lower(userTable.email), decoded.email.toLowerCase()));

    const session = await lucia.createSession(decoded.userId, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return Response.redirect(new URL(process.env.NEXT_PUBLIC_BASE_URL!), 302);
  } catch (error: unknown) {
    return Response.json(
      { success: false, error: getErrorMessage(error) },
      { status: 400 }
    );
  }
};
