import { PrismaClient } from "../app/generated/prisma";

// Add prisma to the NodeJS global type
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Create one client instance or reuse existing one
export const prisma =
  global.prisma ??
  new PrismaClient({
    log: ["query"], // optional, shows queries in terminal
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;
