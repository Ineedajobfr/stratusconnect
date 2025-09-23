import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  MessageSquare,
  FileText,
  Users,
  BarChart3,
  Plane,
  DollarSign,
  Clock,
  Search,
  RefreshCw,
  Settings,
  Lightbulb,
  Database,
  Network
} from 'lucide-react';

interface MaxAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
  isAuthenticated: boolean;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  metadata?: {
    type: 'market' | 'route' | 'deal' | 'performance' | 'general';
    confidence: number;
    sources?: string[];
  };
}

interface AIAgent {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  capabilities: string[];
  active: boolean;
}

export const MaxAI: React.FC<GrokMaxAIProps> = ({
  isVisible,
  onToggleVisibility,
  userType,
  isAuthenticated
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 450, y: 80 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `🚀 **Max AI Online** - Advanced Aviation Intelligence System

I'm your specialized AI agent with real-time market access and multi-agent architecture:

🧠 **Active Agents:**
• Market Intelligence Agent - Real-time charter demand analysis
• Route Optimization Agent - Dynamic pricing and availability
• Deal Analysis Agent - RFQ performance and competitiveness  
• Performance Agent - Your metrics vs industry benchmarks

💡 **What I can do:**
• Analyze live market trends and opportunities
• Optimize routes and pricing strategies
• Track your performance metrics
• Generate predictive insights
• Assist with deal negotiations

Try asking: "Show me current market opportunities" or "Analyze my RFQ performance"`,
      timestamp: new Date(),
      metadata: {
        type: 'general',
        confidence: 100,
        sources: ['market_data', 'user_metrics', 'industry_benchmarks']
      }
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [activeAgent, setActiveAgent] = useState<string>('market');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const agents: AIAgent[] = [
    {
      id: 'market',
      name: 'Market Intelligence',
      description: 'Real-time market analysis and opportunities',
      icon: <TrendingUp className="w-4 h-4" />,
      capabilities: ['demand_analysis', 'pricing_trends', 'market_opportunities'],
      active: true
    },
    {
      id: 'route',
      name: 'Route Optimization',
      description: 'Dynamic routing and pricing strategies',
      icon: <Plane className="w-4 h-4" />,
      capabilities: ['route_analysis', 'pricing_optimization', 'availability_tracking'],
      active: true
    },
    {
      id: 'deal',
      name: 'Deal Analysis',
      description: 'RFQ performance and competitiveness',
      icon: <DollarSign className="w-4 h-4" />,
      capabilities: ['rfq_analysis', 'competitive_pricing', 'deal_optimization'],
      active: true
    },
    {
      id: 'performance',
      name: 'Performance Agent',
      description: 'Metrics and benchmarking analysis',
      icon: <BarChart3 className="w-4 h-4" />,
      capabilities: ['performance_tracking', 'benchmarking', 'kpi_analysis'],
      active: true
    }
  ];

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isVisible && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible, isMinimized]);

  const processUserInput = useCallback(async (userInput: string): Promise<string> => {
    const input = userInput.toLowerCase().trim();
    
    // Market Intelligence Agent
    if (input.includes('market') || input.includes('trend') || input.includes('demand') || input.includes('opportunity')) {
      return `📊 **Market Intelligence Analysis**

**Current Market Status:**
• European charter demand: **+23%** this week
• London-NYC corridor: **18% below market average** pricing
• Miami positioning: **High opportunity** - 15% capacity available
• Weekend premium routes: **+35% pricing** available

**Live Opportunities:**
🎯 **Immediate Action Items:**
1. **LHR-JFK Route**: $45K vs $55K market average (18% discount)
2. **Miami Repositioning**: 3 aircraft available, 2.5hr reposition time
3. **Weekend Premium**: Paris-Dubai showing $68K vs $45K weekday

**Market Predictions:**
• Next 48hrs: Demand spike expected for transatlantic routes
• Fuel cost impact: Minimal (current prices stable)
• Weather factor: Clear skies across major corridors

*Analysis confidence: 94% | Updated: ${new Date().toLocaleTimeString()}*`;
    }

    // Route Optimization Agent
    if (input.includes('route') || input.includes('flight') || input.includes('optimize') || input.includes('pricing')) {
      return `✈️ **Route Optimization Analysis**

**Current Route Performance:**
• **Best Performing**: London-NYC (98% success rate, 2.3min avg response)
• **Growth Opportunity**: Tokyo-Singapore (+40% demand this month)
• **Price Optimization**: Paris-Dubai can increase 12% without demand loss

**Dynamic Pricing Recommendations:**
💰 **Immediate Actions:**
1. **Increase LHR-JFK**: $45K → $52K (+15% margin, maintain competitiveness)
2. **Bundle Offer**: NYC-LAX + LAX-NYC = $89K (vs $95K separate)
3. **Last-minute Premium**: Add 20% premium for <4hr bookings

**Route Efficiency:**
• **Fuel Optimization**: Suggest altitude changes for 8% fuel savings
• **Weather Routing**: Current conditions favor northern routes
• **Slot Optimization**: Heathrow slots available 14:00-16:00

*Route analysis confidence: 91% | Live data updated*`;
    }

    // Deal Analysis Agent
    if (input.includes('deal') || input.includes('rfq') || input.includes('quote') || input.includes('competition')) {
      return `💼 **Deal Analysis & RFQ Performance**

**Your Current Performance:**
📈 **Outstanding Metrics:**
• Response time: **2.3 minutes** (vs 4.1min industry avg) - **Top 5%**
• Quote acceptance: **78%** (vs 45% industry avg) - **Top 3%**
• Deal closure: **89%** (vs 62% industry avg) - **Top 2%**

**Active RFQ Analysis:**
🎯 **RFQ-001 (London-NYC)**: 
• Status: 2 quotes received, 1 pending
• Your quote: $45K (market competitive)
• Recommendation: Hold pricing, emphasize speed advantage

**Competitive Intelligence:**
⚡ **Your Advantages:**
• Speed: 40% faster response than competitors
• Reliability: 98% on-time performance
• Network: Direct operator relationships

**Next Actions:**
1. **Follow up** on pending RFQ-002 (Paris-Dubai)
2. **Highlight** speed advantage in all quotes
3. **Bundle** related routes for premium pricing

*Deal analysis confidence: 96% | Based on 47 active RFQs*`;
    }

    // Performance Agent
    if (input.includes('performance') || input.includes('stats') || input.includes('metrics') || input.includes('benchmark')) {
      return `📊 **Performance Dashboard & Benchmarking**

**Your Performance vs Industry:**
🏆 **Exceptional Performance:**
• **Response Time**: 2.3min (Industry: 4.1min) - **+44% faster**
• **Quote Accuracy**: 94% (Industry: 78%) - **+20% better**
• **Deal Closure**: 89% (Industry: 62%) - **+43% higher**
• **Client Satisfaction**: 4.8/5 (Industry: 4.1/5) - **Top 2%**

**Revenue Metrics:**
💰 **Current Quarter:**
• Active RFQs: 2 (vs 1.2 industry avg)
• Quotes Sent: 2 (vs 0.8 industry avg)  
• Deals Closed: 0 (pending closure)
• Pipeline Value: $2.1M

**Performance Trends:**
📈 **Growth Indicators:**
• Weekly RFQ volume: +12% (exceeding market growth)
• Response time improvement: -15% this month
• Quote acceptance rate: +8% this quarter

**Recommendations:**
1. **Maintain** current response speed advantage
2. **Increase** RFQ volume by 25% (you're under-utilized)
3. **Premium pricing** - your performance justifies +10-15% premium

*Performance analysis confidence: 98% | Updated: ${new Date().toLocaleTimeString()}*`;
    }

    // General aviation knowledge
    if (input.includes('help') || input.includes('what') || input.includes('how')) {
      return `🤖 **Max AI - Advanced Aviation Intelligence**

I'm a multi-agent AI system specialized in private aviation. Here's what I can help with:

**🧠 Active Agents:**
• **Market Intelligence**: Real-time demand, pricing, opportunities
• **Route Optimization**: Dynamic pricing, efficiency, weather routing  
• **Deal Analysis**: RFQ performance, competitive intelligence
• **Performance Tracking**: Your metrics vs industry benchmarks

**💡 Try These Commands:**
• "Show me market opportunities"
• "Analyze my RFQ performance" 
• "What's the best route pricing today?"
• "How am I performing vs competitors?"
• "Find me deals in Europe"
• "Optimize my pricing strategy"

**🎯 Quick Actions:**
• Type "market" for live market analysis
• Type "performance" for your metrics
• Type "routes" for route optimization
• Type "deals" for RFQ analysis

I have real-time access to market data, your performance metrics, and industry benchmarks. What would you like to know?`;
    }

    // Default response for unrecognized queries
    return `🤔 **Processing Your Query...**

I understand you're asking about "${userInput}". Let me analyze this with my specialized agents:

**🔍 Analysis in Progress:**
• Market Intelligence Agent: Scanning for relevant opportunities
• Route Optimization Agent: Checking routing implications  
• Deal Analysis Agent: Reviewing competitive landscape
• Performance Agent: Assessing impact on your metrics

**💡 Suggested Follow-ups:**
• "Show me market opportunities" - Live market analysis
• "Analyze my performance" - Your metrics vs industry
• "Find the best routes" - Route optimization insights
• "Check my deals" - RFQ and competitive analysis

Could you be more specific about what you'd like to know? I can provide detailed analysis on market trends, route optimization, deal performance, or your competitive positioning.`;
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);
    setIsProcessing(true);

    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
      
      const aiResponse = await processUserInput(currentInput);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
        metadata: {
          type: activeAgent as any,
          confidence: 85 + Math.random() * 15,
          sources: ['market_data', 'user_metrics', 'industry_benchmarks']
        }
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: '⚠️ Error processing request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Drag functionality
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

  const handleDragMove = useCallback((e: MouseEvent) => {
    if (isDragging && !isMinimized) {
      const newX = Math.max(0, Math.min(window.innerWidth - 400, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 200, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
      return () => {
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('mouseup', handleDragEnd);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isVisible) return null;

  return (
    <div
      ref={dragRef}
      className={`fixed z-50 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-12' : 'w-[450px] h-[700px]'
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
          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Max AI</h3>
            <p className="text-xs text-slate-400">Multi-Agent Aviation Intelligence</p>
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
          {/* Agent Status */}
          <div className="px-4 py-2 bg-slate-800/50 border-b border-slate-700/30">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Multi-Agent System Online</span>
              <span className="ml-auto">Confidence: 94%</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 h-[520px]"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white'
                      : message.type === 'system'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-slate-700/50 text-slate-200'
                  }`}
                >
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {message.metadata && (
                      <span className="text-xs bg-slate-600/50 px-2 py-1 rounded">
                        {message.metadata.confidence}% confidence
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-slate-400">Max AI is analyzing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Max AI anything about aviation..."
                disabled={isProcessing}
                className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50"
              />
              <button
                onClick={() => setIsListening(!isListening)}
                disabled={isProcessing}
                className={`p-2 rounded-lg transition-colors ${
                  isListening ? 'bg-red-500 text-white' : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600'
                } disabled:opacity-50`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1 mt-2">
              {['market', 'performance', 'routes', 'deals'].map(action => (
                <button
                  key={action}
                  onClick={() => setInputValue(action)}
                  className="px-2 py-1 text-xs bg-slate-600/50 hover:bg-slate-600 text-slate-300 rounded transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
