// How to Use StratusConnect - Comprehensive User Guide
// Step-by-step manual for all terminals and features

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { 
  ArrowLeft, 
  BookOpen, 
  Users, 
  Plane, 
  Briefcase, 
  Building2,
  Search,
  MessageSquare,
  BarChart3,
  Shield,
  DollarSign,
  Clock,
  CheckCircle,
  Star,
  Zap,
  Target,
  TrendingUp,
  FileText,
  Settings,
  HelpCircle,
  Play,
  Download,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const terminalGuides = [
    {
      id: 'broker',
      title: 'Broker Terminal',
      description: 'Master the art of aviation brokerage',
      icon: Building2,
      color: 'text-blue-400',
      features: [
        'Real-time aircraft search and comparison',
        'Automated quote generation and management',
        'Client relationship management tools',
        'Market analytics and pricing insights',
        'Secure payment processing and escrow',
        'AI-powered trip recommendations'
      ]
    },
    {
      id: 'operator',
      title: 'Operator Terminal',
      description: 'Optimize your fleet operations',
      icon: Plane,
      color: 'text-green-400',
      features: [
        'Fleet management and scheduling',
        'Crew assignment and management',
        'Revenue optimization tools',
        'Maintenance tracking and alerts',
        'Performance analytics dashboard',
        'Automated crew matching'
      ]
    },
    {
      id: 'pilot',
      title: 'Pilot Terminal',
      description: 'Advance your flying career',
      icon: Users,
      color: 'text-purple-400',
      features: [
        'Job opportunity matching',
        'Digital logbook and certification tracking',
        'Availability calendar management',
        'Earnings and payment tracking',
        'Professional profile optimization',
        'AI-powered job recommendations'
      ]
    },
    {
      id: 'crew',
      title: 'Crew Terminal',
      description: 'Excel in cabin service',
      icon: Briefcase,
      color: 'text-orange-400',
      features: [
        'Assignment management and scheduling',
        'Service specialty showcase',
        'Availability and preference settings',
        'Performance tracking and reviews',
        'Certification and training records',
        'Smart job matching system'
      ]
    }
  ];

  const quickStartSteps = [
    {
      step: 1,
      title: 'Create Your Account',
      description: 'Sign up with your professional credentials and complete verification',
      icon: Shield,
      details: [
        'Choose your role (Broker, Operator, Pilot, or Crew)',
        'Upload required documents for verification',
        'Complete background checks and credential validation',
        'Set up your professional profile with experience and specialties'
      ]
    },
    {
      step: 2,
      title: 'Explore Your Terminal',
      description: 'Navigate through your personalized dashboard and key features',
      icon: BarChart3,
      details: [
        'Familiarize yourself with the dashboard layout',
        'Review key metrics and performance indicators',
        'Set up your preferences and notification settings',
        'Explore the help guides for each section'
      ]
    },
    {
      step: 3,
      title: 'Start Using Core Features',
      description: 'Begin with essential functions based on your role',
      icon: Zap,
      details: [
        'Brokers: Search for aircraft and create quotes',
        'Operators: List your fleet and manage bookings',
        'Pilots: Update availability and apply for jobs',
        'Crew: Set preferences and respond to assignments'
      ]
    },
    {
      step: 4,
      title: 'Leverage AI Tools',
      description: 'Use our AI-powered features to enhance your experience',
      icon: Target,
      details: [
        'Try the AI search assistant for complex queries',
        'Enable predictive analytics for better decision making',
        'Use automated matching for optimal connections',
        'Explore advanced filtering and recommendation systems'
      ]
    }
  ];

  const aiFeatures = [
    {
      title: 'AI Search Assistant',
      description: 'Ask complex questions in natural language',
      icon: MessageSquare,
      examples: [
        'Find all Gulfstream G650s available from London to Dubai next week',
        'Show me operators with ARGUS Platinum rating in New York',
        'What are the best empty leg opportunities for this route?'
      ]
    },
    {
      title: 'Predictive Analytics',
      description: 'Get insights and recommendations based on data',
      icon: TrendingUp,
      examples: [
        'Optimal aircraft positioning recommendations',
        'Pricing trend analysis and market insights',
        'Demand forecasting for specific routes and dates'
      ]
    },
    {
      title: 'Smart Matching',
      description: 'AI-powered connections between users',
      icon: Star,
      examples: [
        'Automatic crew-to-flight matching',
        'Broker-to-operator compatibility scoring',
        'Personalized job and opportunity recommendations'
      ]
    },
    {
      title: 'Automated Workflows',
      description: 'Streamline repetitive tasks with AI automation',
      icon: Settings,
      examples: [
        'Auto-generate quotes based on historical data',
        'Schedule optimization and conflict resolution',
        'Automated compliance checking and alerts'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Header */}
      <div className="relative z-10 bg-terminal-card border-b border-terminal-border px-6 py-4 backdrop-blur-modern">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <StratusConnectLogo className="text-orange-400" />
            <div>
            <h1 className="text-2xl font-bold text-foreground">Your Partner in Success</h1>
            <p className="text-sm text-muted-foreground">Complete guide to mastering the platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            <Button
              onClick={() => navigate('/demo')}
              className="btn-terminal-accent"
            >
              <Play className="w-4 h-4 mr-2" />
              Try Demo
            </Button>
          </div>
        </div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full justify-start mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="terminals" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Terminals
            </TabsTrigger>
            <TabsTrigger value="ai-features" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              AI Features
            </TabsTrigger>
            <TabsTrigger value="quick-start" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Quick Start
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">We're Your Trusted Partner in Success</CardTitle>
                <p className="text-muted-foreground">
                  We're not just a platform. We're your trusted partner in success, empowering every professional through technology, 
                  transparency, and genuine partnership.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Our Core Values</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Empowerment through technology that actually helps</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Partnership over transaction - we succeed together</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Trust through transparency and honest communication</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Community over competition - we're stronger together</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        <span>Excellence through standards that benefit everyone</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Getting Started</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-terminal-card rounded-lg">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">1</span>
                        </div>
                        <span className="text-sm text-foreground">Choose your terminal type</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-terminal-card rounded-lg">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">2</span>
                        </div>
                        <span className="text-sm text-foreground">Complete verification process</span>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-terminal-card rounded-lg">
                        <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">3</span>
                        </div>
                        <span className="text-sm text-foreground">Explore features and start using</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="terminal-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-8 h-8 text-accent" />
                    <div>
                      <CardTitle className="text-lg">Transparent Pricing</CardTitle>
                      <p className="text-sm text-muted-foreground">No hidden fees or subscriptions</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 7% platform fee on successful deals</li>
                    <li>• 10% hiring fee for crew/pilot placements</li>
                    <li>• Free for pilots and crew members</li>
                    <li>• No monthly subscriptions or hidden costs</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-accent" />
                    <div>
                      <CardTitle className="text-lg">Security & Trust</CardTitle>
                      <p className="text-sm text-muted-foreground">Military-grade security</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• AES-256 encryption</li>
                    <li>• SOC 2 Type II compliant</li>
                    <li>• Comprehensive verification system</li>
                    <li>• Secure escrow payments</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Zap className="w-8 h-8 text-accent" />
                    <div>
                      <CardTitle className="text-lg">AI-Powered</CardTitle>
                      <p className="text-sm text-muted-foreground">Advanced automation</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Smart search and matching</li>
                    <li>• Predictive analytics</li>
                    <li>• Automated workflows</li>
                    <li>• Real-time recommendations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="terminals" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {terminalGuides.map((terminal) => (
                <Card key={terminal.id} className="terminal-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <terminal.icon className={`w-12 h-12 ${terminal.color}`} />
                      <div>
                        <CardTitle className="text-xl text-foreground">{terminal.title}</CardTitle>
                        <p className="text-muted-foreground">{terminal.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Key Features:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {terminal.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <CheckCircle className="w-3 h-3 text-accent" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => navigate(`/demo/${terminal.id}`)}
                        className="flex-1"
                        variant="outline"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Try Demo
                      </Button>
                      <Button
                        onClick={() => navigate(`/login/${terminal.id}`)}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Access Terminal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai-features" className="space-y-8">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">AI-Powered Features</CardTitle>
                <p className="text-muted-foreground">
                  Leverage artificial intelligence to optimize your aviation operations and find the best opportunities.
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiFeatures.map((feature, index) => (
                <Card key={index} className="terminal-card">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <feature.icon className="w-8 h-8 text-accent" />
                      <div>
                        <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Example Queries:</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {feature.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <span className="text-accent">•</span>
                            <span>"{example}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quick-start" className="space-y-8">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Quick Start Guide</CardTitle>
                <p className="text-muted-foreground">
                  Get up and running with StratusConnect in just a few simple steps.
                </p>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {quickStartSteps.map((step, index) => (
                <Card key={index} className="terminal-card">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{step.step}</span>
                      </div>
                      <div>
                        <CardTitle className="text-xl text-foreground">{step.title}</CardTitle>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-accent mt-0.5" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-8">
            <Card className="terminal-card">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">Additional Resources</CardTitle>
                <p className="text-muted-foreground">
                  Download guides, watch tutorials, and access support resources.
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="terminal-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-accent" />
                    <CardTitle className="text-lg">User Manuals</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Broker Terminal Guide (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Operator Terminal Guide (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Pilot Terminal Guide (PDF)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Crew Terminal Guide (PDF)
                  </Button>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Play className="w-8 h-8 text-accent" />
                    <CardTitle className="text-lg">Video Tutorials</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    Platform Overview (5 min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    AI Features Demo (8 min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    Advanced Search Tips (6 min)
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Play className="w-4 h-4 mr-2" />
                    Payment & Escrow (4 min)
                  </Button>
                </CardContent>
              </Card>

              <Card className="terminal-card">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-8 h-8 text-accent" />
                    <CardTitle className="text-lg">Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Live Chat Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Knowledge Base
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    API Documentation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    System Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
