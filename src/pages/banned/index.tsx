import EMAIL_DOMAINS from "@/lib/constants/emailDomains";
import { useClerk } from "@clerk/nextjs";

import { Heading, Link as RadixLink, Text } from "@radix-ui/themes";
import { GetStaticProps, InferGetStaticPropsType } from "next";
const BannedOnboarding = ({
  emailDomains,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
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
        Allowed domains: <RadixLink>{emailDomains.join(", ")}</RadixLink>
      </Text>

      <RadixLink
        weight="bold"
        size="4"
        className="hover:underline! cursor-pointer!"
        onClick={handleRedirect}
      >
        Sign up with a allowed domain
      </RadixLink>
    </div>
  );
};

export const getStaticProps = (async () => {
  return {
    props: { emailDomains: EMAIL_DOMAINS },
  };
}) satisfies GetStaticProps<{
  emailDomains: typeof EMAIL_DOMAINS;
}>;

export default BannedOnboarding;
