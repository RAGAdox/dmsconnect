import { Redis } from "@upstash/redis";
import "server-only";

let redis: Redis | undefined = undefined;
export default function getRedisClient() {
  if (redis) {
    return redis;
  }
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL!.trim(),
    token: process.env.UPSTASH_REDIS_TOKEN!.trim(),
  });
  return redis;
}
