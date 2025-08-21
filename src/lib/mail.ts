import nodemailer from "nodemailer";
import { env } from "./env";

export const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.NODEMAILER_USER_GMAIL_ID,
    pass: env.NODEMAILER_USER_GMAIL_PASS,
  },
});
