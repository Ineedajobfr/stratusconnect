import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  Brain, 
  MessageSquare,
  Crown,
  Lock
} from 'lucide-react';
import PremiumAIChatbot from './PremiumAIChatbot';
import { useAuth } from '@/contexts/AuthContext';

interface AIAssistantButtonProps {
  userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showLabel?: boolean;
}

function AIAssistantButton({ 
  userType, 
  className = "",
  variant = "default",
  size = "default",
  showLabel = true
}: AIAssistantButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { user } = useAuth();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  const handleClick = () => {
    if (!isAuthenticated) {
      // Show upgrade prompt for non-authenticated users
      return;
    }
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  if (!isAuthenticated) {
    return (
      <Button
        variant="outline"
        size={size}
        className={`relative ${className}`}
        disabled
      >
        <Lock className="w-4 h-4 mr-2" />
        {showLabel && 'AI Assistant'}
        <Badge variant="destructive" className="ml-2 text-xs">
          PREMIUM
        </Badge>
      </Button>
    );
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleClick}
        className={`relative group ${className}`}
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Bot className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </div>
          {showLabel && (
            <span className="font-medium">AI Assistant</span>
          )}
          <div className="flex items-center space-x-1">
            <Badge variant="outline" className="text-xs bg-accent/20 text-accent border-accent/30">
              <Zap className="w-3 h-3 mr-1" />
              ULTRA
            </Badge>
            <Badge variant="outline" className="text-xs bg-green-500/20 text-green-500 border-green-500/30">
              <Crown className="w-3 h-3 mr-1" />
              PREMIUM
            </Badge>
          </div>
        </div>
      </Button>

      {isOpen && (
        <PremiumAIChatbot
          userType={userType}
          isMinimized={isMinimized}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose}
        />
      )}
    </>
  );
}

// Compact version for headers
export function AIAssistantCompact({ userType, className = "" }: { userType: string; className?: string }) {
  return (
    <AIAssistantButton
      userType={userType as any}
      className={className}
      variant="ghost"
      size="sm"
      showLabel={false}
    />
  );
}

// Floating version
export function AIAssistantFloating({ userType, className = "" }: { userType: string; className?: string }) {
  return (
    <div className={`fixed top-4 right-4 z-40 ${className}`}>
      <AIAssistantButton
        userType={userType as any}
        variant="default"
        size="sm"
        showLabel={true}
      />
    </div>
  );
}

export { AIAssistantButton };
export default AIAssistantButton;
