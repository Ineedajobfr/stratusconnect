import React from 'react';
import { DemoBanner } from '@/components/DemoBanner';
import { CrewFlightDeck } from '@/components/demo/CrewFlightDeck';
import StarfieldRunwayBackground from '@/components/StarfieldRunwayBackground';

export default function DemoCrewTerminal() {
  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      <div className="relative z-10">
        <DemoBanner />
        <CrewFlightDeck />
      </div>
    </div>
  );
}