import { Link as RadixLink, Text } from "@radix-ui/themes";
import { NextPageContext } from "next";
import Link from "next/link";
export default function Error({ error }: { error: string }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <Text as="p" weight="bold" size="6">
        {error ?? "Something went wrong. Please try again later."}
      </Text>

      <RadixLink weight="bold" size="4" className=" underline" asChild>
        <Link href="/">Return to Home</Link>
      </RadixLink>
    </div>
  );
}

Error.getInitialProps = ({ err }: NextPageContext) => {
  return { error: err?.message };
};
