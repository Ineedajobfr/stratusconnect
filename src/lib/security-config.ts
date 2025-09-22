// Security Configuration
// This file contains security settings and utilities for the frontend

export const SECURITY_CONFIG = {
  // Password requirements
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128,
    // Common weak passwords to reject
    weakPasswords: [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      '12345678', 'password1', 'qwerty123', 'admin123', 'root',
      'toor', 'pass', 'test', 'guest', 'user'
    ]
  },
  
  // Session security
  session: {
    maxIdleTime: 30 * 60 * 1000, // 30 minutes
    maxSessionTime: 8 * 60 * 60 * 1000, // 8 hours
    refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
  },
  
  // Rate limiting
  rateLimits: {
    loginAttempts: {
      max: 5,
      window: 15 * 60 * 1000, // 15 minutes
    },
    apiCalls: {
      max: 100,
      window: 60 * 1000, // 1 minute
    },
    passwordReset: {
      max: 3,
      window: 60 * 60 * 1000, // 1 hour
    }
  },
  
  // Security headers
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co; frame-src 'none';"
  },
  
  // OTP settings
  otp: {
    expiry: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 3,
    cooldownPeriod: 60 * 1000, // 1 minute between attempts
  },
  
  // Audit logging
  audit: {
    enabled: true,
    logLevel: 'info',
    events: [
      'login_success',
      'login_failed',
      'password_change',
      'email_change',
      'phone_change',
      'account_lockout',
      'suspicious_activity',
      'admin_action',
      'data_access',
      'data_modification'
    ]
  }
};

// Password strength checker
export function checkPasswordStrength(password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} {
  const feedback: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < SECURITY_CONFIG.password.minLength) {
    feedback.push(`Password must be at least ${SECURITY_CONFIG.password.minLength} characters long`);
  } else {
    score += 1;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  // Number check
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }
  
  // Weak password check
  if (SECURITY_CONFIG.password.weakPasswords.includes(password.toLowerCase())) {
    feedback.push('Password is too common and easily guessable');
    score = 0;
  }
  
  // Common patterns check
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Password contains repeated characters');
    score -= 1;
  }
  
  if (/123|abc|qwe/i.test(password)) {
    feedback.push('Password contains common sequences');
    score -= 1;
  }
  
  const isStrong = score >= 4 && feedback.length === 0;
  
  return {
    score: Math.max(0, score),
    feedback,
    isStrong
  };
}

// Rate limiting utility
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);
    
    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (attempt.count >= maxAttempts) {
      return false;
    }
    
    attempt.count += 1;
    return true;
  }
  
  getRemainingTime(key: string): number {
    const attempt = this.attempts.get(key);
    if (!attempt) return 0;
    
    const now = Date.now();
    return Math.max(0, attempt.resetTime - now);
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

// Security event logger
export function logSecurityEvent(
  eventType: string,
  details: Record<string, unknown> = {},
  severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
): void {
  if (!SECURITY_CONFIG.audit.enabled) return;
  
  const event = {
    timestamp: new Date().toISOString(),
    eventType,
    details,
    severity,
    userAgent: navigator.userAgent,
    url: window.location.href,
    userId: localStorage.getItem('user_id') || 'anonymous'
  };
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Security Event:', event);
  }
  
  // In production, send to your logging service
  // Example: sendToLoggingService(event);
}

// Session security manager
export class SessionSecurityManager {
  private lastActivity: number = Date.now();
  private sessionTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  
  constructor() {
    this.setupActivityListeners();
    this.startSessionTimer();
  }
  
  private setupActivityListeners(): void {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, this.updateActivity.bind(this), true);
    });
  }
  
  private updateActivity(): void {
    this.lastActivity = Date.now();
  }
  
  private startSessionTimer(): void {
    this.sessionTimer = setInterval(() => {
      const now = Date.now();
      const idleTime = now - this.lastActivity;
      const sessionTime = now - (this.lastActivity - idleTime);
      
      // Check for idle timeout
      if (idleTime > SECURITY_CONFIG.session.maxIdleTime) {
        this.handleIdleTimeout();
        return;
      }
      
      // Check for session timeout
      if (sessionTime > SECURITY_CONFIG.session.maxSessionTime) {
        this.handleSessionTimeout();
        return;
      }
      
      // Show warning before session expires
      const timeUntilExpiry = SECURITY_CONFIG.session.maxSessionTime - sessionTime;
      if (timeUntilExpiry <= SECURITY_CONFIG.session.refreshThreshold && !this.warningTimer) {
        this.showSessionWarning();
      }
    }, 60000); // Check every minute
  }
  
  private handleIdleTimeout(): void {
    logSecurityEvent('session_idle_timeout', { idleTime: Date.now() - this.lastActivity });
    this.logout('Your session has expired due to inactivity');
  }
  
  private handleSessionTimeout(): void {
    logSecurityEvent('session_timeout', { sessionTime: Date.now() - this.lastActivity });
    this.logout('Your session has expired');
  }
  
  private showSessionWarning(): void {
    this.warningTimer = setTimeout(() => {
      // Show warning modal or notification
      if (confirm('Your session will expire soon. Do you want to extend it?')) {
        this.extendSession();
      } else {
        this.handleSessionTimeout();
      }
    }, 1000);
  }
  
  private extendSession(): void {
    this.lastActivity = Date.now();
    this.warningTimer = null;
    logSecurityEvent('session_extended');
  }
  
  private logout(reason: string): void {
    logSecurityEvent('forced_logout', { reason });
    
    // Clear timers
    if (this.sessionTimer) clearInterval(this.sessionTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
    
    // Clear session data
    localStorage.removeItem('user_id');
    localStorage.removeItem('session_token');
    
    // Redirect to login
    window.location.href = '/login';
  }
  
  public destroy(): void {
    if (this.sessionTimer) clearInterval(this.sessionTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);
  }
}

// Initialize session security
export const sessionSecurity = new SessionSecurityManager();

// Content Security Policy helper
export function getCSPHeader(): string {
  return SECURITY_CONFIG.headers['Content-Security-Policy'];
}

// XSS protection utilities
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
}

// CSRF protection
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function validateCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken && token.length === 64;
}
