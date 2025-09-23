function StatusChip({ tone = "brand", children }: { tone?: "brand" | "fire" | "success" | "warn" | "danger", children: React.ReactNode }) {
  const tones: Record<string, string> = {
    brand: "bg-brand/15 text-brand",
    fire: "bg-fire/15 text-fire",
    success: "bg-success/15 text-success",
    warn: "bg-warn/15 text-warn",
    danger: "bg-danger/15 text-danger",
  };
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${tones[tone]}`}>{children}</span>;
}

export default StatusChip;

