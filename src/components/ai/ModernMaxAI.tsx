import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Minimize2, 
  Maximize2, 
  Move,
  Zap,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  MessageSquare,
  FileText,
  Users,
  BarChart3
} from 'lucide-react';

interface ModernMaxAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
  isAuthenticated: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface AIInsight {
  id: string;
  type: 'market' | 'opportunity' | 'risk' | 'performance';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  icon: React.ReactNode;
}

export const ModernMaxAI: React.FC<ModernMaxAIProps> = ({
  isVisible,
  onToggleVisibility,
  userType,
  isAuthenticated
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 420, y: 100 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Hello! I'm Max, your advanced aviation AI assistant. I can help you with market analysis, route optimization, deal insights, and much more. What would you like to know?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'insights'>('chat');
  
  const chatRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'market',
      title: 'European Charter Surge',
      description: 'Demand for European routes increased 23% this week. London-NYC showing highest activity.',
      confidence: 94,
      actionable: true,
      icon: <TrendingUp className="w-5 h-5 text-green-400" />
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Miami Positioning',
      description: 'Miami-based aircraft showing 18% below market rates. Great opportunity for repositioning.',
      confidence: 87,
      actionable: true,
      icon: <Target className="w-5 h-5 text-blue-400" />
    },
    {
      id: '3',
      type: 'performance',
      title: 'Response Excellence',
      description: 'Your average response time is 2.3 minutes vs 4.1 industry average. Top 5% performance.',
      confidence: 98,
      actionable: false,
      icon: <Star className="w-5 h-5 text-yellow-400" />
    }
  ];

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
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
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('market') || input.includes('trend')) {
      return "Based on current market data, European charter demand is surging 23% this week. London-NYC routes are particularly active with pricing 18% below market average. I recommend positioning aircraft in Miami for optimal coverage.";
    }
    
    if (input.includes('route') || input.includes('flight')) {
      return "I can help you analyze routes! The most profitable routes this month are London-NYC, Paris-Dubai, and Tokyo-Singapore. Would you like me to run a detailed analysis on any specific route?";
    }
    
    if (input.includes('deal') || input.includes('rfq')) {
      return "Your current RFQ performance is excellent - 2.3 minute average response time puts you in the top 5% of brokers. You have 2 active RFQs with 2 quotes received. Would you like me to analyze your quote competitiveness?";
    }
    
    if (input.includes('performance') || input.includes('stats')) {
      return "Your performance metrics: 2 active RFQs, 2 quotes received, 0 deals closed, $2.1M volume potential. Your response time of 2.3 minutes is 40% faster than industry average. You're performing exceptionally well!";
    }
    
    return "I understand you're asking about aviation operations. As your AI assistant, I can help with market analysis, route optimization, deal insights, performance tracking, and strategic recommendations. Could you be more specific about what you'd like to know?";
  };

  const handleDragStart = (e: React.MouseEvent) => {
    if (dragRef.current && !isMinimized) {
      setIsDragging(true);
      const rect = dragRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleDragMove = (e: MouseEvent) => {
    if (isDragging && !isMinimized) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible) return null;

  return (
    <div
      ref={dragRef}
      className={`fixed z-50 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-96 h-[600px]'
      }`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/90 rounded-t-xl cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Max AI</h3>
            <p className="text-xs text-slate-400">Aviation Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4 text-slate-400" /> : <Minimize2 className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-slate-700/50">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'chat'
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-800/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-800/50'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              Insights
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col h-[480px]">
            {activeTab === 'chat' ? (
              <>
                {/* Chat Messages */}
                <div
                  ref={chatRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.type === 'user'
                            ? 'bg-orange-500 text-white'
                            : 'bg-slate-700/50 text-slate-200'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-slate-700/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask Max AI anything..."
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      onClick={() => setIsListening(!isListening)}
                      className={`p-2 rounded-lg transition-colors ${
                        isListening ? 'bg-red-500 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Insights Tab */
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {insight.icon}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white text-sm">{insight.title}</h4>
                          <span className="text-xs bg-slate-600 text-slate-300 px-2 py-1 rounded">
                            {insight.confidence}% confidence
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-2">{insight.description}</p>
                        {insight.actionable && (
                          <button className="text-orange-400 text-xs hover:text-orange-300 transition-colors">
                            Take Action →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
