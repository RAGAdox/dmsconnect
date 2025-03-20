import getDrizzleClient from "../drizzle";
import { featureFlags } from "../drizzle/schema/featureFlags";
import getRedisClient from "../redis";

export type FeatureFlags = Record<string, boolean>;

export default async function getFeatureFlags(): Promise<FeatureFlags> {
  const redisClient = getRedisClient();
  const flags: FeatureFlags =
    (await redisClient.hgetall("feature_flags")) || {};

  // Object.keys(flags).length === 0 checks if the flags object is empty
  if (Object.keys(flags).length === 0) {
    const db = getDrizzleClient();
    const dbFeatureflags = await db.select().from(featureFlags);

    for (const flag of dbFeatureflags) {
      // Set each flag as a key-value pair in Redis
      await redisClient.hset("feature_flags", { [flag.flag]: flag.enabled });
      flags[flag.flag] = flag.enabled;
    }
  }

  return flags;
}
