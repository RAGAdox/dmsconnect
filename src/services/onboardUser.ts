import getPrisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const prisma = getPrisma();
export default async function onboardUser(args: Prisma.onboardingCreateInput) {
  try {
    const result = await prisma.onboarding.create({
      data: { ...args },
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
