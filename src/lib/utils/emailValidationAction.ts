import { clerkClient } from "@clerk/nextjs/server";
import getFeatureFlags from "./getFeatureFlags";
import isAllowedEmailDomain from "./isAllowedEmailDomain";

export default async function emailValidationAction(
  userId: string,
  action: () => Promise<unknown> | unknown
) {
  const featureFlags = await getFeatureFlags();
  if (featureFlags.check_email_domains) {
    const client = await clerkClient();
    const { emailAddresses } = await client.users.getUser(userId);
    const isAllowed = isAllowedEmailDomain(emailAddresses);
    if (!isAllowed) {
      return await action();
    }
  }
}
