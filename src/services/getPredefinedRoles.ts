import getDrizzleClient from "@/lib/drizzle";
import { predefinedUserRoles } from "@/lib/drizzle/schema/predefinedUserRoles";
import { eq } from "drizzle-orm";

const getPredefinedRoles = async (email: string) => {
  try {
    const drizzle = getDrizzleClient();
    const dataQuery = await drizzle
      .select({
        id: predefinedUserRoles.id,
        email: predefinedUserRoles.email,
        roles: predefinedUserRoles.roles,
      })
      .from(predefinedUserRoles)
      .where(eq(predefinedUserRoles.email, email));
    return dataQuery && dataQuery.length === 1 ? dataQuery[0].roles : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getPredefinedRoles;
