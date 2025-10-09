import { cn } from '@/lib/utils';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface DataWidgetProps {
  metric: string;
  value: string | number;
  trend?: number; // Percentage change
  sparkline?: number[]; // Mini chart data
  realtime?: boolean;
  unit?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const DataWidget: React.FC<DataWidgetProps> = ({
  metric,
  value,
  trend,
  sparkline,
  realtime = false,
  unit = '',
  className,
  icon,
}) => {
  const trendDirection = trend ? (trend > 0 ? 'positive' : trend < 0 ? 'negative' : 'neutral') : 'neutral';
  
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend > 0) return <TrendingUp className="w-4 h-4" />;
    if (trend < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  return (
    <div className={cn('data-widget', className)}>
      <div className="flex items-center justify-between">
        <div className="data-widget-label">
          {metric}
        </div>
        {realtime && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-enterprise-success animate-pulse" />
            <span className="text-xs text-enterprise-success font-mono">LIVE</span>
          </div>
        )}
        {icon && (
          <div className="text-enterprise-primary/60">
            {icon}
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <div className="data-widget-value">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {unit && <span className="text-lg ml-1 text-white/60">{unit}</span>}
        </div>
        {trend !== undefined && (
          <div className={cn('data-widget-trend flex items-center gap-1', trendDirection)}>
            {getTrendIcon()}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      {sparkline && sparkline.length > 0 && (
        <div className="mt-2 h-8 flex items-end gap-px">
          {sparkline.map((point, index) => {
            const maxValue = Math.max(...sparkline);
            const height = (point / maxValue) * 100;
            return (
              <div
                key={index}
                className="flex-1 bg-enterprise-primary/40 rounded-t transition-all hover:bg-enterprise-primary/60"
                style={{ height: `${height}%`, minHeight: '4px' }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

