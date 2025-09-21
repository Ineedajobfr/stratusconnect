import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brand } from '@/components/Brand';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Circle, 
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  BookOpen,
  Zap,
  Target,
  Shield,
  DollarSign,
  MessageCircle,
  Search,
  Star,
  BarChart3,
  Users,
  Clock,
  AlertCircle,
  CheckSquare,
  Eye,
  Trophy,
  Plane,
  TrendingUp,
  Bell,
  FileText,
  UserCheck
} from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  completed: boolean;
  autoPlay?: boolean;
}

export default function BrokerTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to StratusConnect Broker Terminal',
      description: 'You\'re about to experience the most advanced aviation brokerage platform. This tutorial will guide you through all the powerful features available to brokers.',
      action: 'Let\'s begin your journey to elite aviation brokerage',
      icon: <BookOpen className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('welcome'),
      autoPlay: true
    },
    {
      id: 'dashboard',
      title: 'Your Command Center',
      description: 'The dashboard shows your active requests, quotes received, success rate, and messages at a glance. Monitor your brokerage performance in real-time.',
      action: 'Click on Dashboard to see your metrics',
      icon: <BarChart3 className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('dashboard')
    },
    {
      id: 'post-request',
      title: 'Post Trip Requests',
      description: 'Create detailed trip requests for your clients. Include route, date, passengers, and special requirements. Operators will compete to provide the best quotes.',
      action: 'Click "Post New Trip Request" to create your first request',
      icon: <Target className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('post-request')
    },
    {
      id: 'quote-management',
      title: 'Quote Management',
      description: 'Review and compare quotes from multiple operators. See pricing breakdowns, aircraft details, and operator ratings. Accept the best offers for your clients.',
      action: 'Navigate to Quote Management to review incoming quotes',
      icon: <DollarSign className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('quote-management')
    },
    {
      id: 'marketplace',
      title: 'Browse the Marketplace',
      description: 'Discover empty legs and special deals. Find repositioning flights at discounted rates. Save your favorite operators and aircraft for quick access.',
      action: 'Explore the Marketplace for empty leg opportunities',
      icon: <Search className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('marketplace')
    },
    {
      id: 'communications',
      title: 'Secure Communications',
      description: 'Message operators directly through our secure platform. All communications are logged and encrypted. Build relationships with trusted aviation partners.',
      action: 'Check your Messages to communicate with operators',
      icon: <MessageCircle className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('communications')
    },
    {
      id: 'saved-operators',
      title: 'Saved Jets & Operators',
      description: 'Build your network of trusted operators. Save aircraft configurations and track operator performance. Access your favorites quickly for future bookings.',
      action: 'Visit Saved Jets to manage your operator network',
      icon: <Star className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('saved-operators')
    },
    {
      id: 'escrow-protection',
      title: 'Escrow Protection',
      description: 'Secure all transactions with our escrow system. Funds are held safely until flight completion. Automatic release upon successful delivery.',
      action: 'Review Escrow settings for secure transactions',
      icon: <Shield className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('escrow-protection')
    },
    {
      id: 'tasks',
      title: 'Task Management',
      description: 'Never miss a deadline with our task system. Track quote deadlines, client follow-ups, and booking confirmations. Stay organized and professional.',
      action: 'Check your Tasks to manage your workflow',
      icon: <CheckSquare className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('tasks')
    },
    {
      id: 'performance',
      title: 'Performance Analytics',
      description: 'Monitor your brokerage performance with detailed analytics. Track success rates, average deal values, and client satisfaction scores.',
      action: 'View your Performance metrics and analytics',
      icon: <BarChart3 className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('performance')
    },
    {
      id: 'verification',
      title: 'Fortress of Trust',
      description: 'Maintain your verified status with our comprehensive verification system. Identity, business license, insurance, and background checks all verified.',
      action: 'Review your Profile to maintain verification status',
      icon: <Shield className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('verification')
    },
    {
      id: 'completion',
      title: 'You\'re Ready!',
      description: 'Congratulations! You\'ve completed the broker tutorial. You now have access to the most advanced aviation brokerage platform. Start building your elite client base today.',
      action: 'Begin your journey as an elite aviation broker',
      icon: <Zap className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('completion')
    }
  ];

  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen bg-app text-body">
      {/* Header matching broker demo terminal */}
      <header className="sticky top-0 z-20 bg-app/80 backdrop-blur border-b border-default">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-xl" />
            <div>
              <Brand.PageTitle className="hero-glow">Broker Tutorial</Brand.PageTitle>
              <p className="text-muted text-glow-subtle">Master the Elite Aviation Brokerage Platform</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.location.href = '/beta/broker'}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Terminal
            </Button>
            <Brand.StatusChip status="success">
              <Shield className="w-3 h-3 mr-1 icon-glow" />
              FCA Compliant
            </Brand.StatusChip>
            <Brand.StatusChip status="info">
              <Trophy className="w-3 h-3 mr-1 icon-glow" />
              Tutorial Mode
            </Brand.StatusChip>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-body mb-2">
                Tutorial Progress
              </h2>
              <div className="flex items-center space-x-4">
                <Brand.StatusChip status="info">
                  <Circle className="w-3 h-3 mr-1 icon-glow" />
                  Step {currentStep + 1} of {tutorialSteps.length}
                </Brand.StatusChip>
                <Brand.StatusChip status="success">
                  <CheckCircle className="w-3 h-3 mr-1 icon-glow" />
                  {completedSteps.size} Completed
                </Brand.StatusChip>
              </div>
            </div>
            <Button
              onClick={togglePlayPause}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'} Tutorial
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-elev rounded-full h-2 mb-2">
            <div 
              className="bg-[hsl(var(--accent))] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>{Math.round(progress)}% Complete</span>
            <span>{tutorialSteps.length - currentStep - 1} steps remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Tutorial Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Step Card */}
            <Brand.Card className="border border-default">
              <div className="flex items-start space-x-4 mb-6">
                <div className="p-3 bg-[hsl(var(--accent))]/20 rounded-xl">
                  {currentStepData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-body mb-2">
                    {currentStepData.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-4">
                    {currentStepData.completed ? (
                      <Brand.StatusChip status="success">
                        <CheckCircle className="w-3 h-3 mr-1 icon-glow" />
                        Completed
                      </Brand.StatusChip>
                    ) : (
                      <Brand.StatusChip status="info">
                        <Circle className="w-3 h-3 mr-1 icon-glow" />
                        In Progress
                      </Brand.StatusChip>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-body/80 text-lg leading-relaxed mb-6">
                {currentStepData.description}
              </p>
              
              <div className="bg-elev rounded-xl p-4 border border-default mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-[hsl(var(--accent))]" />
                  <span className="text-[hsl(var(--accent))] font-medium">Action Required:</span>
                </div>
                <p className="text-body/80">{currentStepData.action}</p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <Brand.Secondary
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Brand.Secondary>
                
                <div className="flex items-center space-x-2">
                  <Brand.Primary
                    onClick={() => markStepComplete(currentStepData.id)}
                    disabled={currentStepData.completed}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Brand.Primary>
                </div>

                <Brand.Primary
                  onClick={nextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Brand.Primary>
              </div>
            </Brand.Card>

            {/* Quick Tips */}
            <Brand.Card className="border border-default">
              <div className="flex items-center space-x-2 mb-4">
                <HelpCircle className="h-5 w-5 text-[hsl(var(--accent))]" />
                <h3 className="text-lg font-semibold text-body">Quick Tips</h3>
              </div>
              <div className="space-y-4">
                {[
                  "Always include detailed trip requirements to get accurate quotes",
                  "Compare multiple quotes before accepting to ensure best value",
                  "Use the messaging system to build relationships with operators",
                  "Save your favorite operators for quick access to trusted partners"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-body/80 text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </Brand.Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Step Overview */}
            <Brand.Card className="border border-default">
              <h3 className="text-lg font-semibold text-body mb-4">Tutorial Steps</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tutorialSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep
                        ? 'bg-[hsl(var(--accent))]/20 border border-[hsl(var(--accent))]/30'
                        : 'hover:bg-elev'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : index === currentStep ? (
                        <div className="w-4 h-4 bg-[hsl(var(--accent))] rounded-full" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        index === currentStep ? 'text-[hsl(var(--accent))]' : 'text-body/80'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Brand.Card>

            {/* Key Features */}
            <Brand.Card className="border border-default">
              <h3 className="text-lg font-semibold text-body mb-4">Key Features</h3>
              <div className="space-y-3">
                {[
                  { icon: <Shield className="h-4 w-4 text-green-400" />, text: "Universal Compliance" },
                  { icon: <DollarSign className="h-4 w-4 text-blue-400" />, text: "7% Platform Fee" },
                  { icon: <MessageCircle className="h-4 w-4 text-purple-400" />, text: "Secure Messaging" },
                  { icon: <BarChart3 className="h-4 w-4 text-[hsl(var(--accent))]" />, text: "Performance Analytics" },
                  { icon: <Eye className="h-4 w-4 text-cyan-400" />, text: "Transparent Pricing" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {feature.icon}
                    <span className="text-sm text-body/80">{feature.text}</span>
                  </div>
                ))}
              </div>
            </Brand.Card>

            {/* Support */}
            <Brand.Card className="border border-default">
              <h3 className="text-lg font-semibold text-body mb-4">Need Help?</h3>
              <div className="space-y-3">
                <Brand.Secondary className="w-full justify-start">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Brand.Secondary>
                <Brand.Secondary className="w-full justify-start">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Documentation
                </Brand.Secondary>
              </div>
            </Brand.Card>
          </div>
        </div>
      </div>
    </div>
  );
}