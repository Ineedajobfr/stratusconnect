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
  DollarSign,
  Sparkles,
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe
} from 'lucide-react';
import { aiIntelligenceService, AIMessage, AIAnalysis } from '@/lib/ai-intelligence-service';
import { stratusAssistOrchestrator } from '@/lib/stratus-assist-orchestrator';
import { SearchResult } from '@/lib/ai-search-service';

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

const terminalGradients = {
  broker: 'from-green-500/20 to-emerald-500/10',
  operator: 'from-blue-500/20 to-cyan-500/10',
  pilot: 'from-purple-500/20 to-violet-500/10',
  crew: 'from-orange-500/20 to-amber-500/10'
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
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [showSources, setShowSources] = useState(false);
  const [searchSources, setSearchSources] = useState<SearchResult[]>([]);
  const [searchReasoning, setSearchReasoning] = useState<string>('');
  const [maxStatus, setMaxStatus] = useState<'local' | 'fallback' | 'checking'>('checking');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const TerminalIcon = terminalIcons[terminalType];
  const terminalColor = terminalColors[terminalType];
  const terminalGradient = terminalGradients[terminalType];

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

  // Check Max status on mount
  useEffect(() => {
    const checkMaxStatus = async () => {
      try {
        // Test if Ollama is available
        const response = await fetch('http://127.0.0.1:11434/api/tags');
        if (response.ok) {
          setMaxStatus('local');
        } else {
          setMaxStatus('fallback');
        }
      } catch {
        setMaxStatus('fallback');
      }
    };

    checkMaxStatus();
  }, []);

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
      // Use the new orchestrator for professional aviation responses
      const orchestratorResponse = await stratusAssistOrchestrator.processMessage(
        userMessage,
        conversationId,
        terminalType
      );

      const response: AIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: orchestratorResponse.reply,
        metadata: {
          confidence: orchestratorResponse.confidence,
          sources: [],
          reasoning: `Processed using Stratus Assist Orchestrator. State: ${orchestratorResponse.newState}. Tool calls: ${orchestratorResponse.toolCalls?.join(', ') || 'none'}`
        },
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, response]);
      
      // Update suggestions based on orchestrator response
      if (orchestratorResponse.newState === 'intake') {
        setSuggestions([
          "Gulfstream G550 London to Nice",
          "Falcon 7X Paris to Dubai", 
          "Global 6000 New York to Miami",
          "Challenger 350 Frankfurt to Rome"
        ]);
      } else if (orchestratorResponse.newState === 'presenting') {
        setSuggestions([
          "Request confirmation",
          "See cabin photos",
          "Check operator details",
          "Compare alternatives"
        ]);
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
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>')
      .replace(/• (.*?)(?=\n|$)/g, '<li class="flex items-start space-x-2"><ArrowRight className="w-3 h-3 mt-1 text-accent flex-shrink-0" /><span>$1</span></li>')
      .replace(/\n/g, '<br/>');
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'market_analysis': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'route_optimization': return <Target className="w-4 h-4 text-blue-500" />;
      case 'pricing_insight': return <DollarSign className="w-4 h-4 text-yellow-500" />;
      case 'demand_forecast': return <BarChart3 className="w-4 h-4 text-purple-500" />;
      case 'risk_assessment': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Brain className="w-4 h-4 text-accent" />;
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent/25 ${className}`}
        title="Open AI Assistant"
      >
        <div className="relative">
          <Brain className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 left-6 z-50 w-[420px] h-[600px] shadow-2xl border-2 border-accent/30 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm ${isMinimized ? 'h-16' : ''} ${className}`}>
      <CardHeader className="pb-3 bg-gradient-to-r from-accent/20 to-accent/10 border-b border-accent/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${terminalGradient} shadow-lg`}>
              <TerminalIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span>Max AI</span>
                <Badge 
                  variant={maxStatus === 'local' ? 'default' : maxStatus === 'fallback' ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {maxStatus === 'local' ? 'Local' : maxStatus === 'fallback' ? 'Fallback' : 'Checking...'}
                </Badge>
              </CardTitle>
              <p className="text-xs text-gray-300 capitalize font-medium">{terminalType} Terminal</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-9 w-9 p-0 hover:bg-accent/20 text-gray-300 hover:text-white transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-9 w-9 p-0 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="flex-1 flex flex-col p-0 h-[520px]">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-accent/30 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-accent to-accent/80 text-white'
                        : 'bg-gradient-to-r from-slate-700/80 to-slate-600/80 text-gray-100 backdrop-blur-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {msg.role === 'assistant' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      {msg.role === 'user' && (
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex-1">
                        <div
                          className="prose prose-invert prose-sm max-w-none"
                          dangerouslySetInnerHTML={{
                            __html: formatMessage(msg.content)
                          }}
                        />
                        
                        {/* Sources at bottom of message */}
                        {msg.metadata?.sources && msg.metadata.sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-gray-700/50">
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="w-3 h-3 text-blue-400" />
                              <span className="text-xs font-medium text-blue-400">Sources:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {msg.metadata.sources.slice(0, 3).map((source: any, index: number) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-900/30 text-blue-300 border border-blue-700/50"
                                >
                                  {source.source}
                                </span>
                              ))}
                              {msg.metadata.sources.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-700/50 text-gray-400 border border-gray-600/50">
                                  +{msg.metadata.sources.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {msg.metadata?.confidence && (
                          <div className="mt-3 flex items-center space-x-2 text-xs text-gray-400">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span>Confidence: {Math.round((msg.metadata.confidence || 0.5) * 100)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gradient-to-r from-slate-700/80 to-slate-600/80 rounded-2xl p-4 flex items-center space-x-3 backdrop-blur-sm">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent to-accent/80 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-300">AI is thinking</span>
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1 h-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Search Sources Panel */}
            {searchSources.length > 0 && (
              <div className="border-t border-accent/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/5">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-500/5 transition-colors"
                  onClick={() => setShowSources(!showSources)}
                >
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-semibold text-white">Search Sources</span>
                    <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                      {searchSources.length} sources
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                  >
                    {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                {showSources && (
                  <div className="px-4 pb-4 space-y-3">
                    {searchSources.map((source, index) => (
                      <div key={source.id} className="bg-slate-700/50 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white">{source.title}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              source.source === 'internet' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                              source.source === 'database' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                              'bg-purple-500/20 text-purple-400 border-purple-500/30'
                            }`}
                          >
                            {source.source}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-2">{source.content}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            {Math.round((source.confidence || 0.5) * 100)}% confidence
                          </span>
                          {source.url && (
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-400 hover:text-blue-300 underline"
                            >
                              View Source
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                    {searchReasoning && (
                      <div className="bg-slate-800/50 rounded-lg p-3 border-l-4 border-blue-500">
                        <div className="flex items-center space-x-2 mb-2">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-semibold text-white">AI Reasoning</span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed">{searchReasoning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}


            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-t border-accent/20 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-white">Quick Suggestions</span>
                    <Badge variant="outline" className="text-xs bg-slate-700/50 text-gray-300 border-slate-600">
                      {suggestions.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                  >
                    {showSuggestions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                {showSuggestions && (
                  <div className="px-4 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, 3).map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-8 bg-slate-700/50 border-slate-600 text-gray-200 hover:bg-accent/20 hover:border-accent/50 hover:text-white transition-all duration-200"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            {actions.length > 0 && (
              <div className="border-t border-accent/20 bg-gradient-to-r from-slate-800/50 to-slate-700/50">
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
                  onClick={() => setShowActions(!showActions)}
                >
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-accent" />
                    <span className="text-sm font-semibold text-white">Quick Actions</span>
                    <Badge variant="outline" className="text-xs bg-slate-700/50 text-gray-300 border-slate-600">
                      {actions.length}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-300 hover:text-white"
                  >
                    {showActions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>
                {showActions && (
                  <div className="px-4 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {actions.slice(0, 3).map((action, index) => (
                        <Button
                          key={index}
                          variant="default"
                          size="sm"
                          onClick={() => handleActionClick(action)}
                          className="text-xs h-8 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg hover:shadow-accent/25 transition-all duration-200"
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-accent/20 p-4 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm">
              <div className="flex space-x-3">
                <Input
                  ref={inputRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about aviation..."
                  className="flex-1 bg-slate-700/50 border-slate-600 text-white placeholder:text-gray-400 focus:border-accent/50 focus:ring-accent/20 rounded-xl"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isLoading}
                  className="w-12 h-12 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-white shadow-lg hover:shadow-accent/25 transition-all duration-200 rounded-xl"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
}