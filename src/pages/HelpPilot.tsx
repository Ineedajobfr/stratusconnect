import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StarfieldBackground from '@/components/StarfieldBackground';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NavigationControls } from '@/components/NavigationControls';
import { 
  Plane, 
  Calendar, 
  Briefcase, 
  Award, 
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

export default function HelpPilot() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Plane className="h-6 w-6" />,
      title: "Flight Deck",
      description: "Your central command center for flight operations",
      steps: [
        "View today's schedule and upcoming flights",
        "Check weather conditions and notices",
        "Monitor flight hours and performance metrics",
        "Access quick actions and emergency procedures"
      ]
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Schedule Management",
      description: "Manage your availability and flight schedule",
      steps: [
        "Set your availability calendar",
        "Block dates for personal time",
        "View assigned flights and duties",
        "Track duty time and rest requirements"
      ]
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Certifications",
      description: "Track and manage your pilot credentials",
      steps: [
        "View all current certifications and ratings",
        "Track expiration dates and renewal requirements",
        "Upload new certificates and documents",
        "Monitor training requirements and compliance"
      ]
    },
    {
      icon: <Briefcase className="h-6 w-6" />,
      title: "Job Pipeline",
      description: "Find and apply for pilot positions",
      steps: [
        "Browse available pilot positions",
        "Filter by aircraft type, location, and pay",
        "Apply for positions that match your qualifications",
        "Track application status and responses"
      ]
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Fortress of Trust",
      description: "Verification and trust management",
      steps: [
        "Complete identity verification",
        "Upload required documents and certificates",
        "Maintain security clearance status",
        "Build your professional reputation"
      ]
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Earnings",
      description: "Track your flight earnings and payments",
      steps: [
        "View completed flights and earnings",
        "Track payment history and status",
        "Monitor performance bonuses",
        "Generate earnings reports"
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
                <Plane className="h-4 w-4 text-black" />
              </div>
              <span className="text-xl font-bold">STRATUSCONNECT</span>
            </div>
            <div className="text-sm text-slate-400">PILOT HELP CENTER</div>
          </div>
          <NavigationControls 
            onPrevious={() => navigate('/demo/pilot')}
            showHome={true}
            showHelp={false}
          />
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-400 mb-4">
            Pilot Terminal Guide
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Professional pilot interface for career management and flight operations
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
              Get your pilot profile set up and start finding opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">1</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Complete Profile</h3>
                <p className="text-slate-400">Add certifications, ratings, and experience</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">2</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Set Availability</h3>
                <p className="text-slate-400">Update your calendar and availability</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-black">3</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Find Jobs</h3>
                <p className="text-slate-400">Browse and apply for pilot positions</p>
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
                <h4 className="font-semibold text-white mb-2">Credentials Speak</h4>
                <p className="text-slate-300">Keep all certifications current and prominently displayed</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Fly the Missions That Fit</h4>
                <p className="text-slate-300">Focus on aircraft types and routes you're most qualified for</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Maintain Availability</h4>
                <p className="text-slate-300">Keep your calendar updated for maximum opportunities</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">Build Reputation</h4>
                <p className="text-slate-300">Deliver excellent service to build ratings and reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button 
            onClick={() => navigate('/demo/pilot')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg"
          >
            Try Pilot Terminal
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
