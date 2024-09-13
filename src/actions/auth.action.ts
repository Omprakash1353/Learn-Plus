"use server";

import { generateCodeVerifier, generateState } from "arctic";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { z } from "zod";

import { signInSchema } from "@/app/[...auth]/_components/sign-in-form";
import { signUpSchema } from "@/app/[...auth]/_components/sign-up-form";
import { getErrorMessage } from "@/helpers/errorHandler";
import { db } from "@/lib/db";
import {
  emailVerificationTable,
  instructorTable,
  lower,
  userTable,
} from "@/lib/db/schema";
import Email from "@/service/email";
import { lucia, validateRequest } from "@/lib/lucia";
import {
  github as githubOAuthInstructor,
  google as googleOAuthInstructor,
} from "@/lib/lucia/instructor/oauth";
import {
  github as githubOAuthUser,
  google as googleOAuthUser,
} from "@/lib/lucia/oauth";

export const signUp = async (values: z.infer<typeof signUpSchema>) => {
  try {
    const userExists = await db.query.userTable.findFirst({
      where: eq(lower(userTable.email), values.email.toLowerCase()),
    });

    if (userExists) {
      throw new Error("User with email already exists");
    }

    const userId = generateId(15);
    const hashedPassword = await hash(values.password, 10);

    await db.transaction(async (tx) => {
      const res = await tx
        .insert(userTable)
        .values({
          id: userId,
          name: values.name,
          email: values.email.toLowerCase(),
          hashedPassword,
          role: values.role,
        })
        .returning({
          id: userTable.id,
          name: userTable.name,
          email: userTable.email,
          role: userTable.role,
        });

      if (res[0].role === "INSTRUCTOR") {
        await tx.insert(instructorTable).values({ id: res[0].id });
      }

      console.log(res);
    });

    const code = Math.random().toString(36).substring(2, 8);

    const emailVerificationId = generateId(15);
    await db
      .insert(emailVerificationTable)
      .values({ id: emailVerificationId, code, userId, sentAt: new Date() });

    const token = jwt.sign(
      { email: values.email, userId, code },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" },
    );

    console.log("[TOKEN]", token);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;
    await Email.sendEmail({
      html: `<a href="${url}">Verify your email</a>`,
      subject: "Verify your email",
      to: values.email.toLowerCase(),
    });
    console.log("[URL]", url);

    return {
      success: true,
      data: { userId },
      message: "Email sent successfully !!!",
    };
  } catch (error: unknown) {
    console.error(error);
    return { success: false, error: getErrorMessage(error) };
  }
};

export const signIn = async (values: z.infer<typeof signInSchema>) => {
  try {
    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(lower(table.email), values.email.toLowerCase()),
    });

    if (!existingUser) {
      return { error: "User not found" };
    }

    if (!existingUser.hashedPassword) {
      return { error: "User not found" };
    }

    const isValidPassword = await compare(
      values.password,
      existingUser.hashedPassword,
    );

    if (!isValidPassword) {
      return { error: "Invalid email or password" };
    }

    if (existingUser.isEmailVerified === false) {
      return { error: "Email is not verified", key: "email_not_verified" };
    }

    const session = await lucia.createSession(existingUser.id, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return {
      success: true,
      message: "Logged in successfully !!!",
    };
  } catch (error: unknown) {
    return { success: false, message: getErrorMessage(error) };
  }
};

export const signOut = async () => {
  try {
    const { session } = await validateRequest();

    if (!session) {
      return { success: false, message: "Unauthorized" };
    }

    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );

    return { success: true, error: "", message: "Logged out successfully !!!" };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error), message: "" };
  }
};

export const resendVerificationEmail = async (email: string) => {
  try {
    const existingUser = await db.query.userTable.findFirst({
      where: (table) => eq(lower(table.email), email.toLowerCase()),
    });

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    if (existingUser.isEmailVerified === true) {
      return { success: false, error: "Email already verified" };
    }

    const existedCode = await db.query.emailVerificationTable.findFirst({
      where: eq(emailVerificationTable.userId, existingUser.id),
    });

    if (!existedCode) {
      return { success: false, error: "Code not found" };
    }

    const sentAt = new Date(existedCode.sentAt);
    const isOneMinuteHasPassed =
      new Date().getTime() - sentAt.getTime() > 60000;

    if (!isOneMinuteHasPassed) {
      return {
        success: false,
        error: `Email already sent next email in ${
          60 - Math.floor((new Date().getTime() - sentAt.getTime()) / 1000)
        } seconds`,
      };
    }

    const code = Math.random().toString(36).substring(2, 8);

    await db
      .update(emailVerificationTable)
      .set({ code, sentAt: new Date() })
      .where(eq(emailVerificationTable.userId, existingUser.id));

    const token = jwt.sign(
      { email, userId: existingUser.id, code },
      process.env.JWT_SECRET!,
      { expiresIn: "5m" },
    );

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;
    await Email.sendEmail({
      html: `<a href="${url}">Verify your email</a>`,
      subject: "Verify your email",
      to: email,
    });
    console.log(url);

    return {
      success: true,
      data: { userId: existingUser.id },
      message:
        "We've have sent a verification email to your inbox. Pleaase verify your email to continue",
    };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const createGoogleAuthorizationURL = async (
  role: "INSTRUCTOR" | "STUDENT",
) => {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set("codeVerifier", codeVerifier, {
      httpOnly: true,
    });

    cookies().set("state", state, {
      httpOnly: true,
    });

    let authorizationURL: any;

    if (role === "INSTRUCTOR") {
      authorizationURL = await googleOAuthInstructor.createAuthorizationURL(
        state,
        codeVerifier,
        {
          scopes: ["email", "profile"],
        },
      );
      console.log(authorizationURL);
    } else {
      authorizationURL = await googleOAuthUser.createAuthorizationURL(
        state,
        codeVerifier,
        {
          scopes: ["email", "profile"],
        },
      );
    }

    console.debug("authorizationURL", authorizationURL);

    return { success: true, data: authorizationURL };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};

export const createGithubAuthorizationURL = async (
  role: "INSTRUCTOR" | "STUDENT",
) => {
  try {
    const state = generateState();

    cookies().set("state", state, {
      httpOnly: true,
    });

    let authorizationURL: any;

    if (role === "INSTRUCTOR") {
      authorizationURL = await githubOAuthInstructor.createAuthorizationURL(
        state,
        {
          scopes: ["user:email"],
        },
      );
    } else {
      authorizationURL = await githubOAuthUser.createAuthorizationURL(state, {
        scopes: ["user:email"],
      });
    }
    return { success: true, data: authorizationURL };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
};
