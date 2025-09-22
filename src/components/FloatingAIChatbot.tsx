import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  X, 
  Bot, 
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import AdvancedAIChatbot from './AdvancedAIChatbot';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface FloatingAIChatbotProps {
  className?: string;
}

export default function FloatingAIChatbot({ className = "" }: FloatingAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Determine user type - default to broker for now
  const getUserType = (): 'broker' | 'operator' | 'pilot' | 'crew' | 'admin' => {
    // For now, we'll default to broker
    // In a real implementation, this would get the user type from context
    return 'broker';
  };

  try {
    return (
      <>
        {/* Floating Button */}
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          {!isOpen && (
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-accent hover:bg-accent/80 shadow-lg hover:shadow-xl transition-all duration-300 group"
              size="lg"
            >
              <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </Button>
          )}
        </div>

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-terminal-card border border-terminal-border rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-terminal-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    StratusConnect AI Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your intelligent aviation assistant
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Shield className="w-3 h-3" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Zap className="w-3 h-3" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>24/7</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Chatbot Component */}
            <div className="flex-1 p-4">
              <ErrorBoundary fallback={
                <div className="text-center text-muted-foreground p-4">
                  <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>AI Chatbot temporarily unavailable</p>
                  <p className="text-xs mt-2">Please try refreshing the page</p>
                </div>
              }>
                <AdvancedAIChatbot userType={getUserType()} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      )}
    </>
  );
  } catch (error) {
    console.error('FloatingAIChatbot error:', error);
    // Return a minimal fallback that won't crash the app
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => window.open('/ai-chatbot', '_blank')}
          className="w-14 h-14 rounded-full bg-accent hover:bg-accent/80 shadow-lg"
          size="lg"
          title="Open AI Chatbot"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>
      </div>
    );
  }
}
