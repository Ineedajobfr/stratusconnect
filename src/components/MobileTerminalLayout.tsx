import React from 'react';
import { cn } from '@/lib/utils';
import { MobileResponsive, MobileStack, MobileGrid } from './MobileResponsive';

interface MobileTerminalProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  showSidebar?: boolean;
}

export const MobileTerminal: React.FC<MobileTerminalProps> = ({
  children,
  className = "",
  header,
  sidebar,
  showSidebar = false
}) => {
  return (
    <MobileResponsive layout="terminal" className={className}>
      {header && (
        <div className="sticky top-0 z-20 backdrop-blur bg-app/90 border-b border-default">
          <div className="w-full px-3 sm:px-4 md:px-6 py-2 sm:py-3">
            {header}
          </div>
        </div>
      )}
      
      <div className="flex flex-1 min-h-0">
        {showSidebar && sidebar && (
          <div className="hidden lg:flex lg:w-64 border-r border-default bg-surface">
            <div className="w-full p-3 sm:p-4 md:p-6">
              {sidebar}
            </div>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="h-full p-3 sm:p-4 md:p-6">
            {children}
          </div>
        </div>
      </div>
    </MobileResponsive>
  );
};

// Mobile dashboard grid
export const MobileDashboardGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <MobileGrid columns={3} className={className}>
      {children}
    </MobileGrid>
  );
};

// Mobile card layout for terminals
export const MobileTerminalCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
}> = ({ title, children, className = "", actions }) => {
  return (
    <div className={cn("card w-full", className)}>
      <div className="flex items-center justify-between p-3 sm:p-4 md:p-6 pb-2 sm:pb-3">
        <h3 className="text-base sm:text-lg font-semibold text-body truncate">{title}</h3>
        {actions && (
          <div className="flex items-center gap-2 ml-2">
            {actions}
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-6 pt-0">
        {children}
      </div>
    </div>
  );
};

// Mobile navigation tabs
export const MobileNavTabs: React.FC<{
  tabs: Array<{ label: string; value: string; count?: number }>;
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
}> = ({ tabs, activeTab, onTabChange, className = "" }) => {
  return (
    <div className={cn("flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide pb-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            "px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5",
            activeTab === tab.value
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:text-body hover:bg-surface"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "px-1.5 py-0.5 text-xs rounded-full",
              activeTab === tab.value
                ? "bg-accent-foreground/20"
                : "bg-muted"
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// Mobile stats grid
export const MobileStatsGrid: React.FC<{
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }>;
  className?: string;
}> = ({ stats, className = "" }) => {
  return (
    <MobileGrid columns={2} className={className}>
      {stats.map((stat, index) => (
        <div key={index} className="card p-3 sm:p-4">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{stat.label}</p>
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-body tabular-nums">{stat.value}</p>
            {stat.change && (
              <p className={cn(
                "text-xs sm:text-sm font-medium",
                stat.changeType === 'positive' ? 'text-terminal-success' : 
                stat.changeType === 'negative' ? 'text-terminal-danger' : 
                'text-muted-foreground'
              )}>
                {stat.change}
              </p>
            )}
          </div>
        </div>
      ))}
    </MobileGrid>
  );
};
