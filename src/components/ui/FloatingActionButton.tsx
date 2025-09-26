import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, X } from 'lucide-react';

interface FloatingActionButtonProps {
  icon?: React.ReactNode;
  label?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon = <Plus className="h-5 w-5" />,
  label,
  position = 'bottom-right',
  size = 'md',
  color = 'primary',
  onClick,
  children,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14'
  };

  const colorClasses = {
    primary: 'bg-terminal-accent hover:bg-terminal-accent/90 text-terminal-bg',
    secondary: 'bg-terminal-muted hover:bg-terminal-muted/80 text-terminal-fg',
    accent: 'bg-terminal-accent hover:bg-terminal-accent/90 text-terminal-bg',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    error: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const handleClick = () => {
    if (children) {
      setIsExpanded(!isExpanded);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={cn('fixed z-50', positionClasses[position], className)}>
      {/* Expanded menu */}
      {children && isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 space-y-2">
          <div className="bg-terminal-bg border border-terminal-border rounded-lg shadow-lg p-2 min-w-48">
            {children}
          </div>
        </div>
      )}

      {/* Main button */}
      <Button
        onClick={handleClick}
        className={cn(
          'rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out',
          'transform hover:scale-110 active:scale-95',
          sizeClasses[size],
          colorClasses[color],
          isExpanded && 'rotate-45'
        )}
      >
        {isExpanded ? <X className="h-5 w-5" /> : icon}
        {label && (
          <span className="ml-2 text-sm font-medium">
            {label}
          </span>
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;
