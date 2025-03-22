import EMAIL_DOMAINS from "@/lib/constants/emailDomains";
import getFeatureFlags from "@/lib/utils/getFeatureFlags";

import { useClerk } from "@clerk/nextjs";
import { Heading, Link as RadixLink, Text } from "@radix-ui/themes";
import { GetStaticProps } from "next";
const BannedOnboarding = () => {
  const { signOut } = useClerk();

  const handleRedirect = async () => {
    await signOut({ redirectUrl: "/?promptLogin=true" });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <Heading as="h3" weight="bold" size="6" align="center">
        Your email does not follow our security standards
      </Heading>
      <Text>
        Allowed domains:{" "}
        {EMAIL_DOMAINS.map((emailDomain) => (
          <RadixLink key={emailDomain}>{emailDomain}</RadixLink>
        )).join(", ")}
      </Text>

      <RadixLink
        weight="bold"
        size="4"
        className=" underline"
        onClick={handleRedirect}
      >
        Sign up with a allowed domain
      </RadixLink>
    </div>
  );
};

export const getStaticProps = (async () => {
  const featureFlags = await getFeatureFlags();

  return {
    revalidate: 60,
    props: { featureFlags },
  };
}) satisfies GetStaticProps<{
  featureFlags: FeatureFlags;
}>;

export default BannedOnboarding;
