export default function SavedJetsPanel() {
  const jets = [
    { type: "Gulfstream G650", operator: "SkyLux Aviation" },
    { type: "Falcon 7X", operator: "JetOne Europe" },
    { type: "Citation XLS", operator: "EuroAir Charter" }
  ];
  
  return (
    <div className="space-y-2">
      {jets.map((j, i) => (
        <div key={i} className="p-3 border rounded-2xl bg-card">
          <div className="font-semibold text-card-foreground">{j.type}</div>
          <div className="text-sm text-muted-foreground">{j.operator}</div>
        </div>
      ))}
    </div>
  );
}
