// How to Use StratusConnect - Comprehensive User Guide
// Step-by-step manual for all terminals and features

import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';
import { StratusConnectLogo } from '@/components/StratusConnectLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    ArrowLeft,
    BarChart3,
    BookOpen,
    Briefcase,
    Building2,
    CheckCircle,
    DollarSign,
    Download,
    ExternalLink,
    FileText,
    MessageSquare,
    Plane,
    Play,
    Search,
    Shield,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  const terminalGuides = [
    {
      id: 'broker',
      title: 'Broker Terminal',
      description: 'Connect with operators and manage client relationships',
      icon: Building2,
      color: 'text-blue-400',
      features: [
        'Browse available aircraft and operators',
        'Submit quote requests to multiple operators',
        'Track and manage client communications',
        'Monitor market trends and pricing',
        'Secure payment processing and escrow',
        'Document management and compliance'
      ]
    },
    {
      id: 'operator',
      title: 'Operator Terminal',
      description: 'Manage your fleet and respond to broker requests',
      icon: Plane,
      color: 'text-green-400',
      features: [
        'Fleet availability and scheduling',
        'Respond to broker quote requests',
        'Manage crew assignments and rosters',
        'Track maintenance and certifications',
        'Revenue and performance analytics',
        'Operational documentation'
      ]
    },
    {
      id: 'pilot',
      title: 'Pilot Terminal',
      description: 'Find flying opportunities and manage your career',
      icon: Users,
      color: 'text-purple-400',
      features: [
        'Browse available pilot positions',
        'Submit applications to operators',
        'Track flight hours and certifications',
        'Manage availability calendar',
        'View earnings and payment history',
        'Professional profile management'
      ]
    },
    {
      id: 'crew',
      title: 'Crew Terminal',
      description: 'Find cabin crew opportunities and manage assignments',
      icon: Briefcase,
      color: 'text-orange-400',
      features: [
        'Browse available crew positions',
        'Apply for cabin crew assignments',
        'Manage service specialties and skills',
        'Track availability and preferences',
        'View performance reviews and ratings',
        'Certification and training records'
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

  const platformFeatures = [
    {
      title: 'Advanced Search',
      description: 'Powerful filtering and search capabilities',
      icon: Search,
      examples: [
        'Filter aircraft by type, range, and availability',
        'Search operators by location and certification level',
        'Find opportunities by route and date preferences'
      ]
    },
    {
      title: 'Market Analytics',
      description: 'Real-time data and market insights',
      icon: TrendingUp,
      examples: [
        'View pricing trends and market data',
        'Track performance metrics and KPIs',
        'Monitor competitor activity and pricing'
      ]
    },
    {
      title: 'Communication Hub',
      description: 'Centralized messaging and collaboration tools',
      icon: MessageSquare,
      examples: [
        'Direct messaging between brokers and operators',
        'Crew assignment notifications and updates',
        'Document sharing and collaboration features'
      ]
    },
    {
      title: 'Document Management',
      description: 'Secure file storage and compliance tracking',
      icon: FileText,
      examples: [
        'Digital document storage and organization',
        'Compliance tracking and renewal alerts',
        'Secure document sharing between parties'
      ]
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-black">
      <StarfieldRunwayBackground />
      
      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-black/40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)] pointer-events-none" />
      
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
              onClick={() => {
                // Check if user is authenticated to determine where to navigate
                const isAuthenticated = localStorage.getItem('testUser') || document.cookie.includes('supabase');
                if (isAuthenticated) {
                  navigate('/home');
                } else {
                  navigate('/');
                }
              }}
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
                  Platform Features
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
                    <BarChart3 className="w-8 h-8 text-accent" />
                    <div>
                      <CardTitle className="text-lg">Analytics & Insights</CardTitle>
                      <p className="text-sm text-muted-foreground">Data-driven decision making</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Market trend analysis</li>
                    <li>• Performance metrics</li>
                    <li>• Revenue tracking</li>
                    <li>• Operational insights</li>
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
                <CardTitle className="text-2xl text-foreground">Platform Features</CardTitle>
                <p className="text-muted-foreground">
                  Advanced tools and features to streamline your aviation operations and maximize efficiency.
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {platformFeatures.map((feature, index) => (
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
                  Download comprehensive guides and documentation for each terminal.
                </p>
              </CardHeader>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
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
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
