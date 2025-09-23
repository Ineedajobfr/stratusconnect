import React, { useState } from 'react';
import { Brain, MessageSquare, Zap, Eye, EyeOff } from 'lucide-react';
import { CluelyStyleAI } from './CluelyStyleAI';
import { CluelyChatbot } from './CluelyChatbot';

interface CluelyAviationAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const CluelyAviationAI: React.FC<CluelyAviationAIProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [mode, setMode] = useState<'live' | 'chat'>('live');

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleVisibility}
          className="w-14 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center group"
          aria-label="Open Aviation AI Assistant"
        >
          <Brain className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mode Toggle */}
      <div className="fixed bottom-32 right-6 z-50">
        <div className="bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-1 flex shadow-lg">
          <button
            onClick={() => setMode('live')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
              mode === 'live'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap className="w-3 h-3" />
            Live
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 ${
              mode === 'chat'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            Chat
          </button>
        </div>
      </div>

      {/* Main AI Interface */}
      {mode === 'live' ? (
        <CluelyStyleAI isVisible={isVisible} onToggleVisibility={onToggleVisibility} />
      ) : (
        <CluelyChatbot isVisible={isVisible} onToggleVisibility={onToggleVisibility} />
      )}
    </>
  );
};
