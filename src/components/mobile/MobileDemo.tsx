import React from 'react';
import { MobileTerminal, MobileTerminalCard, MobileStatsGrid } from '../MobileTerminalLayout';
import { MobileResponsive, MobileGrid, MobileText } from '../MobileResponsive';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Mobile-optimized demo components
export const MobileDemoWrapper: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className = "" }) => {
  return (
    <MobileResponsive layout="page" className={className}>
      <div className="sticky top-0 z-20 backdrop-blur bg-app/90 border-b border-default">
        <div className="w-full px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <MobileText size="title" className="text-body">{title}</MobileText>
          <MobileText size="small" className="text-muted-foreground mt-1">{description}</MobileText>
        </div>
      </div>
      
      <div className="flex-1 p-3 sm:p-4 md:p-6">
        {children}
      </div>
    </MobileResponsive>
  );
};

// Mobile demo dashboard
export const MobileDemoDashboard: React.FC<{
  stats: Array<{
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }>;
  actions?: React.ReactNode;
  children: React.ReactNode;
}> = ({ stats, actions, children }) => {
  return (
    <div className="w-full space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <MobileStatsGrid stats={stats} />
      
      {/* Actions */}
      {actions && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {actions}
        </div>
      )}
      
      {/* Main Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

// Mobile demo card grid
export const MobileDemoCardGrid: React.FC<{
  cards: Array<{
    title: string;
    content: React.ReactNode;
    badge?: { text: string; variant?: 'default' | 'secondary' | 'destructive' | 'outline' };
  }>;
  columns?: number;
}> = ({ cards, columns = 2 }) => {
  return (
    <MobileGrid columns={columns}>
      {cards.map((card, index) => (
        <div key={index} className="card p-3 sm:p-4 space-y-3">
          <div className="flex items-center justify-between">
            <MobileText size="subtitle" className="text-body truncate">
              {card.title}
            </MobileText>
            {card.badge && (
              <Badge variant={card.badge.variant || 'default'} className="text-xs">
                {card.badge.text}
              </Badge>
            )}
          </div>
          <div className="text-sm sm:text-base">
            {card.content}
          </div>
        </div>
      ))}
    </MobileGrid>
  );
};

// Mobile demo table
export const MobileDemoTable: React.FC<{
  headers: string[];
  rows: Array<Array<string | React.ReactNode>>;
  className?: string;
}> = ({ headers, rows, className = "" }) => {
  return (
    <div className={`w-full overflow-x-auto scrollbar-hide ${className}`}>
      <div className="min-w-full">
        <div className="card overflow-hidden">
          {/* Headers */}
          <div className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 p-3 sm:p-4 bg-surface border-b border-default">
            {headers.map((header, index) => (
              <MobileText key={index} size="small" className="font-semibold text-muted-foreground truncate">
                {header}
              </MobileText>
            ))}
          </div>
          
          {/* Rows */}
          <div className="divide-y divide-default">
            {rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid grid-flow-col auto-cols-fr gap-2 sm:gap-4 p-3 sm:p-4">
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} className="text-sm sm:text-base text-body truncate">
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile demo actions
export const MobileDemoActions: React.FC<{
  primary?: { label: string; onClick: () => void; loading?: boolean };
  secondary?: Array<{ label: string; onClick: () => void; variant?: 'outline' | 'ghost' }>;
  className?: string;
}> = ({ primary, secondary, className = "" }) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-2 sm:gap-3 ${className}`}>
      {primary && (
        <Button 
          onClick={primary.onClick}
          disabled={primary.loading}
          className="w-full sm:w-auto"
          size="sm"
        >
          {primary.loading ? 'Loading...' : primary.label}
        </Button>
      )}
      
      {secondary && secondary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {secondary.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              size="sm"
              className="flex-1 sm:flex-initial"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};