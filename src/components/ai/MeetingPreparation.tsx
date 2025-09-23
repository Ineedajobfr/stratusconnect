import React, { useState, useEffect } from 'react';
import { Users, Calendar, MessageSquare, Briefcase, MapPin, Clock, TrendingUp, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AttendeeProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  location: string;
  specialties: string[];
  recentDeals: {
    id: string;
    type: string;
    value: string;
    date: Date;
    status: 'completed' | 'active' | 'pending';
  }[];
  pastInteractions: {
    date: Date;
    context: string;
    outcome: string;
  }[];
  preferences: {
    communication: string;
    decisionMaking: string;
    priorities: string[];
  };
  riskProfile: 'low' | 'medium' | 'high';
  lastActive: Date;
}

interface MeetingInfo {
  id: string;
  title: string;
  date: Date;
  duration: number;
  attendees: AttendeeProfile[];
  agenda: string[];
  objectives: string[];
}

interface MeetingPreparationProps {
  meetingInfo?: MeetingInfo;
  onClose: () => void;
}

export const MeetingPreparation: React.FC<MeetingPreparationProps> = ({
  meetingInfo,
  onClose
}) => {
  const [attendees, setAttendees] = useState<AttendeeProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<AttendeeProfile | null>(null);

  // Mock data for aviation industry attendees
  const mockAttendees: AttendeeProfile[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'VP of Operations',
      company: 'SkyBridge Aviation',
      email: 'sarah.chen@skybridge.com',
      location: 'New York, NY',
      specialties: ['Fleet Management', 'Route Optimization', 'Cost Control'],
      recentDeals: [
        {
          id: 'deal-1',
          type: 'Charter Agreement',
          value: '$2.5M',
          date: new Date('2024-01-15'),
          status: 'completed'
        },
        {
          id: 'deal-2',
          type: 'Maintenance Contract',
          value: '$850K',
          date: new Date('2024-01-20'),
          status: 'active'
        }
      ],
      pastInteractions: [
        {
          date: new Date('2024-01-10'),
          context: 'Fleet expansion discussion',
          outcome: 'Positive - interested in G650ER acquisition'
        },
        {
          date: new Date('2023-12-15'),
          context: 'Charter pricing negotiation',
          outcome: 'Successful - 15% cost reduction achieved'
        }
      ],
      preferences: {
        communication: 'Direct and data-driven',
        decisionMaking: 'Consensus-based with key stakeholders',
        priorities: ['Cost efficiency', 'Reliability', 'Safety record']
      },
      riskProfile: 'medium',
      lastActive: new Date('2024-01-22')
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      role: 'Chief Pilot',
      company: 'Elite Air Services',
      email: 'm.rodriguez@eliteair.com',
      location: 'Los Angeles, CA',
      specialties: ['Type Ratings', 'Safety Management', 'Crew Training'],
      recentDeals: [
        {
          id: 'deal-3',
          type: 'Crew Assignment',
          value: '$180K',
          date: new Date('2024-01-18'),
          status: 'completed'
        }
      ],
      pastInteractions: [
        {
          date: new Date('2024-01-05'),
          context: 'Crew availability for transatlantic routes',
          outcome: 'Excellent - highly professional crew'
        }
      ],
      preferences: {
        communication: 'Technical and detailed',
        decisionMaking: 'Safety-first approach',
        priorities: ['Safety protocols', 'Crew experience', 'Aircraft maintenance']
      },
      riskProfile: 'low',
      lastActive: new Date('2024-01-21')
    },
    {
      id: '3',
      name: 'David Kim',
      role: 'Broker',
      company: 'Global Aviation Partners',
      email: 'david.kim@gap.com',
      location: 'London, UK',
      specialties: ['Aircraft Sales', 'Market Analysis', 'Client Relations'],
      recentDeals: [
        {
          id: 'deal-4',
          type: 'Aircraft Sale',
          value: '$45M',
          date: new Date('2024-01-12'),
          status: 'completed'
        },
        {
          id: 'deal-5',
          type: 'Charter Brokerage',
          value: '$1.2M',
          date: new Date('2024-01-19'),
          status: 'active'
        }
      ],
      pastInteractions: [
        {
          date: new Date('2024-01-08'),
          context: 'Market trends discussion',
          outcome: 'Very positive - strong market insights'
        }
      ],
      preferences: {
        communication: 'Relationship-focused',
        decisionMaking: 'Client-driven with broker guidance',
        priorities: ['Market timing', 'Client satisfaction', 'Commission structure']
      },
      riskProfile: 'high',
      lastActive: new Date('2024-01-22')
    }
  ];

  useEffect(() => {
    if (meetingInfo) {
      setIsLoading(true);
      // Simulate loading attendee data
      setTimeout(() => {
        setAttendees(meetingInfo.attendees || mockAttendees);
        setIsLoading(false);
      }, 1000);
    } else {
      setAttendees(mockAttendees);
    }
  }, [meetingInfo]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
    }
  };

  const getDealStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'active': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-neutral-500/20 text-neutral-400';
    }
  };

  const generateMeetingBrief = () => {
    const brief = {
      summary: `Meeting with ${attendees.length} aviation professionals from ${attendees.map(a => a.company).join(', ')}`,
      keyTopics: [
        'Fleet expansion opportunities',
        'Transatlantic charter operations',
        'Crew availability and qualifications',
        'Market trends and pricing'
      ],
      recommendations: [
        'Focus on cost efficiency and reliability metrics',
        'Prepare detailed aircraft specifications',
        'Highlight safety protocols and maintenance records',
        'Have backup options ready for crew assignments'
      ],
      actionItems: [
        'Review fleet utilization data',
        'Prepare charter pricing proposals',
        'Verify crew certifications',
        'Schedule follow-up meetings'
      ]
    };
    
    // In a real implementation, this would open a modal or generate a document
    console.log('Meeting Brief:', brief);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="terminal-card border-terminal-border bg-terminal-card/95 backdrop-blur-sm w-full max-w-4xl">
          <CardContent className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
            <span className="ml-3 text-neutral-400">Preparing meeting intelligence...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="terminal-card border-terminal-border bg-terminal-card/95 backdrop-blur-sm w-full max-w-6xl max-h-[90vh]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Meeting Preparation
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-neutral-400 hover:text-white"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Attendees List */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4">Meeting Attendees</h3>
              <div className="space-y-3">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedAttendee?.id === attendee.id
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
                    }`}
                    onClick={() => setSelectedAttendee(attendee)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{attendee.name}</h4>
                        <p className="text-sm text-neutral-400">{attendee.role}</p>
                        <p className="text-sm text-neutral-500">{attendee.company}</p>
                      </div>
                      <Badge variant="outline" className={getRiskColor(attendee.riskProfile)}>
                        {attendee.riskProfile}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <MapPin className="w-3 h-3" />
                        {attendee.location}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <Clock className="w-3 h-3" />
                        Active {attendee.lastActive.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="text-xs text-neutral-500 mb-1">Specialties:</div>
                      <div className="flex flex-wrap gap-1">
                        {attendee.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-neutral-700 text-neutral-300">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={generateMeetingBrief}
                className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Meeting Brief
              </Button>
            </div>

            {/* Attendee Details */}
            <div className="lg:col-span-2">
              {selectedAttendee ? (
                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="p-4 bg-neutral-800 rounded-lg">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-white">{selectedAttendee.name}</h2>
                        <p className="text-neutral-400">{selectedAttendee.role} at {selectedAttendee.company}</p>
                        <p className="text-sm text-neutral-500">{selectedAttendee.email}</p>
                      </div>
                      <Badge variant="outline" className={getRiskColor(selectedAttendee.riskProfile)}>
                        {selectedAttendee.riskProfile} risk
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-neutral-500">Location:</span>
                        <span className="text-white ml-2">{selectedAttendee.location}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Last Active:</span>
                        <span className="text-white ml-2">{selectedAttendee.lastActive.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Deals */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-orange-400" />
                      Recent Deals
                    </h3>
                    <div className="space-y-3">
                      {selectedAttendee.recentDeals.map((deal) => (
                        <div key={deal.id} className="p-3 bg-neutral-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{deal.type}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-orange-400">{deal.value}</span>
                              <Badge variant="outline" className={getDealStatusColor(deal.status)}>
                                {deal.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-neutral-400">
                            {deal.date.toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Interactions */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-orange-400" />
                      Past Interactions
                    </h3>
                    <div className="space-y-3">
                      {selectedAttendee.pastInteractions.map((interaction, index) => (
                        <div key={index} className="p-3 bg-neutral-800 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-white">{interaction.context}</h4>
                            <span className="text-sm text-neutral-400">
                              {interaction.date.toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-300">{interaction.outcome}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-orange-400" />
                      Preferences & Priorities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-neutral-800 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Communication Style</h4>
                        <p className="text-sm text-neutral-300">{selectedAttendee.preferences.communication}</p>
                      </div>
                      <div className="p-3 bg-neutral-800 rounded-lg">
                        <h4 className="font-medium text-white mb-2">Decision Making</h4>
                        <p className="text-sm text-neutral-300">{selectedAttendee.preferences.decisionMaking}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-neutral-800 rounded-lg">
                      <h4 className="font-medium text-white mb-2">Key Priorities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedAttendee.preferences.priorities.map((priority, index) => (
                          <Badge key={index} variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                            {priority}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
                    <p className="text-neutral-400">Select an attendee to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
