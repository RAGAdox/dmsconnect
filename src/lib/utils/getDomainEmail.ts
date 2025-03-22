import { EmailAddress } from "@clerk/nextjs/server";
import EMAIL_DOMAINS from "../constants/emailDomains";
import getFeatureFlags from "./getFeatureFlags";

export default async function getDomainEmail(emailAddress: EmailAddress[]) {
  const featureFlag = await getFeatureFlags();
  const domainVerification = featureFlag.check_email_domains;
  const emailList = emailAddress
    .filter((emailItem) => {
      if (!domainVerification) {
        return true;
      }
      const domain = emailItem.emailAddress.split("@").pop();
      if (domain) {
        return (EMAIL_DOMAINS as unknown as string[]).includes(domain);
      }
      return false;
    })
    .map((emailItem) => emailItem.emailAddress);
  if (emailList.length > 0) {
    return emailList[0];
  }
}
