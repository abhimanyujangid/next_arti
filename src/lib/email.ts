import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export function getEmailHtml(contentHtml: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #faf9f6;
      color: #1a1a1a;
      margin: 0;
      padding: 0;
    }
    .wrapper {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e0;
      padding: 40px;
    }
    .header {
      text-align: center;
      border-bottom: 1px solid #d4af37;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .logo {
      font-size: 28px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: #1a1a1a;
      margin: 0;
      font-weight: 300;
    }
    .subtitle {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #707065;
      margin-top: 6px;
    }
    .content {
      font-size: 15px;
      line-height: 1.7;
      color: #2c2c27;
    }
    .btn {
      display: inline-block;
      background-color: #1a1a1a;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 32px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      margin-top: 24px;
      margin-bottom: 24px;
      font-weight: bold;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #e5e5e0;
      padding-top: 24px;
      margin-top: 32px;
      font-size: 11px;
      color: #707065;
      line-height: 1.6;
    }
    .footer-links {
      margin-bottom: 12px;
    }
    .footer-links a {
      color: #707065;
      text-decoration: underline;
      margin: 0 8px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1 class="logo">ArtiSun</h1>
      <div class="subtitle">A Living Museum · Est. India</div>
    </div>
    <div class="content">
      ${contentHtml}
    </div>
    <div class="footer">
      <div class="footer-links">
        <a href="${appUrl}/shop">The Collection</a> · 
        <a href="${appUrl}/about">Our Story</a>
      </div>
      <div>© ${new Date().getFullYear()} ArtiSun Luxury Gallery. All rights reserved.</div>
      <div style="margin-top: 4px;">Museum packaging & insured worldwide shipping.</div>
    </div>
  </div>
</body>
</html>
  `;
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const mailOptions = {
    from: `"ArtiSun Gallery" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  try {
    logger.info({ to, subject }, "Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId, to }, "Email sent successfully");
    return info;
  } catch (error) {
    logger.error({ err: error, to, subject }, "Error sending email via nodemailer");
    throw error;
  }
}
