import { memo, useCallback, useMemo } from 'react';
import { debounce } from 'lodash-es';

// Debounced search hook for better performance
export const useDebounceCallback = (callback: (...args: unknown[]) => void, delay: number) => {
  return useMemo(() => debounce(callback, delay), [callback, delay]);
};

// Memoized wrapper for expensive components
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  areEqual?: (prevProps: P, nextProps: P) => boolean
) => {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};

// Virtual scrolling for large lists (basic implementation)
export const VirtualList = memo(({ 
  items, 
  renderItem, 
  itemHeight = 50, 
  containerHeight = 400 
}: {
  items: unknown[];
  renderItem: (item: unknown, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
}) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const totalHeight = items.length * itemHeight;
  
  return (
    <div style={{ height: containerHeight, overflow: 'auto' }}>
      <div style={{ height: totalHeight, position: 'relative' }}>
        {items.slice(0, visibleCount + 5).map((item, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              height: itemHeight,
              width: '100%'
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
});

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (
  callback: () => void,
  options?: IntersectionObserverInit
) => {
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback();
      }
    });
  }, [callback]);

  const observer = useMemo(() => {
    if (typeof window !== 'undefined') {
      return new IntersectionObserver(observerCallback, options);
    }
    return null;
  }, [observerCallback, options]);

  return observer;
};