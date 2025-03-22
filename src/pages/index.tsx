import { t } from "@/lib/constants";
import getFeatureFlags from "@/lib/utils/getFeatureFlags";

import { GetStaticProps, InferGetStaticPropsType } from "next";

export const metadata = {
  title: t.index.title,
  description: t.index.description,
};

const index = ({}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return <div className="grid grid-cols-1 md:grid-cols-4"></div>;
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

export default index;
