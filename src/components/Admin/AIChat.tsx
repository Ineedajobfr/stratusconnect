import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { adminAI, type AIResponse } from '@/lib/admin-ai-assistant';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Loader2, Send, Sparkles } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  response?: AIResponse;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your AI Admin Assistant. I can help you with platform management, troubleshooting, and analytics. Try asking me something like:\n\n• "Show me all failed payments from last week"\n• "Find duplicate user accounts"\n• "Generate a revenue report"\n• "What transactions failed today?"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Query the AI assistant
      const response = await adminAI.query({ query: userMessage.content });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        response,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI query error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const executeAction = async (action: any) => {
    try {
      await action.execute();
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✓ Action completed: ${action.label}`,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error('Action execution error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: `✗ Action failed: ${action.label}`,
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <Card className="enterprise-card h-full flex flex-col">
      <CardHeader className="enterprise-card-header">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-enterprise-primary" />
          <CardTitle className="enterprise-card-title">AI Admin Assistant</CardTitle>
          <Badge className="status-badge status-badge-success">
            <span className="mr-1">●</span>
            ONLINE
          </Badge>
        </div>
        <p className="text-sm text-white/60 font-mono mt-2">
          Ask me anything about your platform. I can analyze data, fix issues, and provide insights.
        </p>
      </CardHeader>
      
      <CardContent className="enterprise-card-body flex-1 flex flex-col min-h-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-enterprise-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-enterprise-primary" />
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-[80%] rounded-lg p-4 font-mono text-sm',
                  message.role === 'user'
                    ? 'bg-enterprise-primary/20 text-white'
                    : 'bg-black/30 text-white/90 border border-enterprise-primary/20'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                
                {/* Actions */}
                {message.response?.actions && message.response.actions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-white/60 uppercase tracking-wider">Suggested Actions:</p>
                    {message.response.actions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => executeAction(action)}
                        className={cn(
                          'w-full justify-start border-enterprise-primary/30 text-white hover:bg-enterprise-primary/10',
                          action.risk === 'high' && 'border-enterprise-danger/30 hover:bg-enterprise-danger/10'
                        )}
                      >
                        {action.risk === 'high' && <AlertCircle className="w-3 h-3 mr-2 text-enterprise-danger" />}
                        {action.risk === 'low' && <CheckCircle className="w-3 h-3 mr-2 text-enterprise-success" />}
                        <span className="flex-1 text-left">{action.label}</span>
                        <Badge className={cn(
                          'status-badge text-xs',
                          action.risk === 'high' ? 'status-badge-danger' :
                          action.risk === 'medium' ? 'status-badge-warning' :
                          'status-badge-success'
                        )}>
                          {action.risk.toUpperCase()}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}
                
                {/* Suggestions */}
                {message.response?.suggestions && message.response.suggestions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs text-white/60 uppercase tracking-wider">You might also want to:</p>
                    <div className="flex flex-wrap gap-2">
                      {message.response.suggestions.map((suggestion, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs border border-enterprise-primary/20 hover:bg-enterprise-primary/10"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Confidence indicator */}
                {message.response?.confidence !== undefined && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/60">Confidence</span>
                      <span className={cn(
                        'font-semibold',
                        message.response.confidence >= 0.8 ? 'text-enterprise-success' :
                        message.response.confidence >= 0.5 ? 'text-enterprise-warning' :
                        'text-enterprise-danger'
                      )}>
                        {(message.response.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          message.response.confidence >= 0.8 ? 'bg-enterprise-success' :
                          message.response.confidence >= 0.5 ? 'bg-enterprise-warning' :
                          'bg-enterprise-danger'
                        )}
                        style={{ width: `${message.response.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-white/40 mt-3">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
              
              {message.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-enterprise-gold/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-enterprise-gold">YOU</span>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-enterprise-primary/20 flex items-center justify-center flex-shrink-0">
                <Loader2 className="w-4 h-4 text-enterprise-primary animate-spin" />
              </div>
              <div className="bg-black/30 rounded-lg p-4 border border-enterprise-primary/20">
                <p className="text-sm text-white/60 font-mono">Thinking...</p>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="flex-1 bg-black/30 border-enterprise-primary/20 text-white placeholder:text-white/40 font-mono"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-enterprise-primary hover:bg-enterprise-primary/80"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <p className="text-xs text-white/40 mt-2 font-mono">
          Press <kbd className="kbd">Enter</kbd> to send • <kbd className="kbd">Shift + Enter</kbd> for new line
        </p>
      </CardContent>
    </Card>
  );
};

