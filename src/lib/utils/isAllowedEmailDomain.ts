import { EmailAddress } from "@clerk/nextjs/server";
import EMAIL_DOMAINS from "../constants/emailDomains";

export default function isAllowedEmailDomain(emailAddresses: EmailAddress[]) {
  return emailAddresses.some((emailItem) => {
    const domain = emailItem.emailAddress.split("@").pop() || "";
    return (EMAIL_DOMAINS as unknown as string[]).includes(domain);
  });
}
