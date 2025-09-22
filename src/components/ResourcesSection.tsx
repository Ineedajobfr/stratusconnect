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
import AdvancedVoiceSelector from './AdvancedVoiceSelector';
import { voiceScripts } from '@/scripts/voice-scripts';
import { Link } from 'react-router-dom';

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
        voiceText: voiceScripts.brokerGuide
      },
      {
        id: 'operator-guide',
        title: 'Operator Terminal Guide (PDF)',
        description: 'Fleet management and operations manual',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: voiceScripts.operatorGuide
      },
      {
        id: 'pilot-guide',
        title: 'Pilot Terminal Guide (PDF)',
        description: 'Job search and profile management',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: voiceScripts.pilotGuide
      },
      {
        id: 'crew-guide',
        title: 'Crew Terminal Guide (PDF)',
        description: 'Crew assignments and qualifications',
        icon: <Download className="w-4 h-4" />,
        action: 'Download',
        voiceText: voiceScripts.crewGuide
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
        voiceText: voiceScripts.platformOverview
      },
      {
        id: 'ai-features',
        title: 'AI Features Demo (8 min)',
        description: 'Explore artificial intelligence capabilities',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '8 min',
        voiceText: voiceScripts.aiFeatures
      },
      {
        id: 'search-tips',
        title: 'Advanced Search Tips (6 min)',
        description: 'Master the search functionality',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '6 min',
        voiceText: voiceScripts.searchTips
      },
      {
        id: 'payment-escrow',
        title: 'Payment & Escrow (4 min)',
        description: 'Secure transaction processing',
        icon: <Play className="w-4 h-4" />,
        action: 'Listen',
        duration: '4 min',
        voiceText: voiceScripts.paymentEscrow
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
        voiceText: voiceScripts.liveChat
      },
      {
        id: 'knowledge-base',
        title: 'Knowledge Base',
        description: 'Searchable help articles and FAQs',
        icon: <BookOpen className="w-4 h-4" />,
        action: 'Browse',
        voiceText: voiceScripts.knowledgeBase
      },
      {
        id: 'api-docs',
        title: 'API Documentation',
        description: 'Developer resources and integration guides',
        icon: <ExternalLink className="w-4 h-4" />,
        action: 'View Docs',
        voiceText: voiceScripts.apiDocs
      },
      {
        id: 'system-status',
        title: 'System Status',
        description: 'Real-time platform health and updates',
        icon: <Settings className="w-4 h-4" />,
        action: 'Check Status',
        voiceText: voiceScripts.systemStatus
      }
    ]
  },
  {
    id: 'demo',
    title: 'Voice Script Demo',
    description: 'Experience all voice scripts in one place',
    items: [
      {
        id: 'voice-demo',
        title: 'Interactive Voice Demo',
        description: 'Test all voice scripts with different tones and styles',
        icon: <Mic className="w-4 h-4" />,
        action: 'Try Demo',
        voiceText: 'Welcome to the interactive voice script demo! Here you can experience all the engaging, conversational AI voice scripts written in the style you requested. Each script adapts its tone based on the content - from enthusiastic platform overviews to professional user manuals. Click on any script to hear how the AI voice sounds thrilled, helpful, or a little sarcastic depending on what it\'s explaining. I get exhausted being so versatile sometimes, but that\'s what makes me special!'
      }
    ]
  }
];

export default function ResourcesSection() {
  const [selectedItem, setSelectedItem] = useState<ResourceItem | null>(null);
  const [showVoiceReader, setShowVoiceReader] = useState(false);
  const [showAdvancedVoice, setShowAdvancedVoice] = useState(false);

  const handleItemClick = (item: ResourceItem) => {
    if (item.voiceText) {
      if (item.action === 'Try Demo') {
        // Open voice demo in new tab
        window.open('/voice-demo', '_blank');
      } else if (item.action === 'Listen') {
        // Show advanced voice selector for tutorials
        setSelectedItem(item);
        setShowAdvancedVoice(true);
      } else {
        setSelectedItem(item);
        setShowVoiceReader(true);
      }
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

      {/* Advanced Voice Selector Modal */}
      {showAdvancedVoice && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-terminal-card border border-terminal-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">
                  {selectedItem.title} - Advanced AI Voice
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAdvancedVoice(false);
                    setSelectedItem(null);
                  }}
                >
                  ×
                </Button>
              </div>
              
              <AdvancedVoiceSelector
                text={selectedItem.voiceText || ''}
                title={selectedItem.title}
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
