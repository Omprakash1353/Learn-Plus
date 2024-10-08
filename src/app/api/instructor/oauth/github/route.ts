import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import {
  imageTable,
  instructorTable,
  oauthAccountTable,
  userTable,
} from "@/lib/db/schema";
import { lucia } from "@/lib/lucia";
import { github } from "@/lib/lucia/oauth";

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    const savedState = cookies().get("state")?.value;

    if (!savedState) {
      return Response.json({ error: "Invalid request" }, { status: 400 });
    }

    if (savedState !== state) {
      return Response.json({ error: "State doesn't match" }, { status: 400 });
    }

    const { accessToken } = await github.validateAuthorizationCode(code);

    const githubRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
      method: "GET",
    });

    const githubData = (await githubRes.json()) as any;

    console.log(githubData);

    await db.transaction(async (trx) => {
      const userAvail = await trx.query.userTable.findFirst({
        where: eq(userTable.id, githubData.id),
      });

      if (!userAvail) {
        const imageRes = await trx
          .insert(imageTable)
          .values({
            secure_url: githubData.avatar_url,
            id: githubData.avatar_url,
          })
          .returning({ id: imageTable.id });

        const newUserRes = await trx
          .insert(userTable)
          .values({
            id: githubData.id,
            name: githubData.name || githubData.login,
            profilePictureUrl: imageRes[0].id,
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
            id: githubData.id,
            provider: "github",
            providerUserId: githubData.id,
            userId: githubData.id,
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
          .set({ accessToken })
          .where(eq(oauthAccountTable.id, githubData.id));

        if (updatedOAuthAccountRes.rowCount === 0) {
          trx.rollback();
          return Response.json(
            { error: "Failed to update OAuthAccountRes" },
            { status: 500 },
          );
        }
      }
    });

    const session = await lucia.createSession(githubData.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    cookies().set("state", "", { expires: new Date(0) });

    return NextResponse.redirect(
      new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
      { status: 302 },
    );
  } catch (error: unknown) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 });
  }
};
