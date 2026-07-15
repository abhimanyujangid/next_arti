import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma";

const connectionString = process.env.DATABASE_URL;

/** Bump when Prisma schema models/fields change so Next loads a fresh client. */
const PRISMA_GLOBAL_KEY = "__artisun_prisma_v8_contact__";

const globalForPrisma = globalThis as unknown as {
  [PRISMA_GLOBAL_KEY]?: PrismaClient;
};

const createPrismaClient = () => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

export const db =
  globalForPrisma[PRISMA_GLOBAL_KEY] ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma[PRISMA_GLOBAL_KEY] = db;
}
