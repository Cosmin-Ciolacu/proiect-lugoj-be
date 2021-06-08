import * as mailer from "nodemailer";

import { Transporter } from "nodemailer";

export class Mailer {
  private transporter: Transporter;
  constructor() {
    this.transporter = mailer.createTransport({
      host: "mail.privateemail.com",
      port: 465,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });
  }

  public async sendMail(
    email: string,
    subject: string,
    body?: string,
    html?: string
  ) {
    const mailOptions: any = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: subject,
    };
    if (body) {
      mailOptions.text = body;
    }
    if (html) {
      mailOptions.html = html;
    }
    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }
}
