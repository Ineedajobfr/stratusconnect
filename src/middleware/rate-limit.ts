// Rate Limiting and Anti-Scraping Middleware
// FCA Compliant Aviation Platform

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  requireTurnstile: boolean;
  progressiveBackoff: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  requireTurnstile: boolean;
  reason?: string;
}

// Rate limit configurations for different endpoints
const RATE_LIMITS: Record<string, RateLimitConfig> = {
  'GET:/marketplace': {
    windowMs: 60000, // 1 minute
    maxRequests: 30,
    requireTurnstile: true,
    progressiveBackoff: true
  },
  'GET:/operators': {
    windowMs: 60000, // 1 minute
    maxRequests: 20,
    requireTurnstile: true,
    progressiveBackoff: true
  },
  'GET:/quotes': {
    windowMs: 300000, // 5 minutes
    maxRequests: 50,
    requireTurnstile: false,
    progressiveBackoff: false
  },
  'POST:/quotes': {
    windowMs: 300000, // 5 minutes
    maxRequests: 10,
    requireTurnstile: true,
    progressiveBackoff: true
  },
  'POST:/messages': {
    windowMs: 60000, // 1 minute
    maxRequests: 20,
    requireTurnstile: false,
    progressiveBackoff: false
  },
  'GET:/profile': {
    windowMs: 60000, // 1 minute
    maxRequests: 100,
    requireTurnstile: false,
    progressiveBackoff: false
  }
};

// In-memory rate limit store (would use Redis in production)
const rateLimitStore = new Map<string, {
  count: number;
  resetTime: number;
  backoffLevel: number;
}>();

/**
 * Check rate limit for a request
 */
export function checkRateLimit(
  ip: string,
  userId: string | null,
  endpoint: string,
  userAgent?: string
): RateLimitResult {
  const config = RATE_LIMITS[endpoint];
  if (!config) {
    return {
      allowed: true,
      remaining: 0,
      resetTime: Date.now(),
      requireTurnstile: false
    };
  }

  const key = userId ? `user:${userId}` : `ip:${ip}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Get current rate limit data
  let rateData = rateLimitStore.get(key);
  
  if (!rateData || rateData.resetTime <= now) {
    // Reset or initialize
    rateData = {
      count: 0,
      resetTime: now + config.windowMs,
      backoffLevel: 0
    };
  }

  // Check if request is allowed
  const effectiveMaxRequests = config.progressiveBackoff 
    ? Math.max(1, Math.floor(config.maxRequests / Math.pow(2, rateData.backoffLevel)))
    : config.maxRequests;

  if (rateData.count >= effectiveMaxRequests) {
    // Rate limit exceeded
    if (config.progressiveBackoff) {
      rateData.backoffLevel = Math.min(rateData.backoffLevel + 1, 5); // Max 5 levels
    }

    rateLimitStore.set(key, rateData);

    return {
      allowed: false,
      remaining: 0,
      resetTime: rateData.resetTime,
      requireTurnstile: config.requireTurnstile,
      reason: `Rate limit exceeded. Max ${effectiveMaxRequests} requests per ${config.windowMs / 1000} seconds.`
    };
  }

  // Increment counter
  rateData.count++;
  rateLimitStore.set(key, rateData);

  // Reset backoff level on successful request
  if (config.progressiveBackoff && rateData.backoffLevel > 0) {
    rateData.backoffLevel = Math.max(0, rateData.backoffLevel - 1);
    rateLimitStore.set(key, rateData);
  }

  return {
    allowed: true,
    remaining: effectiveMaxRequests - rateData.count,
    resetTime: rateData.resetTime,
    requireTurnstile: config.requireTurnstile
  };
}

/**
 * Check if user agent is suspicious (bot/scraper detection)
 */
export function isSuspiciousUserAgent(userAgent: string): boolean {
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /node/i,
    /postman/i,
    /insomnia/i
  ];

  return suspiciousPatterns.some(pattern => pattern.test(userAgent));
}

/**
 * Check if IP is from a suspicious range (VPN/Proxy detection)
 */
export function isSuspiciousIP(ip: string): boolean {
  // This would integrate with IP reputation services
  // For now, check for common VPN/proxy patterns
  const suspiciousRanges = [
    /^10\./, // Private range
    /^192\.168\./, // Private range
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./ // Private range
  ];

  // In production, you'd check against known VPN/proxy IP ranges
  return suspiciousRanges.some(range => range.test(ip));
}

/**
 * Generate Turnstile challenge if required
 */
export function shouldRequireTurnstile(
  rateLimitResult: RateLimitResult,
  userAgent: string,
  ip: string,
  isAuthenticated: boolean
): boolean {
  // Always require Turnstile for unauthenticated users on sensitive endpoints
  if (!isAuthenticated && rateLimitResult.requireTurnstile) {
    return true;
  }

  // Require Turnstile for suspicious user agents
  if (isSuspiciousUserAgent(userAgent)) {
    return true;
  }

  // Require Turnstile for suspicious IPs
  if (isSuspiciousIP(ip)) {
    return true;
  }

  // Require Turnstile if rate limit was exceeded
  if (!rateLimitResult.allowed) {
    return true;
  }

  return false;
}

/**
 * Log rate limit violations for analysis
 */
export async function logRateLimitViolation(
  ip: string,
  userId: string | null,
  endpoint: string,
  userAgent: string,
  result: RateLimitResult
): Promise<void> {
  try {
    console.log('Rate limit violation logged:', {
      ip,
      userId,
      endpoint,
      userAgent,
      allowed: result.allowed,
      remaining: result.remaining,
      resetTime: result.resetTime,
      requireTurnstile: result.requireTurnstile,
      reason: result.reason,
      timestamp: new Date().toISOString()
    });

    // In production, this would log to your audit system
    // await supabase.from('audit_logs').insert({ ... });
  } catch (error) {
    console.error('Failed to log rate limit violation:', error);
  }
}

/**
 * Rate limiting middleware factory
 */
export function createRateLimitMiddleware() {
  return {
    checkRateLimit: (
      ip: string,
      userId: string | null,
      endpoint: string,
      userAgent?: string
    ) => checkRateLimit(ip, userId, endpoint, userAgent),

    shouldRequireTurnstile: (
      rateLimitResult: RateLimitResult,
      userAgent: string,
      ip: string,
      isAuthenticated: boolean
    ) => shouldRequireTurnstile(rateLimitResult, userAgent, ip, isAuthenticated),

    logViolation: (
      ip: string,
      userId: string | null,
      endpoint: string,
      userAgent: string,
      result: RateLimitResult
    ) => logRateLimitViolation(ip, userId, endpoint, userAgent, result),

    isSuspiciousUserAgent,
    isSuspiciousIP
  };
}

/**
 * Turnstile integration helper
 */
export function generateTurnstileChallenge(): string {
  // This would integrate with Cloudflare Turnstile
  return 'turnstile_challenge_placeholder';
}

/**
 * Validate Turnstile response
 */
export function validateTurnstileResponse(token: string, ip: string): Promise<boolean> {
  // This would validate with Cloudflare Turnstile API
  return Promise.resolve(true); // Mock validation
}

/**
 * Rate limit store cleanup (remove expired entries)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (data.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

// Cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

export const rateLimitMiddleware = createRateLimitMiddleware();
