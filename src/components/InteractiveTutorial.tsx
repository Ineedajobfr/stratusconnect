import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  BookOpen, 
  Video, 
  FileText,
  Download,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import AIVoiceReader from './AIVoiceReader';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  duration: number; // in minutes
  type: 'overview' | 'demo' | 'guide' | 'tip';
  voiceText: string;
  highlights?: string[];
}

interface TutorialSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: TutorialStep[];
  estimatedTime: number;
}

const tutorialSections: TutorialSection[] = [
  {
    id: 'platform-overview',
    title: 'Platform Overview',
    description: 'Complete walkthrough of StratusConnect features',
    icon: <BookOpen className="w-6 h-6" />,
    estimatedTime: 5,
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to StratusConnect',
        content: 'StratusConnect is the premier aviation marketplace connecting brokers, operators, pilots, and crew members.',
        duration: 1,
        type: 'overview',
        voiceText: 'Hail, and well met. You stand now at the threshold of StratusConnect, the realm where the skies themselves bend to the will of those who dare to soar. Here, in this digital kingdom, brokers forge alliances, operators command their fleets, and pilots and crew find their destiny among the clouds. This is no mere marketplace - this is where legends of aviation are born.',
        highlights: ['Aviation marketplace', 'Brokers', 'Operators', 'Pilots', 'Crew members']
      },
      {
        id: 'key-features',
        title: 'Key Features',
        content: 'AI-powered search, real-time tracking, secure payments, and comprehensive user management.',
        duration: 2,
        type: 'overview',
        voiceText: 'Behold the power that lies within your grasp. The AI search, like the wisdom of the ancient ones, sees beyond mere words to understand the true intent of your quest. Real-time tracking, swift as the wind itself, keeps watch over every journey. Secure payments flow like rivers of gold, protected by the strongest of shields. And the management tools - they are the very foundation upon which empires of aviation are built.',
        highlights: ['AI-powered search', 'Real-time tracking', 'Secure payments', 'User management']
      },
      {
        id: 'user-roles',
        title: 'User Roles',
        content: 'Brokers manage quotes, Operators handle fleet operations, Pilots find jobs, and Crew members get assignments.',
        duration: 2,
        type: 'overview',
        voiceText: 'Four paths lie before you, each with its own destiny. The Brokers - they are the diplomats of the sky, forging alliances and managing the great contracts that bind the realm together. The Operators - they are the generals, commanding vast fleets and orchestrating the great movements across the heavens. The Pilots - they are the knights of the air, seeking their noble quests and adventures among the clouds. And the Crew - they are the faithful companions, ever ready to serve and support the great missions that await.',
        highlights: ['Brokers', 'Operators', 'Pilots', 'Crew members']
      }
    ]
  },
  {
    id: 'ai-features',
    title: 'AI Features Demo',
    description: 'Explore artificial intelligence capabilities',
    icon: <Video className="w-6 h-6" />,
    estimatedTime: 8,
    steps: [
      {
        id: 'ai-search',
        title: 'AI Search Assistant',
        content: 'Intelligent search that understands aviation terminology and context.',
        duration: 2,
        type: 'demo',
        voiceText: 'The AI Search Assistant - it is like having the wisdom of the ages at your command. Speak to it as you would to a trusted advisor, in the common tongue, and it shall understand not just your words, but the very essence of your quest. It knows the ancient languages of aviation, the secret codes of the sky, and will guide you to that which you seek with the precision of an eagle\'s eye.',
        highlights: ['Natural language', 'Aviation terminology', 'Context understanding']
      },
      {
        id: 'predictive-analytics',
        title: 'Predictive Analytics',
        content: 'Data-driven insights for better decision making and fleet optimization.',
        duration: 3,
        type: 'demo',
        voiceText: 'The Predictive Analytics - it is the gift of foresight, granted to those who would master the skies. Like the ancient seers who could read the patterns in the stars, this power analyzes the great tapestry of historical data to reveal the paths that lie ahead. It whispers of fleet optimization, foretells the tides of demand, and measures the very pulse of performance. With this knowledge, you shall make decisions that would make even the wisest of kings envious.',
        highlights: ['Data analysis', 'Fleet optimization', 'Demand forecasting', 'Performance metrics']
      },
      {
        id: 'ai-chatbot',
        title: 'AI Chatbot',
        content: '24/7 intelligent assistance for users and real-time support.',
        duration: 3,
        type: 'demo',
        voiceText: 'The AI Chatbot - your ever-vigilant guardian, standing watch through the long hours of day and night. Like a faithful steward who never sleeps, it stands ready to answer your every question, guide you through the labyrinth of the platform, and come to your aid when troubles arise. It knows the secrets of navigation, the mysteries of the interface, and the solutions to the most common of trials. In your darkest hour, when all seems lost, the chatbot shall be your light in the darkness.',
        highlights: ['24/7 assistance', 'Real-time support', 'Platform guidance']
      }
    ]
  },
  {
    id: 'search-tips',
    title: 'Advanced Search Tips',
    description: 'Master the search functionality',
    icon: <FileText className="w-6 h-6" />,
    estimatedTime: 6,
    steps: [
      {
        id: 'search-basics',
        title: 'Search Basics',
        content: 'Use keywords, filters, and operators to find exactly what you need.',
        duration: 2,
        type: 'guide',
        voiceText: 'Start with basic keywords related to your search. Use filters to narrow down results by date, location, aircraft type, or price range. Combine multiple terms for more specific results.',
        highlights: ['Keywords', 'Filters', 'Operators', 'Date range', 'Location']
      },
      {
        id: 'advanced-filters',
        title: 'Advanced Filters',
        content: 'Combine multiple criteria for precise results and save searches for later.',
        duration: 2,
        type: 'guide',
        voiceText: 'Advanced filters allow you to combine multiple criteria. You can filter by aircraft type, departure and arrival locations, date ranges, price brackets, and availability. Save your searches to quickly access them later.',
        highlights: ['Multiple criteria', 'Aircraft type', 'Price brackets', 'Save searches']
      },
      {
        id: 'search-shortcuts',
        title: 'Search Shortcuts',
        content: 'Use keyboard shortcuts and quick actions for faster searching.',
        duration: 2,
        type: 'tip',
        voiceText: 'Use keyboard shortcuts like Ctrl+F for quick search, Tab to navigate between filters, and Enter to execute searches. Quick actions include recent searches and saved filters.',
        highlights: ['Keyboard shortcuts', 'Quick actions', 'Recent searches', 'Saved filters']
      }
    ]
  },
  {
    id: 'payment-escrow',
    title: 'Payment & Escrow',
    description: 'Secure transaction processing',
    icon: <Download className="w-6 h-6" />,
    estimatedTime: 4,
    steps: [
      {
        id: 'payment-methods',
        title: 'Payment Methods',
        content: 'Support for multiple payment methods including credit cards, bank transfers, and digital wallets.',
        duration: 1,
        type: 'guide',
        voiceText: 'StratusConnect supports multiple payment methods including major credit cards, bank transfers, and digital wallets. All transactions are processed securely with industry-standard encryption.',
        highlights: ['Credit cards', 'Bank transfers', 'Digital wallets', 'Secure encryption']
      },
      {
        id: 'escrow-system',
        title: 'Escrow System',
        content: 'Secure escrow holds funds until services are completed and verified.',
        duration: 2,
        type: 'guide',
        voiceText: 'The escrow system holds funds securely until services are completed and verified. This protects both buyers and sellers by ensuring payment only occurs after successful service delivery.',
        highlights: ['Secure holding', 'Service verification', 'Buyer protection', 'Seller protection']
      },
      {
        id: 'transaction-tracking',
        title: 'Transaction Tracking',
        content: 'Real-time tracking of payments, disputes, and resolution processes.',
        duration: 1,
        type: 'guide',
        voiceText: 'Track all transactions in real-time through the platform. Monitor payment status, handle disputes, and follow resolution processes all in one place.',
        highlights: ['Real-time tracking', 'Payment status', 'Dispute handling', 'Resolution process']
      }
    ]
  }
];

export default function InteractiveTutorial() {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showVoiceReader, setShowVoiceReader] = useState(false);

  const currentTutorial = tutorialSections[currentSection];
  const currentStepData = currentTutorial.steps[currentStep];
  const progress = ((currentStep + 1) / currentTutorial.steps.length) * 100;

  const nextStep = () => {
    if (currentStep < currentTutorial.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (currentSection < tutorialSections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentStep(0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentStep(tutorialSections[currentSection - 1].steps.length - 1);
    }
  };

  const playStep = () => {
    setIsPlaying(true);
    setShowVoiceReader(true);
  };

  const completeStep = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]));
    nextStep();
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'overview': return 'bg-blue-500';
      case 'demo': return 'bg-green-500';
      case 'guide': return 'bg-orange-500';
      case 'tip': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'overview': return <BookOpen className="w-4 h-4" />;
      case 'demo': return <Video className="w-4 h-4" />;
      case 'guide': return <FileText className="w-4 h-4" />;
      case 'tip': return <Volume2 className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Interactive Tutorials</h2>
        <p className="text-muted-foreground">
          Learn StratusConnect with AI-powered voice guides
        </p>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tutorialSections.map((section, index) => (
          <Card 
            key={section.id}
            className={`cursor-pointer transition-all duration-200 ${
              index === currentSection 
                ? 'border-accent bg-accent/10' 
                : 'border-terminal-border hover:border-accent/50'
            }`}
            onClick={() => {
              setCurrentSection(index);
              setCurrentStep(0);
            }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {section.icon}
                <CardTitle className="text-lg text-foreground">
                  {section.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {section.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {section.estimatedTime} min
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Tutorial */}
      <Card className="terminal-card border-terminal-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentTutorial.icon}
              <div>
                <CardTitle className="text-foreground">
                  {currentTutorial.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {currentTutorial.steps.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStepTypeColor(currentStepData.type)}>
                {getStepTypeIcon(currentStepData.type)}
                <span className="ml-1 capitalize">{currentStepData.type}</span>
              </Badge>
              <Badge variant="outline">
                {currentStepData.duration} min
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Content */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">
              {currentStepData.title}
            </h3>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed">
                {currentStepData.content}
              </p>
            </div>

            {/* Highlights */}
            {currentStepData.highlights && (
              <div className="flex flex-wrap gap-2">
                {currentStepData.highlights.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {highlight}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={prevStep}
                variant="outline"
                size="sm"
                disabled={currentSection === 0 && currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={playStep}
                variant="default"
                size="sm"
                className="bg-accent hover:bg-accent/80"
              >
                <Play className="w-4 h-4" />
                Play Audio
              </Button>
              
              <Button
                onClick={completeStep}
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700"
              >
                ✓ Complete
              </Button>
              
              <Button
                onClick={nextStep}
                variant="outline"
                size="sm"
                disabled={currentSection === tutorialSections.length - 1 && currentStep === currentTutorial.steps.length - 1}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {completedSteps.size} of {tutorialSections.reduce((acc, section) => acc + section.steps.length, 0)} completed
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Voice Reader */}
      {showVoiceReader && (
        <AIVoiceReader
          text={currentStepData.voiceText}
          title={`${currentStepData.title} - Audio Guide`}
          className="mt-6"
        />
      )}
    </div>
  );
}
