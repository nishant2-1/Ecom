import { getRedisClient } from "@/lib/redis";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
};

export async function enforceRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  const redis = getRedisClient();

  // Fallback: allow traffic when Redis is not configured yet.
  if (!redis) {
    return {
      allowed: true,
      remaining: limit,
      resetSeconds: windowSeconds
    };
  }

  const nowWindow = Math.floor(Date.now() / (windowSeconds * 1000));
  const redisKey = `ratelimit:${key}:${nowWindow}`;

  const current = await redis.incr(redisKey);
  if (current === 1) {
    await redis.expire(redisKey, windowSeconds);
  }

  const remaining = Math.max(0, limit - current);
  return {
    allowed: current <= limit,
    remaining,
    resetSeconds: windowSeconds
  };
}
