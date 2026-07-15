import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

/** Bump when Order/Address schema fields change so dev global cache is discarded. */
const PRISMA_GLOBAL_KEY = "__artisun_prisma_v4__";

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
