/**
 * In-memory sliding-window rate limiter for VernacTriage API routes.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Checks whether an IP or client identifier has exceeded the request threshold.
 * 
 * @param identifier Client IP address or unique request identifier
 * @param limit Maximum allowed requests within the time window (default: 10)
 * @param windowMs Window duration in milliseconds (default: 60,000ms = 1 minute)
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60_000
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const windowStart = now - windowMs;

  const record = rateLimitMap.get(identifier) || { timestamps: [] };
  const activeTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (activeTimestamps.length >= limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetMs = Math.max(0, oldestTimestamp + windowMs - now);
    rateLimitMap.set(identifier, { timestamps: activeTimestamps });
    return { allowed: false, remaining: 0, resetMs };
  }

  activeTimestamps.push(now);
  rateLimitMap.set(identifier, { timestamps: activeTimestamps });

  // Keep memory footprint bounded
  if (rateLimitMap.size > 5_000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.timestamps.every((ts) => ts <= windowStart)) {
        rateLimitMap.delete(key);
      }
    }
  }

  return {
    allowed: true,
    remaining: limit - activeTimestamps.length,
    resetMs: windowMs,
  };
}
