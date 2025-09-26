import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  title?: string;
  header?: React.ReactNode;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  className,
  hover = true,
  delay = 0,
  title,
  header
}) => {
  return (
    <Card 
      className={cn(
        'bg-terminal-bg border-terminal-border transition-all duration-300 ease-in-out',
        'transform hover:scale-105 hover:shadow-lg hover:shadow-terminal-accent/20',
        hover && 'hover:border-terminal-accent/50',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
        animation: 'fadeInUp 0.6s ease-out forwards'
      }}
    >
      {(title || header) && (
        <CardHeader>
          {title && <CardTitle className="text-terminal-fg">{title}</CardTitle>}
          {header}
        </CardHeader>
      )}
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default AnimatedCard;
