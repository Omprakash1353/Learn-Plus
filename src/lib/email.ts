import { createTransport } from "nodemailer";

type sendEmailProps = {
  to: string;
  subject: string;
  html: string;
};

class Email {
  private transporter: ReturnType<typeof createTransport>;

  constructor() {
    this.transporter = createTransport({
      host: "smtp.gmail.net",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, html }: sendEmailProps) {
    await this.transporter.sendMail({
      from: `${process.env.GMAIL_USER}`,
      to,
      subject,
      html,
    });
  }
}

const email = new Email();

export default email;
