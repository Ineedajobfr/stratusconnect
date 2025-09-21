import React from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { DemoPilotDashboard } from '@/components/demo/DemoPilotDashboard';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';

export default function DemoPilotTerminal() {
  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      <div className="relative z-10">
        <DemoBanner />
        <DemoPilotDashboard />
      </div>
    </div>
  );
}