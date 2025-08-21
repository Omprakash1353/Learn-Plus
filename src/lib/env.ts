import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.url().min(6),
    BETTER_AUTH_URL: z.url().min(6),
    BETTER_AUTH_SECRET: z.string().min(6),
    GOOGLE_AUTH_CLIENT_ID: z.string().min(6),
    GOOGLE_AUTH_CLIENT_SECRET: z.string().min(6),
    NODEMAILER_USER_GMAIL_ID: z.string().min(6),
    NODEMAILER_USER_GMAIL_PASS: z.string().min(6),
    ARCJET_KEY: z.string().min(6),
    S3_BUCKET_NAME: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    GEMINI_API_KEY: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_S3_BUCKET_NAME: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
  },
});
