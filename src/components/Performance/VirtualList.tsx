// Virtual List Component - Industry Standard Implementation
// FCA Compliant Aviation Platform

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactElement;
  className?: string;
  overscan?: number; // Number of items to render outside visible area
  onScroll?: (scrollTop: number) => void;
  loading?: boolean;
  emptyMessage?: string;
  itemKey?: (item: T, index: number) => string | number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className = '',
  overscan = 5,
  onScroll,
  loading = false,
  emptyMessage = 'No items to display',
  itemKey
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
      key: itemKey ? itemKey(item, visibleRange.start + index) : visibleRange.start + index
    }));
  }, [items, visibleRange, itemKey]);

  // Calculate total height and offset
  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    setIsScrolling(true);

    // Clear existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new timeout to detect scroll end
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);

    // Call external scroll handler
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to specific item
  const scrollToItem = useCallback((index: number) => {
    if (containerRef.current) {
      const targetScrollTop = index * itemHeight;
      containerRef.current.scrollTop = targetScrollTop;
      setScrollTop(targetScrollTop);
    }
  }, [itemHeight]);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollToItem(0);
  }, [scrollToItem]);

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    scrollToItem(items.length - 1);
  }, [scrollToItem, items.length]);

  // Expose scroll methods via ref
  React.useImperativeHandle(containerRef, () => ({
    scrollToItem,
    scrollToTop,
    scrollToBottom,
    scrollTop: scrollTop
  }));

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: containerHeight }}>
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height: containerHeight }}>
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className} ${isScrolling ? 'scroll-smooth' : ''}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0
          }}
        >
          {visibleItems.map(({ item, index, key }) => (
            <div
              key={key}
              style={{ height: itemHeight }}
              className="flex items-center"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for virtual list with data fetching
export function useVirtualList<T>(
  fetchItems: (offset: number, limit: number) => Promise<T[]>,
  itemHeight: number,
  containerHeight: number,
  pageSize: number = 50
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const newItems = await fetchItems(items.length, pageSize);
      setItems(prev => [...prev, ...newItems]);
      setHasMore(newItems.length === pageSize);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [items.length, pageSize, loading, hasMore, fetchItems]);

  const reset = useCallback(() => {
    setItems([]);
    setHasMore(true);
    setError(null);
  }, []);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  };
}

// Infinite scroll virtual list
interface InfiniteVirtualListProps<T> extends Omit<VirtualListProps<T>, 'items'> {
  fetchItems: (offset: number, limit: number) => Promise<T[]>;
  pageSize?: number;
  threshold?: number; // Distance from bottom to trigger load more
}

export function InfiniteVirtualList<T>({
  fetchItems,
  pageSize = 50,
  threshold = 100,
  ...props
}: InfiniteVirtualListProps<T>) {
  const {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    reset
  } = useVirtualList(fetchItems, props.itemHeight, props.containerHeight, pageSize);

  const handleScroll = useCallback((scrollTop: number) => {
    const scrollHeight = items.length * props.itemHeight;
    const scrollBottom = scrollTop + props.containerHeight;
    
    if (scrollBottom >= scrollHeight - threshold && hasMore && !loading) {
      loadMore();
    }
  }, [items.length, props.itemHeight, props.containerHeight, threshold, hasMore, loading, loadMore]);

  useEffect(() => {
    loadMore();
  }, []);

  return (
    <VirtualList
      {...props}
      items={items}
      loading={loading}
      onScroll={handleScroll}
      emptyMessage={error ? `Error: ${error.message}` : props.emptyMessage}
    />
  );
}

// Performance optimized virtual list with memoization
export const MemoizedVirtualList = React.memo(VirtualList) as typeof VirtualList;

// Virtual list with search and filtering
interface SearchableVirtualListProps<T> extends VirtualListProps<T> {
  searchTerm: string;
  searchFields: (keyof T)[];
  onSearchChange: (term: string) => void;
}

export function SearchableVirtualList<T>({
  searchTerm,
  searchFields,
  onSearchChange,
  items,
  ...props
}: SearchableVirtualListProps<T>) {
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    
    return items.filter(item =>
      searchFields.some(field => {
        const value = item[field];
        return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [items, searchTerm, searchFields]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <VirtualList
        {...props}
        items={filteredItems}
        emptyMessage={searchTerm ? 'No items match your search' : props.emptyMessage}
      />
    </div>
  );
}
