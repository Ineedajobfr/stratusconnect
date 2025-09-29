// Intelligent AI Chatbot Component
// Advanced Aviation AI with Real Intelligence
// FCA Compliant Aviation Platform

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  Maximize2,
  X,
  Zap,
  Lightbulb,
  Clock,
  CheckCircle,
  Brain,
  TrendingUp,
  Target,
  AlertCircle,
  BarChart3,
  Plane,
  Users,
  DollarSign
} from 'lucide-react';
import { aiIntelligenceService, AIMessage, AIAnalysis } from '@/lib/ai-intelligence-service';

interface IntelligentAIChatbotProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  className?: string;
}

const terminalIcons = {
  broker: DollarSign,
  operator: Plane,
  pilot: Users,
  crew: Users
};

const terminalColors = {
  broker: 'text-green-500',
  operator: 'text-blue-500',
  pilot: 'text-purple-500',
  crew: 'text-orange-500'
};

export default function IntelligentAIChatbot({ 
  terminalType, 
  className = "" 
}: IntelligentAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const TerminalIcon = terminalIcons[terminalType];
  const terminalColor = terminalColors[terminalType];

  // Initialize conversation on mount
  useEffect(() => {
    const initConversation = async () => {
      try {
        const id = await aiIntelligenceService.initializeConversation(terminalType);
        setConversationId(id);
        
        // Add welcome message
        const welcomeMessage: AIMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `🚀 **Welcome to StratusConnect AI Intelligence!**\n\nI'm your advanced aviation AI assistant, powered by real-time market data and industry expertise. I can help you with:\n\n• **Market Analysis** - Real-time trends and insights\n• **Route Optimization** - Efficiency and cost analysis\n• **Pricing Intelligence** - Competitive pricing strategies\n• **Demand Forecasting** - Future market predictions\n• **Risk Assessment** - Safety and compliance analysis\n\n*What would you like to explore today?*`,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        setSuggestions([
          "Analyze current market trends",
          "Find optimal routes for my fleet",
          "Show me pricing opportunities",
          "Forecast demand for next quarter",
          "Assess operational risks"
        ]);
      } catch (error) {
        console.error('Failed to initialize AI conversation:', error);
      }
    };

    initConversation();
  }, [terminalType]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    try {
      const response = await aiIntelligenceService.processMessage(conversationId, userMessage);
      
      setMessages(prev => [...prev, response]);
      
      if (response.metadata?.suggestions) {
        setSuggestions(response.metadata.suggestions);
      }
      
      if (response.metadata?.actions) {
        setActions(response.metadata.actions);
      }
      
      if (response.metadata?.analysis) {
        setCurrentAnalysis(response.metadata.analysis);
      }
    } catch (error) {
      console.error('Failed to process message:', error);
      const errorMessage: AIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    inputRef.current?.focus();
  };

  const handleActionClick = (action: string) => {
    // Handle action execution
    console.log('Executing action:', action);
    // This would integrate with the actual terminal functionality
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Convert markdown-like formatting to JSX
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/• (.*?)(?=\n|$)/g, '<li>$1</li>')
      .replace(/\n/g, '<br/>');
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'market_analysis': return <TrendingUp className="w-4 h-4" />;
      case 'route_optimization': return <Target className="w-4 h-4" />;
      case 'pricing_insight': return <DollarSign className="w-4 h-4" />;
      case 'demand_forecast': return <BarChart3 className="w-4 h-4" />;
      case 'risk_assessment': return <AlertCircle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-accent/90 text-white shadow-lg transition-all duration-300 hover:scale-110 ${className}`}
        title="Open AI Assistant"
      >
        <Brain className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 left-6 z-50 w-96 h-[500px] shadow-2xl border-2 border-accent/20 ${isMinimized ? 'h-16' : ''} ${className}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-accent/10 to-accent/5 border-b border-accent/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg bg-accent/20 ${terminalColor}`}>
              <TerminalIcon className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">AI Intelligence</CardTitle>
              <p className="text-xs text-muted-foreground capitalize">{terminalType} Terminal</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-accent text-white'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 mt-1">
                          <Brain className="w-4 h-4 text-accent" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(msg.content)
                          }}
                        />
                        {msg.metadata?.confidence && (
                          <div className="mt-2 text-xs opacity-70">
                            Confidence: {Math.round(msg.metadata.confidence * 100)}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3 flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-accent animate-pulse" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Analysis Panel */}
            {currentAnalysis && (
              <div className="border-t border-accent/20 p-4 bg-gradient-to-r from-accent/5 to-accent/10">
                <div className="flex items-center space-x-2 mb-2">
                  {getAnalysisIcon(currentAnalysis.type)}
                  <span className="text-sm font-medium capitalize">
                    {currentAnalysis.type.replace('_', ' ')} Analysis
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {Math.round(currentAnalysis.confidence * 100)}% confidence
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentAnalysis.insights.slice(0, 2).join(' • ')}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-t border-accent/20 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Suggestions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-7"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="border-t border-accent/20 p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Quick Actions</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {actions.slice(0, 3).map((action, index) => (
                    <Button
                      key={index}
                      variant="default"
                      size="sm"
                      onClick={() => handleActionClick(action)}
                      className="text-xs h-7 bg-accent hover:bg-accent/90"
                    >
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="border-t border-accent/20 p-4">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about aviation..."
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="bg-accent hover:bg-accent/90"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}
