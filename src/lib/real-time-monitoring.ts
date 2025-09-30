// Real-time monitoring system with accurate uptime tracking
// Monitors multiple endpoints and provides live status updates

export interface HealthCheck {
  id: string;
  name: string;
  url: string;
  status: 'up' | 'down' | 'degraded' | 'unknown';
  responseTime: number;
  lastCheck: string;
  consecutiveFailures: number;
  uptime24h: number;
  uptime7d: number;
  uptime30d: number;
}

export interface SystemStatus {
  overall: 'operational' | 'degraded' | 'outage';
  uptime: {
    current: number;
    p50: number;
    p90: number;
    p99: number;
  };
  monitors: HealthCheck[];
  lastUpdated: string;
  version: string;
  incidents: number;
}

class RealTimeMonitoringService {
  private static instance: RealTimeMonitoringService;
  private monitors: Map<string, HealthCheck> = new Map();
  private checkInterval: NodeJS.Timeout | null = null;
  private isRunning = false;
  private startTime = Date.now();
  private checkHistory: Map<string, Array<{ timestamp: number; status: 'up' | 'down'; responseTime: number }>> = new Map();

  constructor() {
    this.initializeMonitors();
    this.startMonitoring();
  }

  static getInstance(): RealTimeMonitoringService {
    if (!RealTimeMonitoringService.instance) {
      RealTimeMonitoringService.instance = new RealTimeMonitoringService();
    }
    return RealTimeMonitoringService.instance;
  }

  private initializeMonitors() {
    // Monitor key endpoints
    const endpoints = [
      {
        id: 'main-app',
        name: 'Main Application',
        url: window.location.origin,
      },
      {
        id: 'api-health',
        name: 'API Health',
        url: `${window.location.origin}/api/health`,
      },
      {
        id: 'auth-service',
        name: 'Authentication Service',
        url: `${window.location.origin}/api/auth/health`,
      },
      {
        id: 'database',
        name: 'Database',
        url: `${window.location.origin}/api/db/health`,
      },
    ];

    endpoints.forEach(endpoint => {
      this.monitors.set(endpoint.id, {
        id: endpoint.id,
        name: endpoint.name,
        url: endpoint.url,
        status: 'unknown',
        responseTime: 0,
        lastCheck: new Date().toISOString(),
        consecutiveFailures: 0,
        uptime24h: 100,
        uptime7d: 100,
        uptime30d: 100,
      });
      this.checkHistory.set(endpoint.id, []);
    });
  }

  private async startMonitoring() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🚀 Starting real-time monitoring...');
    
    // Initial check
    await this.performHealthChecks();
    
    // Set up interval for continuous monitoring
    this.checkInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 10000); // Check every 10 seconds

    // Clean up old history data every hour
    setInterval(() => {
      this.cleanupOldHistory();
    }, 3600000); // Every hour
  }

  private async performHealthChecks() {
    const checkPromises = Array.from(this.monitors.values()).map(monitor => 
      this.checkEndpoint(monitor)
    );
    
    await Promise.allSettled(checkPromises);
  }

  private async checkEndpoint(monitor: HealthCheck): Promise<void> {
    const startTime = performance.now();
    
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 5000); // 5 second timeout
      });

      // Create the fetch promise
      const fetchPromise = fetch(monitor.url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
        // Add credentials for same-origin requests
        credentials: 'same-origin',
      });

      // Race between fetch and timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]);
      const responseTime = Math.round(performance.now() - startTime);

      if (response.ok) {
        monitor.status = 'up';
        monitor.consecutiveFailures = 0;
        monitor.responseTime = responseTime;
      } else {
        monitor.status = response.status >= 500 ? 'down' : 'degraded';
        monitor.consecutiveFailures++;
        monitor.responseTime = responseTime;
      }
    } catch (error) {
      monitor.status = 'down';
      monitor.consecutiveFailures++;
      monitor.responseTime = Math.round(performance.now() - startTime);
      
      console.warn(`Health check failed for ${monitor.name}:`, error);
    }

    monitor.lastCheck = new Date().toISOString();
    
    // Record this check in history
    this.recordCheck(monitor.id, monitor.status, monitor.responseTime);
    
    // Update uptime calculations
    this.updateUptimeMetrics(monitor);
  }

  private recordCheck(monitorId: string, status: 'up' | 'down', responseTime: number) {
    const history = this.checkHistory.get(monitorId) || [];
    const now = Date.now();
    
    history.push({
      timestamp: now,
      status,
      responseTime,
    });

    // Keep only last 7 days of data (10-second intervals = 60480 records)
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    const filteredHistory = history.filter(record => record.timestamp > sevenDaysAgo);
    
    this.checkHistory.set(monitorId, filteredHistory);
  }

  private updateUptimeMetrics(monitor: HealthCheck) {
    const history = this.checkHistory.get(monitor.id) || [];
    const now = Date.now();
    
    // Calculate uptime for different periods
    const periods = [
      { name: 'uptime24h', hours: 24 },
      { name: 'uptime7d', hours: 24 * 7 },
      { name: 'uptime30d', hours: 24 * 30 },
    ];

    periods.forEach(period => {
      const cutoffTime = now - (period.hours * 60 * 60 * 1000);
      const recentChecks = history.filter(record => record.timestamp > cutoffTime);
      
      if (recentChecks.length === 0) {
        // If no recent checks, assume 100% uptime
        monitor[period.name as keyof HealthCheck] = 100;
        return;
      }

      const upChecks = recentChecks.filter(record => record.status === 'up').length;
      const uptime = (upChecks / recentChecks.length) * 100;
      monitor[period.name as keyof HealthCheck] = Math.round(uptime * 100) / 100;
    });
  }

  private cleanupOldHistory() {
    const now = Date.now();
    const sevenDaysAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    this.checkHistory.forEach((history, monitorId) => {
      const filteredHistory = history.filter(record => record.timestamp > sevenDaysAgo);
      this.checkHistory.set(monitorId, filteredHistory);
    });
  }

  public getSystemStatus(): SystemStatus {
    const monitors = Array.from(this.monitors.values());
    
    // Calculate overall status
    const downMonitors = monitors.filter(m => m.status === 'down').length;
    const degradedMonitors = monitors.filter(m => m.status === 'degraded').length;
    
    let overall: 'operational' | 'degraded' | 'outage';
    if (downMonitors > 0) {
      overall = 'outage';
    } else if (degradedMonitors > 0) {
      overall = 'degraded';
    } else {
      overall = 'operational';
    }

    // Calculate average uptime
    const avgUptime = monitors.length > 0 
      ? monitors.reduce((sum, m) => sum + m.uptime24h, 0) / monitors.length 
      : 100;

    // Calculate response time percentiles
    const allResponseTimes = monitors
      .filter(m => m.status === 'up')
      .map(m => m.responseTime)
      .sort((a, b) => a - b);

    const calculatePercentile = (values: number[], percentile: number): number => {
      if (values.length === 0) return 0;
      const index = Math.ceil((percentile / 100) * values.length) - 1;
      return values[index] || 0;
    };

    const p50 = calculatePercentile(allResponseTimes, 50);
    const p90 = calculatePercentile(allResponseTimes, 90);
    const p99 = calculatePercentile(allResponseTimes, 99);

    // Count active incidents
    const incidents = monitors.filter(m => m.status === 'down' || m.status === 'degraded').length;

    return {
      overall,
      uptime: {
        current: Math.round(avgUptime * 100) / 100,
        p50,
        p90,
        p99,
      },
      monitors,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0',
      incidents,
    };
  }

  public getMonitorHistory(monitorId: string, hours: number = 24) {
    const history = this.checkHistory.get(monitorId) || [];
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    return history.filter(record => record.timestamp > cutoffTime);
  }

  public getUptimeMetrics() {
    const status = this.getSystemStatus();
    return {
      uptime_ratio: status.uptime.current,
      average_response_time: status.uptime.p50,
      current_status: status.overall,
      total_monitors: status.monitors.length,
      active_incidents: status.incidents,
      last_updated: status.lastUpdated,
    };
  }

  public stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isRunning = false;
    console.log('🛑 Monitoring stopped');
  }

  public restart() {
    this.stop();
    this.startMonitoring();
  }
}

// Create singleton instance
export const realTimeMonitoring = RealTimeMonitoringService.getInstance();

// Export for use in components
export default realTimeMonitoring;
