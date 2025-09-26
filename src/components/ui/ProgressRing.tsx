import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
  label?: string;
  color?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  className,
  showValue = true,
  label,
  color = 'terminal-accent'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(Math.max(value, 0), max);
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / max) * circumference;

  const getColorClass = (color: string) => {
    switch (color) {
      case 'terminal-accent': return 'text-terminal-accent';
      case 'green': return 'text-green-500';
      case 'red': return 'text-red-500';
      case 'yellow': return 'text-yellow-500';
      case 'blue': return 'text-blue-500';
      default: return 'text-terminal-accent';
    }
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-terminal-muted/20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn('transition-all duration-500 ease-in-out', getColorClass(color))}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold text-terminal-fg">
            {Math.round((progress / max) * 100)}%
          </span>
        )}
        {label && (
          <span className="text-xs text-terminal-muted mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
