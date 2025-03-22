import { featureFlagsArray } from "../constants/flags";
import redisKeys from "../constants/redis-keys";
import getRedisClient from "../redis";

export default async function getFeatureFlags() {
  let flags: FeatureFlags | null = null;
  console.log("executing feature flags");
  const redisClient = getRedisClient();
  flags = await redisClient.hgetall(redisKeys.featureFlag);

  if (!flags) {
    flags = {} as FeatureFlags;
    for (const flagKey of featureFlagsArray) {
      flags[flagKey] = false;
    }
    await redisClient.hset(redisKeys.featureFlag, flags);
  }
  return flags;
}
