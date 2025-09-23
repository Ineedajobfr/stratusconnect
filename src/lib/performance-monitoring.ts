// Simplified Performance Monitoring Service
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];

  trackMetric(name: string, value: number, unit: string = 'ms', category: string = 'performance', metadata?: Record<string, any>): void {
    this.metrics.push({
      name,
      value,
      unit,
      timestamp: new Date().toISOString()
    });
  }

  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  startMonitoring(): void {
    // Simple monitoring implementation
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Monitor page load
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as any;
        if (navigation) {
          this.trackMetric('page_load_time', navigation.loadEventEnd - navigation.loadEventStart);
        }
      });
    }
  }
}

export const performanceMonitoringService = new PerformanceMonitoringService();
export default performanceMonitoringService;