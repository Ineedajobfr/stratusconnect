import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  blockDurationMs: number
}

interface RateLimitEntry {
  count: number
  windowStart: number
  blockedUntil?: number
}

const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // General API endpoints
  'api': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    blockDurationMs: 30 * 60 * 1000 // 30 minutes
  },
  // Authentication endpoints
  'auth': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    blockDurationMs: 60 * 60 * 1000 // 1 hour
  },
  // File upload endpoints
  'upload': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    blockDurationMs: 2 * 60 * 60 * 1000 // 2 hours
  },
  // Search endpoints
  'search': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    blockDurationMs: 5 * 60 * 1000 // 5 minutes
  },
  // Default fallback
  'default': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
    blockDurationMs: 5 * 60 * 1000 // 5 minutes
  }
}

function getRateLimitKey(ip: string, endpoint: string, userId?: string): string {
  // Use user ID if available, otherwise fall back to IP
  const identifier = userId || ip
  return `rate_limit:${endpoint}:${identifier}`
}

function getRateLimitConfig(endpoint: string): RateLimitConfig {
  // Determine config based on endpoint
  if (endpoint.includes('/auth/')) return RATE_LIMIT_CONFIGS.auth
  if (endpoint.includes('/upload/')) return RATE_LIMIT_CONFIGS.upload
  if (endpoint.includes('/search/')) return RATE_LIMIT_CONFIGS.search
  if (endpoint.includes('/api/')) return RATE_LIMIT_CONFIGS.api
  return RATE_LIMIT_CONFIGS.default
}

async function checkRateLimit(
  supabase: any,
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number; blocked: boolean }> {
  const now = Date.now()
  const windowStart = now - config.windowMs

  try {
    // Get current rate limit data
    const { data: existingData, error: fetchError } = await supabase
      .from('rate_limits')
      .select('*')
      .eq('key', key)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching rate limit data:', fetchError)
      // On error, allow the request but log it
      return { allowed: true, remaining: config.maxRequests, resetTime: now + config.windowMs, blocked: false }
    }

    let rateLimitData: RateLimitEntry = existingData?.data || { count: 0, windowStart: now }

    // Check if currently blocked
    if (rateLimitData.blockedUntil && now < rateLimitData.blockedUntil) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: rateLimitData.blockedUntil,
        blocked: true
      }
    }

    // Reset window if it has passed
    if (now - rateLimitData.windowStart > config.windowMs) {
      rateLimitData = { count: 0, windowStart: now }
    }

    // Check if limit exceeded
    if (rateLimitData.count >= config.maxRequests) {
      // Block the user
      rateLimitData.blockedUntil = now + config.blockDurationMs
      
      await supabase
        .from('rate_limits')
        .upsert({
          key,
          data: rateLimitData,
          updated_at: new Date().toISOString()
        })

      // Log security event
      await supabase
        .from('security_events')
        .insert({
          event_type: 'rate_limit_exceeded',
          severity: 'high',
          ip_address: key.split(':')[2] || 'unknown',
          user_agent: 'unknown',
          details: {
            endpoint: key.split(':')[1],
            count: rateLimitData.count,
            limit: config.maxRequests,
            blocked_until: rateLimitData.blockedUntil
          }
        })

      return {
        allowed: false,
        remaining: 0,
        resetTime: rateLimitData.blockedUntil,
        blocked: true
      }
    }

    // Increment counter
    rateLimitData.count++

    // Update rate limit data
    await supabase
      .from('rate_limits')
      .upsert({
        key,
        data: rateLimitData,
        updated_at: new Date().toISOString()
      })

    const remaining = Math.max(0, config.maxRequests - rateLimitData.count)
    const resetTime = rateLimitData.windowStart + config.windowMs

    return {
      allowed: true,
      remaining,
      resetTime,
      blocked: false
    }

  } catch (error) {
    console.error('Rate limit check failed:', error)
    // On error, allow the request
    return { allowed: true, remaining: config.maxRequests, resetTime: now + config.windowMs, blocked: false }
  }
}

interface BehavioralData {
  hasMouseMovements?: boolean;
  hasKeyboardActivity?: boolean;
  hasAssetRequests?: boolean;
  screenResolution?: string;
  timezone?: string;
  formFillSpeed?: number;
  clickPattern?: string[];
  navigationPattern?: string[];
  requestTiming?: number[];
}

function detectSuspiciousActivity(req: Request, ip: string, behavioralData?: BehavioralData): boolean {
  const userAgent = req.headers.get('user-agent') || ''
  const referer = req.headers.get('referer') || ''
  const acceptLanguage = req.headers.get('accept-language') || ''
  
  // Detect common bot patterns
  const botPatterns = [
    /bot/i, /crawler/i, /spider/i, /scraper/i,
    /curl/i, /wget/i, /python-requests/i, /node-fetch/i,
    /postman/i, /insomnia/i, /httpie/i
  ]
  
  // Detect headless browsers
  const headlessPatterns = [
    /headless/i, /phantom/i, /selenium/i, /puppeteer/i, /playwright/i,
    /chrome-lighthouse/i, /chromedriver/i, /geckodriver/i
  ]
  
  // Check for missing or suspicious user agent
  if (!userAgent || userAgent.length < 10) return true
  
  // Check for bot patterns
  if (botPatterns.some(pattern => pattern.test(userAgent))) return true
  
  // Check for headless browser patterns
  if (headlessPatterns.some(pattern => pattern.test(userAgent))) return true
  
  // Check for suspicious referer patterns
  if (referer && (
    referer.includes('localhost') ||
    referer.includes('127.0.0.1') ||
    referer.includes('example.com') ||
    referer === ''
  )) return true
  
  // Enhanced behavioral analysis
  if (behavioralData) {
    // Check for missing human-like behavior
    if (behavioralData.hasMouseMovements === false && 
        behavioralData.hasKeyboardActivity === false) return true
    
    // Check for missing browser characteristics
    if (!behavioralData.screenResolution && 
        !behavioralData.timezone && 
        !acceptLanguage) return true
    
    // Check for suspiciously fast form filling
    if (behavioralData.formFillSpeed && behavioralData.formFillSpeed < 100) return true
    
    // Check for missing asset requests (CSS, JS, images)
    if (behavioralData.hasAssetRequests === false) return true
    
    // Check for robotic click patterns
    if (behavioralData.clickPattern && 
        behavioralData.clickPattern.length > 0 &&
        behavioralData.clickPattern.every(pattern => 
          pattern.includes('exact') || pattern.includes('pixel-perfect')
        )) return true
  }
  
  return false
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get client IP
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    // Get user ID from auth header if available
    const authHeader = req.headers.get('authorization')
    let userId: string | undefined
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabaseClient.auth.getUser(token)
        userId = user?.id
      } catch (error) {
        // Ignore auth errors for rate limiting
      }
    }

    // Extract endpoint from URL
    const url = new URL(req.url)
    const endpoint = url.pathname

    // Extract behavioral data from headers
    const behavioralData: BehavioralData = {
      hasMouseMovements: req.headers.get('x-mouse-movements') === 'true',
      hasKeyboardActivity: req.headers.get('x-keyboard-activity') === 'true',
      hasAssetRequests: req.headers.get('x-asset-requests') === 'true',
      screenResolution: req.headers.get('x-screen-resolution') || undefined,
      timezone: req.headers.get('x-timezone') || undefined,
      formFillSpeed: parseFloat(req.headers.get('x-form-fill-speed') || '0'),
      clickPattern: req.headers.get('x-click-pattern')?.split(',') || [],
      navigationPattern: req.headers.get('x-navigation-pattern')?.split(',') || [],
      requestTiming: req.headers.get('x-request-timing')?.split(',').map(Number) || []
    };

    // Detect suspicious activity with behavioral data
    const isSuspicious = detectSuspiciousActivity(req, ip, behavioralData)
    
    if (isSuspicious) {
      // Apply stricter rate limiting for suspicious activity
      const suspiciousConfig = {
        windowMs: 5 * 60 * 1000, // 5 minutes
        maxRequests: 5,
        blockDurationMs: 60 * 60 * 1000 // 1 hour
      }
      
      const key = getRateLimitKey(ip, 'suspicious', userId)
      const rateLimitResult = await checkRateLimit(supabaseClient, key, suspiciousConfig)
      
      if (!rateLimitResult.allowed) {
        // Log security event
        await supabaseClient
          .from('security_events')
          .insert({
            event_type: 'suspicious_activity_blocked',
            severity: 'high',
            ip_address: ip,
            user_agent: req.headers.get('user-agent') || 'unknown',
            details: {
              endpoint,
              reason: 'suspicious_activity_detected',
              user_id: userId
            }
          })

        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded due to suspicious activity',
            retry_after: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
          }),
          {
            status: 429,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
              'X-RateLimit-Limit': suspiciousConfig.maxRequests.toString(),
              'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
              'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
            }
          }
        )
      }
    }

    // Apply normal rate limiting
    const config = getRateLimitConfig(endpoint)
    const key = getRateLimitKey(ip, endpoint, userId)
    const rateLimitResult = await checkRateLimit(supabaseClient, key, config)

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          retry_after: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          blocked: rateLimitResult.blocked
        }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      )
    }

    // Forward the request with rate limit headers
    const response = await fetch(req.url, {
      method: req.method,
      headers: req.headers,
      body: req.body
    })

    // Add rate limit headers to response
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set('X-RateLimit-Limit', config.maxRequests.toString())
    responseHeaders.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString())
    responseHeaders.set('X-RateLimit-Reset', rateLimitResult.resetTime.toString())

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders
    })

  } catch (error) {
    console.error('Rate limiter error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
