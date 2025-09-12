import React from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { DemoPilotDashboard } from '@/components/demo/DemoPilotDashboard';

export default function DemoPilotTerminal() {
  return (
    <div className="min-h-screen bg-terminal-bg">
      <DemoBanner />
      <DemoPilotDashboard />
    </div>
  );
}