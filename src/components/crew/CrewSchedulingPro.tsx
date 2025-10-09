import { EnterpriseCard } from '@/components/enterprise/EnterpriseCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type CrewMember } from '@/lib/ai-crew-scheduler';
import { cn } from '@/lib/utils';
import { AlertTriangle, Award, Clock, MapPin, Plane, Sparkles, User, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export const CrewSchedulingPro: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<CrewMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrewData();
  }, [selectedDate]);

  const loadCrewData = async () => {
    setLoading(true);
    
    // Mock crew data - in production, load from Supabase
    const mockCrew: CrewMember[] = [
      {
        id: '1',
        name: 'Capt. John Smith',
        role: 'captain',
        certifications: ['Citation X', 'Gulfstream G450', 'Phenom 300'],
        baseLocation: { lat: 40.7128, lon: -74.0060, airport: 'TEB' },
        lastDutyEnd: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        currentDutyHours: 32,
        maxDutyHours: 100,
        preferences: {},
        performanceRating: 4.8,
        languages: ['English', 'Spanish'],
        status: 'available',
      },
      {
        id: '2',
        name: 'F/O Sarah Johnson',
        role: 'first_officer',
        certifications: ['Citation X', 'Learjet 75'],
        baseLocation: { lat: 40.7128, lon: -74.0060, airport: 'TEB' },
        lastDutyEnd: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
        currentDutyHours: 28,
        maxDutyHours: 100,
        preferences: {},
        performanceRating: 4.9,
        languages: ['English'],
        status: 'available',
      },
      {
        id: '3',
        name: 'Capt. Michael Chen',
        role: 'captain',
        certifications: ['Gulfstream G450', 'Gulfstream G650'],
        baseLocation: { lat: 34.0522, lon: -118.2437, airport: 'VNY' },
        lastDutyEnd: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        currentDutyHours: 48,
        maxDutyHours: 100,
        preferences: {},
        performanceRating: 4.9,
        languages: ['English', 'Mandarin'],
        status: 'on_duty',
      },
      {
        id: '4',
        name: 'Emma Rodriguez',
        role: 'cabin_crew',
        certifications: ['Citation X', 'Phenom 300', 'Learjet 75'],
        baseLocation: { lat: 25.7617, lon: -80.1918, airport: 'OPF' },
        lastDutyEnd: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        currentDutyHours: 18,
        maxDutyHours: 100,
        preferences: {},
        performanceRating: 4.7,
        languages: ['English', 'Spanish', 'Portuguese'],
        status: 'available',
      },
    ];
    
    setCrew(mockCrew);
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      available: { label: 'AVAILABLE', className: 'status-badge-success' },
      on_duty: { label: 'ON DUTY', className: 'status-badge-warning' },
      resting: { label: 'RESTING', className: 'status-badge-info' },
      unavailable: { label: 'UNAVAILABLE', className: 'status-badge-danger' },
    };
    
    return config[status as keyof typeof config] || config.available;
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'captain': return <Plane className="w-4 h-4" />;
      case 'first_officer': return <Zap className="w-4 h-4" />;
      case 'cabin_crew': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getDutyPercentage = (current: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="enterprise-spinner" />
        <span className="ml-3 text-white/60 font-mono">Loading crew schedule...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-enterprise-gold font-mono flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            AI-Powered Crew Scheduling
          </h2>
          <p className="text-white/60 font-mono text-sm mt-1">
            Intelligent crew assignment with FAA/EASA compliance
          </p>
        </div>
        <Button className="bg-enterprise-gold text-black hover:bg-enterprise-gold/80">
          <Sparkles className="w-4 h-4 mr-2" />
          Auto-Assign Crew
        </Button>
      </div>

      {/* Crew Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {crew.map((member) => {
          const dutyPercentage = getDutyPercentage(member.currentDutyHours, member.maxDutyHours);
          const badgeConfig = getStatusBadge(member.status);
          
          return (
            <EnterpriseCard
              key={member.id}
              title={member.name}
              status={member.status === 'available' ? 'live' : member.status === 'on_duty' ? 'pending' : undefined}
              actions={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCrew(member)}
                  className="border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10"
                >
                  View Details
                </Button>
              }
            >
              <div className="space-y-4">
                {/* Role & Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(member.role)}
                    <span className="text-sm font-mono text-white/80 uppercase">
                      {member.role.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge className={cn('status-badge', badgeConfig.className)}>
                    {badgeConfig.label}
                  </Badge>
                </div>

                {/* Performance Rating */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white/60">PERFORMANCE</span>
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-enterprise-gold" />
                      <span className="text-sm font-mono text-enterprise-gold font-semibold">
                        {member.performanceRating.toFixed(1)}/5.0
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'h-2 flex-1 rounded',
                          i < Math.floor(member.performanceRating)
                            ? 'bg-enterprise-gold'
                            : 'bg-white/10'
                        )}
                      />
                    ))}
                  </div>
                </div>

                {/* Duty Hours */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-white/60">DUTY HOURS</span>
                    <span className={cn(
                      'text-sm font-mono font-semibold',
                      dutyPercentage >= 80 ? 'text-enterprise-danger' :
                      dutyPercentage >= 60 ? 'text-enterprise-warning' :
                      'text-enterprise-success'
                    )}>
                      {member.currentDutyHours}/{member.maxDutyHours} ({dutyPercentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        dutyPercentage >= 80 ? 'bg-enterprise-danger' :
                        dutyPercentage >= 60 ? 'bg-enterprise-warning' :
                        'bg-enterprise-success'
                      )}
                      style={{ width: `${dutyPercentage}%` }}
                    />
                  </div>
                  {dutyPercentage >= 80 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-enterprise-danger font-mono">
                      <AlertTriangle className="w-3 h-3" />
                      Approaching duty limit
                    </div>
                  )}
                </div>

                {/* Base Location */}
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-white/60" />
                  <span className="text-xs font-mono text-white/80">
                    Base: {member.baseLocation.airport}
                  </span>
                </div>

                {/* Certifications */}
                <div>
                  <div className="text-xs font-mono text-white/60 mb-2">CERTIFICATIONS</div>
                  <div className="flex flex-wrap gap-1">
                    {member.certifications.slice(0, 3).map((cert) => (
                      <Badge key={cert} className="status-badge status-badge-info text-xs">
                        {cert}
                      </Badge>
                    ))}
                    {member.certifications.length > 3 && (
                      <Badge className="status-badge status-badge-neutral text-xs">
                        +{member.certifications.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <div className="text-xs font-mono text-white/60 mb-2">LANGUAGES</div>
                  <div className="text-sm font-mono text-white/80">
                    {member.languages.join(', ')}
                  </div>
                </div>

                {/* Last Rest */}
                {member.lastDutyEnd && (
                  <div className="flex items-center gap-2 text-xs font-mono text-white/60">
                    <Clock className="w-3 h-3" />
                    Last duty ended {getTimeAgo(member.lastDutyEnd)}
                  </div>
                )}
              </div>
            </EnterpriseCard>
          );
        })}
      </div>

      {/* Crew Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnterpriseCard title="Available Crew" status="live">
          <div className="text-4xl font-bold text-enterprise-success font-mono">
            {crew.filter(c => c.status === 'available').length}
          </div>
          <p className="text-sm text-white/60 mt-2 font-mono">
            Ready for assignment
          </p>
        </EnterpriseCard>

        <EnterpriseCard title="On Duty" status="pending">
          <div className="text-4xl font-bold text-enterprise-warning font-mono">
            {crew.filter(c => c.status === 'on_duty').length}
          </div>
          <p className="text-sm text-white/60 mt-2 font-mono">
            Currently flying
          </p>
        </EnterpriseCard>

        <EnterpriseCard title="Avg Performance" status="live">
          <div className="text-4xl font-bold text-enterprise-gold font-mono">
            {(crew.reduce((sum, c) => sum + c.performanceRating, 0) / crew.length).toFixed(1)}
          </div>
          <p className="text-sm text-white/60 mt-2 font-mono">
            Out of 5.0
          </p>
        </EnterpriseCard>

        <EnterpriseCard title="Compliance" status="live">
          <div className="text-4xl font-bold text-enterprise-success font-mono">
            100%
          </div>
          <p className="text-sm text-white/60 mt-2 font-mono">
            All crew compliant
          </p>
        </EnterpriseCard>
      </div>
    </div>
  );
};

// Helper function
function getTimeAgo(isoDate: string): string {
  const hours = Math.floor((Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60));
  if (hours < 1) return 'less than 1 hour ago';
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

