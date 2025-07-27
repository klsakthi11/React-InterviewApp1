import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';

// Type declarations for production environment
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    __NODE_ENV__?: string;
    __REACT_APP_ANALYTICS_ENDPOINT__?: string;
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      REACT_APP_ANALYTICS_ENDPOINT?: string;
    }
  }
  var process:
    | {
        env?: {
          NODE_ENV?: string;
          REACT_APP_ANALYTICS_ENDPOINT?: string;
        };
      }
    | undefined;
}

// Production-ready Performance Monitor
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Set<(metric: string, value: number) => void> = new Set();
  private isProduction: boolean;
  private samplingRate: number; // Only collect X% of metrics in production
  private maxMetricsPerType: number; // Prevent memory leaks

  private constructor() {
    // Check for production environment - handle both Node.js and browser environments
    this.isProduction =
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.NODE_ENV === 'production') ||
      (typeof window !== 'undefined' &&
        (window as any).__NODE_ENV__ === 'production') ||
      false;
    this.samplingRate = this.isProduction ? 0.1 : 1; // 10% sampling in production
    this.maxMetricsPerType = 1000; // Keep only last 1000 metrics per type
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string): () => void {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    };
  }

  recordMetric(name: string, value: number): void {
    // Apply sampling in production
    if (this.isProduction && Math.random() > this.samplingRate) {
      return;
    }

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const metricArray = this.metrics.get(name)!;
    metricArray.push(value);

    // Prevent memory leaks by limiting stored metrics
    if (metricArray.length > this.maxMetricsPerType) {
      metricArray.splice(0, metricArray.length - this.maxMetricsPerType);
    }

    // Notify observers
    this.observers.forEach(observer => {
      try {
        observer(name, value);
      } catch (error) {
        // Don't let observer errors break the monitor
        console.warn('PerformanceMonitor observer error:', error);
      }
    });

    // Send to analytics in production
    if (this.isProduction) {
      this.sendToAnalytics(name, value);
    }
  }

  getMetrics(name?: string): number[] | Map<string, number[]> {
    if (name) {
      return this.metrics.get(name) || [];
    }
    return this.metrics;
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getPercentileMetric(name: string, percentile: number): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.max(0, index)];
  }

  clearMetrics(name?: string): void {
    if (name) {
      this.metrics.delete(name);
    } else {
      this.metrics.clear();
    }
  }

  subscribe(observer: (metric: string, value: number) => void): () => void {
    this.observers.add(observer);
    return () => {
      this.observers.delete(observer);
    };
  }

  // Production analytics integration
  private sendToAnalytics(name: string, value: number): void {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: name,
        value: Math.round(value),
        timestamp: Date.now(),
        page: window.location.pathname,
      });
    }

    // Custom analytics endpoint
    const analyticsEndpoint =
      (typeof process !== 'undefined' &&
        process.env &&
        process.env.REACT_APP_ANALYTICS_ENDPOINT) ||
      (typeof window !== 'undefined' &&
        (window as any).__REACT_APP_ANALYTICS_ENDPOINT__);

    if (typeof window !== 'undefined' && analyticsEndpoint) {
      fetch(analyticsEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metric: name,
          value: Math.round(value),
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silently fail - don't break the app
      });
    }

    // Performance API (if supported)
    if ('performance' in window && 'mark' in performance) {
      performance.mark(`${name}-${Date.now()}`);
    }
  }

  // Get performance summary for reporting
  getPerformanceSummary(): Record<string, any> {
    const summary: Record<string, any> = {};

    this.metrics.forEach((values, name) => {
      const sorted = [...values].sort((a, b) => a - b);
      summary[name] = {
        count: values.length,
        average: this.getAverageMetric(name),
        min: sorted[0],
        max: sorted[sorted.length - 1],
        p50: this.getPercentileMetric(name, 50),
        p95: this.getPercentileMetric(name, 95),
        p99: this.getPercentileMetric(name, 99),
      };
    });

    return summary;
  }
}

// React performance hooks
export const usePerformanceTimer = (name: string) => {
  const monitor = PerformanceMonitor.getInstance();
  const startTime = useRef<number>(0);

  const start = useCallback(() => {
    startTime.current = performance.now();
  }, []);

  const end = useCallback(() => {
    const duration = performance.now() - startTime.current;
    monitor.recordMetric(name, duration);
    return duration;
  }, [name, monitor]);

  return { start, end };
};

export const usePerformanceObserver = (
  callback: (metric: string, value: number) => void
) => {
  useEffect(() => {
    const monitor = PerformanceMonitor.getInstance();
    const unsubscribe = monitor.subscribe(callback);
    return unsubscribe;
  }, [callback]);
};

// Memoization utilities
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Lazy loading utilities
// Lazy loading utility (simplified for TypeScript)
export const lazyLoad = (importFn: any) => {
  return React.lazy(importFn);
};

// Virtual scrolling utilities
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export const useVirtualScroll = <T>(
  items: T[],
  config: VirtualScrollConfig
) => {
  const { itemHeight, containerHeight, overscan = 5 } = config;
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange,
  };
};

// Debounce utility
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle utility
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef<number>(0);
  const timeoutRef = useRef<any>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRun.current = Date.now();
          },
          delay - (now - lastRun.current)
        );
      }
    },
    [callback, delay]
  ) as T;
};

// Intersection Observer hook
export const useIntersectionObserver = (
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return { isIntersecting, entry };
};

// Resize Observer hook
export const useResizeObserver = (ref: React.RefObject<Element>) => {
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref]);

  return dimensions;
};

// Image lazy loading hook
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setError(false);
    };

    img.onerror = () => {
      setError(true);
      setIsLoaded(false);
    };

    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageSrc, isLoaded, error };
};

// Code splitting utilities
// Async component utility (simplified for TypeScript)
export const createAsyncComponent = (importFn: any) => {
  return React.lazy(importFn);
};

// Bundle size monitoring
export const useBundleSize = () => {
  const [bundleSize, setBundleSize] = useState<number | null>(null);

  useEffect(() => {
    // This would typically be done at build time
    // For now, we'll simulate it
    const estimateBundleSize = () => {
      // Simulate bundle size calculation
      return Math.random() * 1000 + 500; // 500-1500 KB
    };

    setBundleSize(estimateBundleSize());
  }, []);

  return bundleSize;
};

// Memory usage monitoring
export const useMemoryUsage = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};
