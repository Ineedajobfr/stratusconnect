import React, { useState, useEffect } from 'react';
import { Brain, Mic, MicOff, Search, Users, FileText, Settings, Zap, MessageSquare, Calendar, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LiveAviationAssistant } from './LiveAviationAssistant';
import { AviationKnowledgeSearch } from './AviationKnowledgeSearch';
import { MeetingPreparation } from './MeetingPreparation';
import { FollowUpGenerator } from './FollowUpGenerator';

interface EnhancedAviationAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const EnhancedAviationAI: React.FC<EnhancedAviationAIProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'search' | 'meeting' | 'followup'>('live');
  const [isListening, setIsListening] = useState(false);
  const [currentInsights, setCurrentInsights] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Simulate real-time insights counter
  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setCurrentInsights(prev => prev + 1);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isListening]);

  const tabs = [
    { id: 'live', label: 'Live AI', icon: <Zap className="w-4 h-4" />, badge: currentInsights },
    { id: 'search', label: 'Knowledge', icon: <Search className="w-4 h-4" /> },
    { id: 'meeting', label: 'Meeting Prep', icon: <Users className="w-4 h-4" /> },
    { id: 'followup', label: 'Follow-up', icon: <FileText className="w-4 h-4" /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'live':
        return <LiveAviationAssistant isVisible={true} onToggleVisibility={() => {}} />;
      case 'search':
        return <AviationKnowledgeSearch isVisible={true} onClose={() => setActiveTab('live')} />;
      case 'meeting':
        return <MeetingPreparation onClose={() => setActiveTab('live')} />;
      case 'followup':
        return <FollowUpGenerator onClose={() => setActiveTab('live')} />;
      default:
        return null;
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleVisibility}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-14 h-14 shadow-lg hover:scale-105 transition-transform"
          aria-label="Show Enhanced Aviation AI"
        >
          <Brain className="w-7 h-7" />
        </Button>
      </div>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="terminal-card border-terminal-border bg-terminal-card/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-semibold text-white">Aviation AI</span>
              </div>
              <div className="flex gap-1">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`h-6 w-6 p-0 ${
                      activeTab === tab.id
                        ? 'bg-orange-500 text-white'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                    }`}
                  >
                    {tab.icon}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
                className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-[80vh] z-50">
      <Card className="terminal-card border-terminal-border bg-terminal-card/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-orange-400" />
              <CardTitle className="text-sm font-semibold text-white">
                Enhanced Aviation AI
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mt-3">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 h-8 text-xs ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                <div className="flex items-center gap-1">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs bg-orange-500/20 text-orange-400">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="h-96 overflow-hidden">
            {renderTabContent()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
