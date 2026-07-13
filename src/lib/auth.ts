import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  // Add more providers/plugins here as needed
  // e.g. socialProviders: { github: { clientId: ..., clientSecret: ... } }
});

export type Session = typeof auth.$Infer.Session;
