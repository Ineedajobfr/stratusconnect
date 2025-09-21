import React from "react";
import { UnifiedLayout } from "@/components/layout/UnifiedLayout";
import { ConnectionsPage } from "@/components/network/ConnectionsPage";

export default function NetworkPage() {
  return (
    <UnifiedLayout title="My Network">
      <ConnectionsPage />
    </UnifiedLayout>
  );
}
