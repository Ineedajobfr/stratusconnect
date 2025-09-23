import React from 'react';
import AIAssistantButton from './AIAssistantButton';
import { useAuth } from '@/contexts/AuthContext';

interface FloatingAIChatbotProps {
  className?: string;
}

export default function FloatingAIChatbot({ className = "" }: FloatingAIChatbotProps) {
  const { user } = useAuth();

  // Determine user type from auth context
  const getUserType = (): 'broker' | 'operator' | 'pilot' | 'crew' | 'admin' => {
    if (!user) return 'broker';
    
    try {
      const userRole = user.user_metadata?.role || 'broker';
      return userRole as 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
    } catch (error) {
      console.error('Error determining user type:', error);
      return 'broker';
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AIAssistantButton
        userType={getUserType()}
        variant="default"
        size="lg"
        showLabel={false}
        className="w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      />
    </div>
  );
}