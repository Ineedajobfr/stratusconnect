import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Brain, MessageSquare, Zap, Eye, EyeOff, X } from 'lucide-react';

interface CluelyStyleAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const CluelyStyleAI: React.FC<CluelyStyleAIProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [liveInsights, setLiveInsights] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [transcript, setTranscript] = useState<string>('');
  const insightsRef = useRef<HTMLDivElement>(null);

  // Simulate real-time aviation insights like Cluely
  const aviationInsights = [
    "Gulfstream G650ER specs: 7,500nm range, 19 passengers, Mach 0.925 cruise",
    "EU ETS applies to flights within EU - consider carbon credits or SAF",
    "Transatlantic routes via Shannon (EINN) could save 45 minutes flight time",
    "For G650ER: 2 pilots with type rating + 2 cabin crew with VIP experience",
    "Current jet fuel: $2.85/gallon globally, SAF premium $3-6/gallon above",
    "Weather at destination: 25kt crosswinds - monitor updates, have alternates ready"
  ];

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(true);
    setTranscript('');
    
    // Simulate processing
    setTimeout(() => {
      const mockQuestion = "What's the best aircraft for a transatlantic flight with 12 passengers?";
      setCurrentQuestion(mockQuestion);
      setTranscript(mockQuestion);
      
      // Generate live insights with delay like Cluely
      const insights: string[] = [];
      let insightIndex = 0;
      
      const addInsight = () => {
        if (insightIndex < aviationInsights.length) {
          insights.push(aviationInsights[insightIndex]);
          setLiveInsights([...insights]);
          insightIndex++;
          
          if (insightIndex < aviationInsights.length) {
            setTimeout(addInsight, 1500 + Math.random() * 1000);
          } else {
            setIsProcessing(false);
          }
        }
      };
      
      setTimeout(addInsight, 1000);
    }, 1500);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  const clearInsights = () => {
    setLiveInsights([]);
    setCurrentQuestion('');
    setTranscript('');
  };

  // Auto-scroll to latest insight
  useEffect(() => {
    if (insightsRef.current) {
      insightsRef.current.scrollTop = insightsRef.current.scrollHeight;
    }
  }, [liveInsights]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleVisibility}
          className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
          aria-label="Open Aviation AI Assistant"
        >
          <Brain className="w-7 h-7" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Cluely-style translucent overlay */}
      <div className="absolute top-6 right-6 w-80 max-h-[85vh] bg-black/20 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Aviation AI</h3>
              <p className="text-white/60 text-xs">Real-time insights</p>
            </div>
          </div>
          <button
            onClick={onToggleVisibility}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                isListening
                  ? 'bg-red-500/80 hover:bg-red-500 text-white'
                  : 'bg-orange-500/80 hover:bg-orange-500 text-white'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Start Listening
                </>
              )}
            </button>
            
            {liveInsights.length > 0 && (
              <button
                onClick={clearInsights}
                className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Current Question */}
        {currentQuestion && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-orange-400" />
              <span className="text-white/80 text-sm font-medium">Current Discussion</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">{currentQuestion}</p>
          </div>
        )}

        {/* Live Insights */}
        <div className="flex-1 overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-white/80 text-sm font-medium">Live Insights</span>
              {isProcessing && (
                <div className="flex items-center gap-1 ml-2">
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              )}
            </div>
            
            <div 
              ref={insightsRef}
              className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              {liveInsights.map((insight, index) => (
                <div
                  key={index}
                  className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl animate-in slide-in-from-bottom-2 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <p className="text-white/90 text-sm leading-relaxed">{insight}</p>
                </div>
              ))}
              
              {liveInsights.length === 0 && !isProcessing && (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/60 text-sm">
                    {isListening ? 'Listening for aviation insights...' : 'Start listening to see live insights'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Tap listen to link AI to system audio for live insights</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
