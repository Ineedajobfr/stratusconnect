import { useEffect, useState } from "react";

export default function AnalyticsPanel() {
  const [kpis] = useState({ 
    deals: 12, 
    revenue: 540000, 
    art: "1h 22m", 
    top: "Citation XLS", 
    trend: "+14% DXB demand" 
  });

  useEffect(() => {
    // Could fetch from performance_metrics and market_trends in the future
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="p-4 border rounded-2xl bg-card">
        <div className="text-sm text-muted-foreground">Deals</div>
        <div className="text-2xl font-bold text-card-foreground">{kpis.deals}</div>
      </div>
      <div className="p-4 border rounded-2xl bg-card">
        <div className="text-sm text-muted-foreground">Revenue</div>
        <div className="text-2xl font-bold text-card-foreground">£{kpis.revenue.toLocaleString()}</div>
      </div>
      <div className="p-4 border rounded-2xl bg-card">
        <div className="text-sm text-muted-foreground">Avg response time</div>
        <div className="text-2xl font-bold text-card-foreground">{kpis.art}</div>
      </div>
      <div className="p-4 border rounded-2xl bg-card">
        <div className="text-sm text-muted-foreground">Top requested aircraft</div>
        <div className="text-2xl font-bold text-card-foreground">{kpis.top}</div>
      </div>
      <div className="col-span-2 p-4 border rounded-2xl bg-card">
        <div className="text-sm text-muted-foreground">Market trend</div>
        <div className="text-xl text-card-foreground">Demand {kpis.trend}</div>
      </div>
    </div>
  );
}