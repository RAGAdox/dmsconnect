import FEATURE_FLAGS from "@/lib/config/featureFlags";
import { Link as RadixLink, Text } from "@radix-ui/themes";
import { GetServerSideProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
interface Props {
  feature: keyof typeof FEATURE_FLAGS;
  reason?: string;
}

const FeatureUnavailable = ({
  feature,
  reason,
}: InferGetStaticPropsType<typeof getServerSideProps>) => {
  return (
    <div className="flex flex-col justify-center items-center">
      {!reason ? (
        <Text as="p" weight="bold" size="6">
          {feature
            .replace("_", " ")
            .replace(/\b\w/g, (char) => char.toUpperCase())}{" "}
          feature is disabled
        </Text>
      ) : (
        <>
          <Text as="p" weight="bold" size="6">
            Unable to access{" "}
            {feature
              .replace("_", " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </Text>
          <Text as="p">Reason: {reason}</Text>
        </>
      )}

      <RadixLink weight="bold" size="4" className=" underline" asChild>
        <Link href="/">Return to Home</Link>
      </RadixLink>
    </div>
  );
};
export const getServerSideProps = (async (context) => {
  const { query } = context;
  const feature =
    typeof query.feature === "string" &&
    Object.keys(FEATURE_FLAGS).includes(query.feature)
      ? query.feature
      : undefined;
  if (!feature) {
    throw new Error("Something feels off");
  }
  const queryReason = query.reason;
  const reason = Array.isArray(queryReason) ? queryReason[0] : queryReason;
  return {
    props: { feature: feature as keyof typeof FEATURE_FLAGS, reason },
  };
}) satisfies GetServerSideProps<Props>;

export default FeatureUnavailable;
