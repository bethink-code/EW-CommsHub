import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Using type assertion due to Prisma 7.x TypeScript changes
export const prisma = globalForPrisma.prisma ?? (new (PrismaClient as any)() as PrismaClient);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
