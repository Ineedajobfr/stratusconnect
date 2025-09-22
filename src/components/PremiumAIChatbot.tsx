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
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { processAviationQuery, learnFromFeedback, getPersonalizedRecommendations } from '@/lib/aviation-knowledge-base';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  confidence?: number;
  category?: string;
  data?: any;
}

interface PremiumAIChatbotProps {
  userType: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
  isMinimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}

export default function PremiumAIChatbot({ 
  userType, 
  className = "",
  isMinimized = false,
  onMinimize,
  onMaximize,
  onClose
}: PremiumAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [responseSpeed, setResponseSpeed] = useState<'fast' | 'ultra'>('ultra');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  const { user } = useAuth();
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
        content: `Welcome to StratusConnect AI Assistant! I'm your intelligent aviation companion with access to comprehensive databases, real-time market data, and industry expertise. How can I help you today?`,
        timestamp: new Date(),
        confidence: 1.0,
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
    utterance.rate = responseSpeed === 'ultra' ? 1.2 : 1.0;
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
  }, [isMuted, voiceEnabled, responseSpeed]);

  // Process message with AI
  const processMessage = useCallback(async (userMessage: string): Promise<Message> => {
    setIsTyping(true);
    
    try {
      // Simulate ultra-fast processing
      const delay = responseSpeed === 'ultra' ? 300 : 800;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Process with aviation knowledge base
      const result = processAviationQuery(userMessage, userType);
      
      // Add personalized recommendations
      const recommendations = getPersonalizedRecommendations(userType, {});
      const recommendationText = recommendations.length > 0 
        ? `\n\n**Personalized Recommendations:**\n${recommendations.map(r => `• ${r}`).join('\n')}`
        : '';
      
      const response: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: result.response + recommendationText,
        timestamp: new Date(),
        confidence: result.confidence,
        category: result.category,
        data: result.data
      };
      
      // Learn from interaction
      learnFromFeedback({
        userId: user?.id || 'anonymous',
        userType,
        query: userMessage,
        response: result.response,
        rating: 5, // Default high rating for AI responses
        feedback: '',
        timestamp: new Date().toISOString(),
        context: { userType, confidence: result.confidence }
      });
      
      return response;
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
  }, [userType, user?.id, responseSpeed]);

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
                <Badge variant="outline" className="text-xs bg-accent/20 text-accent">
                  {responseSpeed === 'ultra' ? 'ULTRA FAST' : 'FAST'}
                </Badge>
                {voiceEnabled && (
                  <Badge variant="outline" className="text-xs">
                    VOICE ENABLED
                  </Badge>
                )}
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
                <label className="text-sm font-medium text-foreground">Response Speed</label>
                <div className="flex space-x-2">
                  <Button
                    variant={responseSpeed === 'fast' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setResponseSpeed('fast')}
                  >
                    Fast
                  </Button>
                  <Button
                    variant={responseSpeed === 'ultra' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setResponseSpeed('ultra')}
                  >
                    Ultra Fast
                  </Button>
                </div>
              </div>
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
