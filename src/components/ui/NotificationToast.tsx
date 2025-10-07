import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  AlertTriangle,
  CheckCircle,
  Info,
  X,
  XCircle
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NotificationToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onClose(id), 300);
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-terminal-accent" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/20';
      case 'error': return 'bg-red-500/10 border-red-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/20';
      default: return 'bg-terminal-bg border-terminal-border';
    }
  };

  return (
    <div
      className={cn(
        'relative max-w-sm w-full bg-terminal-bg border rounded-lg shadow-lg transition-all duration-300 ease-in-out',
        getTypeStyles(),
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isLeaving && 'translate-x-full opacity-0'
      )}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-terminal-fg">
              {title}
            </h4>
            <p className="text-sm text-terminal-muted mt-1">
              {message}
            </p>
            
            {action && (
              <div className="mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={action.onClick}
                  className="border-terminal-border text-terminal-fg hover:bg-terminal-accent/10"
                >
                  {action.label}
                </Button>
              </div>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-terminal-muted hover:text-terminal-fg"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
