// Performance Service - Industry Standard Implementation
// FCA Compliant Aviation Platform

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items
  strategy: 'lru' | 'fifo' | 'ttl'; // Cache eviction strategy
}

export interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  apiResponseTime: number;
  bundleSize: number;
}

class PerformanceService {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private metrics: PerformanceMetrics = {
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    apiResponseTime: 0,
    bundleSize: 0
  };
  private cacheHits = 0;
  private cacheMisses = 0;

  // Cache management
  setCache(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    
    // Clean up expired entries
    this.cleanupCache();
  }

  getCache(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.cacheMisses++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.cacheMisses++;
      return null;
    }

    this.cacheHits++;
    return entry.data;
  }

  clearCache(): void {
    this.cache.clear();
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  // Lazy loading utilities - simplified for TypeScript service
  createLazyComponentConfig<T,>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: string
  ) {
    return {
      importFunc,
      fallback
    };
  }

  // Image lazy loading - returns configuration object instead of JSX
  createLazyImageConfig(src: string, alt: string, className?: string) {
    return {
      src,
      alt,
      className,
      lazy: true
    };
  }

  // Data prefetching
  async prefetchData<T>(
    key: string,
    fetchFunc: () => Promise<T>,
    ttl: number = 300000
  ): Promise<T> {
    const cached = this.getCache(key);
    if (cached) {
      return cached;
    }

    const data = await fetchFunc();
    this.setCache(key, data, ttl);
    return data;
  }

  // Performance monitoring
  startTiming(label: string): void {
    performance.mark(`${label}-start`);
  }

  endTiming(label: string): number {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    const duration = measure.duration;
    
    // Clean up marks and measures
    performance.clearMarks(`${label}-start`);
    performance.clearMarks(`${label}-end`);
    performance.clearMeasures(label);
    
    return duration;
  }

  // Memory usage tracking
  getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  // Cache statistics
  getCacheStats() {
    const total = this.cacheHits + this.cacheMisses;
    return {
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: total > 0 ? this.cacheHits / total : 0,
      size: this.cache.size
    };
  }

  // Performance metrics
  getMetrics(): PerformanceMetrics {
    return {
      ...this.metrics,
      cacheHitRate: this.getCacheStats().hitRate,
      memoryUsage: this.getMemoryUsage()
    };
  }

  // Bundle size estimation
  estimateBundleSize(): number {
    // This is a simplified estimation
    // In a real implementation, you would use webpack-bundle-analyzer or similar
    return 0;
  }

  // API response time tracking
  async trackApiCall<T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> {
    const start = performance.now();
    try {
      const result = await apiCall();
      const duration = performance.now() - start;
      
      // Update metrics
      this.metrics.apiResponseTime = duration;
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.metrics.apiResponseTime = duration;
      throw error;
    }
  }

  // Component memoization - simplified for TypeScript service
  createMemoizedComponentConfig<T>(
    componentName: string,
    areEqual?: (prevProps: any, nextProps: any) => boolean
  ) {
    return {
      componentName,
      areEqual
    };
  }

  // Virtual scrolling for large lists - simplified for TypeScript service
  createVirtualListConfig<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number
  ) {
    const visibleStart = 0;
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    const visibleItems = items.slice(visibleStart, visibleEnd);
    const totalHeight = items.length * itemHeight;
    const offsetY = visibleStart * itemHeight;

    return {
      visibleItems,
      totalHeight,
      offsetY,
      itemHeight,
      containerHeight
    };
  }

  // Debouncing utility
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Throttling utility
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Resource preloading
  preloadResource(url: string, type: 'script' | 'style' | 'image' | 'font'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    
    switch (type) {
      case 'script':
        link.as = 'script';
        break;
      case 'style':
        link.as = 'style';
        break;
      case 'image':
        link.as = 'image';
        break;
      case 'font':
        link.as = 'font';
        link.crossOrigin = 'anonymous';
        break;
    }
    
    document.head.appendChild(link);
  }

  // Critical resource prioritization
  prioritizeResource(url: string, priority: 'high' | 'low'): void {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.setAttribute('fetchpriority', priority);
    document.head.appendChild(link);
  }

  // Performance budget monitoring
  checkPerformanceBudget(): boolean {
    const metrics = this.getMetrics();
    
    // Define performance budgets
    const budgets = {
      loadTime: 3000, // 3 seconds
      renderTime: 100, // 100ms
      memoryUsage: 50 * 1024 * 1024, // 50MB
      apiResponseTime: 1000 // 1 second
    };
    
    return (
      metrics.loadTime <= budgets.loadTime &&
      metrics.renderTime <= budgets.renderTime &&
      metrics.memoryUsage <= budgets.memoryUsage &&
      metrics.apiResponseTime <= budgets.apiResponseTime
    );
  }

  // Performance reporting
  generatePerformanceReport(): string {
    const metrics = this.getMetrics();
    const cacheStats = this.getCacheStats();
    const budgetCheck = this.checkPerformanceBudget();
    
    return JSON.stringify({
      metrics,
      cacheStats,
      budgetCheck,
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  // Cleanup
  cleanup(): void {
    this.clearCache();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Export singleton instance
export const performanceService = new PerformanceService();
export default performanceService;
