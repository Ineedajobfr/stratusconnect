import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Brain, MessageSquare, Zap, Eye, EyeOff, X } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface CluelyChatbotProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const CluelyChatbot: React.FC<CluelyChatbotProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "I'm your aviation AI assistant. Ask me anything about aircraft specs, regulations, routes, or market data.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Aviation knowledge responses
  const getAviationResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('gulfstream') || lowerQuestion.includes('g650')) {
      return "The Gulfstream G650ER is an ultra-long-range business jet with a range of 7,500nm and can carry up to 19 passengers. It features a maximum cruise speed of Mach 0.925 and flies at altitudes up to 51,000 feet. The aircraft has a cabin volume of 2,140 cubic feet with a full galley and private lavatory.";
    }
    
    if (lowerQuestion.includes('transatlantic') || lowerQuestion.includes('trans-atlantic')) {
      return "For transatlantic flights, popular routes include JFK-LHR, BOS-LHR, and LAX-LHR. Alternative routing via Shannon (EINN) can provide fuel stops and weather alternatives. North Atlantic Tracks (NAT) provide organized routes that change daily based on weather conditions.";
    }
    
    if (lowerQuestion.includes('crew') || lowerQuestion.includes('pilot')) {
      return "For aircraft over 12,500 lbs, two pilots are required. Cabin crew requirements vary by passenger count: 1-19 passengers typically require 1-2 cabin crew. All crew must hold appropriate licenses and medical certificates. For VIP operations, additional training in service protocols is recommended.";
    }
    
    if (lowerQuestion.includes('fuel') || lowerQuestion.includes('cost')) {
      return "Jet fuel prices in 2024 average $2.85/gallon globally. Sustainable Aviation Fuel (SAF) premiums range from $3-6/gallon above conventional jet fuel. Prices are influenced by crude oil costs, refining margins, and seasonal demand patterns.";
    }
    
    if (lowerQuestion.includes('regulation') || lowerQuestion.includes('ets')) {
      return "EU ETS applies to all flights departing from or arriving at airports in the European Economic Area. Operators must surrender allowances for their CO2 emissions. The system covers approximately 40% of EU emissions and includes both domestic and international flights.";
    }
    
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('minimum')) {
      return "Standard instrument approach minimums vary by approach type: ILS Category I (200 ft decision height), ILS Category II (100 ft), ILS Category III (0 ft). Weather minimums for VFR operations require 3 miles visibility and 1,000 ft ceiling. Special considerations apply for mountainous terrain.";
    }
    
    return "I can help with aircraft specifications, route planning, crew requirements, regulatory compliance, market data, and weather considerations. Could you be more specific about what you'd like to know?";
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse = getAviationResponse(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const startListening = () => {
    setIsListening(true);
    // Simulate voice input
    setTimeout(() => {
      const mockVoiceInput = "What are the specifications for a Gulfstream G650ER?";
      setInputValue(mockVoiceInput);
      setIsListening(false);
    }, 2000);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when visible
  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleVisibility}
          className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
          aria-label="Open Aviation AI Chatbot"
        >
          <MessageSquare className="w-7 h-7" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Cluely-style chat overlay */}
      <div className="absolute top-6 right-6 w-96 h-[600px] bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Aviation AI</h3>
              <p className="text-white/60 text-xs">Ask me anything</p>
            </div>
          </div>
          <button
            onClick={onToggleVisibility}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white/90'
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 p-3 rounded-2xl">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about aircraft, routes, regulations..."
                className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-orange-500/50 transition-colors text-sm"
                disabled={isListening}
              />
              {isListening && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={startListening}
              disabled={isListening}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isListening
                  ? 'bg-red-500/80 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'
              }`}
            >
              {isListening ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>
            
            <button
              type="submit"
              disabled={!inputValue.trim() || isListening}
              className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <div className="mt-2 text-xs text-white/50 text-center">
            AI second brain for every aviation conversation
          </div>
        </div>
      </div>
    </div>
  );
};
