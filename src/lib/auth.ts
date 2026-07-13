import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { sendEmail, getEmailHtml } from "@/lib/email";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000"],
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const emailHtml = getEmailHtml(`
        <h2 style="font-family: Georgia, serif; font-weight: normal; margin-bottom: 20px; color: #1a1a1a;">Verify Your Account</h2>
        <p>Dear ${user.name || "Collector"},</p>
        <p>Thank you for joining the House of ArtiSun. To complete your registration and activate your account, please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" class="btn" style="color: #ffffff;">Verify Email Address</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; font-size: 12px; color: #707065; background-color: #f5f5f0; padding: 10px; border: 1px solid #e5e5e0;">${url}</p>
        <p>This verification link will expire in 24 hours.</p>
        <p>Warm regards,<br>The ArtiSun Curatorial Team</p>
      `);

      await sendEmail({
        to: user.email,
        subject: "Activate Your Account — ArtiSun",
        html: emailHtml,
      });
    },
  },
});

export type Session = typeof auth.$Infer.Session;
