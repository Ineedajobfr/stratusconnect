import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DataTileProps {
  title: string;
  subtitle?: string;
  status?: string;
  statusVariant?: 'success' | 'warning' | 'danger' | 'info';
  metadata?: Array<{ label: string; value: string; icon?: React.ReactNode }>;
  rightSlot?: React.ReactNode;
  actions?: Array<{ label: string; onClick: () => void; variant?: 'default' | 'outline' }>;
  className?: string;
}

const statusStyles = {
  success: 'status-active',
  warning: 'status-pending',
  danger: 'status-error',
  info: 'status-info'
};

export function DataTile({ 
  title, 
  subtitle, 
  status, 
  statusVariant = 'info',
  metadata = [], 
  rightSlot,
  actions = [],
  className = '' 
}: DataTileProps) {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-terminal-border/50 last:border-b-0 hover:bg-terminal-card/50 transition-colors ${className}`}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-3">
          <div className="terminal-subheader text-base text-foreground">{title}</div>
          {status && (
            <Badge className={`text-xs font-mono ${statusStyles[statusVariant]}`}>
              {status.toUpperCase()}
            </Badge>
          )}
        </div>
        
        {subtitle && (
          <div className="text-gunmetal text-sm mb-2">{subtitle}</div>
        )}
        
        {metadata.length > 0 && (
          <div className="flex items-center gap-6 text-sm text-gunmetal font-mono">
            {metadata.map((item, index) => (
              <span key={index} className="flex items-center gap-1">
                {item.icon}
                {item.label}: {item.value}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        {rightSlot}
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            className="btn-terminal-secondary"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}