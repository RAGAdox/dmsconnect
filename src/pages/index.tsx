import FEATURE_FLAGS from "@/lib/config/featureFlags";
import { t } from "@/lib/constants";
import { Card, Heading, Text } from "@radix-ui/themes";

import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

export const metadata = {
  title: t.index.title,
  description: t.index.description,
};

const index = ({
  featureFlags,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {Object.keys(featureFlags)
        .filter((key) => {
          const flag = featureFlags[key as keyof typeof featureFlags];
          return flag.enabled && flag.type === "module";
        })
        .map((key) => {
          const flag = featureFlags[key as keyof typeof featureFlags];
          return (
            <Link key={key} href={flag.featureUrl}>
              <Card className="hover:ring">
                <Heading>{flag.title}</Heading>
                <Text>{flag.description}</Text>
              </Card>
            </Link>
          );
        })}
    </div>
  );
};

export const getStaticProps = (() => {
  return {
    props: { featureFlags: FEATURE_FLAGS },
  };
}) satisfies GetStaticProps<{
  featureFlags: typeof FEATURE_FLAGS;
}>;

export default index;
