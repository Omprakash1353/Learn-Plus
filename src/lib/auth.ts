import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, emailOTP } from "better-auth/plugins";

import { db } from "../db";
import * as schema from "../db/schema";
import { env } from "./env";
import { transporter } from "./mail";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  socialProviders: {
    google: {
      clientId: env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: env.GOOGLE_AUTH_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        transporter.sendMail(
          {
            from: env.NODEMAILER_USER_GMAIL_ID,
            to: email,
            subject: "LearnPlus - Verify your email",
            html: `<p>Your OTP is <strong>${otp}</strong></p>`,
          },
          (error, info) => {
            if (error) {
              console.error("Error sending email: ", error);
            } else {
              console.log("Email sent: ", info.response);
            }
          }
        );
      },
    }),
    admin(),
  ],
});
