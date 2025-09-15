import React from 'react';
import { cn } from '@/lib/utils';

// Mobile-optimized spacing utilities
export const MobileSpacing = {
  page: "p-4 sm:p-6 space-y-4 sm:space-y-6",
  section: "space-y-3 sm:space-y-4", 
  card: "p-3 sm:p-4",
  header: "px-4 sm:px-6 py-3"
};

// Mobile-responsive grid classes
export const ResponsiveGrid = {
  cards: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
  twoCol: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6",
  threeCol: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4",
  sidebar: "grid grid-cols-1 lg:grid-cols-3 gap-6"
};

// Mobile-optimized typography
export const ResponsiveText = {
  title: "text-lg sm:text-xl lg:text-2xl font-bold truncate",
  subtitle: "text-sm sm:text-base text-muted",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm"
};

// Mobile navigation wrapper
export const MobileNav = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("flex items-center justify-between gap-2 overflow-x-auto pb-2", className)}>
    {children}
  </div>
);

// Mobile-friendly button sizing
export const MobileButton = {
  sm: "h-8 px-2 text-xs sm:h-9 sm:px-3 sm:text-sm",
  md: "h-9 px-3 text-sm sm:h-10 sm:px-4 sm:text-base",
  lg: "h-10 px-4 text-sm sm:h-11 sm:px-6 sm:text-base"
};

// Mobile container with proper overflow handling
export const MobileContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("w-full overflow-hidden", className)}>
    {children}
  </div>
);