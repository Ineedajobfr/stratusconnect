import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    AlertCircle,
    ArrowLeft,
    ArrowRight,
    BarChart3,
    BookOpen,
    CheckCircle,
    CheckSquare,
    Circle,
    DollarSign,
    Eye,
    FileText,
    HelpCircle,
    MessageCircle,
    Search,
    Shield,
    Star,
    Target,
    Trophy,
    Zap
} from 'lucide-react';
import React, { useState } from 'react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
  completed: boolean;
  autoPlay?: boolean;
}

interface BrokerTutorialProps {
  isDemo?: boolean;
}

export default function BrokerTutorial({ isDemo = false }: BrokerTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
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
      id: 'collapsible-sections',
      title: 'Collapsible Interface',
      description: 'The new collapsible sections help you manage long pages efficiently. Click on section headers to expand or collapse content as needed.',
      action: 'Try collapsing the Document Management and RFQ sections',
      icon: <FileText className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('collapsible-sections')
    },
    {
      id: 'ranking-system',
      title: 'Ranking & Performance',
      description: 'Track your performance with the new ranking widget. See your league status, global rank, and points earned from successful deals.',
      action: 'Check your ranking widget in the dashboard corner',
      icon: <Trophy className="h-6 w-6 text-orange-400" />,
      completed: completedSteps.has('ranking-system')
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

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const currentStepData = tutorialSteps[currentStep];

  return (
    <div className="min-h-screen relative overflow-hidden scroll-smooth">
      {/* Cinematic Burnt Orange to Obsidian Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
      {/* Cinematic Vignette - Creates spotlight effect on center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Subtle golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 30%, transparent 60%)',
        }}
      />
      
      {/* Subtle grid pattern overlay - more refined */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CiAgICAgIDxwYXRoIGQ9Ik0gMTAwIDAgTCAwIDAgTCAwIDEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjAuNSIvPgogICAgPC9wYXR0ZXJuPgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0idXJsKCNncmlkKSIvPgo8L3N2Zz4=')] opacity-30"></div>
      </div>
      
      {/* Header matching broker demo terminal */}
      <header className="relative z-10 sticky top-0 backdrop-blur-modern border-b border-terminal-border bg-slate-800">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          {/* Logo at absolute left corner */}
          <div className="flex items-center">
            <StratusConnectLogo className="text-xl" />
          </div>
          
          {/* Middle space cleared for future content */}
          <div className="flex-1"></div>
          
          {/* Tutorial button at absolute right corner */}
          <div className="flex items-center">
            <Button
              onClick={() => window.location.href = '/demo/broker'}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Demo
            </Button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        {/* Progress Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Tutorial Progress
              </h2>
              <div className="flex items-center space-x-6">
                <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2">
                  <Circle className="w-4 h-4 mr-2" />
                  Step {currentStep + 1} of {tutorialSteps.length}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {completedSteps.size} Completed
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
              {/* Ranking Widget */}
              <Card className="terminal-card w-fit">
                <div className="flex items-center gap-4 p-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Ranking</p>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-accent" />
                      <span className="text-lg font-bold text-accent">Golden</span>
                    </div>
                    <p className="text-xs text-accent">#12 Global</p>
                  </div>
                  <div className="w-px h-10 bg-terminal-border"></div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Points</p>
                    <p className="text-lg font-bold text-foreground">567</p>
                    <p className="text-xs text-accent">+23 this week</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-terminal-border rounded-full h-3 mb-3">
            <div 
              className="bg-accent h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% Complete</span>
            <span>{tutorialSteps.length - currentStep - 1} steps remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tutorial Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Step Card */}
            <Card className="terminal-card p-8">
              <div className="flex items-start space-x-6 mb-8">
                <div className="p-4 bg-accent/20 rounded-xl">
                  {currentStepData.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {currentStepData.title}
                  </h3>
                  <div className="flex items-center space-x-3 mb-6">
                    {currentStepData.completed ? (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Completed
                      </Badge>
                    ) : (
                      <Badge className="bg-accent/20 text-accent border-accent/30 px-4 py-2">
                        <Circle className="w-4 h-4 mr-2" />
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                {currentStepData.description}
              </p>
              
              <div className="bg-terminal-card/50 rounded-xl p-6 border border-terminal-border mb-8">
                <div className="flex items-center space-x-3 mb-3">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  <span className="text-accent font-medium text-lg">Action Required:</span>
                </div>
                <p className="text-muted-foreground text-lg">{currentStepData.action}</p>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => markStepComplete(currentStepData.id)}
                    disabled={currentStepData.completed}
                    className="bg-accent hover:bg-accent/90 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>

                <Button
                  onClick={nextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="bg-accent hover:bg-accent/90 text-white disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Card>

            {/* Quick Tips */}
            <Card className="terminal-card p-8">
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="h-6 w-6 text-accent" />
                <h3 className="text-xl font-semibold text-foreground">Quick Tips</h3>
              </div>
              <div className="space-y-6">
                {[
                  "Always include detailed trip requirements to get accurate quotes",
                  "Compare multiple quotes before accepting to ensure best value",
                  "Use the messaging system to build relationships with operators",
                  "Save your favorite operators for quick access to trusted partners"
                ].map((tip, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <p className="text-muted-foreground text-base leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Step Overview */}
            <Card className="terminal-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Tutorial Steps</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tutorialSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer transition-colors ${
                      index === currentStep
                        ? 'bg-accent/20 border border-accent/30'
                        : 'hover:bg-terminal-card/50'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="flex-shrink-0">
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : index === currentStep ? (
                        <div className="w-5 h-5 bg-accent rounded-full" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-relaxed ${
                        index === currentStep ? 'text-accent' : 'text-muted-foreground'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Key Features */}
            <Card className="terminal-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Key Features</h3>
              <div className="space-y-4">
                {[
                  { icon: <Shield className="h-5 w-5 text-green-400" />, text: "Universal Compliance" },
                  { icon: <DollarSign className="h-5 w-5 text-blue-400" />, text: "7% Platform Fee" },
                  { icon: <MessageCircle className="h-5 w-5 text-purple-400" />, text: "Secure Messaging" },
                  { icon: <BarChart3 className="h-5 w-5 text-accent" />, text: "Performance Analytics" },
                  { icon: <Eye className="h-5 w-5 text-cyan-400" />, text: "Transparent Pricing" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {feature.icon}
                    <span className="text-base text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Support */}
            <Card className="terminal-card p-6">
              <h3 className="text-xl font-semibold text-foreground mb-6">Need Help?</h3>
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start px-4 py-3">
                  <HelpCircle className="h-4 w-4 mr-3" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start px-4 py-3">
                  <BookOpen className="h-4 w-4 mr-3" />
                  View Documentation
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
