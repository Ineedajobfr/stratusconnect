// FREE Monitoring System - No external services, no costs
// Uses browser APIs and localStorage for zero-cost monitoring

export interface FreeMetrics {
  uptime: number;
  responseTime: number;
  activeUsers: number;
  transactions: number;
  lastUpdated: string;
}

export interface FreeHealthCheck {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  responseTime: number;
  error?: string;
}

class FreeMonitoringSystem {
  private static instance: FreeMonitoringSystem;
  private metrics: FreeMetrics = {
    uptime: 100,
    responseTime: 0,
    activeUsers: 0,
    transactions: 0,
    lastUpdated: new Date().toISOString(),
  };
  private healthChecks: FreeHealthCheck[] = [];
  private startTime = Date.now();
  private isRunning = false;

  static getInstance(): FreeMonitoringSystem {
    if (!FreeMonitoringSystem.instance) {
      FreeMonitoringSystem.instance = new FreeMonitoringSystem();
    }
    return FreeMonitoringSystem.instance;
  }

  /**
   * Start free monitoring (no external services)
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startHealthChecks();
    this.startMetricsCollection();
    this.loadStoredData();
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.isRunning = false;
  }

  /**
   * Start health checks using browser APIs
   */
  private startHealthChecks(): void {
    setInterval(async () => {
      if (!this.isRunning) return;

      const startTime = performance.now();
      let status: 'healthy' | 'degraded' | 'down' = 'healthy';
      let error: string | undefined;

      try {
        // Check if the app is responsive
        const isResponsive = this.checkAppResponsiveness();
        
        if (!isResponsive) {
          status = 'degraded';
          error = 'App not responsive';
        }

        // Check localStorage availability
        const storageAvailable = this.checkStorageAvailability();
        if (!storageAvailable) {
          status = 'degraded';
          error = 'Storage not available';
        }

        // Check network connectivity
        const networkStatus = await this.checkNetworkStatus();
        if (!networkStatus) {
          status = 'down';
          error = 'Network connectivity issues';
        }

      } catch (err) {
        status = 'down';
        error = err instanceof Error ? err.message : 'Unknown error';
      }

      const responseTime = performance.now() - startTime;
      
      const healthCheck: FreeHealthCheck = {
        status,
        timestamp: new Date().toISOString(),
        responseTime,
        error,
      };

      this.healthChecks.push(healthCheck);
      
      // Keep only last 100 health checks
      if (this.healthChecks.length > 100) {
        this.healthChecks = this.healthChecks.slice(-100);
      }

      this.updateMetrics();
      this.persistData();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      if (!this.isRunning) return;

      this.updateMetrics();
      this.persistData();
    }, 60000); // Update every minute
  }

  /**
   * Check if app is responsive
   */
  private checkAppResponsiveness(): boolean {
    try {
      // Simple responsiveness check
      const start = performance.now();
      const result = document.querySelector('body') !== null;
      const end = performance.now();
      
      // If DOM query takes more than 100ms, consider it unresponsive
      return result && (end - start) < 100;
    } catch {
      return false;
    }
  }

  /**
   * Check storage availability
   */
  private checkStorageAvailability(): boolean {
    try {
      const testKey = 'monitoring_test';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check network status
   */
  private async checkNetworkStatus(): Promise<boolean> {
    try {
      // Use navigator.onLine as a basic network check
      if (!navigator.onLine) {
        return false;
      }

      // Try to fetch a small resource to verify connectivity
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Update metrics based on health checks
   */
  private updateMetrics(): void {
    const now = Date.now();
    const uptimeMs = now - this.startTime;
    const uptimeHours = uptimeMs / (1000 * 60 * 60);
    
    // Calculate uptime percentage based on health checks
    const recentHealthChecks = this.healthChecks.filter(
      check => new Date(check.timestamp).getTime() > (now - 24 * 60 * 60 * 1000)
    );
    
    const healthyChecks = recentHealthChecks.filter(check => check.status === 'healthy');
    const uptimePercentage = recentHealthChecks.length > 0 
      ? (healthyChecks.length / recentHealthChecks.length) * 100
      : 100;

    // Calculate average response time
    const avgResponseTime = recentHealthChecks.length > 0
      ? recentHealthChecks.reduce((sum, check) => sum + check.responseTime, 0) / recentHealthChecks.length
      : 0;

    // Estimate active users from localStorage activity
    const activeUsers = this.estimateActiveUsers();
    
    // Count transactions from localStorage
    const transactions = this.countTransactions();

    this.metrics = {
      uptime: Math.round(uptimePercentage * 100) / 100,
      responseTime: Math.round(avgResponseTime * 100) / 100,
      activeUsers,
      transactions,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Estimate active users from localStorage activity
   */
  private estimateActiveUsers(): number {
    try {
      const userActivity = JSON.parse(localStorage.getItem('user_activity') || '[]');
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      const recentUsers = userActivity.filter((activity: any) => 
        new Date(activity.timestamp).getTime() > oneDayAgo
      );
      
      const uniqueUsers = new Set(recentUsers.map((activity: any) => activity.userId));
      return uniqueUsers.size;
    } catch {
      return 0;
    }
  }

  /**
   * Count transactions from localStorage
   */
  private countTransactions(): number {
    try {
      const cryptoIntents = JSON.parse(localStorage.getItem('free_payment_intents') || '[]');
      const p2pIntents = JSON.parse(localStorage.getItem('p2p_payment_intents') || '[]');
      const manualIntents = JSON.parse(localStorage.getItem('manual_escrow_intents') || '[]');
      
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);
      
      const recentTransactions = [
        ...cryptoIntents,
        ...p2pIntents,
        ...manualIntents,
      ].filter((intent: any) => 
        new Date(intent.createdAt).getTime() > oneDayAgo
      );
      
      return recentTransactions.length;
    } catch {
      return 0;
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): FreeMetrics {
    return { ...this.metrics };
  }

  /**
   * Get health status
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'down';
    uptime: number;
    responseTime: number;
    lastCheck: string;
  } {
    const latestCheck = this.healthChecks[this.healthChecks.length - 1];
    
    return {
      status: latestCheck?.status || 'healthy',
      uptime: this.metrics.uptime,
      responseTime: this.metrics.responseTime,
      lastCheck: latestCheck?.timestamp || new Date().toISOString(),
    };
  }

  /**
   * Get detailed health history
   */
  getHealthHistory(limit: number = 50): FreeHealthCheck[] {
    return this.healthChecks.slice(-limit);
  }

  /**
   * Persist data to localStorage (free storage)
   */
  private persistData(): void {
    try {
      localStorage.setItem('monitoring_metrics', JSON.stringify(this.metrics));
      localStorage.setItem('monitoring_health_checks', JSON.stringify(this.healthChecks.slice(-50)));
    } catch (error) {
      console.warn('Failed to persist monitoring data:', error);
    }
  }

  /**
   * Load stored data from localStorage
   */
  private loadStoredData(): void {
    try {
      const storedMetrics = localStorage.getItem('monitoring_metrics');
      if (storedMetrics) {
        this.metrics = { ...this.metrics, ...JSON.parse(storedMetrics) };
      }

      const storedHealthChecks = localStorage.getItem('monitoring_health_checks');
      if (storedHealthChecks) {
        this.healthChecks = JSON.parse(storedHealthChecks);
      }
    } catch (error) {
      console.warn('Failed to load stored monitoring data:', error);
    }
  }

  /**
   * Track user activity (free analytics)
   */
  trackUserActivity(userId: string, action: string): void {
    try {
      const activity = {
        userId,
        action,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      const existingActivity = JSON.parse(localStorage.getItem('user_activity') || '[]');
      existingActivity.push(activity);
      
      // Keep only last 1000 activities
      const recentActivity = existingActivity.slice(-1000);
      localStorage.setItem('user_activity', JSON.stringify(recentActivity));
    } catch (error) {
      console.warn('Failed to track user activity:', error);
    }
  }

  /**
   * Get system status for /status endpoint
   */
  getSystemStatus(): {
    status: string;
    uptime: number;
    responseTime: number;
    activeUsers: number;
    transactions: number;
    timestamp: string;
    version: string;
  } {
    const health = this.getHealthStatus();
    
    return {
      status: health.status,
      uptime: health.uptime,
      responseTime: health.responseTime,
      activeUsers: this.metrics.activeUsers,
      transactions: this.metrics.transactions,
      timestamp: this.metrics.lastUpdated,
      version: '1.0.0',
    };
  }
}

// Free analytics system
export class FreeAnalytics {
  private static instance: FreeAnalytics;

  static getInstance(): FreeAnalytics {
    if (!FreeAnalytics.instance) {
      FreeAnalytics.instance = new FreeAnalytics();
    }
    return FreeAnalytics.instance;
  }

  /**
   * Track page view (free analytics)
   */
  trackPageView(page: string): void {
    try {
      const pageView = {
        page,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
        url: window.location.href,
      };

      const existingViews = JSON.parse(localStorage.getItem('page_views') || '[]');
      existingViews.push(pageView);
      
      // Keep only last 1000 page views
      const recentViews = existingViews.slice(-1000);
      localStorage.setItem('page_views', JSON.stringify(recentViews));
    } catch (error) {
      console.warn('Failed to track page view:', error);
    }
  }

  /**
   * Track custom event (free analytics)
   */
  trackEvent(event: string, properties: Record<string, any> = {}): void {
    try {
      const eventData = {
        event,
        properties,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      const existingEvents = JSON.parse(localStorage.getItem('custom_events') || '[]');
      existingEvents.push(eventData);
      
      // Keep only last 1000 events
      const recentEvents = existingEvents.slice(-1000);
      localStorage.setItem('custom_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to track event:', error);
    }
  }

  /**
   * Get analytics data
   */
  getAnalyticsData(): {
    pageViews: any[];
    customEvents: any[];
    uniqueVisitors: number;
  } {
    try {
      const pageViews = JSON.parse(localStorage.getItem('page_views') || '[]');
      const customEvents = JSON.parse(localStorage.getItem('custom_events') || '[]');
      
      // Calculate unique visitors from page views
      const uniqueVisitors = new Set(
        pageViews.map((view: any) => view.userAgent).filter(Boolean)
      ).size;

      return {
        pageViews: pageViews.slice(-100), // Last 100 page views
        customEvents: customEvents.slice(-100), // Last 100 events
        uniqueVisitors,
      };
    } catch {
      return {
        pageViews: [],
        customEvents: [],
        uniqueVisitors: 0,
      };
    }
  }
}

// Create singleton instances
export const freeMonitoring = FreeMonitoringSystem.getInstance();
export const freeAnalytics = FreeAnalytics.getInstance();

// Initialize monitoring on import
freeMonitoring.start();
