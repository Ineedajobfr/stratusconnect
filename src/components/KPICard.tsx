import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

const variantStyles = {
  default: 'text-accent',
  success: 'text-data-positive',
  warning: 'text-data-warning',
  danger: 'text-data-negative',
  info: 'text-terminal-info'
};

export function KPICard({ title, value, delta, icon: Icon, variant = 'default' }: KPICardProps) {
  return (
    <Card className="terminal-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="terminal-label text-gunmetal">{title}</span>
          <Icon className={`w-5 h-5 ${variantStyles[variant]}`} />
        </div>
        <div className={`terminal-metric ${variantStyles[variant]} mb-1`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {delta && (
          <div className="text-xs font-mono text-gunmetal">
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  );
}