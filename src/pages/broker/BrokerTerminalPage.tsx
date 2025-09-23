export default function BrokerTerminalPage() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {["Active requests","Quotes sent","Win rate","Avg response"].map((label, i) => (
        <div key={i} className="rounded-xl bg-surface-1 p-4 ring-1 ring-white/5 shadow-card">
          <div className="text-text/70 text-xs">{label}</div>
          <div className="mt-2 text-2xl font-semibold text-text">{["128","342","31%","18m"][i]}</div>
        </div>
      ))}
      <div className="md:col-span-2 rounded-xl bg-surface-1 p-4 ring-1 ring-white/5 shadow-card">
        <div className="text-text/80 text-sm">Requests over time</div>
        <div className="mt-3 h-40 rounded-lg bg-white/5" />
      </div>
      <div className="md:col-span-2 rounded-xl bg-surface-1 p-4 ring-1 ring-white/5 shadow-card">
        <div className="text-text/80 text-sm">Latest requests</div>
        <div className="mt-3 h-40 rounded-lg bg-white/5" />
      </div>
    </div>
  );
}
