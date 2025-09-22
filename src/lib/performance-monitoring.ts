// Performance Monitoring and Analytics System
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: 'performance' | 'user' | 'ai' | 'error';
  metadata?: Record<string, any>;
}

export interface UserAnalytics {
  userId: string;
  userType: string;
  sessionId: string;
  pageViews: number;
  timeSpent: number;
  actions: UserAction[];
  deviceInfo: DeviceInfo;
  timestamp: Date;
}

export interface UserAction {
  id: string;
  type: string;
  component: string;
  duration?: number;
  success: boolean;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface DeviceInfo {
  userAgent: string;
  screenResolution: string;
  viewport: string;
  isMobile: boolean;
  browser: string;
  os: string;
}

export interface AIAnalytics {
  queryId: string;
  userType: string;
  query: string;
  responseTime: number;
  confidence: number;
  category: string;
  success: boolean;
  timestamp: Date;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private userAnalytics: UserAnalytics[] = [];
  private aiAnalytics: AIAnalytics[] = [];
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializePerformanceObserver();
    this.trackPageLoad();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializePerformanceObserver(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            this.trackMetric('page_load_time', entry.duration, 'ms', 'performance');
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });

      // Observe resource timing
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            this.trackMetric('resource_load_time', entry.duration, 'ms', 'performance', {
              name: entry.name,
              type: entry.initiatorType
            });
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });

      // Observe long tasks
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackMetric('long_task', entry.duration, 'ms', 'performance', {
            name: entry.name
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    }
  }

  private trackPageLoad(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        this.trackMetric('page_load_complete', loadTime, 'ms', 'performance');
      });
    }
  }

  // Track custom metrics
  trackMetric(
    name: string, 
    value: number, 
    unit: string, 
    category: PerformanceMetric['category'],
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      value,
      unit,
      timestamp: new Date(),
      category,
      metadata
    };

    this.metrics.push(metric);
    this.sendMetric(metric);
  }

  // Track user actions
  trackUserAction(
    type: string,
    component: string,
    duration?: number,
    success: boolean = true,
    metadata?: Record<string, any>
  ): void {
    const action: UserAction = {
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      component,
      duration,
      success,
      metadata,
      timestamp: new Date()
    };

    // Update current user analytics
    const currentAnalytics = this.getCurrentUserAnalytics();
    if (currentAnalytics) {
      currentAnalytics.actions.push(action);
    }

    this.sendUserAction(action);
  }

  // Track AI interactions
  trackAIInteraction(
    query: string,
    responseTime: number,
    confidence: number,
    category: string,
    success: boolean = true
  ): void {
    const aiAnalytic: AIAnalytics = {
      queryId: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userType: this.getUserType(),
      query,
      responseTime,
      confidence,
      category,
      success,
      timestamp: new Date()
    };

    this.aiAnalytics.push(aiAnalytic);
    this.sendAIAnalytic(aiAnalytic);
  }

  // Set user context
  setUser(userId: string, userType: string): void {
    this.userId = userId;
    this.createUserAnalytics(userType);
  }

  private createUserAnalytics(userType: string): void {
    const analytics: UserAnalytics = {
      userId: this.userId!,
      userType,
      sessionId: this.sessionId,
      pageViews: 1,
      timeSpent: 0,
      actions: [],
      deviceInfo: this.getDeviceInfo(),
      timestamp: new Date()
    };

    this.userAnalytics.push(analytics);
  }

  private getCurrentUserAnalytics(): UserAnalytics | undefined {
    return this.userAnalytics.find(a => a.userId === this.userId);
  }

  private getUserType(): string {
    const current = this.getCurrentUserAnalytics();
    return current?.userType || 'unknown';
  }

  private getDeviceInfo(): DeviceInfo {
    if (typeof window === 'undefined') {
      return {
        userAgent: 'unknown',
        screenResolution: 'unknown',
        viewport: 'unknown',
        isMobile: false,
        browser: 'unknown',
        os: 'unknown'
      };
    }

    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    return {
      userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isMobile,
      browser: this.getBrowserName(userAgent),
      os: this.getOSName(userAgent)
    };
  }

  private getBrowserName(userAgent: string): string {
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  }

  private getOSName(userAgent: string): string {
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Send data to analytics service
  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      // In production, send to your analytics service
      console.log('Performance Metric:', metric);
      
      // Example: Send to Supabase
      // await supabase.from('performance_metrics').insert(metric);
    } catch (error) {
      console.error('Error sending metric:', error);
    }
  }

  private async sendUserAction(action: UserAction): Promise<void> {
    try {
      console.log('User Action:', action);
      
      // Example: Send to Supabase
      // await supabase.from('user_actions').insert(action);
    } catch (error) {
      console.error('Error sending user action:', error);
    }
  }

  private async sendAIAnalytic(analytic: AIAnalytics): Promise<void> {
    try {
      console.log('AI Analytic:', analytic);
      
      // Example: Send to Supabase
      // await supabase.from('ai_analytics').insert(analytic);
    } catch (error) {
      console.error('Error sending AI analytic:', error);
    }
  }

  // Get performance summary
  getPerformanceSummary(): {
    totalMetrics: number;
    averageResponseTime: number;
    errorRate: number;
    topSlowQueries: PerformanceMetric[];
  } {
    const performanceMetrics = this.metrics.filter(m => m.category === 'performance');
    const responseTimes = performanceMetrics
      .filter(m => m.name.includes('response') || m.name.includes('load'))
      .map(m => m.value);

    const averageResponseTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0;

    const errorRate = this.metrics.filter(m => m.name.includes('error')).length / this.metrics.length;

    const topSlowQueries = performanceMetrics
      .filter(m => m.name.includes('ai') || m.name.includes('query'))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    return {
      totalMetrics: this.metrics.length,
      averageResponseTime,
      errorRate,
      topSlowQueries
    };
  }

  // Get user analytics summary
  getUserAnalyticsSummary(): {
    totalUsers: number;
    averageSessionTime: number;
    mostActiveUserType: string;
    topActions: string[];
  } {
    const totalUsers = this.userAnalytics.length;
    const averageSessionTime = this.userAnalytics.reduce((sum, user) => sum + user.timeSpent, 0) / totalUsers;
    
    const userTypes = this.userAnalytics.map(u => u.userType);
    const mostActiveUserType = userTypes.reduce((a, b, i, arr) => 
      arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
    );

    const allActions = this.userAnalytics.flatMap(u => u.actions.map(a => a.type));
    const actionCounts = allActions.reduce((acc, action) => {
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);

    return {
      totalUsers,
      averageSessionTime,
      mostActiveUserType,
      topActions
    };
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  return {
    trackMetric: performanceMonitor.trackMetric.bind(performanceMonitor),
    trackUserAction: performanceMonitor.trackUserAction.bind(performanceMonitor),
    trackAIInteraction: performanceMonitor.trackAIInteraction.bind(performanceMonitor),
    setUser: performanceMonitor.setUser.bind(performanceMonitor),
    getPerformanceSummary: performanceMonitor.getPerformanceSummary.bind(performanceMonitor),
    getUserAnalyticsSummary: performanceMonitor.getUserAnalyticsSummary.bind(performanceMonitor)
  };
}
