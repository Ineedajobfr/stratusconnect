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

  // Lazy loading utilities
  createLazyComponent<T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ): React.LazyExoticComponent<T> {
    return React.lazy(importFunc);
  }

  // Image lazy loading
  createLazyImage(src: string, alt: string, className?: string): React.ReactElement {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [isInView, setIsInView] = React.useState(false);
    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={imgRef} className={className}>
        {isInView && (
          <img
            src={src}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        {!isLoaded && isInView && (
          <div className="animate-pulse bg-gray-300 h-48 w-full rounded" />
        )}
      </div>
    );
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

  // API response caching
  async cachedFetch<T>(
    url: string,
    options: RequestInit = {},
    ttl: number = 300000
  ): Promise<T> {
    const cacheKey = `api_${url}_${JSON.stringify(options)}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    const response = await fetch(url, options);
    const data = await response.json();
    const endTime = Date.now();

    this.setCache(cacheKey, data, ttl);
    this.updateApiResponseTime(endTime - startTime);
    
    return data;
  }

  // Performance monitoring
  startPerformanceMonitoring(): void {
    // Monitor page load time
    window.addEventListener('load', () => {
      this.metrics.loadTime = performance.now();
    });

    // Monitor memory usage
    if ('memory' in performance) {
      setInterval(() => {
        this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
      }, 5000);
    }

    // Monitor render performance
    this.observeRenderPerformance();
  }

  private observeRenderPerformance(): void {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') {
          this.metrics.renderTime = entry.duration;
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });
  }

  // Bundle size optimization
  async analyzeBundleSize(): Promise<number> {
    try {
      const response = await fetch('/static/js/bundle.js');
      const blob = await response.blob();
      this.metrics.bundleSize = blob.size;
      return blob.size;
    } catch (error) {
      console.error('Error analyzing bundle size:', error);
      return 0;
    }
  }

  // Database query optimization
  async optimizedQuery<T>(
    queryKey: string,
    queryFunc: () => Promise<T>,
    dependencies: any[] = [],
    ttl: number = 300000
  ): Promise<T> {
    const cacheKey = `${queryKey}_${JSON.stringify(dependencies)}`;
    const cached = this.getCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const startTime = Date.now();
    const result = await queryFunc();
    const endTime = Date.now();

    this.setCache(cacheKey, result, ttl);
    this.updateApiResponseTime(endTime - startTime);
    
    return result;
  }

  // Component memoization
  createMemoizedComponent<T extends React.ComponentType<any>>(
    Component: T,
    areEqual?: (prevProps: any, nextProps: any) => boolean
  ): T {
    return React.memo(Component, areEqual) as T;
  }

  // Virtual scrolling for large lists
  createVirtualList<T>(
    items: T[],
    itemHeight: number,
    containerHeight: number,
    renderItem: (item: T, index: number) => React.ReactElement
  ): React.ReactElement {
    const [scrollTop, setScrollTop] = React.useState(0);
    
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    const visibleItems = items.slice(visibleStart, visibleEnd);
    const totalHeight = items.length * itemHeight;
    const offsetY = visibleStart * itemHeight;

    return (
      <div
        style={{ height: containerHeight, overflow: 'auto' }}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item, index) => 
              renderItem(item, visibleStart + index)
            )}
          </div>
        </div>
      </div>
    );
  }

  // Image optimization
  optimizeImage(
    src: string,
    width?: number,
    height?: number,
    quality: number = 80
  ): string {
    // In a real implementation, this would use an image optimization service
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('q', quality.toString());
    
    return `${src}?${params.toString()}`;
  }

  // Code splitting utilities
  async loadComponent<T>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ): Promise<T> {
    try {
      const module = await importFunc();
      return module.default;
    } catch (error) {
      console.error('Error loading component:', error);
      if (fallback) {
        return fallback as T;
      }
      throw error;
    }
  }

  // Performance metrics
  getMetrics(): PerformanceMetrics {
    this.metrics.cacheHitRate = this.cacheHits / (this.cacheHits + this.cacheMisses) * 100;
    return { ...this.metrics };
  }

  updateApiResponseTime(time: number): void {
    this.metrics.apiResponseTime = time;
  }

  // Cleanup
  destroy(): void {
    this.clearCache();
    this.cacheHits = 0;
    this.cacheMisses = 0;
  }
}

export const performanceService = new PerformanceService();
