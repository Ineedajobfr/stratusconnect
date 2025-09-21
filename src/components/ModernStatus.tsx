import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, Activity } from 'lucide-react';

interface ModernStatusProps {
  status: 'online' | 'offline' | 'warning' | 'error' | 'loading';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export function ModernStatus({ 
  status, 
  label, 
  size = 'md', 
  showPulse = true,
  className = '' 
}: ModernStatusProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const statusConfig = {
    online: {
      color: 'bg-terminal-success',
      icon: CheckCircle,
      text: 'Online'
    },
    offline: {
      color: 'bg-terminal-border',
      icon: XCircle,
      text: 'Offline'
    },
    warning: {
      color: 'bg-terminal-warning',
      icon: AlertCircle,
      text: 'Warning'
    },
    error: {
      color: 'bg-terminal-danger',
      icon: XCircle,
      text: 'Error'
    },
    loading: {
      color: 'bg-accent',
      icon: Activity,
      text: 'Loading'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} ${config.color} rounded-full`} />
        {showPulse && status === 'online' && (
          <div className={`absolute inset-0 ${sizeClasses[size]} ${config.color} rounded-full animate-ping opacity-75`} />
        )}
        {status === 'loading' && (
          <div className={`absolute inset-0 ${sizeClasses[size]} ${config.color} rounded-full animate-spin`} />
        )}
      </div>
      {label && (
        <span className="text-sm font-mono text-gunmetal">
          {label}
        </span>
      )}
    </div>
  );
}

// Enhanced status badge
export function StatusBadge({ 
  status, 
  children, 
  className = '' 
}: { 
  status: 'success' | 'warning' | 'error' | 'info' | 'pending';
  children: React.ReactNode;
  className?: string;
}) {
  const statusClasses = {
    success: 'bg-terminal-success/20 text-terminal-success border-terminal-success/30',
    warning: 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30',
    error: 'bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30',
    info: 'bg-terminal-info/20 text-terminal-info border-terminal-info/30',
    pending: 'bg-accent/20 text-accent border-accent/30'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-mono border ${statusClasses[status]} ${className}`}>
      {children}
    </span>
  );
}

// Modern notification dot
export function NotificationDot({ 
  count, 
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) {
  if (!count || count === 0) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="w-2 h-2 bg-terminal-danger rounded-full animate-pulse" />
      {count > 1 && (
        <div className="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-mono">
          {count > 9 ? '9+' : count}
        </div>
      )}
    </div>
  );
}
