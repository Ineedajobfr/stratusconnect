import React from 'react';
import { UserProfile } from '@/components/UserProfile';
import { DemoBanner } from '@/components/DemoBanner';

export default function PublicProfile() {
  return (
    <div className="min-h-screen bg-slate-900">
      <DemoBanner />
      <div className="fixed top-20 right-6 z-40">
      </div>
      <div className="pt-12">
        <UserProfile />
      </div>
    </div>
  );
}
