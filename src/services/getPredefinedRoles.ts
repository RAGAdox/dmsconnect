import getPrisma from "@/lib/prisma";

const getPredefinedRoles = async (email: string) => {
  try {
    const prisma = getPrisma();
    const data = await prisma.predefined_user_roles.findFirst({
      where: { email },
    });
    return data ? data.roles : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getPredefinedRoles;
