import React, { useState, useEffect, useRef } from 'react';
import { Brain, Zap, Shield, Lock, Eye, EyeOff, X, MessageSquare, Mic, MicOff, Search, Users, FileText, TrendingUp, AlertTriangle, CheckCircle, Star, Target, Send } from 'lucide-react';
import { getMaxAIInstance } from '@/services/MaxAIService';

interface MaxAIProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  userType: 'broker' | 'operator' | 'pilot' | 'crew';
  isAuthenticated: boolean;
}

interface MaxInsight {
  id: string;
  type: 'security' | 'performance' | 'opportunity' | 'risk' | 'compliance' | 'market' | 'predictive' | 'coaching' | 'feedback';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  content: string;
  confidence: number;
  timestamp: Date;
  actionable: boolean;
  category: string;
  impact: string;
  timeframe: string;
  improvement?: string;
  suggestion?: string;
}

interface SecurityAlert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  type: 'threat' | 'anomaly' | 'compliance' | 'access';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export const MaxAI: React.FC<MaxAIProps> = ({
  isVisible,
  onToggleVisibility,
  userType,
  isAuthenticated
}) => {
  const [isListening, setIsListening] = useState(false);
  const [currentContext, setCurrentContext] = useState<string>('');
  const [maxInsights, setMaxInsights] = useState<MaxInsight[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'insights' | 'security' | 'predictive' | 'analytics' | 'chat'>('insights');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [performanceStats, setPerformanceStats] = useState<any>(null);
  const [learnedPatterns, setLearnedPatterns] = useState<any>(null);
  const insightsRef = useRef<HTMLDivElement>(null);

  // Max AI Service Instance
  const maxAIService = getMaxAIInstance(userType);

  // Update performance stats and patterns periodically
  useEffect(() => {
    const updateStats = () => {
      setPerformanceStats(maxAIService.getPerformanceStats());
      setLearnedPatterns(maxAIService.getLearnedPatterns());
    };
    
    updateStats();
    const interval = setInterval(updateStats, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [maxAIService]);

  // Send message function
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    try {
      const response = await maxAIService.handleQuery(inputValue, { userType });
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message to Max AI:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I apologize, but I encountered an error. StratusConnect\'s systems are designed for reliability and excellence. Please try again.',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Max AI's advanced knowledge base
  const maxKnowledge = {
    security: [
      {
        type: 'threat',
        priority: 'critical',
        title: 'Advanced Threat Detection',
        content: 'Real-time monitoring of suspicious activities, unauthorized access attempts, and potential security breaches across all terminals.',
        confidence: 0.98
      },
      {
        type: 'compliance',
        priority: 'high',
        title: 'Regulatory Compliance',
        content: 'Continuous monitoring of FAA, EASA, ICAO regulations with automated compliance checking and alert systems.',
        confidence: 0.95
      }
    ],
    performance: [
      {
        type: 'optimization',
        priority: 'high',
        title: 'Performance Optimization',
        content: 'Advanced algorithms analyzing system performance, user behavior patterns, and optimization opportunities.',
        confidence: 0.92
      }
    ],
    market: [
      {
        type: 'intelligence',
        priority: 'medium',
        title: 'Market Intelligence',
        content: 'Real-time analysis of aviation market trends, pricing dynamics, and competitive landscape.',
        confidence: 0.89
      }
    ],
    predictive: [
      {
        type: 'forecasting',
        priority: 'high',
        title: 'Predictive Analytics',
        content: 'AI-powered forecasting of demand patterns, pricing trends, and operational requirements.',
        confidence: 0.94
      }
    ]
  };

  // Generate advanced Max insights with coaching
  const generateMaxInsights = (context: string): MaxInsight[] => {
    const insights: MaxInsight[] = [];
    
    // Coaching insights - always show these for user improvement
    const coachingInsights = [
      {
        type: 'coaching' as const,
        priority: 'high' as const,
        title: 'Quote Response Time Analysis',
        content: 'Your average response time is 2.3 minutes. Top performers respond within 90 seconds. Consider using saved templates for faster responses.',
        improvement: 'Create pre-written responses for common requests to reduce response time by 40%',
        suggestion: 'Set up email templates for standard charter requests',
        confidence: 0.94
      },
      {
        type: 'feedback' as const,
        priority: 'medium' as const,
        title: 'Client Communication Pattern',
        content: 'You\'re missing 15% of follow-up opportunities. Clients who receive immediate follow-ups are 3x more likely to book.',
        improvement: 'Implement automated follow-up sequences within 2 hours of quote submission',
        suggestion: 'Use the Saved Searches feature to track client preferences and tailor follow-ups',
        confidence: 0.89
      },
      {
        type: 'coaching' as const,
        priority: 'high' as const,
        title: 'Market Positioning Strategy',
        content: 'You\'re not leveraging the AI Search Assistant effectively. 78% of successful brokers use AI insights for client matching.',
        improvement: 'Start each client interaction by using AI Search to find similar successful deals',
        suggestion: 'Try searching "Find Gulfstream G650 available for charter" to see how AI can help',
        confidence: 0.92
      }
    ];

    // Add coaching insights
    coachingInsights.forEach((insight, index) => {
      if (Math.random() > 0.3) { // 70% chance to show coaching
        insights.push({
          id: `coaching-${Date.now()}-${index}`,
          ...insight,
          timestamp: new Date(),
          actionable: true,
          category: 'User Improvement',
          impact: 'High',
          timeframe: 'Immediate'
        });
      }
    });
    
    // Security insights
    if (Math.random() > 0.7) {
      insights.push({
        id: `security-${Date.now()}`,
        type: 'security',
        priority: 'critical',
        title: 'Security Protocol Enhancement',
        content: 'Detected potential security vulnerability in user session management. Recommend immediate implementation of multi-factor authentication.',
        confidence: 0.96,
        timestamp: new Date(),
        actionable: true,
        category: 'Security',
        impact: 'High',
        timeframe: 'Immediate'
      });
    }

    // Performance insights
    if (Math.random() > 0.6) {
      insights.push({
        id: `perf-${Date.now()}`,
        type: 'performance',
        priority: 'high',
        title: 'Performance Optimization Detected',
        content: 'Analysis shows 23% improvement opportunity in response times. Optimizing database queries and caching strategies.',
        confidence: 0.91,
        timestamp: new Date(),
        actionable: true,
        category: 'Performance',
        impact: 'Medium',
        timeframe: '24 hours'
      });
    }

    // Market insights
    if (Math.random() > 0.5) {
      insights.push({
        id: `market-${Date.now()}`,
        type: 'market',
        priority: 'medium',
        title: 'Market Opportunity Identified',
        content: 'Emerging demand pattern detected in transatlantic routes. Suggest proactive fleet positioning for optimal revenue.',
        confidence: 0.87,
        timestamp: new Date(),
        actionable: true,
        category: 'Market',
        impact: 'High',
        timeframe: '48 hours'
      });
    }

    // Predictive insights
    if (Math.random() > 0.4) {
      insights.push({
        id: `pred-${Date.now()}`,
        type: 'predictive',
        priority: 'high',
        title: 'Predictive Analysis Complete',
        content: 'Forecasting 15% increase in demand for next quarter. Recommend scaling operations and crew availability.',
        confidence: 0.93,
        timestamp: new Date(),
        actionable: true,
        category: 'Predictive',
        impact: 'High',
        timeframe: '1 week'
      });
    }

    return insights;
  };

  // Generate security alerts
  const generateSecurityAlerts = (): SecurityAlert[] => {
    const alerts: SecurityAlert[] = [];
    
    if (Math.random() > 0.8) {
      alerts.push({
        id: `alert-${Date.now()}`,
        level: 'warning',
        type: 'anomaly',
        message: 'Unusual access pattern detected from new IP address',
        timestamp: new Date(),
        resolved: false
      });
    }

    if (Math.random() > 0.9) {
      alerts.push({
        id: `alert-${Date.now() + 1}`,
        level: 'info',
        type: 'compliance',
        message: 'All security protocols up to date',
        timestamp: new Date(),
        resolved: true
      });
    }

    return alerts;
  };

  const startListening = () => {
    setIsListening(true);
    setIsProcessing(true);
    
    setTimeout(() => {
      const mockContext = `Max AI analyzing ${userType} terminal operations and security protocols`;
      setCurrentContext(mockContext);
      
      const insights = generateMaxInsights(mockContext);
      const alerts = generateSecurityAlerts();
      
      setMaxInsights(insights);
      setSecurityAlerts(alerts);
      setIsProcessing(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setIsProcessing(false);
  };

  const clearInsights = () => {
    setMaxInsights([]);
    setCurrentContext('');
    setSecurityAlerts([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'opportunity': return <Target className="w-4 h-4" />;
      case 'risk': return <AlertTriangle className="w-4 h-4" />;
      case 'compliance': return <CheckCircle className="w-4 h-4" />;
      case 'market': return <TrendingUp className="w-4 h-4" />;
      case 'predictive': return <Star className="w-4 h-4" />;
      case 'coaching': return <Target className="w-4 h-4" />;
      case 'feedback': return <AlertTriangle className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  // Auto-scroll to latest insight
  useEffect(() => {
    if (insightsRef.current) {
      insightsRef.current.scrollTop = insightsRef.current.scrollHeight;
    }
  }, [maxInsights]);

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggleVisibility}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center group relative"
          aria-label="Open Max AI Assistant"
        >
          <Brain className="w-8 h-8 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Max AI's advanced translucent overlay */}
      <div className="absolute top-6 right-6 w-96 max-h-[90vh] bg-black/30 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl pointer-events-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 bg-gradient-to-r from-blue-600/20 to-purple-600/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Max AI</h3>
              <p className="text-white/70 text-xs">Advanced Intelligence System</p>
            </div>
          </div>
          <button
            onClick={onToggleVisibility}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="p-2 border-b border-white/20">
          <div className="flex gap-1">
            {[
              { id: 'insights', label: 'Insights', icon: <Brain className="w-3 h-3" /> },
              { id: 'security', label: 'Security', icon: <Shield className="w-3 h-3" /> },
              { id: 'predictive', label: 'Predictive', icon: <Star className="w-3 h-3" /> },
              { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-3 h-3" /> },
              { id: 'chat', label: 'Chat', icon: <MessageSquare className="w-3 h-3" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-blue-500/30 text-white shadow-md'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center gap-3">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                isListening
                  ? 'bg-red-500/80 hover:bg-red-500 text-white'
                  : 'bg-blue-500/80 hover:bg-blue-500 text-white'
              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  Stop Analysis
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  Start Analysis
                </>
              )}
            </button>
            
            {(maxInsights.length > 0 || securityAlerts.length > 0) && (
              <button
                onClick={clearInsights}
                className="px-3 py-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-sm"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'insights' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-blue-400" />
                <span className="text-white/80 text-sm font-medium">Max Insights</span>
                {isProcessing && (
                  <div className="flex items-center gap-1 ml-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
              
              <div 
                ref={insightsRef}
                className="max-h-64 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
              >
                {maxInsights.map((insight, index) => (
                  <div
                    key={insight.id}
                    className="p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl animate-in slide-in-from-bottom-2 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(insight.type)}
                        <span className="text-white/90 text-sm font-medium">{insight.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(insight.priority)}`}></div>
                        <span className="text-xs text-white/60">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm leading-relaxed mb-2">{insight.content}</p>
                    {insight.improvement && (
                      <div className="mb-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <p className="text-green-400 text-xs font-medium mb-1">💡 Improvement:</p>
                        <p className="text-green-300 text-xs">{insight.improvement}</p>
                      </div>
                    )}
                    {insight.suggestion && (
                      <div className="mb-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-400 text-xs font-medium mb-1">🎯 Suggestion:</p>
                        <p className="text-blue-300 text-xs">{insight.suggestion}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-white/60">Category: {insight.category}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/60">Impact: {insight.impact}</span>
                      <span className="text-white/60">•</span>
                      <span className="text-white/60">Time: {insight.timeframe}</span>
                    </div>
                  </div>
                ))}
                
                {maxInsights.length === 0 && !isProcessing && (
                  <div className="text-center py-8">
                    <Brain className="w-12 h-12 text-white/30 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">
                      {isListening ? 'Max AI analyzing system...' : 'Start analysis to see advanced insights'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-white/80 text-sm font-medium">Security Monitor</span>
              </div>
              
              <div className="space-y-3">
                {securityAlerts.map((alert, index) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl border animate-in slide-in-from-bottom-2 duration-500 ${getAlertColor(alert.level)}`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{alert.type.toUpperCase()}</span>
                      <span className="text-xs opacity-60">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{alert.message}</p>
                  </div>
                ))}
                
                {securityAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-green-400/30 mx-auto mb-3" />
                    <p className="text-white/60 text-sm">All security systems operational</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'predictive' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4 text-purple-400" />
                <span className="text-white/80 text-sm font-medium">Predictive Analytics</span>
              </div>
              
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
                <p className="text-white/60 text-sm">Advanced predictive models analyzing...</p>
                <p className="text-white/40 text-xs mt-2">Market trends • Demand patterns • Risk assessment</p>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-white/80 text-sm font-medium">Performance Analytics</span>
              </div>
              
              <div className="space-y-4">
                {/* Performance Stats */}
                {performanceStats && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white/90 text-sm font-medium mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-white/60">Avg Response Time:</span>
                        <span className="text-white ml-2">
                          {performanceStats.averageLatency ? `${Math.round(performanceStats.averageLatency)}ms` : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-white/60">Cache Size:</span>
                        <span className="text-white ml-2">{performanceStats.cacheSize || 0}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Model:</span>
                        <span className="text-white ml-2">{performanceStats.modelSettings?.model || 'gpt-4o'}</span>
                      </div>
                      <div>
                        <span className="text-white/60">Temperature:</span>
                        <span className="text-white ml-2">{performanceStats.modelSettings?.temperature || 0.3}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Learned Patterns */}
                {learnedPatterns && (
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h4 className="text-white/90 text-sm font-medium mb-3">Learned Patterns</h4>
                    <div className="space-y-3 text-xs">
                      <div>
                        <span className="text-white/60">Total Queries:</span>
                        <span className="text-white ml-2">{learnedPatterns.totalQueries || 0}</span>
                      </div>
                      {learnedPatterns.preferredOperators?.length > 0 && (
                        <div>
                          <span className="text-white/60">Preferred Aircraft:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {learnedPatterns.preferredOperators.slice(0, 3).map((operator: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">
                                {operator}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {learnedPatterns.typicalRoutes?.length > 0 && (
                        <div>
                          <span className="text-white/60">Common Routes:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {learnedPatterns.typicalRoutes.slice(0, 3).map((route: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">
                                {route}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {learnedPatterns.pricingTolerance > 0 && (
                        <div>
                          <span className="text-white/60">Avg Budget:</span>
                          <span className="text-white ml-2">${Math.round(learnedPatterns.pricingTolerance).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Learning Status */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white/90 text-sm font-medium mb-3">AI Learning Status</h4>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white/80">Continuously learning from interactions</span>
                  </div>
                  <div className="mt-2 text-xs text-white/60">
                    Max AI adapts to your preferences and optimizes responses automatically
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                <span className="text-white/80 text-sm font-medium">Max Chat</span>
              </div>
              
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {chatMessages.length === 0 ? (
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <p className="text-white/90 text-sm">Hello! I'm Max, your advanced AI assistant. How can I help optimize your {userType} operations today?</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-xl ${
                        message.type === 'user'
                          ? 'bg-blue-500/20 ml-4'
                          : 'bg-white/10 mr-4'
                      }`}
                    >
                      <p className="text-white/90 text-sm">{message.content}</p>
                      <p className="text-white/50 text-xs mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
                {isProcessing && (
                  <div className="p-3 bg-white/10 rounded-xl mr-4">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                      <p className="text-white/70 text-sm">Max is thinking...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Max anything..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 text-sm focus:outline-none focus:border-blue-500/50"
                  disabled={isProcessing}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isProcessing || !inputValue.trim()}
                  className="px-3 py-2 bg-blue-500/80 hover:bg-blue-500 disabled:bg-gray-500/50 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Max AI • Advanced Intelligence System</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
