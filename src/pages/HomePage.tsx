import React from "react";
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { PersonalizedFeed } from "@/components/feed/PersonalizedFeed";

export default function HomePage() {
  return (
    <UnifiedLayout title="Dashboard">
      <PersonalizedFeed />
    </UnifiedLayout>
  );
}
