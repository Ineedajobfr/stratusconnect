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

export function KPICard({ title, value, delta, icon: Icon, variant = 'default', className = '', ...props }: KPICardProps & { className?: string; [key: string]: any }) {
  return (
    <Card className={`terminal-card group hover:terminal-glow transition-all duration-300 ${className}`} {...props}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="terminal-label text-gunmetal">{title}</span>
          <div className="p-2 bg-accent/20 rounded-lg group-hover:bg-accent/30 transition-colors duration-300">
            <Icon className={`w-5 h-5 ${variantStyles[variant]} group-hover:scale-110 transition-transform duration-300`} />
          </div>
        </div>
        <div className={`terminal-metric ${variantStyles[variant]} mb-1 group-hover:scale-105 transition-transform duration-300`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {delta && (
          <div className="text-xs font-mono text-gunmetal group-hover:text-foreground transition-colors duration-300">
            {delta}
          </div>
        )}
      </CardContent>
    </Card>
  );
}