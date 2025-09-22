import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Bot, 
  User, 
  Loader2,
  MessageSquare,
  Zap,
  Brain,
  Shield,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { stratusConnectAI, ChatMessage, ChatSession } from '@/lib/ai-chatbot-system';

interface AdvancedAIChatbotProps {
  userType?: 'broker' | 'operator' | 'pilot' | 'crew' | 'admin';
  className?: string;
}

export default function AdvancedAIChatbot({ 
  userType = 'broker',
  className = "" 
}: AdvancedAIChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize chat session
    const newSession = stratusConnectAI.createSession(`user_${Date.now()}`, userType);
    setSession(newSession);
    setMessages(newSession.messages);
  }, [userType]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Add user message immediately
      const userMsg = stratusConnectAI.addMessage('user', userMessage);
      setMessages(prev => [...prev, userMsg]);

      // Generate AI response
      const response = await stratusConnectAI.processMessage(userMessage);
      setMessages(prev => [...prev, response]);

      // Speak response if voice is enabled
      if (isVoiceEnabled) {
        stratusConnectAI.speak(response.content);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoice = () => {
    if (isVoiceEnabled) {
      stratusConnectAI.disableVoice();
      setIsVoiceEnabled(false);
    } else {
      stratusConnectAI.enableVoice();
      setIsVoiceEnabled(true);
    }
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Not Supported",
        description: "Your browser doesn't support voice input.",
        variant: "destructive"
      });
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: "Voice Input Error",
        description: "Could not process voice input. Please try again.",
        variant: "destructive"
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
      toast({
        title: "Voice Input Error",
        description: "Could not initialize voice input. Please try again.",
        variant: "destructive"
      });
    }
  };

  const clearChat = () => {
    stratusConnectAI.clearSession();
    const newSession = stratusConnectAI.createSession(`user_${Date.now()}`, userType);
    setSession(newSession);
    setMessages(newSession.messages);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getAvatarIcon = (role: string) => {
    return role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getAvatarColor = (role: string) => {
    return role === 'user' ? 'bg-blue-500' : 'bg-accent';
  };

  return (
    <Card className={`terminal-card border-terminal-border h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <Brain className="w-5 h-5 text-accent" />
            StratusConnect AI Assistant
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {userType.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleVoice}
              className={isVoiceEnabled ? 'text-accent' : 'text-muted-foreground'}
            >
              {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Your intelligent aviation assistant with voice capabilities and comprehensive industry knowledge
        </p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={getAvatarColor(message.role)}>
                    {getAvatarIcon(message.role)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-accent text-white'
                    : 'bg-muted text-foreground'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'You' : 'StratusConnect AI'}
                  </span>
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={getAvatarColor(message.role)}>
                    {getAvatarIcon(message.role)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-accent">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted text-foreground rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-terminal-border p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about aviation, StratusConnect, or your operations..."
                className="pr-10"
                disabled={isLoading}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceInput}
                disabled={isLoading || isListening}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              >
                {isListening ? (
                  <Loader2 className="w-4 h-4 animate-spin text-accent" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-accent hover:bg-accent/80"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure & Private
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                AI-Powered
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                24/7 Available
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isVoiceEnabled && (
                <Badge variant="outline" className="text-xs">
                  Voice Enabled
                </Badge>
              )}
              {isListening && (
                <Badge variant="outline" className="text-xs text-accent">
                  Listening...
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
