import { Redis } from "@upstash/redis";

let redis: Redis | undefined = undefined;
export default function getRedisClient() {
  if (redis) {
    return redis;
  }
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
  });
  return redis;
}
