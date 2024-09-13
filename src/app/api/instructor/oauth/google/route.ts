import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import { instructorTable, oauthAccountTable, userTable } from "@/lib/db/schema";
import { lucia } from "@/lib/lucia";
import { google } from "@/lib/lucia/oauth";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  picture: string;
  locale: string;
}

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const codeVerifier = cookies().get("codeVerifier")?.value;
    const savedState = cookies().get("state")?.value;

    if (!codeVerifier || !savedState) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    if (savedState !== state) {
      return Response.json({ error: "State doesn't match" }, { status: 400 });
    }

    console.debug(
      '[GOOGLE.VALIDATEAUTHORIZATIONCODE] code: "%s", codeVerifier: "%s"',
      code,
      codeVerifier,
    );
    const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier);

    console.debug("[ACCESS_TOKEN] accessToken: %s", accessToken);

    const googleRes = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` }, method: "GET" },
    );

    const googleData = (await googleRes.json()) as GoogleUser;
    console.log("googleData", googleData);

    await db.transaction(async (trx) => {
      const userAvail = await trx.query.userTable.findFirst({
        where: eq(userTable.id, googleData.id),
      });

      if (!userAvail) {
        const newUserRes = await trx
          .insert(userTable)
          .values({
            email: googleData.email,
            id: googleData.id,
            name: googleData.name,
            profilePictureUrl: googleData.picture,
            isEmailVerified: googleData.verified_email,
            role: "INSTRUCTOR",
          })
          .returning({ id: userTable.id });

        await trx.insert(instructorTable).values({ id: newUserRes[0].id });

        if (newUserRes.length === 0) {
          trx.rollback();
          return Response.json(
            { error: "Failed to create user" },
            { status: 500 },
          );
        }

        const createOAuthAccountRes = await trx
          .insert(oauthAccountTable)
          .values({
            accessToken,
            expiresAt: accessTokenExpiresAt,
            id: googleData.id,
            provider: "google",
            providerUserId: googleData.id,
            userId: googleData.id,
          });

        if (createOAuthAccountRes.rowCount === 0) {
          trx.rollback();
          return Response.json(
            { error: "Failed to create user" },
            { status: 500 },
          );
        }
      } else {
        const updatedOAuthAccountRes = await trx
          .update(oauthAccountTable)
          .set({ accessToken, expiresAt: accessTokenExpiresAt, refreshToken })
          .where(eq(oauthAccountTable.id, googleData.id));

        if (updatedOAuthAccountRes.rowCount === 0) {
          trx.rollback();
          return Response.json(
            { error: "Failed to update OAuthAccountRes" },
            { status: 500 },
          );
        }
      }
    });

    const session = await lucia.createSession(googleData.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    cookies().set("state", "", { expires: new Date(0) });
    cookies().set("codeVerifier", "", { expires: new Date(0) });

    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
      { status: 302 },
    );
  } catch (error: unknown) {
    return Response.json({ error: error, success: false }, { status: 500 });
  }
};
