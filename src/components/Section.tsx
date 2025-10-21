import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Section({ title, subtitle, actions, children, className = '' }: SectionProps) {
  return (
    <Card className={`terminal-card ${className}`}>
      <CardHeader className="border-b border-terminal-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="terminal-header text-foreground">{title}</CardTitle>
            {subtitle && (
              <p className="text-gunmetal text-sm font-medium mt-1">{subtitle}</p>
            )}
          </div>
          {actions}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  );
}
