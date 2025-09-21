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
  className = '',
  ...props
}: DataTileProps & { [key: string]: any }) {
  return (
    <div className={`flex items-center justify-between p-6 border-b border-terminal-border/50 last:border-b-0 hover:bg-terminal-card/50 transition-all duration-300 group cursor-pointer ${className}`} {...props}>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-3">
          <div className="terminal-subheader text-base text-foreground group-hover:text-accent transition-colors duration-300">{title}</div>
          {status && (
            <Badge className={`text-xs font-mono ${statusStyles[statusVariant]} group-hover:scale-105 transition-transform duration-300`}>
              {status.toUpperCase()}
            </Badge>
          )}
        </div>
        
        {subtitle && (
          <div className="text-gunmetal text-sm mb-2 group-hover:text-muted-foreground transition-colors duration-300">{subtitle}</div>
        )}
        
        {metadata.length > 0 && (
          <div className="flex items-center gap-6 text-sm text-gunmetal font-mono">
            {metadata.map((item, index) => (
              <span key={index} className="flex items-center gap-1 group-hover:scale-105 transition-transform duration-300">
                {item.icon}
                <span className="group-hover:text-muted-foreground transition-colors duration-300">{item.label}:</span>
                <span className="group-hover:text-foreground transition-colors duration-300">{item.value}</span>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="group-hover:scale-105 transition-transform duration-300">
          {rightSlot}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outline'}
              size="sm"
              onClick={action.onClick}
              className="btn-terminal-secondary hover:scale-105 transition-transform duration-300"
            >
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}