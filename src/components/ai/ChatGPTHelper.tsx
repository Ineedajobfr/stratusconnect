// ============================================================================
// ChatGPT Integration - AI Assistant for Broker Terminal
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Paperclip, 
  X, 
  Minimize2, 
  Maximize2,
  Lightbulb,
  TrendingUp,
  DollarSign,
  Plane,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  MessageSquare,
  Settings,
  RotateCcw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type: 'text' | 'suggestion' | 'action' | 'error';
  suggestions?: string[];
  actions?: {
    label: string;
    action: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

interface ChatGPTHelperProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize?: () => void;
  isMinimized?: boolean;
  context?: {
    activeTab: string;
    currentRFQ?: any;
    userRole: string;
    recentActivity?: any[];
  };
}

export const ChatGPTHelper: React.FC<ChatGPTHelperProps> = ({
  isOpen,
  onClose,
  onMinimize,
  isMinimized = false,
  context
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // System prompt for ChatGPT
  const systemPrompt = `You are an AI assistant for StratusConnect, a professional aviation broker terminal platform. You help brokers with:

1. RFQ Creation & Management
2. Aircraft Search & Comparison
3. Market Intelligence & Pricing
4. Client Communication
5. Compliance & Regulations
6. Workflow Optimization
7. Financial Calculations
8. Route Planning

Current context:
- User is a ${context?.userRole || 'broker'}
- Active tab: ${context?.activeTab || 'dashboard'}
- Platform: FCA Compliant Aviation Trading Floor

Always provide:
- Specific, actionable advice
- Relevant industry insights
- Step-by-step guidance
- Safety and compliance reminders
- Professional tone

Respond concisely but thoroughly. Ask clarifying questions when needed.`;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your AI assistant for the StratusConnect broker terminal. I can help you with:

• Creating and managing RFQs
• Finding the best aircraft and operators
• Market analysis and pricing insights
• Client communication strategies
• Compliance and regulatory guidance
• Workflow optimization

What would you like help with today?`,
        timestamp: new Date(),
        type: 'text',
        suggestions: [
          'How do I create a multi-leg RFQ?',
          'What aircraft are available for LHR to JFK?',
          'How can I improve my response time?',
          'Show me market trends for Gulfstream routes'
        ]
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Simulate OpenAI API call
      const response = await simulateOpenAIResponse(input, context);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        type: response.type || 'text',
        suggestions: response.suggestions,
        actions: response.actions
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or rephrase your question.',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateOpenAIResponse = async (userInput: string, context?: any): Promise<any> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const input = userInput.toLowerCase();
    
    // RFQ Creation
    if (input.includes('rfq') || input.includes('request') || input.includes('quote')) {
      return {
        content: `To create a multi-leg RFQ in StratusConnect:

1. **Navigate to RFQs tab** - Click on "RFQs" in the main navigation
2. **Click "New RFQ"** - This opens the Multi-Leg RFQ Builder
3. **Add Route Details**:
   - Enter IATA codes (e.g., LHR, JFK)
   - Select departure date and time
   - Specify passenger count (1-20 per leg)
   - Add special requirements

4. **Add Additional Legs** - Click "Add Leg" for multi-leg trips
5. **Review & Publish** - Validate all details before publishing

**Pro Tips:**
- Use IATA codes for accuracy
- Add special requirements early
- Consider time zones for departure times
- Save as draft if not ready to publish

Would you like me to walk you through any specific part of the RFQ creation process?`,
        type: 'suggestion',
        suggestions: [
          'How do I add special requirements?',
          'What are the IATA code requirements?',
          'How do I save as draft?',
          'Show me validation rules'
        ],
        actions: [
          {
            label: 'Open RFQ Builder',
            action: () => {
              // This would trigger navigation to RFQ tab
              console.log('Navigate to RFQ builder');
            },
            icon: Plane
          }
        ]
      };
    }

    // Aircraft Search
    if (input.includes('aircraft') || input.includes('search') || input.includes('find')) {
      return {
        content: `For aircraft search and discovery:

1. **Use the Marketplace tab** - Browse available aircraft
2. **Apply Filters**:
   - Route: Enter departure and destination
   - Aircraft type: Gulfstream, Citation, etc.
   - Price range: Set your budget
   - Date: Specify travel dates
   - Verification: Filter by verified operators

3. **AI Search Assistant** - Use Ctrl+K for natural language search
   - "Find a Gulfstream for London to New York next week"
   - "Show me empty legs under $50,000"
   - "Best aircraft for 8 passengers"

4. **Compare Options** - Select up to 3 aircraft for side-by-side comparison

**Current Market Insights:**
- Gulfstream G650: High demand, premium pricing
- Citation X: Good value for mid-range trips
- Empty legs: 30% average savings available

What specific route or aircraft type are you looking for?`,
        type: 'suggestion',
        suggestions: [
          'Show me Gulfstream availability',
          'Find empty legs for my route',
          'Compare aircraft types',
          'What are current market prices?'
        ]
      };
    }

    // Market Intelligence
    if (input.includes('market') || input.includes('price') || input.includes('trend')) {
      return {
        content: `**Market Intelligence Dashboard:**

**Current Trends:**
- LHR-JFK: High demand, prices up 15% this month
- Empty leg availability: 23% increase week-over-week
- Fuel costs: Down 8% from last month
- Operator capacity: 78% average utilization

**Pricing Insights:**
- Gulfstream G650: $85,000-$120,000 (LHR-JFK)
- Citation X: $45,000-$65,000 (LHR-JFK)
- Best booking window: 2-3 weeks advance
- Peak times: Monday mornings, Friday evenings

**AI Recommendations:**
- Consider empty legs for 30% savings
- Book mid-week for better pricing
- Premium routes showing strong demand
- Weather delays affecting 12% of flights

**Risk Factors:**
- Fuel price volatility: Medium risk
- Weather season approaching: High risk
- Regulatory changes: Low risk

Would you like specific analysis for your route or aircraft type?`,
        type: 'suggestion',
        suggestions: [
          'Analyze my specific route',
          'Show me competitor pricing',
          'What are the best booking times?',
          'How do I track market changes?'
        ]
      };
    }

    // General Help
    return {
      content: `I'd be happy to help! Based on your current context (${context?.activeTab || 'dashboard'} tab), here are some things I can assist with:

**Quick Actions:**
- Create and manage RFQs
- Search for aircraft and operators
- Analyze market trends and pricing
- Optimize your workflow
- Handle client communications
- Ensure compliance

**Current Terminal Features:**
- Dashboard: Real-time metrics and insights
- RFQs: Request for Quote management
- Marketplace: Aircraft search and comparison
- Analytics: Performance tracking
- Billing: Financial management

What specific task would you like help with? Feel free to ask in natural language!`,
      type: 'text',
      suggestions: [
        'How do I get started?',
        'Show me the dashboard features',
        'Help with client communication',
        'What are the keyboard shortcuts?'
      ]
    };
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onMinimize}
          className="bg-brand hover:bg-brand-600 text-text rounded-full w-14 h-14 shadow-lg"
        >
          <Bot className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 z-50 bg-surface-1 border-terminal-border shadow-2xl transition-all duration-300 ${
      isExpanded ? 'w-96 h-[600px]' : 'w-80 h-[500px]'
    }`}>
      <CardHeader className="bg-surface-2 border-b border-terminal-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand/20 rounded-lg">
              <Bot className="w-5 h-5 text-brand" />
            </div>
            <div>
              <CardTitle className="text-sm text-bright">AI Assistant</CardTitle>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-text/70">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={clearChat}
              className="text-text/70 hover:text-text hover:bg-surface-1"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-text/70 hover:text-text hover:bg-surface-1"
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-text/70 hover:text-text hover:bg-surface-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-brand text-text'
                      : 'bg-surface-2 text-text'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-xs border-terminal-border text-text hover:bg-surface-2 mr-1 mb-1"
                        onClick={() => setInput(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {message.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        className="bg-brand/20 hover:bg-brand/30 text-brand border-brand/30 text-xs mr-1 mb-1"
                        onClick={action.action}
                      >
                        {action.icon && <action.icon className="w-3 h-3 mr-1" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}

                <div className={`text-xs text-text/50 mt-1 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-2 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-brand rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm text-text/70">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-terminal-border">
          <div className="flex items-end gap-2">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about the broker terminal..."
              className="flex-1 min-h-[40px] max-h-[120px] bg-surface-2 border-terminal-border text-text placeholder:text-text/50 focus:ring-brand/50 resize-none"
              rows={1}
            />
            <Button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-brand hover:bg-brand-600 text-text disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
