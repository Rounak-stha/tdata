import { Redis } from "@upstash/redis";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL!;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN!;

if (!REDIS_URL || !REDIS_TOKEN) {
  throw new Error("Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN");
}

export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

/**
 * Fetches cached data from Redis
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get<string>(key);
  return cached ? JSON.parse(cached) : null;
}

/**
 * Stores data in Redis with an expiration time
 */
export async function setCache(key: string, data: unknown, ttlSeconds = 3600) {
  await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
}

/**
 * Deletes cache entry from Redis
 */
export async function deleteCache(key: string) {
  await redis.del(key);
}
