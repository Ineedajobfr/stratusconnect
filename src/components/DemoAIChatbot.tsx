import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Bot, 
  User, 
  Sparkles,
  Zap,
  Shield,
  Brain,
  MessageSquare,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
  Lock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  confidence?: number;
  category?: string;
}

interface DemoAIChatbotProps {
  userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

// GPT-3 level responses for demo
const demoResponses = {
  aircraft: [
    "The Gulfstream G650ER is an ultra-long-range business jet with a range of 7,500 nautical miles. It can carry up to 19 passengers and has a maximum cruise speed of 516 knots. Operating costs are approximately $6,500 per hour.",
    "The Bombardier Global 7500 offers exceptional range of 7,700 nautical miles and can accommodate up to 19 passengers. It features advanced avionics and a spacious cabin designed for comfort on long-haul flights.",
    "The Embraer Phenom 300E is a light jet perfect for regional flights. With a range of 2,000 nautical miles and capacity for 9 passengers, it's ideal for shorter business trips and costs around $2,500 per hour to operate."
  ],
  market: [
    "Current market rates for transatlantic flights are averaging $4,500-$6,500 per hour depending on aircraft type. Demand is strong with a 15% increase year-over-year.",
    "The private aviation market is experiencing steady growth with premium segment showing 8% annual growth. Light jets are particularly popular for regional travel.",
    "Fuel costs are currently stable, contributing to consistent pricing. Operators are seeing increased demand for sustainable aviation options."
  ],
  regulations: [
    "FAA Part 135 regulations require operators to maintain specific certifications, training programs, and safety management systems. Compliance is essential for commercial operations.",
    "EASA regulations in Europe have specific requirements for crew training, aircraft maintenance, and operational procedures. Staying current with updates is crucial.",
    "ICAO standards provide international guidelines for aviation safety and security. Most countries align their regulations with ICAO recommendations."
  ],
  general: [
    "I'm here to help with your aviation needs! I can assist with aircraft specifications, market analysis, regulatory questions, and operational guidance.",
    "As your StratusConnect AI assistant, I have access to comprehensive aviation databases and can provide real-time insights to help optimize your operations.",
    "Feel free to ask me anything about aircraft, routes, regulations, or how to use the StratusConnect platform. I'm designed to be your intelligent aviation companion."
  ]
};

export default function DemoAIChatbot({ 
  userType, 
  className = "",
  isMinimized = false,
  onMinimize,
  onMaximize,
  onClose
}: DemoAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const { toast } = useToast();

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Welcome to StratusConnect AI Assistant! I'm your intelligent aviation companion with access to comprehensive databases and real-time market data. This is a demo version with GPT-3 level capabilities. How can I help you today?`,
        timestamp: new Date(),
        confidence: 0.9,
        category: 'welcome'
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Input Error",
          description: "Could not process voice input. Please try again.",
          variant: "destructive"
        });
      };
    }
  }, [toast]);

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if (isMuted || !voiceEnabled) return;
    
    if (synthesisRef.current) {
      window.speechSynthesis.cancel();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    // Select best voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [isMuted, voiceEnabled]);

  // Process message with GPT-3 level AI
  const processMessage = useCallback(async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    
    try {
      // Simulate GPT-3 level processing time
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const lowerQuery = userMessage.toLowerCase();
      let response = '';
      let category = 'general';
      let confidence = 0.8;

      // Simple keyword matching for demo
      if (lowerQuery.includes('aircraft') || lowerQuery.includes('jet') || lowerQuery.includes('plane') || 
          lowerQuery.includes('gulfstream') || lowerQuery.includes('bombardier') || lowerQuery.includes('embraer')) {
        const responses = demoResponses.aircraft;
        response = responses[Math.floor(Math.random() * responses.length)];
        category = 'aircraft';
        confidence = 0.9;
      } else if (lowerQuery.includes('market') || lowerQuery.includes('price') || lowerQuery.includes('rate') || 
                 lowerQuery.includes('cost') || lowerQuery.includes('demand')) {
        const responses = demoResponses.market;
        response = responses[Math.floor(Math.random() * responses.length)];
        category = 'market';
        confidence = 0.85;
      } else if (lowerQuery.includes('regulation') || lowerQuery.includes('faa') || lowerQuery.includes('easa') || 
                 lowerQuery.includes('compliance') || lowerQuery.includes('certification')) {
        const responses = demoResponses.regulations;
        response = responses[Math.floor(Math.random() * responses.length)];
        category = 'regulation';
        confidence = 0.9;
      } else {
        const responses = demoResponses.general;
        response = responses[Math.floor(Math.random() * responses.length)];
        category = 'general';
        confidence = 0.7;
      }

      // Add personalized touch based on user type
      const personalizedEnding = `\n\nAs a ${userType}, you might also be interested in optimizing your operations and staying updated with the latest industry trends. Is there anything specific you'd like to know more about?`;

      const finalResponse: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response + personalizedEnding,
        timestamp: new Date(),
        confidence,
        category
      };
      
      return finalResponse;
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        confidence: 0.1
      };
    } finally {
      setIsTyping(false);
    }
  }, [userType]);

  // Send message
  const sendMessage = useCallback(async () => {
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
    
    // Process with AI
    const aiResponse = await processMessage(userMessage);
    setMessages(prev => [...prev, aiResponse]);
    
    // Speak response if voice is enabled
    if (voiceEnabled && !isMuted) {
      speak(aiResponse.content);
    }
    
    setIsLoading(false);
  }, [input, isLoading, processMessage, speak, voiceEnabled, isMuted]);

  // Voice input
  const toggleVoiceInput = useCallback(() => {
    if (!recognitionRef.current) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening, toast]);

  // Copy message
  const copyMessage = useCallback((messageId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(messageId);
    setTimeout(() => setCopiedMessageId(null), 2000);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  }, [toast]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setMessages([]);
    toast({
      title: "Conversation Cleared",
      description: "Starting fresh conversation",
    });
  }, [toast]);

  if (isMinimized) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={onMaximize}
          className="w-14 h-14 rounded-full bg-accent hover:bg-accent/80 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          <Bot className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col bg-terminal-card border-terminal-border shadow-2xl">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-terminal-border">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Bot className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">StratusConnect AI Assistant</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {userType.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-xs bg-yellow-500/20 text-yellow-500">
                  <Lock className="w-3 h-3 mr-1" />
                  DEMO
                </Badge>
                <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-500">
                  GPT-3 LEVEL
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onMinimize}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Settings Panel */}
        {showSettings && (
          <div className="p-4 border-b border-terminal-border bg-terminal-bg/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Voice Settings</label>
                <div className="flex space-x-2">
                  <Button
                    variant={voiceEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    {voiceEnabled ? 'Enabled' : 'Disabled'}
                  </Button>
                  <Button
                    variant={isMuted ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? 'Muted' : 'Unmuted'}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Demo Mode</label>
                <div className="text-sm text-muted-foreground">
                  This is a GPT-3 level demo. Upgrade for full AI capabilities.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-accent text-white'
                        : 'bg-terminal-bg border border-terminal-border'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="w-4 h-4 mt-1 text-accent flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="w-4 h-4 mt-1 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        {message.confidence && message.confidence < 0.8 && (
                          <div className="mt-2 text-xs text-muted-foreground">
                            Confidence: {Math.round(message.confidence * 100)}%
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                          {message.role === 'assistant' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyMessage(message.id, message.content)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedMessageId === message.id ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-terminal-bg border border-terminal-border rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-accent" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input Area */}
        <div className="p-4 border-t border-terminal-border">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about aviation, StratusConnect, or your operations..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={toggleVoiceInput}
                disabled={isLoading}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-red-500" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="px-6"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={clearConversation}
              title="Clear conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('What aircraft are available for my route?')}
              className="text-xs"
            >
              Aircraft Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Show me current market rates')}
              className="text-xs"
            >
              Market Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Help me with regulations')}
              className="text-xs"
            >
              Regulations
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('How do I use this platform?')}
              className="text-xs"
            >
              Platform Help
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
