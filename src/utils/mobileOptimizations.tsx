import React from 'react';
import { cn } from '@/lib/utils';

// Mobile-optimized spacing utilities
export const MobileSpacing = {
  page: "p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-6",
  section: "space-y-2 sm:space-y-3 md:space-y-4", 
  card: "p-3 sm:p-4 md:p-6",
  header: "px-3 sm:px-4 md:px-6 py-2 sm:py-3",
  compact: "p-2 sm:p-3 space-y-2 sm:space-y-3",
  button: "px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3"
};

// Mobile-responsive grid classes
export const ResponsiveGrid = {
  cards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6",
  twoCol: "grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6",
  threeCol: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6",
  fourCol: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4",
  sidebar: "grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6",
  dashboard: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
};

// Mobile-optimized typography
export const ResponsiveText = {
  hero: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold",
  title: "text-lg sm:text-xl md:text-2xl font-bold",
  subtitle: "text-base sm:text-lg md:text-xl font-semibold",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm",
  tiny: "text-xs",
  muted: "text-xs sm:text-sm text-muted-foreground"
};

// Mobile navigation wrapper
export const MobileNav = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide", className)}>
    {children}
  </div>
);

// Mobile-friendly button sizing
export const MobileButton = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm",
  md: "h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base",
  lg: "h-10 px-4 text-sm sm:h-11 sm:px-6 sm:text-base",
  xl: "h-11 px-6 text-base sm:h-12 sm:px-8 sm:text-lg"
};

// Mobile container with proper overflow handling
export const MobileContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full max-w-full overflow-hidden", className)}>
    {children}
  </div>
);

// Mobile-optimized table wrapper
export const MobileTable = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full overflow-x-auto scrollbar-hide", className)}>
    <div className="min-w-full">
      {children}
    </div>
  </div>
);

// Mobile-responsive flex utilities
export const MobileFlex = {
  stack: "flex flex-col space-y-2 sm:space-y-3",
  row: "flex flex-col sm:flex-row gap-2 sm:gap-4",
  center: "flex items-center justify-center",
  between: "flex items-center justify-between",
  wrap: "flex flex-wrap gap-2 sm:gap-3"
};

// Mobile breakpoint utilities
export const useIsMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 640;
};

export const useIsTablet = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= 640 && window.innerWidth < 1024;
};

export const useIsDesktop = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 1024;
};