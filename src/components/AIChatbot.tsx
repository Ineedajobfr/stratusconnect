// AI Chatbot Component
// Provides real-time AI assistance and support

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
  CheckCircle
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatbotProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  className?: string;
}

const quickSuggestions = {
  broker: [
    "Find Gulfstream G650s available next week",
    "Show me pricing trends for transatlantic routes",
    "What are the best empty leg opportunities?",
    "Help me create a quote for LHR-JFK",
    "Show me operators with ARGUS Platinum rating"
  ],
  operator: [
    "Find contract pilots for my Gulfstream",
    "Show me fleet utilization analytics",
    "What are the best aircraft positioning opportunities?",
    "Help me optimize crew scheduling",
    "Show me market demand for my routes"
  ],
  pilot: [
    "Find Gulfstream G650 jobs in Europe",
    "Show me highest paying contract positions",
    "What are the best routes for my experience?",
    "Help me optimize my availability",
    "Show me operators with great reviews"
  ],
  crew: [
    "Find cabin crew jobs for long-haul flights",
    "Show me jobs requiring French language skills",
    "What are the best paying crew positions?",
    "Help me update my availability",
    "Show me operators with excellent crew benefits"
  ]
};

const aiResponses = {
  broker: [
    "I found 12 Gulfstream G650s available for your route. Here are the top 3 options with pricing and availability...",
    "Based on current market data, transatlantic routes are showing a 15% increase in demand. I recommend focusing on LHR-JFK and LHR-LAX routes...",
    "I've identified 8 empty leg opportunities that match your client's preferences. These could save up to 40% on costs...",
    "I'll help you create a comprehensive quote. Let me gather the latest pricing data and operator availability...",
    "I found 5 ARGUS Platinum operators in your region with excellent safety records and competitive pricing..."
  ],
  operator: [
    "I found 3 qualified Gulfstream G650 captains available in your area. Here are their profiles and availability...",
    "Your current fleet utilization is at 78%. I recommend repositioning aircraft to Miami for 40% higher demand...",
    "Based on market analysis, positioning your Global 6000 in London would increase bookings by 35%...",
    "I can help optimize your crew scheduling. Here's a suggested rotation that maximizes efficiency...",
    "Market demand for your primary routes is up 22% this month. Consider increasing capacity..."
  ],
  pilot: [
    "I found 8 Gulfstream G650 positions matching your experience. Here are the details and application links...",
    "The highest paying positions are in the Middle East and Asia, averaging $850-950 per day...",
    "Based on your experience, European and transatlantic routes offer the best opportunities...",
    "I can help optimize your availability calendar. Here are some suggestions based on demand patterns...",
    "I found 5 operators with excellent crew reviews and competitive compensation packages..."
  ],
  crew: [
    "I found 6 long-haul cabin crew positions. Here are the details including routes and compensation...",
    "French language skills are in high demand, with positions paying 20% above average rates...",
    "The highest paying crew positions are on luxury aircraft with VIP clients, averaging $400-500 per day...",
    "I can help you update your availability. Here are the most requested time slots...",
    "I found 4 operators with excellent crew benefits including health insurance and travel perks..."
  ]
};

export default function AIChatbot({ terminalType, className = "" }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestions = quickSuggestions[terminalType] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponses[terminalType][Math.floor(Math.random() * aiResponses[terminalType].length)],
        timestamp: new Date(),
        suggestions: suggestions.slice(0, 3)
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-accent hover:bg-accent/80 rounded-full shadow-lg z-50 ${className}`}
      >
        <MessageSquare className="w-6 h-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 z-50 ${isMinimized ? 'h-16' : 'h-[500px]'} transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm text-foreground">AI Assistant</CardTitle>
              <p className="text-xs text-muted-foreground">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-8 h-8 p-0"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0">
          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Hi! I'm your AI assistant. How can I help you today?</p>
                <div className="mt-4 space-y-2">
                  {suggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <Lightbulb className="w-3 h-3 mr-2" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-accent text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'ai' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      {message.suggestions && (
                        <div className="mt-2 space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs h-6"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
