import { EmailAddress } from "@clerk/nextjs/server";

import FEATURE_FLAGS from "@/config/featureFlags";
import EMAIL_DOMAINS from "@/constants/emailDomains";

export default function isAllowedEmailDomain(
  emailAddresses: EmailAddress[] | string 
) {
  if (FEATURE_FLAGS.check_email_domains.enabled) {
    if (Array.isArray(emailAddresses)) {
      return emailAddresses.some((emailItem) => {
        const domain = emailItem.emailAddress.split("@").pop() || "";
        return EMAIL_DOMAINS.includes(domain);
      });
    } else {
      const domain = emailAddresses.split("@").pop() || "";
      return EMAIL_DOMAINS.includes(domain);
    }
  }
  return true;
}
