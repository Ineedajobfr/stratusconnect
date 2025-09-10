import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  Play, 
  ChevronRight, 
  Shield, 
  Users, 
  Plane, 
  MessageSquare,
  BarChart3,
  Settings,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Book
} from "lucide-react";

interface InstructionStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'getting-started' | 'navigation' | 'features' | 'security' | 'advanced';
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface InstructionGuideProps {
  terminalType: 'broker' | 'operator' | 'crew' | 'admin' | 'demo';
  showOnMount?: boolean;
  onGuideComplete?: () => void;
}

export const InstructionGuide = ({ terminalType, showOnMount = false, onGuideComplete }: InstructionGuideProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('getting-started');
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showWelcome, setShowWelcome] = useState(showOnMount);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const getInstructionsForTerminal = (type: string): InstructionStep[] => {
    const baseInstructions: InstructionStep[] = [
      {
        id: 'overview',
        title: 'Terminal Overview',
        description: 'Welcome to your professional aviation terminal. Navigate using the sidebar to access different sections and tools.',
        icon: Play,
        category: 'getting-started',
        estimatedTime: '2 min',
        difficulty: 'beginner'
      },
      {
        id: 'navigation',
        title: 'Navigation Basics',
        description: 'Use the sidebar to switch between sections. Each section is designed for specific workflows and data.',
        icon: ChevronRight,
        category: 'navigation',
        estimatedTime: '3 min',
        difficulty: 'beginner'
      },
      {
        id: 'verification',
        title: 'Fortress of Trust',
        description: 'Complete your verification to unlock full platform features and gain access to premium tools.',
        icon: Shield,
        category: 'security',
        estimatedTime: '10 min',
        difficulty: 'intermediate'
      },
      {
        id: 'messaging',
        title: 'Secure Communication',
        description: 'Use the messaging system for secure, encrypted communication with other verified users.',
        icon: MessageSquare,
        category: 'features',
        estimatedTime: '5 min',
        difficulty: 'beginner'
      },
      {
        id: 'analytics',
        title: 'Performance Analytics',
        description: 'Monitor your performance, track metrics, and optimize your operations with detailed analytics.',
        icon: BarChart3,
        category: 'features',
        estimatedTime: '8 min',
        difficulty: 'intermediate'
      }
    ];

    const terminalSpecific: Record<string, InstructionStep[]> = {
      broker: [
        {
          id: 'marketplace',
          title: 'Marketplace Access',
          description: 'Search and filter available aircraft, create quotes, and manage client requests efficiently.',
          icon: Plane,
          category: 'features',
          estimatedTime: '15 min',
          difficulty: 'intermediate'
        },
        {
          id: 'quotes',
          title: 'Quote Management',
          description: 'Create competitive quotes, track response times, and optimize your win rate.',
          icon: Settings,
          category: 'advanced',
          estimatedTime: '12 min',
          difficulty: 'advanced'
        }
      ],
      operator: [
        {
          id: 'fleet',
          title: 'Fleet Management',
          description: 'Monitor aircraft status, schedule maintenance, and optimize utilization rates.',
          icon: Plane,
          category: 'features',
          estimatedTime: '20 min',
          difficulty: 'intermediate'
        },
        {
          id: 'revenue',
          title: 'Revenue Optimization',
          description: 'Track revenue streams, analyze performance, and maximize operational efficiency.',
          icon: BarChart3,
          category: 'advanced',
          estimatedTime: '15 min',
          difficulty: 'advanced'
        }
      ],
      crew: [
        {
          id: 'jobs',
          title: 'Job Management',
          description: 'View available positions, manage applications, and track your career progress.',
          icon: Users,
          category: 'features',
          estimatedTime: '10 min',
          difficulty: 'beginner'
        },
        {
          id: 'certifications',
          title: 'Certification Tracking',
          description: 'Upload and manage your certifications, licenses, and professional credentials.',
          icon: Shield,
          category: 'features',
          estimatedTime: '12 min',
          difficulty: 'intermediate'
        }
      ],
      admin: [
        {
          id: 'user-management',
          title: 'User Management',
          description: 'Manage user accounts, verify credentials, and maintain platform security.',
          icon: Users,
          category: 'advanced',
          estimatedTime: '25 min',
          difficulty: 'advanced'
        },
        {
          id: 'security-monitoring',
          title: 'Security Monitoring',
          description: 'Monitor system security, review audit logs, and manage threat detection.',
          icon: Shield,
          category: 'advanced',
          estimatedTime: '30 min',
          difficulty: 'advanced'
        }
      ],
      demo: [
        {
          id: 'demo-setup',
          title: 'Demo Environment',
          description: 'Set up demo users and explore different terminal types to understand platform capabilities.',
          icon: Play,
          category: 'getting-started',
          estimatedTime: '5 min',
          difficulty: 'beginner'
        }
      ]
    };

    return [...baseInstructions, ...(terminalSpecific[type] || [])];
  };

  const instructions = getInstructionsForTerminal(terminalType);
  const categories = ['getting-started', 'navigation', 'features', 'security', 'advanced'];
  
  const categoryLabels = {
    'getting-started': 'Getting Started',
    'navigation': 'Navigation',
    'features': 'Features',
    'security': 'Security',
    'advanced': 'Advanced'
  };

  const categoryIcons = {
    'getting-started': Play,
    'navigation': ChevronRight,
    'features': Lightbulb,
    'security': Shield,
    'advanced': Settings
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-terminal-success/20 text-terminal-success border-terminal-success/30';
      case 'intermediate': return 'bg-terminal-warning/20 text-terminal-warning border-terminal-warning/30';
      case 'advanced': return 'bg-terminal-danger/20 text-terminal-danger border-terminal-danger/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const markStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
  };

  const getTerminalTitle = (type: string) => {
    const titles = {
      broker: 'Broker Terminal',
      operator: 'Operator Terminal', 
      crew: 'Crew Terminal',
      admin: 'Admin Terminal',
      demo: 'Demo Environment'
    };
    return titles[type as keyof typeof titles] || 'Terminal';
  };

  const WelcomeModal = () => (
    showWelcome && (
      <div className="fixed inset-0 bg-terminal-bg/95 backdrop-blur-sm flex items-center justify-center z-50 p-6">
        <Card className="terminal-card w-full max-w-2xl">
          <CardHeader className="text-center border-b border-terminal-border">
            <div className="w-16 h-16 mx-auto mb-4 bg-terminal-glow/20 rounded-full flex items-center justify-center">
              <Book className="w-8 h-8 text-terminal-glow" />
            </div>
            <CardTitle className="text-2xl lg:text-3xl text-foreground">
              Welcome to {getTerminalTitle(terminalType)}
            </CardTitle>
            <p className="text-gunmetal mt-2">
              Get started with our comprehensive guide to maximize your platform experience
            </p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 bg-terminal-card/50 rounded-lg border border-terminal-border/50">
                <Play className="w-8 h-8 mx-auto mb-2 text-terminal-success" />
                <h3 className="font-medium text-foreground mb-1">Quick Start</h3>
                <p className="text-sm text-gunmetal">5-minute overview</p>
              </div>
              <div className="text-center p-4 bg-terminal-card/50 rounded-lg border border-terminal-border/50">
                <Lightbulb className="w-8 h-8 mx-auto mb-2 text-terminal-warning" />
                <h3 className="font-medium text-foreground mb-1">Features</h3>
                <p className="text-sm text-gunmetal">Explore capabilities</p>
              </div>
              <div className="text-center p-4 bg-terminal-card/50 rounded-lg border border-terminal-border/50">
                <Shield className="w-8 h-8 mx-auto mb-2 text-terminal-glow" />
                <h3 className="font-medium text-foreground mb-1">Security</h3>
                <p className="text-sm text-gunmetal">Stay protected</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowWelcome(false)}
                className="flex-1 bg-terminal-glow text-white hover:bg-terminal-glow/90"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Guide
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowWelcome(false)}
                className="flex-1 border-terminal-border text-gunmetal hover:bg-terminal-card/50"
              >
                Skip for Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );

  return (
    <>
      <WelcomeModal />
      
      {/* Help Button */}
      <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="fixed bottom-6 right-6 z-40 bg-terminal-glow text-slate-900 border-terminal-glow hover:bg-terminal-glow/90 shadow-[0_0_20px_rgba(77,206,255,0.8)] font-semibold"
          >
            <HelpCircle className="w-4 h-4 mr-2" />
            Help Guide
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] bg-terminal-bg border-terminal-border p-0">
          <DialogHeader className="p-6 border-b border-terminal-border">
            <DialogTitle className="text-foreground text-xl">
              {getTerminalTitle(terminalType)} Guide
            </DialogTitle>
            <p className="text-gunmetal text-sm">
              Step-by-step instructions to master your terminal
            </p>
          </DialogHeader>
          
          <div className="flex h-[calc(90vh-120px)]">
            {/* Category Sidebar */}
            <div className="w-64 bg-terminal-card/50 border-r border-terminal-border p-4">
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons];
                  const categorySteps = instructions.filter(inst => inst.category === category);
                  const completedInCategory = categorySteps.filter(step => completedSteps.has(step.id)).length;
                  
                  return (
                    <Button
                      key={category}
                      variant="ghost"
                      onClick={() => setActiveCategory(category)}
                      className={`w-full justify-start text-left p-3 ${
                        activeCategory === category 
                          ? 'bg-terminal-glow/20 text-terminal-glow border border-terminal-glow/30' 
                          : 'text-gunmetal hover:text-foreground hover:bg-terminal-card/50'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </div>
                        <div className="text-xs opacity-70">
                          {completedInCategory}/{categorySteps.length} completed
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Instructions Content */}
            <div className="flex-1">
              <ScrollArea className="h-full">
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {categoryLabels[activeCategory as keyof typeof categoryLabels]}
                    </h3>
                    <p className="text-sm text-gunmetal">
                      Follow these steps to master this section
                    </p>
                  </div>

                  <div className="space-y-4">
                    {instructions
                      .filter(inst => inst.category === activeCategory)
                      .map((instruction, index) => {
                        const Icon = instruction.icon;
                        const isCompleted = completedSteps.has(instruction.id);
                        
                        return (
                          <Card key={instruction.id} className="terminal-card">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                    isCompleted 
                                      ? 'bg-terminal-success/20 text-terminal-success' 
                                      : 'bg-terminal-card border border-terminal-border'
                                  }`}>
                                    {isCompleted ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : (
                                      <Icon className="w-5 h-5 text-gunmetal" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-foreground">
                                      {index + 1}. {instruction.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <Badge className={getDifficultyColor(instruction.difficulty)}>
                                        {instruction.difficulty}
                                      </Badge>
                                      <span className="text-xs text-gunmetal">
                                        {instruction.estimatedTime}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-gunmetal mb-4">
                                {instruction.description}
                              </p>
                              
                              <div className="flex justify-between items-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markStepComplete(instruction.id)}
                                  disabled={isCompleted}
                                  className={`${
                                    isCompleted 
                                      ? 'border-terminal-success/30 text-terminal-success bg-terminal-success/10' 
                                      : 'border-terminal-border text-gunmetal hover:text-foreground'
                                  }`}
                                >
                                  {isCompleted ? (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Completed
                                    </>
                                  ) : (
                                    <>
                                      <ArrowRight className="w-4 h-4 mr-2" />
                                      Mark Complete
                                    </>
                                  )}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};