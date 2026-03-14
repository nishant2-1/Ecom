import { Redis } from "@upstash/redis";

let redisInstance: Redis | null = null;

function createRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

export function getRedisClient(): Redis | null {
  if (redisInstance !== null) {
    return redisInstance;
  }

  redisInstance = createRedisClient();
  return redisInstance;
}
