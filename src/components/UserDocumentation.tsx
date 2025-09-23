import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Play, 
  Download, 
  Search, 
  Video, 
  FileText, 
  HelpCircle,
  ChevronRight,
  CheckCircle,
  Clock,
  Users,
  Zap,
  Shield,
  Bot,
  MessageSquare,
  Settings,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

interface DocumentationSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function UserDocumentation() {
  const [activeSection, setActiveSection] = useState('getting-started');

  const documentationSections: DocumentationSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide for new users',
      icon: <Play className="w-5 h-5" />,
      estimatedTime: '5 minutes',
      difficulty: 'Beginner',
      content: (
        <div className="space-y-6">
          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Welcome to StratusConnect!</h3>
            <p className="text-muted-foreground mb-4">
              StratusConnect is the premier aviation marketplace connecting brokers, operators, pilots, and crew members. 
              This guide will help you get up and running quickly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">For Brokers</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Create and manage RFQs</li>
                  <li>• Access real-time market data</li>
                  <li>• Connect with verified operators</li>
                  <li>• Track deals and payments</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">For Operators</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Manage your fleet</li>
                  <li>• Respond to RFQs</li>
                  <li>• Track crew assignments</li>
                  <li>• Monitor performance metrics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Step-by-Step Setup</h3>
            <div className="space-y-3">
              {[
                { step: 1, title: 'Create Your Account', description: 'Sign up with your email and verify your identity' },
                { step: 2, title: 'Complete Your Profile', description: 'Add your credentials, experience, and preferences' },
                { step: 3, title: 'Choose Your Terminal', description: 'Select the appropriate terminal for your role' },
                { step: 4, title: 'Explore Features', description: 'Take a tour of your terminal and available features' },
                { step: 5, title: 'Start Using AI Assistant', description: 'Ask questions and get instant help' }
              ].map((item) => (
                <div key={item.step} className="flex items-start space-x-3 p-3 bg-terminal-card rounded-lg border border-terminal-border">
                  <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ai-assistant',
      title: 'AI Assistant Guide',
      description: 'Master the AI-powered features',
      icon: <Bot className="w-5 h-5" />,
      estimatedTime: '10 minutes',
      difficulty: 'Intermediate',
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-accent/20 to-blue-500/20 border border-accent/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">🤖 Your AI Aviation Companion</h3>
            <p className="text-muted-foreground mb-4">
              Our AI Assistant is powered by advanced machine learning and comprehensive aviation databases. 
              It can help with everything from aircraft specifications to market analysis.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                <h4 className="font-medium text-foreground">Ultra-Fast</h4>
                <p className="text-sm text-muted-foreground">300ms response times</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-accent mx-auto mb-2" />
                <h4 className="font-medium text-foreground">Secure</h4>
                <p className="text-sm text-muted-foreground">End-to-end encryption</p>
              </div>
              <div className="text-center">
                <Brain className="w-8 h-8 text-accent mx-auto mb-2" />
                <h4 className="font-medium text-foreground">Intelligent</h4>
                <p className="text-sm text-muted-foreground">Learns from interactions</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">AI Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Aircraft Search', description: 'Find aircraft by specifications, range, capacity' },
                { title: 'Market Analysis', description: 'Get real-time pricing and demand data' },
                { title: 'Regulatory Help', description: 'FAA, EASA, ICAO compliance assistance' },
                { title: 'Route Planning', description: 'Optimize flight paths and fuel stops' },
                { title: 'Crew Matching', description: 'Find qualified pilots and crew' },
                { title: 'Deal Analysis', description: 'Evaluate RFQs and quotes' }
              ].map((feature) => (
                <Card key={feature.title} className="terminal-card">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Voice Commands</h3>
            <div className="bg-terminal-card border border-terminal-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-3">Try these voice commands:</p>
              <div className="space-y-2">
                {[
                  "Show me Gulfstream G650ER specifications",
                  "What's the current market rate for TEB to LHR?",
                  "Help me with FAA Part 135 compliance",
                  "Find available crew for tomorrow's flight",
                  "Analyze this RFQ for profitability"
                ].map((command) => (
                  <div key={command} className="flex items-center space-x-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-accent" />
                    <span className="text-foreground">"{command}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'terminal-guides',
      title: 'Terminal Guides',
      description: 'Detailed guides for each terminal type',
      icon: <Monitor className="w-5 h-5" />,
      estimatedTime: '15 minutes',
      difficulty: 'Intermediate',
      content: (
        <div className="space-y-6">
          <Tabs defaultValue="broker" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="broker">Broker</TabsTrigger>
              <TabsTrigger value="operator">Operator</TabsTrigger>
              <TabsTrigger value="pilot">Pilot</TabsTrigger>
              <TabsTrigger value="crew">Crew</TabsTrigger>
            </TabsList>
            
            <TabsContent value="broker" className="space-y-4">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Broker Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Key Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Create and manage RFQs (Request for Quotes)</li>
                      <li>• Access real-time market data and pricing</li>
                      <li>• Connect with verified operators worldwide</li>
                      <li>• Track deal progress and payments</li>
                      <li>• Manage client relationships and history</li>
                      <li>• Generate reports and analytics</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Workflow</h4>
                    <div className="space-y-2">
                      {[
                        'Receive client request',
                        'Create detailed RFQ',
                        'Send to qualified operators',
                        'Review and compare quotes',
                        'Present options to client',
                        'Finalize deal and payment'
                      ].map((step, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-5 h-5 bg-accent text-white rounded-full flex items-center justify-center text-xs">
                            {index + 1}
                          </div>
                          <span className="text-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="operator" className="space-y-4">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-accent" />
                    Operator Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Key Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Manage aircraft fleet and availability</li>
                      <li>• Respond to RFQs with competitive quotes</li>
                      <li>• Track crew assignments and schedules</li>
                      <li>• Monitor operational costs and profitability</li>
                      <li>• Manage maintenance and compliance</li>
                      <li>• Generate operational reports</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="pilot" className="space-y-4">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-accent" />
                    Pilot Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Key Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Update flight hours and certifications</li>
                      <li>• Browse available assignments</li>
                      <li>• Manage schedule and availability</li>
                      <li>• Track earnings and performance</li>
                      <li>• Access training resources</li>
                      <li>• Connect with operators</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="crew" className="space-y-4">
              <Card className="terminal-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-accent" />
                    Crew Terminal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">Key Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Manage qualifications and certifications</li>
                      <li>• View crew assignments and schedules</li>
                      <li>• Update availability calendar</li>
                      <li>• Track performance and ratings</li>
                      <li>• Access training materials</li>
                      <li>• Connect with operators</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and solutions',
      icon: <HelpCircle className="w-5 h-5" />,
      estimatedTime: '5 minutes',
      difficulty: 'Beginner',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Common Issues</h3>
            <div className="space-y-4">
              {[
                {
                  issue: "AI Assistant not responding",
                  solution: "Check your internet connection and try refreshing the page. If the issue persists, try clearing your browser cache.",
                  icon: <Bot className="w-5 h-5 text-accent" />
                },
                {
                  issue: "Can't access terminal features",
                  solution: "Ensure you're logged in with the correct account type. Some features are role-specific.",
                  icon: <Settings className="w-5 h-5 text-accent" />
                },
                {
                  issue: "Mobile app not working properly",
                  solution: "Try using the web version in your mobile browser. The mobile app is optimized for the latest devices.",
                  icon: <Smartphone className="w-5 h-5 text-accent" />
                },
                {
                  issue: "Payment processing errors",
                  solution: "Check your payment method and billing information. Contact support if the issue continues.",
                  icon: <Shield className="w-5 h-5 text-accent" />
                }
              ].map((item, index) => (
                <Card key={index} className="terminal-card">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {item.icon}
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground mb-2">{item.issue}</h4>
                        <p className="text-sm text-muted-foreground">{item.solution}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Still Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Contact Support</h4>
                <p className="text-sm text-muted-foreground">
                  Our support team is available 24/7 to help with any issues.
                </p>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">AI Assistant</h4>
                <p className="text-sm text-muted-foreground">
                  Ask our AI assistant for instant help with common questions.
                </p>
                <Button variant="outline" size="sm">
                  <Bot className="w-4 h-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">StratusConnect Documentation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive guides to help you master every aspect of the StratusConnect platform
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="terminal-card sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {documentationSections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(section.id)}
                >
                  <div className="flex items-center space-x-2">
                    {section.icon}
                    <span className="text-sm">{section.title}</span>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {documentationSections.map((section) => (
            activeSection === section.id && (
              <Card key={section.id} className="terminal-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {section.icon}
                      <div>
                        <CardTitle className="text-xl">{section.title}</CardTitle>
                        <p className="text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{section.difficulty}</Badge>
                      <Badge variant="outline">
                        <Clock className="w-3 h-3 mr-1" />
                        {section.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {section.content}
                </CardContent>
              </Card>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
