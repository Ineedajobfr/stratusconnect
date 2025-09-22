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
  Lock,
  Plane,
  Clock,
  Star
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

// Enhanced GPT-3 level responses for demo
const demoResponses = {
  aircraft: {
    'cesna': "The Cessna Citation series is one of the most popular business jet families in the world. The Citation X+ can reach speeds up to Mach 0.935 and has a range of 3,460 nautical miles, making it perfect for transcontinental flights. Operating costs are around $3,200 per hour.",
    'gulfstream': "Gulfstream aircraft are the gold standard in business aviation. The G650ER offers ultra-long range of 7,500 nautical miles and can carry up to 19 passengers. It's the choice of Fortune 500 executives and heads of state worldwide.",
    'bombardier': "Bombardier's Global series represents the pinnacle of business aviation. The Global 7500 has a range of 7,700 nautical miles and features the industry's most spacious cabin, perfect for long-haul comfort.",
    'embraer': "Embraer's Phenom series offers exceptional value in the light jet category. The Phenom 300E combines efficiency with performance, offering 2,000 nautical miles range at competitive operating costs."
  },
  market: {
    'rates': "Current market rates vary by aircraft type: Light jets (Citation, Phenom) average $2,500-$3,500/hour, Mid-size jets (Challenger, Legacy) $4,000-$6,000/hour, and Heavy jets (Gulfstream, Global) $6,000-$12,000/hour. Rates fluctuate based on fuel costs, demand, and route complexity.",
    'demand': "Private aviation demand is up 15% year-over-year, driven by increased business travel and the flexibility it offers. Peak seasons are spring and fall, with summer showing strong leisure travel demand.",
    'trends': "Key trends include sustainable aviation fuel adoption, increased focus on safety technology, and growing demand for point-to-point travel avoiding commercial hubs."
  },
  regulations: {
    'faa': "FAA Part 135 governs commercial operations. Key requirements include: pilot certification (ATP for captains), aircraft maintenance programs, safety management systems, and operational control procedures. Compliance is mandatory for all commercial flights.",
    'easa': "EASA regulations cover European operations with specific requirements for crew training, aircraft certification, and operational procedures. Part-CAT, Part-NCC, and Part-NCO are the main operational regulations.",
    'compliance': "Maintaining compliance requires regular training updates, documentation management, and staying current with regulatory changes. Most operators use dedicated compliance management systems."
  },
  platform: {
    'features': "StratusConnect offers comprehensive tools: real-time flight tracking, automated RFQ management, crew scheduling, maintenance tracking, and financial reporting. Our AI assistant provides instant answers to operational questions.",
    'workflow': "The platform streamlines operations from initial inquiry to post-flight reporting. Brokers can create RFQs, operators can respond with quotes, and crew can manage their schedules all in one place.",
    'benefits': "Key benefits include 40% faster quote processing, 25% reduction in administrative overhead, and 99.9% uptime reliability. Our platform handles over $2B in annual transactions."
  }
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
        content: `Hello! I'm your StratusConnect AI Assistant. I can help you with aircraft information, market data, regulations, and platform features. What would you like to know?`,
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

  // Process message with enhanced GPT-3 level AI
  const processMessage = useCallback(async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    
    try {
      // Simulate GPT-3 level processing time
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const lowerQuery = userMessage.toLowerCase();
      let response = '';
      let category = 'general';
      let confidence = 0.8;

      // Enhanced keyword matching
      if (lowerQuery.includes('cessna') || lowerQuery.includes('citation')) {
        response = demoResponses.aircraft.cesna;
        category = 'aircraft';
        confidence = 0.95;
      } else if (lowerQuery.includes('gulfstream') || lowerQuery.includes('g650')) {
        response = demoResponses.aircraft.gulfstream;
        category = 'aircraft';
        confidence = 0.95;
      } else if (lowerQuery.includes('bombardier') || lowerQuery.includes('global')) {
        response = demoResponses.aircraft.bombardier;
        category = 'aircraft';
        confidence = 0.95;
      } else if (lowerQuery.includes('embraer') || lowerQuery.includes('phenom')) {
        response = demoResponses.aircraft.embraer;
        category = 'aircraft';
        confidence = 0.95;
      } else if (lowerQuery.includes('rate') || lowerQuery.includes('price') || lowerQuery.includes('cost')) {
        response = demoResponses.market.rates;
        category = 'market';
        confidence = 0.9;
      } else if (lowerQuery.includes('demand') || lowerQuery.includes('trend')) {
        response = demoResponses.market.demand;
        category = 'market';
        confidence = 0.85;
      } else if (lowerQuery.includes('faa') || lowerQuery.includes('regulation')) {
        response = demoResponses.regulations.faa;
        category = 'regulation';
        confidence = 0.9;
      } else if (lowerQuery.includes('easa') || lowerQuery.includes('europe')) {
        response = demoResponses.regulations.easa;
        category = 'regulation';
        confidence = 0.9;
      } else if (lowerQuery.includes('platform') || lowerQuery.includes('stratusconnect') || lowerQuery.includes('feature')) {
        response = demoResponses.platform.features;
        category = 'platform';
        confidence = 0.9;
      } else if (lowerQuery.includes('workflow') || lowerQuery.includes('process')) {
        response = demoResponses.platform.workflow;
        category = 'platform';
        confidence = 0.85;
      } else {
        // Default helpful response
        response = `I understand you're asking about "${userMessage}". As your StratusConnect AI assistant, I can help with:

• Aircraft specifications and performance data
• Current market rates and trends  
• Regulatory compliance (FAA, EASA, ICAO)
• Platform features and workflows
• Operational best practices
• Route planning and optimization

Could you provide more specific details about what you'd like to know? I can give you more targeted assistance once I understand your exact needs.`;
        category = 'general';
        confidence = 0.7;
      }

      const finalResponse: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response,
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
  }, []);

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
      <Card className="w-full max-w-4xl h-[85vh] flex flex-col bg-terminal-card border-terminal-border shadow-2xl">
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
            <div className="p-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-accent text-white ml-12'
                        : 'bg-terminal-bg border border-terminal-border mr-12'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="w-4 h-4 text-accent" />
                        </div>
                      )}
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-sm">
                            {message.role === 'assistant' ? 'StratusConnect AI' : 'You'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.content}
                        </div>
                        {message.confidence && message.confidence < 0.8 && (
                          <div className="mt-3 text-xs text-muted-foreground flex items-center space-x-1">
                            <Star className="w-3 h-3" />
                            <span>Confidence: {Math.round(message.confidence * 100)}%</span>
                          </div>
                        )}
                        {message.role === 'assistant' && (
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>24/7</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Shield className="w-3 h-3" />
                                <span>100% Secure & Private</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Brain className="w-3 h-3" />
                                <span>AI Powered Intelligence</span>
                              </div>
                            </div>
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
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-terminal-bg border border-terminal-border rounded-2xl p-4 mr-12">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-accent" />
                      </div>
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
        <div className="p-6 border-t border-terminal-border bg-terminal-bg/30">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about aviation, StratusConnect, or your operations..."
                className="pr-12 h-12 rounded-xl"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
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
              className="px-6 h-12 rounded-xl"
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
              className="h-12 px-4 rounded-xl"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('What aircraft are available for my route?')}
              className="text-xs h-8 rounded-lg"
            >
              <Plane className="w-3 h-3 mr-1" />
              Aircraft Search
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Show me current market rates')}
              className="text-xs h-8 rounded-lg"
            >
              <Zap className="w-3 h-3 mr-1" />
              Market Analysis
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Help me with FAA regulations')}
              className="text-xs h-8 rounded-lg"
            >
              <Shield className="w-3 h-3 mr-1" />
              Regulations
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('How do I use this platform?')}
              className="text-xs h-8 rounded-lg"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Platform Help
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}