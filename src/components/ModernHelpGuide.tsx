import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X, 
  HelpCircle, 
  Shield, 
  Plane, 
  BarChart3, 
  MessageSquare,
  Globe,
  DollarSign,
  CheckCircle,
  Lock,
  ArrowRight,
  Info,
  Users,
  Calendar,
  Award,
  Briefcase,
  Clock,
  MapPin,
  Search,
  FileText,
  Brain,
  TrendingUp,
  Target,
  Bookmark,
  Eye,
  GitCompare,
  Filter,
  Star,
  Trophy,
  Zap,
  Lightbulb,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  Download,
  Upload,
  Copy,
  Share2,
  Heart,
  ThumbsUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Calculator
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  detailedExplanation: string;
  icon?: React.ComponentType<{ className?: string }>;
  status?: 'locked' | 'available' | 'completed' | 'current';
  action?: string;
  interactive?: boolean;
  videoUrl?: string;
  screenshots?: string[];
  keyboardShortcut?: string;
  relatedFeatures?: string[];
}

interface TutorialSection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  steps: TutorialStep[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ModernHelpGuideProps {
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
  activeTab: string;
  onClose?: () => void;
  showOnMount?: boolean;
  isDemo?: boolean;
}

export const ModernHelpGuide: React.FC<ModernHelpGuideProps> = ({
  terminalType,
  activeTab,
  onClose,
  showOnMount = false,
  isDemo = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('overview');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Show tutorial when showOnMount is true or when explicitly triggered
    const hasBeenDismissed = localStorage.getItem(`help-guide-dismissed-${terminalType}`);
    
    if (showOnMount || (isDemo && activeTab === 'dashboard' && !hasBeenDismissed)) {
      setIsVisible(true);
    }
  }, [activeTab, terminalType, showOnMount, isDemo]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(`help-guide-dismissed-${terminalType}`, 'true');
    if (onClose) {
      onClose();
    }
  };

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const nextStep = () => {
    const currentSectionData = getTutorialSections().find(s => s.id === currentSection);
    if (currentSectionData && currentStep < currentSectionData.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const resetTutorial = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setIsPlaying(false);
  };

  const getTutorialSections = (): TutorialSection[] => {
    if (terminalType !== 'broker') {
      return []; // Only broker has comprehensive tutorial
    }

    return [
      {
        id: 'overview',
        title: 'Broker Terminal Overview',
        description: 'Complete walkthrough of the broker trading floor',
        icon: BarChart3,
        estimatedTime: '5 minutes',
        difficulty: 'beginner',
        steps: [
          {
            id: 'welcome',
            title: 'Welcome to the Broker Terminal',
            description: 'Your FCA compliant aviation trading floor',
            detailedExplanation: 'The broker terminal is your command center for managing client requests, finding aircraft, and closing deals. This is a professional trading environment designed for aviation brokers who need to provide exceptional service to their clients while maintaining compliance with financial regulations.',
            icon: Trophy,
            status: 'available',
            interactive: true,
            keyboardShortcut: 'Ctrl+H',
            relatedFeatures: ['Dashboard', 'Navigation', 'Help System']
          },
          {
            id: 'navigation',
            title: 'Navigation System',
            description: 'Master the tab-based navigation',
            detailedExplanation: 'The terminal uses a tab-based navigation system with 10 main sections. Each tab is designed for specific broker functions. You can navigate using mouse clicks or keyboard shortcuts (Ctrl+1-9). The active tab is highlighted and sections remain highlighted when clicked.',
            icon: Target,
            status: 'available',
            interactive: true,
            keyboardShortcut: 'Ctrl+1-9',
            relatedFeatures: ['Tabs', 'Keyboard Shortcuts', 'Section Highlighting']
          },
          {
            id: 'dashboard-metrics',
            title: 'Dashboard Metrics',
            description: 'Understanding your key performance indicators',
            detailedExplanation: 'The dashboard displays real-time metrics including Active RFQs, Quotes Received, Deals Closed, and Average Response Time. These metrics update automatically every 30 seconds. Click on any metric card to navigate to the relevant section for detailed information.',
            icon: TrendingUp,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Real-time Updates', 'Interactive Cards', 'Performance Tracking']
          },
          {
            id: 'ai-assistant',
            title: 'AI Assistant (ChatGPT)',
            description: 'Your intelligent AI assistant for all broker tasks',
            detailedExplanation: 'The AI Assistant is powered by ChatGPT and trained specifically on your broker terminal. It can help with RFQ creation, market analysis, pricing strategies, client communication, and workflow optimization. Access it via the purple "AI Assistant" button or Ctrl+A.',
            icon: Brain,
            status: 'available',
            interactive: true,
            keyboardShortcut: 'Ctrl+A',
            relatedFeatures: ['Natural Language Processing', 'Context-Aware Responses', 'Action Suggestions', 'Real-time Help']
          },
          {
            id: 'real-time-chat',
            title: 'Real-time Chat System',
            description: 'Communicate instantly with operators and clients',
            detailedExplanation: 'The chat system enables real-time communication with operators, clients, and team members. Features include video/voice calls, file sharing, message status tracking, and online presence indicators. Perfect for negotiations and quick clarifications.',
            icon: MessageSquare,
            status: 'available',
            interactive: true,
            keyboardShortcut: 'Ctrl+C',
            relatedFeatures: ['Video Calls', 'File Sharing', 'Message Status', 'Online Presence', 'Multi-party Chat']
          }
        ]
      },
      {
        id: 'rfq-management',
        title: 'RFQ Creation & Management',
        description: 'Master the art of creating and managing flight requests',
        icon: FileText,
        estimatedTime: '10 minutes',
        difficulty: 'intermediate',
        steps: [
          {
            id: 'create-rfq',
            title: 'Creating Multi-Leg RFQs',
            description: 'Build comprehensive flight requests for your clients',
            detailedExplanation: 'The Multi-Leg RFQ Builder allows you to create detailed flight requests with multiple legs, passenger requirements, special needs, and attachments. You can add up to 5 legs per RFQ, specify IATA codes, departure times, and special requirements. The system validates IATA codes and auto-calculates totals.',
            icon: Plus,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Multi-Leg Builder', 'Validation', 'Auto-calculation', 'File Attachments']
          },
          {
            id: 'rfq-validation',
            title: 'Input Validation & Requirements',
            description: 'Ensure your RFQs meet all requirements',
            detailedExplanation: 'The system includes comprehensive validation: IATA codes are automatically converted to uppercase and filtered to letters only, passenger counts are limited to 1-20 per leg, luggage counts are 0 or positive, and all required fields must be completed before publishing.',
            icon: CheckCircle2,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Validation Rules', 'Error Prevention', 'User Feedback']
          },
          {
            id: 'quote-management',
            title: 'Quote Management & Comparison',
            description: 'Handle incoming quotes and make informed decisions',
            detailedExplanation: 'When operators submit quotes, they appear in your RFQ list with detailed information including operator name, aircraft type, pricing, response time, and deal score. You can compare quotes side-by-side, accept the best offers, and track the status of each RFQ through the entire process.',
            icon: GitCompare,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Quote Display', 'Comparison Tools', 'Accept/Reject', 'Status Tracking']
          }
        ]
      },
      {
        id: 'marketplace',
        title: 'Aircraft Marketplace',
        description: 'Find and compare aircraft with advanced filtering',
        icon: Search,
        estimatedTime: '8 minutes',
        difficulty: 'intermediate',
        steps: [
          {
            id: 'browse-aircraft',
            title: 'Browsing Available Aircraft',
            description: 'Navigate the comprehensive aircraft marketplace',
            detailedExplanation: 'The marketplace displays available aircraft from verified operators worldwide. Each listing shows aircraft type, operator information, pricing, availability, and key metrics. You can filter by route, aircraft type, price range, and operator verification status.',
            icon: Plane,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Aircraft Listings', 'Filtering', 'Search', 'Verification Status']
          },
          {
            id: 'advanced-filters',
            title: 'Advanced Filtering System',
            description: 'Use powerful filters to find exactly what you need',
            detailedExplanation: 'The advanced filtering system includes route-based search, aircraft type filtering, price range selection, currency options, verification status, empty leg availability, safety ratings, and response time requirements. Filters can be combined for precise results.',
            icon: Filter,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Filter Options', 'Search Criteria', 'Saved Filters', 'Real-time Results']
          },
          {
            id: 'compare-aircraft',
            title: 'Aircraft Comparison Tool',
            description: 'Compare multiple aircraft side-by-side',
            detailedExplanation: 'Select up to 3 aircraft for detailed comparison. The comparison tool provides comprehensive analysis including pricing breakdown, operator ratings, deal scores, platform fees, and AI-powered recommendations. You can sort by different criteria and export comparison reports.',
            icon: BarChart3,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Side-by-side Comparison', 'AI Analysis', 'Sorting Options', 'Export Reports']
          }
        ]
      },
      {
        id: 'ai-features',
        title: 'AI-Powered Features',
        description: 'Leverage artificial intelligence for better results',
        icon: Brain,
        estimatedTime: '12 minutes',
        difficulty: 'advanced',
        steps: [
          {
            id: 'ai-assistant-chatgpt',
            title: 'ChatGPT AI Assistant',
            description: 'Your intelligent AI assistant for all broker tasks',
            detailedExplanation: 'The AI Assistant is powered by ChatGPT and trained specifically on your broker terminal system. It can help with RFQ creation, market analysis, pricing strategies, client communication, and workflow optimization. Simply ask questions in natural language and get instant, intelligent responses.',
            icon: Brain,
            status: 'available',
            interactive: true,
            keyboardShortcut: 'Ctrl+A',
            relatedFeatures: ['Natural Language Processing', 'Context-Aware Responses', 'Action Suggestions', 'Real-time Help']
          },
          {
            id: 'smart-pricing-engine',
            title: 'Smart Pricing Engine',
            description: 'AI-powered pricing analysis and recommendations',
            detailedExplanation: 'The Smart Pricing Engine analyzes market conditions, route popularity, seasonal demand, fuel costs, and operator capacity to suggest optimal pricing. It provides confidence scores, risk assessments, and actionable recommendations to help you price competitively while maximizing profit.',
            icon: DollarSign,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Market Analysis', 'Price Optimization', 'Risk Assessment', 'Confidence Scoring']
          },
          {
            id: 'ai-insights',
            title: 'AI Insights & Recommendations',
            description: 'Get personalized insights and market intelligence',
            detailedExplanation: 'The AI system analyzes your trading patterns, market conditions, and performance to provide personalized recommendations. It suggests optimal pricing strategies, identifies market opportunities, and provides coaching on how to improve your success rate.',
            icon: Lightbulb,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Personalized Insights', 'Market Analysis', 'Performance Coaching', 'Predictive Analytics']
          },
          {
            id: 'ai-search',
            title: 'AI Search Assistant',
            description: 'Use natural language to find aircraft and operators',
            detailedExplanation: 'The AI Search Assistant understands natural language queries like "Find a Gulfstream for London to New York next week" or "Show me empty legs under $50,000". It provides intelligent suggestions and learns from your search patterns to improve results over time.',
            icon: Search,
            status: 'available',
            interactive: true,
            keyboardShortcut: 'Ctrl+K',
            relatedFeatures: ['Natural Language', 'Smart Suggestions', 'Learning Algorithm', 'Quick Results']
          },
          {
            id: 'predictive-analytics',
            title: 'Predictive Analytics',
            description: 'Forecast market trends and pricing patterns',
            detailedExplanation: 'The predictive analytics engine uses machine learning to forecast market trends, predict pricing changes, and identify optimal booking times. It analyzes historical data, seasonal patterns, and current market conditions to help you make informed decisions.',
            icon: TrendingUp,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Market Forecasting', 'Price Predictions', 'Trend Analysis', 'Risk Assessment']
          }
        ]
      },
      {
        id: 'reputation-system',
        title: 'Reputation & Ranking System',
        description: 'Build your broker reputation and climb the rankings',
        icon: Award,
        estimatedTime: '6 minutes',
        difficulty: 'intermediate',
        steps: [
          {
            id: 'reputation-metrics',
            title: 'Understanding Reputation Metrics',
            description: 'Learn how your broker reputation is calculated',
            detailedExplanation: 'Your reputation is based on multiple factors including response time, deal completion rate, client satisfaction, and platform compliance. Higher reputation scores unlock premium features, better operator relationships, and increased visibility in the marketplace.',
            icon: Star,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Score Calculation', 'Performance Tracking', 'Achievement System', 'Premium Features']
          },
          {
            id: 'ranking-system',
            title: 'Weekly Rankings & Competition',
            description: 'Compete with other brokers and track your progress',
            detailedExplanation: 'The ranking system tracks your weekly performance against other brokers. Rankings are based on deal volume, success rate, response time, and client satisfaction. Climbing the rankings unlocks exclusive features and increases your visibility to operators.',
            icon: Trophy,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Leaderboard', 'Weekly Challenges', 'Achievement Badges', 'Competitive Rewards']
          }
        ]
      },
      {
        id: 'market-intelligence',
        title: 'Market Intelligence & Analytics',
        description: 'Real-time market data and competitive analysis',
        icon: TrendingUp,
        estimatedTime: '8 minutes',
        difficulty: 'intermediate',
        steps: [
          {
            id: 'market-dashboard',
            title: 'Market Intelligence Dashboard',
            description: 'Access real-time market data and trends',
            detailedExplanation: 'The Market Intelligence tab provides comprehensive market analysis including popular routes, pricing trends, competitor analysis, and market alerts. Stay ahead of the competition with real-time data that updates every 30 seconds.',
            icon: BarChart3,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Real-time Data', 'Competitor Analysis', 'Price Trends', 'Market Alerts']
          },
          {
            id: 'competitor-tracking',
            title: 'Competitor Analysis',
            description: 'Track competitor pricing and market share',
            detailedExplanation: 'Monitor competitor operators, their pricing strategies, market share, response times, and ratings. This intelligence helps you position your quotes competitively and identify market opportunities.',
            icon: Target,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Market Share Tracking', 'Pricing Analysis', 'Response Time Monitoring', 'Rating Comparison']
          },
          {
            id: 'market-alerts',
            title: 'Smart Market Alerts',
            description: 'Get notified of market opportunities and changes',
            detailedExplanation: 'Receive intelligent alerts for price drops, new empty legs, operator additions, and market changes. Alerts are prioritized by relevance and potential impact on your business.',
            icon: Bell,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Price Drop Alerts', 'Empty Leg Notifications', 'New Operator Alerts', 'Priority Filtering']
          }
        ]
      },
      {
        id: 'workflow-automation',
        title: 'Workflow Automation',
        description: 'Automate repetitive tasks and streamline operations',
        icon: Zap,
        estimatedTime: '10 minutes',
        difficulty: 'intermediate',
        steps: [
          {
            id: 'smart-templates',
            title: 'Smart Templates',
            description: 'Pre-built workflows for common broker tasks',
            detailedExplanation: 'Create and use smart templates for RFQ creation, client communication, follow-up sequences, and reporting. Templates can be customized and automated to save hours of repetitive work.',
            icon: FileText,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Template Library', 'Custom Workflows', 'Automation Rules', 'Bulk Operations']
          },
          {
            id: 'bulk-operations',
            title: 'Bulk Operations',
            description: 'Handle multiple tasks simultaneously',
            detailedExplanation: 'Execute bulk operations on RFQs, quotes, clients, and reports. Process hundreds of items at once with progress tracking, error handling, and detailed reporting.',
            icon: Settings,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Batch Processing', 'Progress Tracking', 'Error Handling', 'Performance Analytics']
          },
          {
            id: 'automation-analytics',
            title: 'Automation Performance',
            description: 'Track time saved and efficiency gains',
            detailedExplanation: 'Monitor how much time your automation saves, success rates of automated tasks, and identify opportunities for further optimization. Data-driven insights help you maximize efficiency.',
            icon: BarChart3,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Time Tracking', 'Success Metrics', 'Efficiency Reports', 'Optimization Suggestions']
          }
        ]
      },
      {
        id: 'billing-finance',
        title: 'Billing & Financial Management',
        description: 'Handle invoicing and financial transactions',
        icon: DollarSign,
        estimatedTime: '7 minutes',
        difficulty: 'intermediate',
        steps: [
          {
            id: 'commission-structure',
            title: 'Understanding Commission Structure',
            description: 'Learn about the transparent 7% platform fee',
            detailedExplanation: 'The platform uses a transparent 7% commission structure. All fees are clearly displayed before booking, and the net amount to operators is always shown. This FCA-compliant structure ensures transparency and builds trust with both brokers and operators.',
            icon: Calculator,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Transparent Pricing', 'FCA Compliance', 'Fee Breakdown', 'Net Calculations']
          },
          {
            id: 'billing-management',
            title: 'Billing & Statement Management',
            description: 'Generate statements and track payments',
            detailedExplanation: 'The billing system automatically generates monthly statements, tracks all transactions, and provides detailed financial reports. You can download statements, view payment history, and manage your financial records with full audit trails for compliance.',
            icon: FileText,
            status: 'available',
            interactive: true,
            relatedFeatures: ['Auto Statements', 'Payment Tracking', 'Financial Reports', 'Audit Trails']
          }
        ]
      }
    ];
  };

  const tutorialSections = getTutorialSections();
  const currentSectionData = tutorialSections.find(s => s.id === currentSection);
  const currentStepData = currentSectionData?.steps[currentStep];

  if (!isVisible) return null;

  if (terminalType !== 'broker') {
    // Fallback for other terminal types
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] bg-surface-1 border-terminal-border shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand/20 rounded-lg">
                <HelpCircle className="h-5 w-5 text-brand" />
              </div>
              <div>
                <CardTitle className="text-xl text-bright">Help Guide</CardTitle>
                <p className="text-sm text-text/70 mt-1">Basic help for {terminalType} terminal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-text/70 hover:text-text hover:bg-surface-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-text/70">Comprehensive tutorial available for broker terminal only.</p>
            <Button onClick={handleClose} className="mt-4 bg-brand hover:bg-brand-600 text-text">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[95vh] bg-surface-1 border-terminal-border shadow-2xl">
        <CardHeader className="bg-surface-2 border-b border-terminal-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-brand/20 rounded-xl">
                <Trophy className="h-6 w-6 text-brand" />
              </div>
              <div>
                <CardTitle className="text-2xl text-bright">Broker Terminal Master Tutorial</CardTitle>
                <p className="text-text/70 mt-1">Complete walkthrough of all broker features and functionality</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={resetTutorial}
                className="border-terminal-border text-text hover:bg-surface-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-text/70 hover:text-text hover:bg-surface-1"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 bg-surface-1">
          <div className="flex h-[calc(95vh-120px)]">
            {/* Sidebar - Tutorial Sections */}
            <div className="w-80 bg-surface-2 border-r border-terminal-border p-4 overflow-y-auto">
              <h3 className="text-lg font-semibold text-bright mb-4">Tutorial Sections</h3>
              <div className="space-y-2">
                {tutorialSections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentSection === section.id
                        ? 'bg-brand/20 border border-brand/30 text-bright'
                        : 'bg-surface-1 border border-terminal-border text-text hover:bg-surface-1/80'
                    }`}
                    onClick={() => {
                      setCurrentSection(section.id);
                      setCurrentStep(0);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-brand/20 rounded-lg">
                        <section.icon className="h-4 w-4 text-brand" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{section.title}</h4>
                        <p className="text-xs text-text/70 mt-1">{section.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              section.difficulty === 'beginner' ? 'border-green-400 text-green-400' :
                              section.difficulty === 'intermediate' ? 'border-yellow-400 text-yellow-400' :
                              'border-red-400 text-red-400'
                            }`}
                          >
                            {section.difficulty}
                          </Badge>
                          <span className="text-xs text-text/60">{section.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content - Tutorial Steps */}
            <div className="flex-1 p-6 overflow-y-auto">
              {currentSectionData && (
                <div className="space-y-6">
                  {/* Section Header */}
                  <div className="flex items-center gap-4 pb-4 border-b border-terminal-border">
                    <div className="p-3 bg-brand/20 rounded-xl">
                      <currentSectionData.icon className="h-6 w-6 text-brand" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-bright">{currentSectionData.title}</h2>
                      <p className="text-text/70">{currentSectionData.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-text/70">
                      <span>Step {currentStep + 1} of {currentSectionData.steps.length}</span>
                      <span>{Math.round(((currentStep + 1) / currentSectionData.steps.length) * 100)}% Complete</span>
                    </div>
                    <div className="w-full bg-surface-2 rounded-full h-2">
                      <div 
                        className="bg-brand h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / currentSectionData.steps.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Step Content */}
                  {currentStepData && (
                    <div className="space-y-6">
                      {/* Step Header */}
                      <div className="flex items-start gap-4 p-6 bg-surface-2 rounded-xl border border-terminal-border">
                        <div className="p-3 bg-brand/20 rounded-xl">
                          {currentStepData.icon && <currentStepData.icon className="h-6 w-6 text-brand" />}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-bright mb-2">{currentStepData.title}</h3>
                          <p className="text-text/70 text-lg">{currentStepData.description}</p>
                          {currentStepData.keyboardShortcut && (
                            <Badge className="mt-2 bg-brand/20 text-brand border-brand/30">
                              <Clock className="w-3 h-3 mr-1" />
                              {currentStepData.keyboardShortcut}
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {currentStepData.interactive && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-brand/30 text-brand hover:bg-brand/10"
                              onClick={() => markStepComplete(currentStepData.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Detailed Explanation */}
                      <div className="p-6 bg-surface-2 rounded-xl border border-terminal-border">
                        <h4 className="text-lg font-semibold text-bright mb-3">Detailed Explanation</h4>
                        <p className="text-text/80 leading-relaxed">{currentStepData.detailedExplanation}</p>
                      </div>

                      {/* Related Features */}
                      {currentStepData.relatedFeatures && (
                        <div className="p-6 bg-surface-2 rounded-xl border border-terminal-border">
                          <h4 className="text-lg font-semibold text-bright mb-3">Related Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentStepData.relatedFeatures.map((feature, index) => (
                              <Badge key={index} variant="outline" className="border-brand/30 text-brand">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Interactive Demo */}
                      {currentStepData.interactive && (
                        <div className="p-6 bg-surface-2 rounded-xl border border-terminal-border">
                          <h4 className="text-lg font-semibold text-bright mb-3">Try It Yourself</h4>
                          <div className="flex items-center gap-4">
                            <Button
                              className="bg-brand hover:bg-brand-600 text-text"
                              onClick={() => {
                                // This would trigger the actual feature in the main interface
                                alert(`This would demonstrate: ${currentStepData.title}`);
                              }}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Try This Feature
                            </Button>
                            <Button
                              variant="outline"
                              className="border-terminal-border text-text hover:bg-surface-1"
                              onClick={() => markStepComplete(currentStepData.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              I've Tried This
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Navigation Controls */}
                  <div className="flex justify-between items-center pt-6 border-t border-terminal-border">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 0}
                      className="border-terminal-border text-text hover:bg-surface-2 disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(0)}
                        className="border-terminal-border text-text hover:bg-surface-2"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart Section
                      </Button>
                      
                      {currentStep < (currentSectionData?.steps.length || 0) - 1 ? (
                        <Button
                          onClick={nextStep}
                          className="bg-brand hover:bg-brand-600 text-text"
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleClose}
                          className="bg-green-600 hover:bg-green-700 text-text"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Complete Tutorial
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
