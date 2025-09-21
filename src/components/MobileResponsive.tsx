import React from 'react';
import { cn } from '@/lib/utils';

// Mobile-first responsive wrapper component
interface MobileResponsiveProps {
  children: React.ReactNode;
  className?: string;
  layout?: 'page' | 'section' | 'card' | 'terminal';
}

export const MobileResponsive: React.FC<MobileResponsiveProps> = ({ 
  children, 
  className = "",
  layout = 'section'
}) => {
  const layoutClasses = {
    page: "min-h-screen w-full overflow-x-hidden bg-app",
    section: "w-full max-w-full space-y-3 sm:space-y-4 md:space-y-6",
    card: "w-full max-w-full p-3 sm:p-4 md:p-6",
    terminal: "w-full max-w-full min-h-screen bg-app overflow-x-hidden"
  };

  return (
    <div className={cn(layoutClasses[layout], className)}>
      {children}
    </div>
  );
};

// Mobile-optimized grid component
export const MobileGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  className?: string;
}> = ({ children, columns = 3, className = "" }) => {
  const gridClasses = {
    1: "grid grid-cols-1 gap-3 sm:gap-4 md:gap-6",
    2: "grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6", 
    3: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6",
    4: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4",
    5: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3",
    6: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3"
  };

  return (
    <div className={cn(gridClasses[columns as keyof typeof gridClasses] || gridClasses[3], className)}>
      {children}
    </div>
  );
};

// Mobile text sizing component
export const MobileText: React.FC<{
  children: React.ReactNode;
  size?: 'hero' | 'title' | 'subtitle' | 'body' | 'small' | 'tiny';
  className?: string;
}> = ({ children, size = 'body', className = "" }) => {
  const sizeClasses = {
    hero: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
    title: "text-lg sm:text-xl md:text-2xl font-bold",
    subtitle: "text-base sm:text-lg md:text-xl font-semibold",
    body: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
    tiny: "text-xs"
  };

  return (
    <div className={cn(sizeClasses[size], className)}>
      {children}
    </div>
  );
};

// Mobile button sizing
export const MobileButton: React.FC<{
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
}> = ({ children, size = 'md', className = "", onClick, disabled, variant = 'default' }) => {
  const sizeClasses = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm",
    md: "h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base",
    lg: "h-10 px-4 text-sm sm:h-11 sm:px-6 sm:text-base",
    xl: "h-11 px-6 text-base sm:h-12 sm:px-8 sm:text-lg"
  };

  return (
    <button 
      className={cn("rounded-lg font-medium transition-all", sizeClasses[size], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Mobile scrollable container
export const MobileScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical' | 'both';
}> = ({ children, className = "", direction = 'vertical' }) => {
  const scrollClasses = {
    horizontal: "overflow-x-auto overflow-y-hidden scrollbar-hide",
    vertical: "overflow-y-auto overflow-x-hidden scrollbar-hide",
    both: "overflow-auto scrollbar-hide"
  };

  return (
    <div className={cn("w-full", scrollClasses[direction], className)}>
      {children}
    </div>
  );
};

// Mobile stack layout
export const MobileStack: React.FC<{
  children: React.ReactNode;
  spacing?: 'tight' | 'normal' | 'loose';
  className?: string;
}> = ({ children, spacing = 'normal', className = "" }) => {
  const spacingClasses = {
    tight: "space-y-1 sm:space-y-2",
    normal: "space-y-2 sm:space-y-3 md:space-y-4",
    loose: "space-y-4 sm:space-y-6 md:space-y-8"
  };

  return (
    <div className={cn("flex flex-col", spacingClasses[spacing], className)}>
      {children}
    </div>
  );
};