import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Zap, 
  Shield, 
  Clock, 
  Brain, 
  MessageSquare,
  Mic,
  Volume2,
  Settings,
  Users,
  TrendingUp,
  FileText
} from 'lucide-react';
import AdvancedAIChatbot from '@/components/AdvancedAIChatbot';

export default function AIChatbot() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-foreground">
                StratusConnect AI Assistant
              </h1>
              <p className="text-xl text-muted-foreground">
                Your intelligent aviation companion with voice capabilities
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                AI-Powered Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Comprehensive aviation knowledge base</li>
                <li>• Real-time industry insights</li>
                <li>• Context-aware responses</li>
                <li>• Continuous learning capabilities</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Mic className="w-5 h-5 text-accent" />
                Voice Interaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Natural voice conversations</li>
                <li>• Voice input and output</li>
                <li>• Multi-language support</li>
                <li>• Hands-free operation</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• Privacy-first design</li>
                <li>• Secure data handling</li>
                <li>• Compliance with regulations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Aviation Expertise
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Aircraft Knowledge</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive database of aircraft specifications, performance data, 
                    and manufacturer information for all major aviation companies.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Regulations & Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    Up-to-date information on FAA, ICAO, and EASA regulations, 
                    compliance requirements, and certification processes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Market Intelligence</h4>
                  <p className="text-sm text-muted-foreground">
                    Real-time market trends, pricing data, demand patterns, 
                    and industry insights to help you make informed decisions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="terminal-card border-terminal-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Settings className="w-5 h-5 text-accent" />
                Platform Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">User-Specific Help</h4>
                  <p className="text-sm text-muted-foreground">
                    Tailored assistance based on your role - broker, operator, 
                    pilot, crew, or admin - with relevant guidance and features.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Real-Time Support</h4>
                  <p className="text-sm text-muted-foreground">
                    Instant help with platform features, troubleshooting, 
                    and best practices to maximize your productivity.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Memory & Context</h4>
                  <p className="text-sm text-muted-foreground">
                    Remembers your preferences, previous conversations, 
                    and provides contextual assistance throughout your session.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Chatbot Interface */}
        <Card className="terminal-card border-terminal-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              Start a Conversation
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ask me anything about aviation, StratusConnect, or your operations. 
              I'm here to help 24/7 with voice and text capabilities.
            </p>
          </CardHeader>
          <CardContent>
            <AdvancedAIChatbot userType="broker" className="h-[500px]" />
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Always Available</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">100%</div>
            <div className="text-sm text-muted-foreground">Secure & Private</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">AI</div>
            <div className="text-sm text-muted-foreground">Powered Intelligence</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-accent mb-2">Voice</div>
            <div className="text-sm text-muted-foreground">Enabled</div>
          </div>
        </div>
      </div>
    </div>
  );
}
