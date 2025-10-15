import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BehavioralPattern {
  userId?: string;
  ipAddress: string;
  userAgent: string;
  sessionId?: string;
  timestamp: number;
  endpoint: string;
  method: string;
  requestSize: number;
  responseTime?: number;
  referer?: string;
  acceptLanguage?: string;
  screenResolution?: string;
  timezone?: string;
  hasMouseMovements?: boolean;
  hasKeyboardActivity?: boolean;
  hasAssetRequests?: boolean;
  navigationPattern?: string[];
  formFillSpeed?: number;
  clickPattern?: string[];
}

interface SuspiciousActivity {
  type: 'rapid_fire' | 'missing_assets' | 'non_human_navigation' | 'unusual_patterns' | 'bot_behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  details: Record<string, any>;
  riskScore: number;
}

class BehavioralAnalyzer {
  private patterns: Map<string, BehavioralPattern[]> = new Map();

  analyzePattern(pattern: BehavioralPattern): SuspiciousActivity[] {
    const activities: SuspiciousActivity[] = [];
    const key = pattern.userId || pattern.ipAddress;
    
    // Get existing patterns for this user/IP
    const existingPatterns = this.patterns.get(key) || [];
    existingPatterns.push(pattern);
    
    // Keep only recent patterns (last 30 minutes)
    const recentPatterns = existingPatterns.filter(
      p => Date.now() - p.timestamp < 30 * 60 * 1000
    );
    this.patterns.set(key, recentPatterns);

    // Analyze for suspicious activities
    activities.push(...this.detectRapidFire(recentPatterns));
    activities.push(...this.detectMissingAssets(recentPatterns));
    activities.push(...this.detectNonHumanNavigation(recentPatterns));
    activities.push(...this.detectUnusualPatterns(recentPatterns));
    activities.push(...this.detectBotBehavior(pattern));

    return activities;
  }

  private detectRapidFire(patterns: BehavioralPattern[]): SuspiciousActivity[] {
    const activities: SuspiciousActivity[] = [];
    const now = Date.now();
    
    // Check for rapid-fire requests (more than 20 in 1 minute)
    const recentRequests = patterns.filter(p => now - p.timestamp < 60 * 1000);
    if (recentRequests.length > 20) {
      activities.push({
        type: 'rapid_fire',
        severity: 'high',
        confidence: 0.9,
        details: {
          requestCount: recentRequests.length,
          timeWindow: '1 minute',
          averageInterval: recentRequests.length > 0 ? 60000 / recentRequests.length : 0
        },
        riskScore: Math.min(recentRequests.length / 20, 1.0)
      });
    }

    // Check for burst patterns (more than 5 requests in 10 seconds)
    const burstRequests = patterns.filter(p => now - p.timestamp < 10 * 1000);
    if (burstRequests.length > 5) {
      activities.push({
        type: 'rapid_fire',
        severity: 'medium',
        confidence: 0.8,
        details: {
          requestCount: burstRequests.length,
          timeWindow: '10 seconds',
          burstPattern: true
        },
        riskScore: Math.min(burstRequests.length / 5, 1.0)
      });
    }

    return activities;
  }

  private detectMissingAssets(patterns: BehavioralPattern[]): SuspiciousActivity[] {
    const activities: SuspiciousActivity[] = [];
    
    // Check if requests are missing asset requests (CSS, JS, images)
    const htmlRequests = patterns.filter(p => 
      p.endpoint.match(/\.(html|htm|php|asp|jsp)$/i) || 
      !p.endpoint.includes('.')
    );
    
    const assetRequests = patterns.filter(p => 
      p.endpoint.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf)$/i)
    );

    if (htmlRequests.length > 5 && assetRequests.length === 0) {
      activities.push({
        type: 'missing_assets',
        severity: 'high',
        confidence: 0.85,
        details: {
          htmlRequests: htmlRequests.length,
          assetRequests: assetRequests.length,
          ratio: htmlRequests.length / Math.max(assetRequests.length, 1)
        },
        riskScore: 0.9
      });
    }

    return activities;
  }

  private detectNonHumanNavigation(patterns: BehavioralPattern[]): SuspiciousActivity[] {
    const activities: SuspiciousActivity[] = [];
    
    // Check for direct API access without UI navigation
    const directApiAccess = patterns.filter(p => 
      p.endpoint.includes('/api/') && 
      !p.referer && 
      !p.hasMouseMovements
    );

    if (directApiAccess.length > 3) {
      activities.push({
        type: 'non_human_navigation',
        severity: 'medium',
        confidence: 0.7,
        details: {
          directApiCalls: directApiAccess.length,
          missingReferer: true,
          noMouseMovements: true
        },
        riskScore: 0.7
      });
    }

    // Check for unusual navigation patterns
    const endpoints = patterns.map(p => p.endpoint);
    const uniqueEndpoints = new Set(endpoints);
    if (uniqueEndpoints.size > 20 && patterns.length > 30) {
      activities.push({
        type: 'non_human_navigation',
        severity: 'medium',
        confidence: 0.6,
        details: {
          uniqueEndpoints: uniqueEndpoints.size,
          totalRequests: patterns.length,
          coverage: uniqueEndpoints.size / patterns.length
        },
        riskScore: 0.6
      });
    }

    return activities;
  }

  private detectUnusualPatterns(patterns: BehavioralPattern[]): SuspiciousActivity[] {
    const activities: SuspiciousActivity[] = [];
    
    // Check for identical request patterns
    const requestGroups = new Map<string, number>();
    patterns.forEach(p => {
      const key = `${p.method}:${p.endpoint}`;
      requestGroups.set(key, (requestGroups.get(key) || 0) + 1);
    });

    const repeatedRequests = Array.from(requestGroups.entries())
      .filter(([_, count]) => count > 10);

    if (repeatedRequests.length > 0) {
      activities.push({
        type: 'unusual_patterns',
        severity: 'medium',
        confidence: 0.75,
        details: {
          repeatedPatterns: repeatedRequests,
          totalPatterns: requestGroups.size,
          automationLikelihood: repeatedRequests.length / requestGroups.size
        },
        riskScore: 0.75
      });
    }

    return activities;
  }

  private detectBotBehavior(pattern: BehavioralPattern): SuspiciousActivity[] {
    const activities: SuspiciousActivity[] = [];
    
    // Check user agent for bot signatures
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python-requests/i, /node-fetch/i,
      /headless/i, /phantom/i, /selenium/i, /puppeteer/i, /playwright/i
    ];

    const isBotUA = botPatterns.some(regex => regex.test(pattern.userAgent));
    if (isBotUA) {
      activities.push({
        type: 'bot_behavior',
        severity: 'high',
        confidence: 0.95,
        details: {
          userAgent: pattern.userAgent,
          botSignature: 'detected_in_user_agent'
        },
        riskScore: 0.95
      });
    }

    // Check for missing browser characteristics
    if (!pattern.screenResolution && !pattern.timezone && !pattern.acceptLanguage) {
      activities.push({
        type: 'bot_behavior',
        severity: 'medium',
        confidence: 0.6,
        details: {
          missingBrowserFeatures: ['screen_resolution', 'timezone', 'accept_language']
        },
        riskScore: 0.6
      });
    }

    return activities;
  }

  calculateRiskScore(activities: SuspiciousActivity[]): number {
    if (activities.length === 0) return 0;
    
    const weights = {
      critical: 1.0,
      high: 0.8,
      medium: 0.6,
      low: 0.3
    };

    const weightedScore = activities.reduce((sum, activity) => {
      return sum + (activity.riskScore * weights[activity.severity]);
    }, 0);

    return Math.min(weightedScore / activities.length, 1.0);
  }
}

const analyzer = new BehavioralAnalyzer();

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get request data
    const ip = req.headers.get('x-forwarded-for') || 
               req.headers.get('x-real-ip') || 
               'unknown'
    
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const referer = req.headers.get('referer') || ''
    const acceptLanguage = req.headers.get('accept-language') || ''
    
    const url = new URL(req.url)
    const endpoint = url.pathname
    const method = req.method
    
    // Get user ID from auth header if available
    let userId: string | undefined
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user } } = await supabaseClient.auth.getUser(token)
        userId = user?.id
      } catch (error) {
        // Ignore auth errors
      }
    }

    // Create behavioral pattern
    const pattern: BehavioralPattern = {
      userId,
      ipAddress: ip,
      userAgent,
      timestamp: Date.now(),
      endpoint,
      method,
      requestSize: parseInt(req.headers.get('content-length') || '0'),
      referer,
      acceptLanguage,
      screenResolution: req.headers.get('x-screen-resolution') || undefined,
      timezone: req.headers.get('x-timezone') || undefined,
      hasMouseMovements: req.headers.get('x-mouse-movements') === 'true',
      hasKeyboardActivity: req.headers.get('x-keyboard-activity') === 'true',
      hasAssetRequests: req.headers.get('x-asset-requests') === 'true',
      formFillSpeed: parseFloat(req.headers.get('x-form-fill-speed') || '0'),
      navigationPattern: req.headers.get('x-navigation-pattern')?.split(',') || [],
      clickPattern: req.headers.get('x-click-pattern')?.split(',') || []
    }

    // Analyze behavioral pattern
    const suspiciousActivities = analyzer.analyzePattern(pattern)
    const riskScore = analyzer.calculateRiskScore(suspiciousActivities)

    // Log behavioral data
    await supabaseClient
      .from('behavioral_logs')
      .insert({
        user_id: userId,
        ip_address: ip,
        user_agent: userAgent,
        endpoint: endpoint,
        method: method,
        timestamp: new Date().toISOString(),
        pattern_data: pattern,
        suspicious_activities: suspiciousActivities,
        risk_score: riskScore,
        session_id: req.headers.get('x-session-id') || undefined
      })

    // If high risk, log security event
    if (riskScore > 0.7) {
      await supabaseClient
        .from('security_events')
        .insert({
          event_type: 'suspicious_behavior_detected',
          severity: riskScore > 0.9 ? 'critical' : 'high',
          ip_address: ip,
          user_agent: userAgent,
          user_id: userId,
          details: {
            risk_score: riskScore,
            activities: suspiciousActivities,
            endpoint: endpoint,
            pattern: pattern
          }
        })
    }

    // Return analysis results
    return new Response(
      JSON.stringify({
        risk_score: riskScore,
        suspicious_activities: suspiciousActivities,
        recommendations: riskScore > 0.7 ? [
          'Consider additional verification',
          'Monitor for continued suspicious activity',
          'Apply stricter rate limiting'
        ] : []
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Behavioral monitor error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

