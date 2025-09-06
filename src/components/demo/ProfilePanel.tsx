export default function ProfilePanel() {
  return (
    <div className="p-4 border rounded-2xl space-y-1 bg-card">
      <div className="text-lg font-semibold text-card-foreground">Global Jet Partners</div>
      <div className="text-sm text-muted-foreground">Contact Alex Smith</div>
      <div className="text-sm text-muted-foreground">Preferred routes: London, Geneva, Dubai</div>
      <div className="text-sm text-muted-foreground">Commission: 10% standard, 8% repeat</div>
    </div>
  );
}