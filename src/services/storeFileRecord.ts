import getPrisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function storeFileRecord(
  args: Prisma.file_recordCreateInput
) {
  try {
    const prisma = getPrisma();
    const result = await prisma.file_record.create({
      data: { ...args },
    });
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
