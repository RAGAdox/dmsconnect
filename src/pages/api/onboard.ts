import getDrizzleClient from "@/lib/drizzle";
import { Onboarding } from "@/lib/drizzle/schema/onboarding";
import emailValidationAction from "@/lib/utils/emailValidationAction";
import getDomainEmail from "@/lib/utils/getDomainEmail";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { course, registrationNumber } = req.body as OnboardingArgs;

  if (!course || !registrationNumber) {
    return res.status(400).json({ message: "Invalid Request" });
  }
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const client = await clerkClient();

  /* Fix this */
  const result = await emailValidationAction(userId, () => {
    return res.status(400).json({ message: "Email Domain Not Allowed" });
  });
  if (result) {
    return result;
  }

  /* Get Email */
  const { emailAddresses } = await client.users.getUser(userId);
  const email = await getDomainEmail(emailAddresses);
  if (!email) {
    return res.status(400).json({ message: "Email Not Found" });
  }
  const drizzle = getDrizzleClient();
  try {
    await drizzle.insert(Onboarding).values({
      course,
      reg_number: registrationNumber,
      user_id: userId,
      emailAddress: email,
    });
    const { publicMetadata } = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
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
