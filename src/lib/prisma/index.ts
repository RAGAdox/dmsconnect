import { PrismaClient } from "@prisma/client";
let prisma: PrismaClient | undefined;

export default function getPrisma() {
  if (prisma) {
    return prisma;
  }
  prisma = new PrismaClient();
  return prisma;
}
