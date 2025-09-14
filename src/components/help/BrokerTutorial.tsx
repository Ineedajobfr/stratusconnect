import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
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
  Eye
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

export function BrokerTutorial() {
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
    <div className="min-h-screen bg-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              StratusConnect Broker Tutorial
            </h1>
            <p className="text-slate-400">
              Master the elite aviation brokerage platform
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
              Step {currentStep + 1} of {tutorialSteps.length}
            </Badge>
            <Button
              onClick={togglePlayPause}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <Progress value={progress} className="h-2 bg-slate-700" />
          <div className="flex justify-between text-sm text-slate-400 mt-2">
            <span>{Math.round(progress)}% Complete</span>
            <span>{tutorialSteps.length - currentStep - 1} steps remaining</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tutorial Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Step */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  {currentStepData.icon}
                </div>
                <div>
                  <CardTitle className="text-white text-xl">
                    {currentStepData.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    {currentStepData.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400" />
                    )}
                    <span className="text-sm text-slate-400">
                      {currentStepData.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300 text-lg leading-relaxed">
                {currentStepData.description}
              </p>
              
              <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-400" />
                  <span className="text-orange-400 font-medium">Action Required:</span>
                </div>
                <p className="text-slate-300">{currentStepData.action}</p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => markStepComplete(currentStepData.id)}
                    disabled={currentStepData.completed}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-orange-400" />
                <span>Quick Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">1</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Always include detailed trip requirements to get accurate quotes
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">2</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Compare multiple quotes before accepting to ensure best value
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">3</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Use the messaging system to build relationships with operators
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-black text-xs font-bold">4</span>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Save your favorite operators for quick access to trusted partners
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Step Overview */}
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Tutorial Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tutorialSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep
                        ? 'bg-orange-500/20 border border-orange-500/30'
                        : 'hover:bg-slate-700'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : index === currentStep ? (
                        <div className="w-4 h-4 bg-orange-400 rounded-full" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${
                        index === currentStep ? 'text-orange-400' : 'text-slate-300'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-slate-300">Universal Compliance</span>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                  <span className="text-sm text-slate-300">7% Platform Fee</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="h-4 w-4 text-purple-400" />
                  <span className="text-sm text-slate-300">Secure Messaging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  <span className="text-sm text-slate-300">Performance Analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Eye className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-slate-300">Transparent Pricing</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Documentation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
