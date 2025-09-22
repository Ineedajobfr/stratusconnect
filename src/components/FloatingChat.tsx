import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  X, 
  Bot, 
  User, 
  Lock,
  Clock,
  Shield,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface FloatingChatProps {
  userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  isDemo?: boolean;
  className?: string;
}

// Simple responses for the floating chat
const getSimpleResponse = (userMessage: string, userType: string): string => {
  const lowerQuery = userMessage.toLowerCase();
  
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return `Hello! I'm your StratusConnect AI assistant. How can I help you with your ${userType} operations today?`;
  }
  
  if (lowerQuery.includes('aircraft') || lowerQuery.includes('jet')) {
    return `I can help you find aircraft information, specifications, and availability. What specific aircraft are you looking for?`;
  }
  
  if (lowerQuery.includes('rate') || lowerQuery.includes('price')) {
    return `Current market rates vary by aircraft type and route. Light jets average $2,500-$3,500/hour, while heavy jets can range $6,000-$12,000/hour. Would you like specific pricing for a particular route?`;
  }
  
  if (lowerQuery.includes('help') || lowerQuery.includes('how')) {
    return `I can assist with aircraft searches, market data, regulations, and platform features. What would you like to know more about?`;
  }
  
  return `I understand you're asking about "${userMessage}". As your StratusConnect AI assistant, I can help with aircraft information, market data, regulations, and platform features. Could you be more specific about what you need?`;
};

export default function FloatingChat({ userType, isDemo = false, className = "" }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const { toast } = useToast();

  // Initialize with welcome message
  React.useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Hi! I'm your StratusConnect AI assistant. I can help with aircraft info, market data, and ${userType} operations. What do you need?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length, userType]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: getSimpleResponse(userMessage, userType),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice Input Stopped",
        description: "Voice input has been disabled",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Voice Input Active",
        description: "Speak your message now",
      });
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-accent hover:bg-accent/80 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96">
          <Card className="w-full h-full bg-terminal-card border-terminal-border shadow-2xl flex flex-col">
            {/* Header */}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b border-terminal-border">
              <div className="flex items-center space-x-2">
                <div className="p-1.5 bg-accent/20 rounded-lg">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-sm text-foreground">AI Assistant</CardTitle>
                  <div className="flex items-center space-x-1">
                    <Badge variant="outline" className="text-xs">
                      {userType.toUpperCase()}
                    </Badge>
                    {isDemo && (
                      <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-500">
                        <Lock className="w-2 h-2 mr-1" />
                        DEMO
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="w-3 h-3" />
              </Button>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-2 ${
                          message.role === 'user'
                            ? 'bg-accent text-white'
                            : 'bg-terminal-bg border border-terminal-border'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.role === 'assistant' && (
                            <Bot className="w-3 h-3 mt-0.5 text-accent flex-shrink-0" />
                          )}
                          {message.role === 'user' && (
                            <User className="w-3 h-3 mt-0.5 text-white flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="text-xs whitespace-pre-wrap">
                              {message.content}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground">
                                {message.timestamp.toLocaleTimeString()}
                              </span>
                              {message.role === 'assistant' && (
                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                  <Clock className="w-2 h-2" />
                                  <span>24/7</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-terminal-bg border border-terminal-border rounded-lg p-2">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-3 h-3 text-accent" />
                          <div className="flex space-x-1">
                            <div className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                            <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="p-3 border-t border-terminal-border">
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="pr-8 h-8 text-xs"
                    disabled={isLoading}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={toggleVoiceInput}
                    disabled={isLoading}
                  >
                    {isListening ? (
                      <MicOff className="w-3 h-3 text-red-500" />
                    ) : (
                      <Mic className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="h-8 px-3"
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
