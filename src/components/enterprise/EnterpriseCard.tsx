import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface EnterpriseCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  status?: 'live' | 'pending' | 'completed' | 'error';
  priority?: 'high' | 'medium' | 'low' | 'urgent';
  className?: string;
  footer?: ReactNode;
}

const statusConfig = {
  live: { label: 'LIVE', className: 'status-badge-success', icon: '●' },
  pending: { label: 'PENDING', className: 'status-badge-warning', icon: '◐' },
  completed: { label: 'COMPLETED', className: 'status-badge-info', icon: '✓' },
  error: { label: 'ERROR', className: 'status-badge-danger', icon: '✕' },
};

const priorityConfig = {
  urgent: { label: 'URGENT', className: 'status-badge-danger' },
  high: { label: 'HIGH', className: 'status-badge-warning' },
  medium: { label: 'MEDIUM', className: 'status-badge-info' },
  low: { label: 'LOW', className: 'status-badge-neutral' },
};

export const EnterpriseCard: React.FC<EnterpriseCardProps> = ({
  title,
  description,
  children,
  actions,
  status,
  priority,
  className,
  footer,
}) => {
  return (
    <Card className={cn('enterprise-card', className)}>
      <CardHeader className="enterprise-card-header">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <CardTitle className="enterprise-card-title">{title}</CardTitle>
              {status && (
                <Badge className={cn('status-badge', statusConfig[status].className)}>
                  <span className="mr-1">{statusConfig[status].icon}</span>
                  {statusConfig[status].label}
                </Badge>
              )}
              {priority && (
                <Badge className={cn('status-badge', priorityConfig[priority].className)}>
                  {priorityConfig[priority].label}
                </Badge>
              )}
            </div>
            {description && (
              <CardDescription className="text-white/60 text-sm">
                {description}
              </CardDescription>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="enterprise-card-body">
        {children}
      </CardContent>
      {footer && (
        <div className="px-6 py-4 border-t border-white/10">
          {footer}
        </div>
      )}
    </Card>
  );
};

