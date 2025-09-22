// AI Search Assistant Component
// Provides intelligent search and assistance across the platform

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageSquare, 
  Zap, 
  TrendingUp, 
  Target, 
  Star,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Brain,
  Lightbulb
} from 'lucide-react';

interface AISearchAssistantProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  onSearch?: (query: string) => void;
  className?: string;
}

const aiSuggestions = {
  broker: [
    "Find Gulfstream G650s available from London to Dubai next week",
    "Show me operators with ARGUS Platinum rating in New York",
    "What are the best empty leg opportunities for this route?",
    "Find aircraft with Wi-Fi and pet-friendly policies",
    "Show me pricing trends for transatlantic flights",
    "Find operators with 24/7 customer support"
  ],
  operator: [
    "Find contract pilots for Gulfstream G550 in London",
    "Show me upcoming empty leg opportunities",
    "What are the most requested routes this month?",
    "Find crew members with French language skills",
    "Show me maintenance schedules and alerts",
    "Find brokers with high success rates"
  ],
  pilot: [
    "Find Gulfstream G650 jobs in Europe",
    "Show me jobs with overnight stays included",
    "What are the highest paying contract positions?",
    "Find jobs that match my availability",
    "Show me operators with excellent crew reviews",
    "Find jobs with training opportunities"
  ],
  crew: [
    "Find cabin crew jobs for long-haul flights",
    "Show me jobs requiring multiple languages",
    "What are the best paying crew positions?",
    "Find jobs with luxury aircraft experience",
    "Show me jobs with flexible scheduling",
    "Find operators with great crew benefits"
  ]
};

const aiFeatures = {
  broker: [
    { icon: Search, title: "Smart Search", description: "Natural language aircraft queries" },
    { icon: TrendingUp, title: "Market Analytics", description: "Real-time pricing and demand data" },
    { icon: Target, title: "Client Matching", description: "AI-powered client preference matching" },
    { icon: Star, title: "Quality Scoring", description: "Operator and aircraft quality ratings" }
  ],
  operator: [
    { icon: Search, title: "Crew Matching", description: "AI-powered crew-to-flight matching" },
    { icon: TrendingUp, title: "Fleet Optimization", description: "Aircraft positioning recommendations" },
    { icon: Target, title: "Demand Forecasting", description: "Predict future booking patterns" },
    { icon: Star, title: "Performance Analytics", description: "Fleet utilization insights" }
  ],
  pilot: [
    { icon: Search, title: "Job Matching", description: "AI-powered job recommendations" },
    { icon: TrendingUp, title: "Career Insights", description: "Market trends and opportunities" },
    { icon: Target, title: "Schedule Optimization", description: "Optimal availability planning" },
    { icon: Star, title: "Skill Development", description: "Training and certification tracking" }
  ],
  crew: [
    { icon: Search, title: "Assignment Matching", description: "AI-powered job matching" },
    { icon: TrendingUp, title: "Career Growth", description: "Professional development insights" },
    { icon: Target, title: "Availability Optimization", description: "Smart scheduling recommendations" },
    { icon: Star, title: "Performance Tracking", description: "Service excellence metrics" }
  ]
};

export default function AISearchAssistant({ terminalType, onSearch, className = "" }: AISearchAssistantProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onSearch) {
      onSearch(query);
    }
    
    setIsSearching(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
  };

  const suggestions = aiSuggestions[terminalType] || [];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* AI Search Input */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Brain className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">AI Search Assistant</CardTitle>
              <p className="text-sm text-muted-foreground">
                Ask complex questions in natural language and get intelligent results
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                placeholder="Ask me anything about aircraft, operators, jobs, or market data..."
                className="pr-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 h-8 w-8 p-0"
                onClick={handleSearch}
                disabled={isSearching || !query.trim()}
              >
                {isSearching ? (
                  <Clock className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* AI Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Try these queries:</p>
              <div className="grid grid-cols-1 gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start text-left h-auto p-3 text-sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2 text-accent" />
                    <span className="truncate">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* AI Features Preview */}
          <div className="grid grid-cols-2 gap-3">
            {aiFeatures[terminalType].map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 bg-terminal-card rounded-lg">
                <feature.icon className="w-4 h-4 text-accent" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{feature.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights Card */}
      <Card className="terminal-card">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/20 rounded-lg">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg text-foreground">AI Insights</CardTitle>
              <p className="text-sm text-muted-foreground">
                Get personalized recommendations and market intelligence
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Market Trend</p>
                  <p className="text-xs text-muted-foreground">Charter demand up 15% this month</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                +15%
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Recommendation</p>
                  <p className="text-xs text-muted-foreground">Consider positioning aircraft in Miami</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ArrowRight className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">Opportunity</p>
                  <p className="text-xs text-muted-foreground">3 new job matches found</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <ArrowRight className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
