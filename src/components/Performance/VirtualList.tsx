import React, { useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  overscan?: number;
  loading?: boolean;
  onEndReached?: () => void;
  endReachedThreshold?: number;
}

const VirtualList = <T,>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  loading = false,
  onEndReached,
  endReachedThreshold = 0.8
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const currentScrollTop = e.currentTarget.scrollTop;
    setScrollTop(currentScrollTop);

    // Check if we should trigger onEndReached
    if (onEndReached && endReachedThreshold) {
      const scrollRatio = (currentScrollTop + containerHeight) / totalHeight;
      if (scrollRatio >= endReachedThreshold) {
        onEndReached();
      }
    }
  }, [containerHeight, totalHeight, onEndReached, endReachedThreshold]);

  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      const scrollPosition = index * itemHeight;
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [itemHeight]);

  const scrollToTop = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, []);

  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = totalHeight;
    }
  }, [totalHeight]);

  // Loading skeleton
  if (loading && items.length === 0) {
    return (
      <div className={`space-y-2 ${className}`} style={{ height: containerHeight }}>
        {Array.from({ length: Math.ceil(containerHeight / itemHeight) }).map((_, index) => (
          <Skeleton key={index} className="w-full" style={{ height: itemHeight }} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{
                height: itemHeight,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
      
      {loading && items.length > 0 && (
        <div className="flex justify-center p-4">
          <Skeleton className="h-4 w-32" />
        </div>
      )}
    </div>
  );
};

// Hook for managing virtual list state
export const useVirtualList = <T,>(
  items: T[],
  options: {
    itemHeight: number;
    containerHeight: number;
    overscan?: number;
  }
) => {
  const [scrollTop, setScrollTop] = useState(0);
  
  const startIndex = Math.max(0, Math.floor(scrollTop / options.itemHeight) - (options.overscan || 5));
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + options.containerHeight) / options.itemHeight) + (options.overscan || 5)
  );

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * options.itemHeight;
  const offsetY = startIndex * options.itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop
  };
};

export default VirtualList;
