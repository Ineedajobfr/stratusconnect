// Live Status Handler - Real-time system monitoring with fallbacks
// FCA Compliant Aviation Platform

import { createClient } from '@supabase/supabase-js';
import { compliantMonitoring, UptimeMetrics } from './compliant-monitoring';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface LiveStatusData {
  status: 'operational' | 'degraded' | 'outage' | 'unknown';
  uptime: {
    last24h: number | null;
    last7d: number | null;
    last30d: number | null;
  };
  responseTime: {
    p50: number | null;
    p90: number | null;
    p99: number | null;
    average: number | null;
  };
  incidents: {
    active: number;
    last24h: number;
    last7d: number;
  };
  lastUpdated: string | null;
  dataSource: 'live' | 'cached' | 'fallback' | 'unavailable';
  error?: string;
}

export interface SystemHealthCheck {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
  responseTime: number | null;
  lastChecked: string;
  error?: string;
}

export interface ServiceStatus {
  id: string;
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance' | 'unknown';
  uptime: number | null;
  responseTime: number | null;
  lastIncident: string | null;
  dependencies: string[];
}

class LiveStatusHandler {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly FALLBACK_DURATION = 30 * 60 * 1000; // 30 minutes
  private healthChecks: SystemHealthCheck[] = [];
  private services: ServiceStatus[] = [];

  constructor() {
    this.initializeHealthChecks();
    this.startPeriodicHealthChecks();
  }

  /**
   * Get comprehensive live status data
   */
  async getLiveStatus(): Promise<LiveStatusData> {
    try {
      // Try to get live data from multiple sources
      const [uptimeData, healthData, serviceData] = await Promise.allSettled([
        this.getLiveUptimeData(),
        this.performHealthChecks(),
        this.getServiceStatuses()
      ]);

      const uptime = uptimeData.status === 'fulfilled' ? uptimeData.value : null;
      const health = healthData.status === 'fulfilled' ? healthData.value : [];
      const services = serviceData.status === 'fulfilled' ? serviceData.value : [];

      // Determine overall status
      const overallStatus = this.determineOverallStatus(uptime, health, services);

      // Calculate response time metrics
      const responseTime = this.calculateResponseTimeMetrics(health, services);

      // Count incidents
      const incidents = this.countIncidents(uptime, services);

      return {
        status: overallStatus,
        uptime: {
          last24h: uptime?.uptime_24h || null,
          last7d: uptime?.uptime_7d || null,
          last30d: uptime?.uptime_30d || null,
        },
        responseTime,
        incidents,
        lastUpdated: new Date().toISOString(),
        dataSource: uptime ? 'live' : 'fallback'
      };
    } catch (error) {
      console.error('Error getting live status:', error);
      return this.getFallbackStatus(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  /**
   * Get live uptime data from UptimeRobot
   */
  private async getLiveUptimeData(): Promise<UptimeMetrics | null> {
    try {
      // Check cache first
      const cached = this.getCachedData('uptime');
      if (cached) {
        return cached;
      }

      // Fetch fresh data from UptimeRobot
      const metrics = await compliantMonitoring.getUptimeMetrics();
      
      // Cache the result
      this.setCachedData('uptime', metrics);
      
      return metrics;
    } catch (error) {
      console.error('Failed to get live uptime data:', error);
      return null;
    }
  }

  /**
   * Perform comprehensive health checks
   */
  private async performHealthChecks(): Promise<SystemHealthCheck[]> {
    const checks: SystemHealthCheck[] = [];

    // Check core services
    const servicesToCheck = [
      { name: 'API Server', url: '/api/health' },
      { name: 'Database', url: '/api/database/health' },
      { name: 'Authentication', url: '/api/auth/health' },
      { name: 'Payment Gateway', url: '/api/payments/health' },
      { name: 'File Storage', url: '/api/storage/health' }
    ];

    for (const service of servicesToCheck) {
      try {
        const start = Date.now();
        const response = await fetch(service.url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          signal: AbortSignal.timeout(5000) // 5 second timeout
        });
        
        const responseTime = Date.now() - start;
        const isHealthy = response.ok;

        checks.push({
          id: service.name.toLowerCase().replace(/\s+/g, '_'),
          name: service.name,
          status: isHealthy ? 'healthy' : 'unhealthy',
          responseTime: responseTime,
          lastChecked: new Date().toISOString(),
          error: isHealthy ? undefined : `HTTP ${response.status}`
        });
      } catch (error) {
        checks.push({
          id: service.name.toLowerCase().replace(/\s+/g, '_'),
          name: service.name,
          status: 'unhealthy',
          responseTime: null,
          lastChecked: new Date().toISOString(),
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Check Supabase connectivity
    try {
      const start = Date.now();
      const { error } = await supabase.from('users').select('count').limit(1);
      const responseTime = Date.now() - start;

      checks.push({
        id: 'supabase',
        name: 'Supabase Database',
        status: error ? 'unhealthy' : 'healthy',
        responseTime: responseTime,
        lastChecked: new Date().toISOString(),
        error: error?.message
      });
    } catch (error) {
      checks.push({
        id: 'supabase',
        name: 'Supabase Database',
        status: 'unhealthy',
        responseTime: null,
        lastChecked: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    this.healthChecks = checks;
    return checks;
  }

  /**
   * Get service statuses
   */
  private async getServiceStatuses(): Promise<ServiceStatus[]> {
    const services: ServiceStatus[] = [
      {
        id: 'flight_tracking',
        name: 'Flight Tracking',
        status: 'operational',
        uptime: null,
        responseTime: null,
        lastIncident: null,
        dependencies: ['api_server', 'database']
      },
      {
        id: 'booking_system',
        name: 'Booking System',
        status: 'operational',
        uptime: null,
        responseTime: null,
        lastIncident: null,
        dependencies: ['api_server', 'database', 'payment_gateway']
      },
      {
        id: 'payment_gateway',
        name: 'Payment Gateway',
        status: 'operational',
        uptime: null,
        responseTime: null,
        lastIncident: null,
        dependencies: ['api_server']
      },
      {
        id: 'weather_api',
        name: 'Weather API',
        status: 'operational',
        uptime: null,
        responseTime: null,
        lastIncident: null,
        dependencies: ['api_server']
      },
      {
        id: 'database',
        name: 'Database',
        status: 'operational',
        uptime: null,
        responseTime: null,
        lastIncident: null,
        dependencies: []
      }
    ];

    // Update service statuses based on health checks
    for (const service of services) {
      const relevantChecks = this.healthChecks.filter(check => 
        service.dependencies.includes(check.id)
      );

      if (relevantChecks.length > 0) {
        const unhealthyChecks = relevantChecks.filter(check => check.status === 'unhealthy');
        
        if (unhealthyChecks.length === 0) {
          service.status = 'operational';
        } else if (unhealthyChecks.length < relevantChecks.length) {
          service.status = 'degraded';
        } else {
          service.status = 'outage';
        }

        // Calculate average response time
        const responseTimes = relevantChecks
          .filter(check => check.responseTime !== null)
          .map(check => check.responseTime!);
        
        if (responseTimes.length > 0) {
          service.responseTime = Math.round(
            responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
          );
        }
      }
    }

    this.services = services;
    return services;
  }

  /**
   * Determine overall system status
   */
  private determineOverallStatus(
    uptime: UptimeMetrics | null,
    healthChecks: SystemHealthCheck[],
    services: ServiceStatus[]
  ): 'operational' | 'degraded' | 'outage' | 'unknown' {
    // If no data available, return unknown
    if (!uptime && healthChecks.length === 0 && services.length === 0) {
      return 'unknown';
    }

    // Check for outages
    const hasOutages = services.some(s => s.status === 'outage') ||
                      healthChecks.some(h => h.status === 'unhealthy');

    if (hasOutages) {
      return 'outage';
    }

    // Check for degraded performance
    const hasDegraded = services.some(s => s.status === 'degraded') ||
                       healthChecks.some(h => h.status === 'degraded');

    if (hasDegraded) {
      return 'degraded';
    }

    // Check uptime thresholds
    if (uptime) {
      if (uptime.uptime_24h < 99.0) {
        return 'degraded';
      }
      if (uptime.uptime_24h < 95.0) {
        return 'outage';
      }
    }

    return 'operational';
  }

  /**
   * Calculate response time metrics
   */
  private calculateResponseTimeMetrics(
    healthChecks: SystemHealthCheck[],
    services: ServiceStatus[]
  ): { p50: number | null; p90: number | null; p99: number | null; average: number | null } {
    const responseTimes = [
      ...healthChecks.filter(h => h.responseTime !== null).map(h => h.responseTime!),
      ...services.filter(s => s.responseTime !== null).map(s => s.responseTime!)
    ];

    if (responseTimes.length === 0) {
      return { p50: null, p90: null, p99: null, average: null };
    }

    const sorted = responseTimes.sort((a, b) => a - b);
    const len = sorted.length;

    return {
      p50: sorted[Math.floor(len * 0.5)],
      p90: sorted[Math.floor(len * 0.9)],
      p99: sorted[Math.floor(len * 0.99)],
      average: Math.round(sorted.reduce((a, b) => a + b, 0) / len)
    };
  }

  /**
   * Count incidents
   */
  private countIncidents(uptime: UptimeMetrics | null, services: ServiceStatus[]): {
    active: number;
    last24h: number;
    last7d: number;
  } {
    const activeIncidents = services.filter(s => 
      s.status === 'outage' || s.status === 'degraded'
    ).length;

    return {
      active: activeIncidents,
      last24h: uptime?.incidents_24h || 0,
      last7d: uptime?.incidents_7d || 0
    };
  }

  /**
   * Get fallback status when live data is unavailable
   */
  private getFallbackStatus(error: string): LiveStatusData {
    return {
      status: 'unknown',
      uptime: {
        last24h: null,
        last7d: null,
        last30d: null,
      },
      responseTime: {
        p50: null,
        p90: null,
        p99: null,
        average: null,
      },
      incidents: {
        active: 0,
        last24h: 0,
        last7d: 0,
      },
      lastUpdated: new Date().toISOString(),
      dataSource: 'unavailable',
      error
    };
  }

  /**
   * Initialize health checks
   */
  private initializeHealthChecks(): void {
    // Initialize with empty health checks
    this.healthChecks = [];
  }

  /**
   * Start periodic health checks
   */
  private startPeriodicHealthChecks(): void {
    // Perform initial health check
    this.performHealthChecks();

    // Set up periodic health checks every 2 minutes
    setInterval(() => {
      this.performHealthChecks();
    }, 2 * 60 * 1000);
  }

  /**
   * Cache management
   */
  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  /**
   * Get system metrics for dashboard
   */
  async getSystemMetrics(): Promise<{
    status: string;
    uptime: number | null;
    responseTime: number | null;
    lastUpdated: string;
    dataSource: string;
  }> {
    const liveStatus = await this.getLiveStatus();
    
    return {
      status: liveStatus.status,
      uptime: liveStatus.uptime.last24h,
      responseTime: liveStatus.responseTime.average,
      lastUpdated: liveStatus.lastUpdated || new Date().toISOString(),
      dataSource: liveStatus.dataSource
    };
  }

  /**
   * Format uptime percentage for display
   */
  formatUptime(uptime: number | null): string {
    if (uptime === null) return 'N/A';
    return `${uptime.toFixed(2)}%`;
  }

  /**
   * Format response time for display
   */
  formatResponseTime(responseTime: number | null): string {
    if (responseTime === null) return 'N/A';
    return `${responseTime}ms`;
  }

  /**
   * Get status color for UI
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'operational': return 'text-green-500';
      case 'degraded': return 'text-yellow-500';
      case 'outage': return 'text-red-500';
      case 'unknown': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  }

  /**
   * Get status badge variant
   */
  getStatusBadgeVariant(status: string): string {
    switch (status) {
      case 'operational': return 'default';
      case 'degraded': return 'secondary';
      case 'outage': return 'destructive';
      case 'unknown': return 'outline';
      default: return 'outline';
    }
  }
}

export const liveStatusHandler = new LiveStatusHandler();
export default liveStatusHandler;
