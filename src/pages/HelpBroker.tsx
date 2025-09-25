import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StarfieldBackground from '@/components/StarfieldBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavigationControls } from '@/components/NavigationControls';
import { 
  BarChart3, 
  Plane, 
  DollarSign, 
  MessageCircle, 
  Star, 
  Search, 
  Shield, 
  CheckSquare,
  Users,
  ArrowRight,
  Play,
  FileText,
  Target,
  TrendingUp
} from 'lucide-react';

export default function HelpBroker() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Dashboard Overview",
      description: "Real-time metrics, active requests, and quick stats at a glance",
      steps: [
        "View your active trip requests and their status",
        "Monitor quotes received and success rates",
        "Check recent messages and notifications",
        "Access quick actions for common tasks"
      ]
    },
    {
      icon: <Plane className="h-6 w-6" />,
      title: "My Requests",
      description: "Manage and track all your client trip requests",
      steps: [
        "Create new RFQ (Request for Quote) for clients",
        "Track request status: Draft → Sent → Quoting → Decision → Booked",
        "View quotes received from operators",
        "Compare quotes side-by-side with risk analysis",
        "Accept quotes and move to booking phase"
      ]
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Quote Management",
      description: "Handle all quotes and pricing negotiations",
      steps: [
        "Review incoming quotes from operators",
        "Normalize pricing to price per hour for comparison",
        "Flag risks: short runway, curfew, duty limits",
        "Accept quotes and auto-create deal records",
        "Track commission and fee calculations"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Escrow Management",
      description: "Secure payment handling and fund management",
      steps: [
        "Initiate escrow for accepted deals",
        "Track payment states: Initiated → Held → Released",
        "Monitor dual control for releases above threshold",
        "Handle disputes with evidence upload",
        "Generate receipts for all transactions"
      ]
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      title: "Task Inbox",
      description: "Your daily workflow and action items",
      steps: [
        "View tasks: Missing KYC, quotes to answer, contracts to sign",
        "Check off completed tasks",
        "Snooze tasks for later",
        "Assign tasks to team members",
        "Set priority levels and due dates"
      ]
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Marketplace",
      description: "Browse available aircraft and empty legs",
      steps: [
        "Search for empty leg opportunities",
        "Filter by route, date, aircraft type, and price",
        "View operator profiles and ratings",
        "Save preferred jets and operators",
        "Contact operators directly"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white relative">
      <StarfieldBackground />
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-terminal-bg" />
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">BROKER HELP CENTER</div>
          </div>
          <NavigationControls 
            onPrevious={() => navigate('/demo/broker')}
            showHome={true}
            showHelp={false}
          />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-400 mb-4">
            Broker Terminal Guide
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Master the StratusConnect Broker Terminal with this comprehensive guide
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 px-4 py-2">
              <Play className="h-4 w-4 mr-2" />
              Interactive Demo
            </Badge>
            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2">
              <FileText className="h-4 w-4 mr-2" />
              Step-by-Step
            </Badge>
          </div>
        </div>

        {/* Quick Start */}
        <Card className="bg-slate-800 border-slate-700 mb-8">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <Target className="h-6 w-6 mr-2" />
              Quick Start Guide
            </CardTitle>
            <CardDescription>
              Get up and running with the Broker Terminal in 5 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-terminal-bg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Create Request</h3>
                <p className="text-slate-400">Post a new trip request for your client</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-terminal-bg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Review Quotes</h3>
                <p className="text-slate-400">Compare quotes from multiple operators</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-terminal-bg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Book & Pay</h3>
                <p className="text-slate-400">Accept quote and process payment through escrow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Guide */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Terminal Features Explained
          </h2>
          
          {features.map((feature, index) => (
            <Card key={index} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-orange-400 flex items-center">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center mr-4">
                    {feature.icon}
                  </div>
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {feature.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-orange-400">{stepIndex + 1}</span>
                      </div>
                      <p className="text-slate-300">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pro Tips */}
        <Card className="bg-gradient-to-r from-orange-500/10 to-blue-500/10 border-orange-500/30 mt-8">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center">
              <TrendingUp className="h-6 w-6 mr-2" />
              Pro Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Speed Creates Advantage</h4>
                <p className="text-slate-300">Respond to quotes within 2 hours to maintain competitive advantage</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Use Risk Analysis</h4>
                <p className="text-slate-300">Always check runway requirements and duty limits before accepting</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Build Relationships</h4>
                <p className="text-slate-300">Save preferred operators and maintain regular communication</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Track Everything</h4>
                <p className="text-slate-300">Use the task inbox to never miss important deadlines</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/demo/broker')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
          >
            Try Broker Terminal
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
