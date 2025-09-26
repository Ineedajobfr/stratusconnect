import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StarfieldBackground from '@/components/StarfieldBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavigationControls } from '@/components/NavigationControls';
import { 
  Building2, 
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

export default function HelpOperator() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Fleet Management",
      description: "Manage your aircraft fleet and availability",
      steps: [
        "Add and configure your aircraft",
        "Set availability schedules and pricing",
        "Track aircraft utilization and performance",
        "Manage maintenance schedules and downtime"
      ]
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "Requests Board",
      description: "View and respond to broker requests",
      steps: [
        "Browse incoming RFQs from brokers",
        "Filter by route, date, and aircraft type",
        "Submit competitive quotes quickly",
        "Track quote status and win rates"
      ]
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Quote Management",
      description: "Handle all your quotes and pricing",
      steps: [
        "Create detailed quotes with pricing breakdown",
        "Include ferry time, extras, and surcharges",
        "Set quote expiration dates",
        "Track quote performance and conversion rates"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Escrow Management",
      description: "Secure payment processing and fund management",
      steps: [
        "Receive payments through secure escrow",
        "Track payment states and releases",
        "Handle refunds and disputes",
        "Generate receipts and invoices"
      ]
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      title: "Task Inbox",
      description: "Manage daily operations and tasks",
      steps: [
        "View pending quotes and responses needed",
        "Track contract signings and document requirements",
        "Monitor crew assignments and availability",
        "Set reminders for important deadlines"
      ]
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Crew Management",
      description: "Manage pilots and cabin crew",
      steps: [
        "Browse available pilots and crew",
        "Post job opportunities and requirements",
        "Manage crew schedules and assignments",
        "Track certifications and qualifications"
      ]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Job Board",
      description: "Post and manage aviation jobs",
      steps: [
        "Create detailed job postings for pilots and crew",
        "Set requirements, pay rates, and schedules",
        "Review applications and manage hiring process",
        "Track job performance and completion rates"
      ]
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Community Forums",
      description: "Connect with industry professionals",
      steps: [
        "Participate in operator-specific discussions",
        "Share industry insights and best practices",
        "Ask questions and get expert advice",
        "Build professional relationships and network"
      ]
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Saved Crews",
      description: "Manage your favorite crew members",
      steps: [
        "Save high-performing pilots and crew",
        "Add notes and ratings for future reference",
        "Quickly contact saved crew for new jobs",
        "Track crew performance and reliability"
      ]
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Contract & Document Management",
      description: "Generate and manage contracts and receipts",
      steps: [
        "Generate professional PDF contracts",
        "Create detailed receipts for all transactions",
        "Store all documents in centralized location",
        "Track contract status and renewals"
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
                <Building2 className="h-4 w-4 text-terminal-bg" />
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">OPERATOR HELP CENTER</div>
          </div>
          <NavigationControls 
            onPrevious={() => navigate('/demo/operator')}
            showHome={true}
            showHelp={false}
          />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-400 mb-4">
            Operator Terminal Guide
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Maximize your fleet utilization and grow your business
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
              Get your fleet online and start receiving requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-terminal-bg">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Add Fleet</h3>
                <p className="text-slate-400">List your aircraft and set availability</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-terminal-bg">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Respond to RFQs</h3>
                <p className="text-slate-400">Submit competitive quotes quickly</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-terminal-bg">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Manage Bookings</h3>
                <p className="text-slate-400">Track flights and process payments</p>
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
                <h4 className="font-semibold text-white mb-2">Fill the Legs</h4>
                <p className="text-slate-300">Maximize aircraft utilization with strategic pricing</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Lift the Yield</h4>
                <p className="text-slate-300">Optimize pricing based on demand and competition</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Quick Response</h4>
                <p className="text-slate-300">Respond to RFQs within 30 minutes for best results</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Quality Service</h4>
                <p className="text-slate-300">Maintain high ratings to get more business</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/demo/operator')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
          >
            Try Operator Terminal
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
