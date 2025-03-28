import getDrizzleClient from "@/lib/drizzle";
import { Onboarding } from "@/lib/drizzle/schema/onboarding";
import getPredefinedRoles from "@/services/getPredefinedRoles";
import isAllowedEmailDomain from "@/services/isAllowedEmailDomain";

import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { course, registrationNumber, endYear, startYear } =
    req.body as OnboardingArgs;

  if (!course || !registrationNumber) {
    return res.status(400).json({ message: "Invalid Request" });
  }

  const authObject = getAuth(req);
  const sessionClaims: CustomJwtSessionClaims | null = authObject.userId
    ? authObject.sessionClaims
    : null;

  if (!sessionClaims) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const client = await clerkClient();

  if (!isAllowedEmailDomain(sessionClaims.email)) {
    return res.status(403).json({ message: "Access Denied" });
  }

  const drizzle = getDrizzleClient();
  try {
    const predefinedRoles = await getPredefinedRoles(sessionClaims.email);
    await drizzle.insert(Onboarding).values({
      course,
      reg_number: registrationNumber,
      user_id: sessionClaims.id,
      emailAddress: sessionClaims.email,
      endYear,
      startYear,
    });
    const newPublicMetadata: SessionPublicMetadata = {
      onboardingComplete: true,
      roles: predefinedRoles ? predefinedRoles : ["user"],
    };
    const { publicMetadata } = await client.users.updateUser(sessionClaims.id, {
      publicMetadata: newPublicMetadata as unknown as UserPublicMetadata,
    });
    if (publicMetadata) {
      return res.status(200).json({ publicMetadata });
    }
    return res.status(500).json({ messege: "Unable to update clerk user" });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({ message: "Unable to onboard" });
  }
}
