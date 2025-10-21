import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface OptimizedCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  loading?: boolean;
}

// Optimized card component with memoization to prevent unnecessary re-renders
export const OptimizedCard = memo<OptimizedCardProps>(({
  title,
  children,
  className,
  headerClassName,
  contentClassName,
  loading = false,
}) => {
  if (loading) {
    return (
      <Card className={cn("terminal-card animate-pulse", className)}>
        <CardHeader className={headerClassName}>
          <div className="h-6 bg-muted rounded w-1/3" />
        </CardHeader>
        <CardContent className={contentClassName}>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("terminal-card", className)}>
      {title && (
        <CardHeader className={headerClassName}>
          <CardTitle className="terminal-header">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
});

OptimizedCard.displayName = 'OptimizedCard';
