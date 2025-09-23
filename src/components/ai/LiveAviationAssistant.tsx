import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Brain, MessageSquare, Users, FileText, Zap, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveInsight {
  id: string;
  type: 'aircraft' | 'regulation' | 'market' | 'route' | 'crew' | 'safety';
  title: string;
  content: string;
  confidence: number;
  timestamp: Date;
  actionable: boolean;
}

interface AttendeeInfo {
  name: string;
  role: string;
  company: string;
  background: string;
  recentDeals: string[];
  specialties: string[];
}

interface LiveAviationAssistantProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const LiveAviationAssistant: React.FC<LiveAviationAssistantProps> = ({
  isVisible,
  onToggleVisibility
}) => {
  const [isListening, setIsListening] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [liveInsights, setLiveInsights] = useState<LiveInsight[]>([]);
  const [attendees, setAttendees] = useState<AttendeeInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Simulate real-time aviation insights
  const generateAviationInsight = (question: string): LiveInsight => {
    const insightTypes = ['aircraft', 'regulation', 'market', 'route', 'crew', 'safety'];
    const type = insightTypes[Math.floor(Math.random() * insightTypes.length)];
    
    const insights = {
      aircraft: {
        title: "Aircraft Performance Analysis",
        content: "Based on the discussion, the Gulfstream G650ER offers 7,500nm range with 19 passengers. Consider the G700 for longer routes at 7,500nm with 19 passengers.",
        confidence: 0.95
      },
      regulation: {
        title: "Regulatory Compliance Check",
        content: "EU ETS applies to flights within EU. Consider purchasing carbon credits or using SAF (Sustainable Aviation Fuel) for compliance.",
        confidence: 0.88
      },
      market: {
        title: "Market Intelligence",
        content: "Current demand for transatlantic flights is up 23% this quarter. Peak pricing typically occurs 14-21 days before departure.",
        confidence: 0.92
      },
      route: {
        title: "Route Optimization",
        content: "Alternative routing via Shannon (EINN) could save 45 minutes flight time and reduce fuel costs by $8,500 for this route.",
        confidence: 0.87
      },
      crew: {
        title: "Crew Requirements",
        content: "For this aircraft type, you'll need 2 pilots with G650 type rating and 2 cabin crew members with VIP experience.",
        confidence: 0.94
      },
      safety: {
        title: "Safety Considerations",
        content: "Weather conditions at destination show 25kt crosswinds. Recommend monitoring updates and have alternate airports ready.",
        confidence: 0.89
      }
    };

    const insight = insights[type];
    return {
      id: Date.now().toString(),
      type: type as LiveInsight['type'],
      title: insight.title,
      content: insight.content,
      confidence: insight.confidence,
      timestamp: new Date(),
      actionable: true
    };
  };

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(true);
    
    // Simulate processing aviation conversation
    setTimeout(() => {
      const mockQuestion = "What's the best aircraft for a transatlantic flight with 12 passengers?";
      setCurrentQuestion(mockQuestion);
      
      // Generate multiple insights
      const insights = [
        generateAviationInsight(mockQuestion),
        generateAviationInsight(mockQuestion),
        generateAviationInsight(mockQuestion)
      ];
      
      setLiveInsights(insights);
      setIsProcessing(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  const generateFollowUp = () => {
    // Simulate generating follow-up email and notes
    return {
      email: `Subject: Follow-up on Transatlantic Charter Discussion

Hi [Name],

Following our discussion about the transatlantic charter requirements:

• Aircraft Recommendation: Gulfstream G650ER (12 pax, 7,500nm range)
• Estimated Cost: $125,000 - $140,000 depending on routing
• Timeline: Available aircraft confirmed for requested dates
• Next Steps: Contract review and deposit confirmation

Please let me know if you need any additional information.

Best regards,
[Your Name]`,
      notes: `Meeting Notes - Transatlantic Charter Discussion
Date: ${new Date().toLocaleDateString()}
Attendees: [List attendees]

Key Points:
- Route: New York to London
- Passengers: 12 (including 2 crew)
- Budget: $130,000 - $150,000 range
- Timeline: Next 3 weeks
- Special Requirements: Pet transport, dietary restrictions

Aircraft Options Discussed:
1. Gulfstream G650ER - Best fit for requirements
2. Bombardier Global 7500 - Alternative option
3. Dassault Falcon 8X - Backup option

Action Items:
- [ ] Send formal quote by EOD
- [ ] Confirm crew availability
- [ ] Check weather windows for optimal routing
- [ ] Prepare contract documents`
    };
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'aircraft': return '✈️';
      case 'regulation': return '📋';
      case 'market': return '📊';
      case 'route': return '🗺️';
      case 'crew': return '👥';
      case 'safety': return '🛡️';
      default: return '💡';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-green-500';
    if (confidence >= 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onToggleVisibility}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-12 h-12 shadow-lg"
          aria-label="Show Aviation AI Assistant"
        >
          <Brain className="w-6 h-6" />
        </Button>
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
                Aviation AI Assistant
              </CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
                className="h-6 w-6 p-0 text-neutral-400 hover:text-white"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Listening Controls */}
          <div className="flex items-center gap-2">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`flex-1 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-orange-500 hover:bg-orange-600'
              } text-white`}
              disabled={isProcessing}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2" />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Start Listening
                </>
              )}
            </Button>
          </div>

          {/* Current Question */}
          {currentQuestion && (
            <div className="p-3 bg-neutral-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Current Discussion:</span>
              </div>
              <p className="text-sm text-neutral-300">{currentQuestion}</p>
            </div>
          )}

          {/* Live Insights */}
          {liveInsights.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Live Insights</span>
              </div>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {liveInsights.map((insight) => (
                    <div key={insight.id} className="p-3 bg-neutral-800 rounded-lg border border-neutral-700">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getInsightIcon(insight.type)}</span>
                          <span className="text-sm font-medium text-white">{insight.title}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getConfidenceColor(insight.confidence)}`}></div>
                          <span className="text-xs text-neutral-400">
                            {Math.round(insight.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-300 mb-2">{insight.content}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {insight.type}
                        </Badge>
                        {insight.actionable && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400">
                            Actionable
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Meeting Attendees */}
          {attendees.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-sm font-medium text-white">Meeting Attendees</span>
              </div>
              <div className="space-y-2">
                {attendees.map((attendee, index) => (
                  <div key={index} className="p-2 bg-neutral-800 rounded-lg">
                    <div className="text-sm font-medium text-white">{attendee.name}</div>
                    <div className="text-xs text-neutral-400">{attendee.role} at {attendee.company}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Generation */}
          <Button
            onClick={() => {
              const followUp = generateFollowUp();
              // In a real implementation, this would open a modal or new window
              console.log('Follow-up Email:', followUp.email);
              console.log('Meeting Notes:', followUp.notes);
            }}
            variant="outline"
            className="w-full border-neutral-600 text-neutral-300 hover:bg-neutral-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Follow-up
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
