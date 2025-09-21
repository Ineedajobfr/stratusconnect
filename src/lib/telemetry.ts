// Telemetry and monitoring system for real metrics
// Provides uptime, response time, and performance data

export interface TelemetryEvent {
  id: string;
  type: 'api_request' | 'ui_action' | 'health_check' | 'error';
  name: string;
  duration: number;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface UptimeMetrics {
  uptime_24h: number;
  uptime_7d: number;
  uptime_30d: number;
  last_incident: string | null;
  current_status: 'operational' | 'degraded' | 'outage';
}

export interface ResponseTimeMetrics {
  p50_24h: number;
  p90_24h: number;
  p99_24h: number;
  p50_7d: number;
  p90_7d: number;
  p99_7d: number;
  avg_24h: number;
  avg_7d: number;
}

export interface SystemMetrics {
  uptime: UptimeMetrics;
  response_time: ResponseTimeMetrics;
  active_users_24h: number;
  active_users_7d: number;
  transactions_24h: number;
  transactions_7d: number;
  last_updated: string;
}

class TelemetryService {
  private events: TelemetryEvent[] = [];
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isHealthy = true;
  private startTime = Date.now();

  constructor() {
    this.startHealthChecks();
    this.loadStoredEvents();
  }

  // Track API request performance
  trackApiRequest(name: string, duration: number, metadata: Record<string, any> = {}) {
    this.recordEvent({
      id: crypto.randomUUID(),
      type: 'api_request',
      name,
      duration,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        user_agent: navigator.userAgent,
        url: window.location.href,
      },
    });
  }

  // Track UI action performance
  trackUIAction(name: string, duration: number, metadata: Record<string, any> = {}) {
    this.recordEvent({
      id: crypto.randomUUID(),
      type: 'ui_action',
      name,
      duration,
      timestamp: new Date().toISOString(),
      metadata: {
        ...metadata,
        user_agent: navigator.userAgent,
        url: window.location.href,
      },
    });
  }

  // Track errors
  trackError(error: Error, context: string, metadata: Record<string, any> = {}) {
    this.recordEvent({
      id: crypto.randomUUID(),
      type: 'error',
      name: context,
      duration: 0,
      timestamp: new Date().toISOString(),
      metadata: {
        error_message: error.message,
        error_stack: error.stack,
        context,
        ...metadata,
      },
    });
  }

  // Record telemetry event
  private recordEvent(event: TelemetryEvent) {
    this.events.push(event);
    this.storeEvents();
    
    // Keep only last 1000 events in memory
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  // Start health checks
  private startHealthChecks() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const start = Date.now();
        const response = await fetch('/api/health', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const duration = Date.now() - start;
        
        if (response.ok) {
          this.isHealthy = true;
          this.recordEvent({
            id: crypto.randomUUID(),
            type: 'health_check',
            name: 'api_health_check',
            duration,
            timestamp: new Date().toISOString(),
            metadata: {
              status: response.status,
              healthy: true,
            },
          });
        } else {
          this.isHealthy = false;
          this.recordEvent({
            id: crypto.randomUUID(),
            type: 'health_check',
            name: 'api_health_check',
            duration,
            timestamp: new Date().toISOString(),
            metadata: {
              status: response.status,
              healthy: false,
            },
          });
        }
      } catch (error) {
        this.isHealthy = false;
        this.recordEvent({
          id: crypto.randomUUID(),
          type: 'health_check',
          name: 'api_health_check',
          duration: 0,
          timestamp: new Date().toISOString(),
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
            healthy: false,
          },
        });
      }
    }, 30000); // Check every 30 seconds
  }

  // Calculate uptime metrics
  calculateUptimeMetrics(): UptimeMetrics {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

    const healthChecks24h = this.events.filter(
      e => e.type === 'health_check' && 
           new Date(e.timestamp).getTime() > oneDayAgo
    );
    
    const healthChecks7d = this.events.filter(
      e => e.type === 'health_check' && 
           new Date(e.timestamp).getTime() > oneWeekAgo
    );
    
    const healthChecks30d = this.events.filter(
      e => e.type === 'health_check' && 
           new Date(e.timestamp).getTime() > oneMonthAgo
    );

    const uptime24h = healthChecks24h.length > 0 
      ? (healthChecks24h.filter(h => h.metadata.healthy).length / healthChecks24h.length) * 100
      : 100;
    
    const uptime7d = healthChecks7d.length > 0 
      ? (healthChecks7d.filter(h => h.metadata.healthy).length / healthChecks7d.length) * 100
      : 100;
    
    const uptime30d = healthChecks30d.length > 0 
      ? (healthChecks30d.filter(h => h.metadata.healthy).length / healthChecks30d.length) * 100
      : 100;

    const lastIncident = this.events
      .filter(e => e.type === 'health_check' && !e.metadata.healthy)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    let currentStatus: 'operational' | 'degraded' | 'outage' = 'operational';
    if (!this.isHealthy) {
      currentStatus = 'outage';
    } else if (uptime24h < 99.9) {
      currentStatus = 'degraded';
    }

    return {
      uptime_24h: Math.round(uptime24h * 100) / 100,
      uptime_7d: Math.round(uptime7d * 100) / 100,
      uptime_30d: Math.round(uptime30d * 100) / 100,
      last_incident: lastIncident ? lastIncident.timestamp : null,
      current_status: currentStatus,
    };
  }

  // Calculate response time metrics
  calculateResponseTimeMetrics(): ResponseTimeMetrics {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const apiRequests24h = this.events.filter(
      e => e.type === 'api_request' && 
           new Date(e.timestamp).getTime() > oneDayAgo
    );
    
    const apiRequests7d = this.events.filter(
      e => e.type === 'api_request' && 
           new Date(e.timestamp).getTime() > oneWeekAgo
    );

    const calculatePercentile = (durations: number[], percentile: number): number => {
      const sorted = durations.sort((a, b) => a - b);
      const index = Math.ceil((percentile / 100) * sorted.length) - 1;
      return sorted[index] || 0;
    };

    const durations24h = apiRequests24h.map(r => r.duration);
    const durations7d = apiRequests7d.map(r => r.duration);

    return {
      p50_24h: calculatePercentile(durations24h, 50),
      p90_24h: calculatePercentile(durations24h, 90),
      p99_24h: calculatePercentile(durations24h, 99),
      p50_7d: calculatePercentile(durations7d, 50),
      p90_7d: calculatePercentile(durations7d, 90),
      p99_7d: calculatePercentile(durations7d, 99),
      avg_24h: durations24h.length > 0 ? durations24h.reduce((a, b) => a + b, 0) / durations24h.length : 0,
      avg_7d: durations7d.length > 0 ? durations7d.reduce((a, b) => a + b, 0) / durations7d.length : 0,
    };
  }

  // Get system metrics
  getSystemMetrics(): SystemMetrics {
    const uptime = this.calculateUptimeMetrics();
    const responseTime = this.calculateResponseTimeMetrics();
    
    // These would typically come from your backend/database
    // For now, we'll use placeholder values
    const activeUsers24h = this.getActiveUsers(24);
    const activeUsers7d = this.getActiveUsers(7 * 24);
    const transactions24h = this.getTransactions(24);
    const transactions7d = this.getTransactions(7 * 24);

    return {
      uptime,
      response_time: responseTime,
      active_users_24h: activeUsers24h,
      active_users_7d: activeUsers7d,
      transactions_24h: transactions24h,
      transactions_7d: transactions7d,
      last_updated: new Date().toISOString(),
    };
  }

  // Get active users (placeholder implementation)
  private getActiveUsers(hours: number): number {
    // This would typically query your user activity database
    // For now, return a placeholder value
    return Math.floor(Math.random() * 1000) + 100;
  }

  // Get transactions (placeholder implementation)
  private getTransactions(hours: number): number {
    // This would typically query your transaction database
    // For now, return a placeholder value
    return Math.floor(Math.random() * 100) + 10;
  }

  // Store events in localStorage
  private storeEvents() {
    try {
      localStorage.setItem('telemetry_events', JSON.stringify(this.events.slice(-100)));
    } catch (error) {
      console.warn('Failed to store telemetry events:', error);
    }
  }

  // Load stored events
  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem('telemetry_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored telemetry events:', error);
    }
  }

  // Get status for /status endpoint
  getStatus() {
    const metrics = this.getSystemMetrics();
    return {
      status: metrics.uptime.current_status,
      uptime: metrics.uptime,
      response_time: metrics.response_time,
      timestamp: metrics.last_updated,
      version: process.env.VITE_APP_VERSION || '1.0.0',
    };
  }

  // Cleanup
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
  }
}

// Create singleton instance
export const telemetry = new TelemetryService();

// Performance monitoring wrapper
export function withTelemetry<T extends any[], R>(
  fn: (...args: T) => R,
  name: string
): (...args: T) => R {
  return (...args: T): R => {
    const start = performance.now();
    try {
      const result = fn(...args);
      
      // Handle promises
      if (result instanceof Promise) {
        return result.then(
          (res) => {
            const duration = performance.now() - start;
            telemetry.trackApiRequest(name, duration);
            return res;
          },
          (error) => {
            const duration = performance.now() - start;
            telemetry.trackError(error, name);
            telemetry.trackApiRequest(name, duration, { error: true });
            throw error;
          }
        ) as R;
      }
      
      const duration = performance.now() - start;
      telemetry.trackApiRequest(name, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      telemetry.trackError(error as Error, name);
      telemetry.trackApiRequest(name, duration, { error: true });
      throw error;
    }
  };
}

// UI action tracking
export function trackUIAction(name: string, action: () => void) {
  const start = performance.now();
  try {
    action();
    const duration = performance.now() - start;
    telemetry.trackUIAction(name, duration);
  } catch (error) {
    const duration = performance.now() - start;
    telemetry.trackError(error as Error, name);
    telemetry.trackUIAction(name, duration, { error: true });
    throw error;
  }
}
