import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Play, 
  HelpCircle, 
  Download, 
  MessageSquare, 
  BookOpen, 
  ExternalLink, 
  Settings,
  Mic,
  Volume2
} from 'lucide-react';
import AIVoiceReader from './AIVoiceReader';

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  duration?: string;
  voiceText?: string;
}

const resourceCategories = [
  {
    id: 'manuals',
    title: 'User Manuals',
    description: 'Comprehensive guides for each terminal',
    icon: <FileText className="w-6 h-6 text-accent" />,
    items: [
      {
        id: 'broker-guide',
        title: 'Broker Terminal Guide (PDF)',
        description: 'Complete guide to broker operations',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: 'The Broker Terminal Guide provides comprehensive documentation for managing client relationships, creating quotes, and facilitating transactions. This guide covers advanced search techniques, pricing strategies, and client management best practices essential for successful brokerage operations.'
      },
      {
        id: 'operator-guide',
        title: 'Operator Terminal Guide (PDF)',
        description: 'Fleet management and operations manual',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: 'The Operator Terminal Guide details fleet management operations, aircraft scheduling, pilot coordination, and maintenance tracking. This comprehensive manual covers operational procedures, safety protocols, and efficiency optimization strategies for aviation operators.'
      },
      {
        id: 'pilot-guide',
        title: 'Pilot Terminal Guide (PDF)',
        description: 'Job search and profile management',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: 'The Pilot Terminal Guide explains how to manage your professional profile, search for job opportunities, track flight hours, and maintain certifications. This guide covers profile optimization, job application strategies, and career development within the aviation industry.'
      },
      {
        id: 'crew-guide',
        title: 'Crew Terminal Guide (PDF)',
        description: 'Crew assignments and qualifications',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: 'The Crew Terminal Guide provides instructions for managing crew assignments, maintaining qualifications, and coordinating with flight operations. This manual covers assignment tracking, certification management, and professional development opportunities for aviation crew members.'
      }
    ]
  },
  {
    id: 'tutorials',
    title: 'Voice Tutorials',
    description: 'AI-powered audio guides with professional narration',
    icon: <Mic className="w-6 h-6 text-accent" />,
    items: [
      {
        id: 'platform-overview',
        title: 'Platform Overview (5 min)',
        description: 'Complete system walkthrough',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '5 min',
        voiceText: 'Welcome to StratusConnect, the premier aviation marketplace platform. This sophisticated system connects brokers, operators, pilots, and crew members through advanced technology and streamlined processes. Here, industry professionals manage their operations, coordinate flights, and build successful partnerships in the aviation sector. This platform represents the future of aviation commerce.'
      },
      {
        id: 'ai-features',
        title: 'AI Features Demo (8 min)',
        description: 'Explore artificial intelligence capabilities',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '8 min',
        voiceText: 'StratusConnect delivers enterprise-grade capabilities designed for aviation professionals. Our AI-powered search technology understands complex aviation terminology and context, providing precise results for your specific requirements. Real-time tracking systems monitor every flight and transaction with military-grade precision. Secure payment processing ensures all financial transactions are protected with bank-level encryption.'
      },
      {
        id: 'search-tips',
        title: 'Advanced Search Tips (6 min)',
        description: 'Master the search functionality',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '6 min',
        voiceText: 'The AI Search Assistant represents the cutting edge of aviation technology. This intelligent system processes natural language queries and understands complex aviation terminology, aircraft specifications, and operational requirements. Simply describe your needs in plain English, and the AI will analyze your request against our comprehensive database of aircraft, routes, and services.'
      },
      {
        id: 'payment-escrow',
        title: 'Payment & Escrow (4 min)',
        description: 'Secure transaction processing',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '4 min',
        voiceText: 'StratusConnect implements enterprise-grade security protocols for all financial transactions. Our payment processing system supports multiple payment methods including major credit cards, bank transfers, and digital wallets. The escrow system holds funds securely until services are completed and verified, protecting both buyers and sellers throughout the transaction process.'
      }
    ]
  },
  {
    id: 'support',
    title: 'Support',
    description: 'Get help and access resources',
    icon: <HelpCircle className="w-6 h-6 text-accent" />,
    items: [
      {
        id: 'live-chat',
        title: 'Live Chat Support',
        description: 'Real-time assistance from our team',
        icon: <MessageSquare className="w-4 h-4" />,
        action: 'Start Chat',
        voiceText: 'Our live chat support provides immediate assistance from qualified aviation industry professionals. Available 24/7, our support team can help with technical issues, account questions, and platform guidance. All conversations are logged for quality assurance and follow-up support.'
      },
      {
        id: 'knowledge-base',
        title: 'Knowledge Base',
        description: 'Searchable help articles and FAQs',
        icon: <BookOpen className="w-4 h-4" />,
        action: 'Browse',
        voiceText: 'The Knowledge Base contains comprehensive help articles, frequently asked questions, and troubleshooting guides. Search by topic, category, or keywords to find relevant information. All articles are regularly updated to reflect the latest platform features and industry best practices.'
      },
      {
        id: 'api-docs',
        title: 'API Documentation',
        description: 'Developer resources and integration guides',
        icon: <ExternalLink className="w-4 h-4" />,
        action: 'View Docs',
        voiceText: 'Our API Documentation provides comprehensive resources for developers integrating with StratusConnect. Includes detailed endpoint specifications, authentication methods, code examples, and SDK downloads. The API enables custom integrations and third-party applications.'
      },
      {
        id: 'system-status',
        title: 'System Status',
        description: 'Real-time platform health and updates',
        icon: <Settings className="w-4 h-4" />,
        action: 'Check Status',
        voiceText: 'The System Status page provides real-time information about platform performance, scheduled maintenance, and service availability. Subscribe to status updates via email or SMS to stay informed about any service disruptions or planned maintenance windows.'
      }
    ]
  }
];

export default function ResourcesSection() {
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [showVoiceReader, setShowVoiceReader] = useState(false);

  const handleItemClick = (item: ResourceItem) => {
    if (item.voiceText) {
      setSelectedItem(item);
      setShowVoiceReader(true);
    } else {
      // Handle other actions like downloads, external links, etc.
      console.log(`Action: ${item.action} for ${item.title}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Additional Resources</h2>
        <p className="text-xl text-muted-foreground">
          Download guides, listen to tutorials, and access support resources
        </p>
      </div>

      {/* Resource Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {resourceCategories.map((category) => (
          <Card key={category.id} className="terminal-card border-terminal-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                {category.icon}
                <div>
                  <CardTitle className="text-foreground">{category.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-terminal-border hover:border-accent/50 transition-colors cursor-pointer group"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-accent group-hover:text-accent/80">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground group-hover:text-accent">
                        {item.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.duration && (
                      <Badge variant="outline" className="text-xs">
                        {item.duration}
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent/80"
                    >
                      {item.action}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Voice Reader Modal */}
      {showVoiceReader && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-terminal-card border border-terminal-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedItem.title}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVoiceReader(false)}
                >
                  ×
                </Button>
              </div>
              
              <AIVoiceReader
                text={selectedItem.voiceText || ''}
                title={`${selectedItem.title} - Professional Audio Guide`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
        <div className="text-center">
          <div className="text-3xl font-bold text-accent mb-2">4</div>
          <div className="text-sm text-muted-foreground">User Manuals</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent mb-2">4</div>
          <div className="text-sm text-muted-foreground">Voice Tutorials</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent mb-2">24/7</div>
          <div className="text-sm text-muted-foreground">Support Available</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-accent mb-2">100%</div>
          <div className="text-sm text-muted-foreground">Professional Quality</div>
        </div>
      </div>
    </div>
  );
}
