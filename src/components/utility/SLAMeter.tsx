import React from "react";
import { Clock } from "lucide-react";

export default function SLAMeter({
  label = "First quote time",
  minutes,
}: {
  label?: string;
  minutes: number;
}) {
  const good = minutes <= 10;
  const ok = minutes <= 20;
  const colour = good ? "text-emerald-400" : ok ? "text-amber-300" : "text-rose-300";
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="p-2 rounded-xl bg-white/10">
        <Clock className="w-5 h-5 text-white" />
      </div>
      <div>
        <div className="text-white/60 text-xs">{label}</div>
        <div className={`text-white text-base font-semibold ${colour}`}>{minutes} min</div>
      </div>
    </div>
  );
}
