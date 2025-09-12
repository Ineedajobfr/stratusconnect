import { useEffect, useState } from "react";
import type { Alert } from "@/lib/broker-types";

export default function AlertsPanel() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    setAlerts([
      { 
        id: "a1", 
        title: "New request: GVA to RUH", 
        body: "VIP client inquiry", 
        severity: "info", 
        created_at: new Date().toISOString(), 
        seen: false 
      },
      { 
        id: "a2", 
        title: "Commission paid", 
        body: "£1,380 received for Ibiza charter", 
        severity: "success", 
        created_at: new Date().toISOString(), 
        seen: false 
      }
    ]);
  }, []);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'success': return 'border-success bg-surface';
      case 'warning': return 'border-warning bg-surface';
      case 'critical': return 'border-danger bg-surface';
      default: return 'border-info bg-surface';
    }
  };

  return (
    <div className="space-y-2">
      {alerts.map(a => (
        <div key={a.id} className={`p-3 rounded-2xl border ${getSeverityColor(a.severity)}`}>
          <div className="font-semibold text-body">{a.title}</div>
          <div className="text-sm text-muted">{a.body}</div>
        </div>
      ))}
    </div>
  );
}