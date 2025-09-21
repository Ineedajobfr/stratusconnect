import React from 'react';

interface ModernLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function ModernLoader({ 
  size = 'md', 
  text = 'Loading...', 
  className = '' 
}: ModernLoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full border-2 border-terminal-border animate-spin`} 
             style={{ borderTopColor: 'hsl(var(--accent))' }} />
        
        {/* Inner ring */}
        <div className={`absolute inset-1 rounded-full border-2 border-transparent animate-spin`}
             style={{ 
               borderTopColor: 'hsl(var(--accent) / 0.5)',
               animationDirection: 'reverse',
               animationDuration: '0.8s'
             }} />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
      
      {text && (
        <div className="text-sm text-muted-foreground font-mono animate-pulse">
          {text}
        </div>
      )}
    </div>
  );
}

// Enhanced loading skeleton
export function LoadingSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i}
          className="loading-skeleton h-4 rounded"
          style={{ 
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
}

// Modern progress bar
export function ModernProgress({ 
  value, 
  max = 100, 
  className = '' 
}: { 
  value: number; 
  max?: number; 
  className?: string; 
}) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`w-full bg-terminal-border rounded-full h-2 overflow-hidden ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-accent to-accent/80 rounded-full transition-all duration-500 ease-out relative"
        style={{ width: `${percentage}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
