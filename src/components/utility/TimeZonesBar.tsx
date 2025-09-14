import React, { useEffect, useMemo, useState } from "react";
import { Globe2, Plus, X, Clock } from "lucide-react";
import { useLocalStorage } from "./useLocalStorage";

type Zone = { id: string; tz: string; label: string };

const COMMON_ZONES: Zone[] = [
  { id: "utc", tz: "UTC", label: "UTC" },
  { id: "lon", tz: "Europe/London", label: "London" },
  { id: "nyc", tz: "America/New_York", label: "New York" },
  { id: "dub", tz: "Asia/Dubai", label: "Dubai" },
  { id: "sin", tz: "Asia/Singapore", label: "Singapore" },
  { id: "syd", tz: "Australia/Sydney", label: "Sydney" },
  { id: "la", tz: "America/Los_Angeles", label: "Los Angeles" },
  { id: "jnb", tz: "Africa/Johannesburg", label: "Johannesburg" },
];

const DEFAULTS = ["utc", "lon", "nyc", "dub", "sin", "syd"];

function nowIn(tz: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  const parts = fmt.formatToParts(new Date());
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? "";
  const time = `${get("hour")}:${get("minute")}`;
  const date = `${get("weekday")} ${get("day")} ${get("month")}`;
  return { time, date };
}

export default function TimeZonesBar({
  sticky = true,
}: {
  sticky?: boolean;
}) {
  const [favIds, setFavIds] = useLocalStorage<string[]>(
    "sc_tz_favourites",
    DEFAULTS
  );
  const [open, setOpen] = useState(false);
  const zones = useMemo(
    () => favIds.map(id => COMMON_ZONES.find(z => z.id === id)).filter(Boolean) as Zone[],
    [favIds]
  );

  const [, force] = useState(0);
  useEffect(() => {
    const t = setInterval(() => force(x => x + 1), 1000 * 30); // tick every 30s
    return () => clearInterval(t);
  }, []);

  function addZone(id: string) {
    if (!favIds.includes(id)) setFavIds([...favIds, id]);
  }
  function removeZone(id: string) {
    setFavIds(favIds.filter(x => x !== id));
  }

  return (
    <div
      className={`w-full ${sticky ? "sticky top-0 z-40" : ""} bg-[#0A0F1F]/95 backdrop-blur border-b border-white/10`}
      aria-label="Global time zones"
    >
      <div className="px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 text-white/70 mr-1">
          <Globe2 className="w-4 h-4" aria-hidden />
          <span className="text-xs">Time zones</span>
        </div>

        {zones.map(z => {
          const t = nowIn(z.tz);
          return (
            <div
              key={z.id}
              className="flex items-center gap-2 rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-1.5"
              role="group"
              aria-label={`${z.label} time`}
            >
              <Clock className="w-3.5 h-3.5 text-white/70" aria-hidden />
              <div className="leading-tight">
                <div className="text-[11px] text-white/60">{z.label}</div>
                <div className="text-sm text-white font-semibold tabular-nums">{t.time}</div>
              </div>
              <div className="text-[11px] text-white/50 ml-1">{t.date}</div>
              <button
                className="ml-1 p-1 rounded hover:bg-white/10 text-white/60"
                onClick={() => removeZone(z.id)}
                aria-label={`Remove ${z.label}`}
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        <div className="relative">
          <button
            className="ml-1 flex items-center gap-1 rounded-xl bg-white/10 px-2 py-1.5 text-white/80 text-xs ring-1 ring-white/15"
            onClick={() => setOpen(s => !s)}
            aria-expanded={open}
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-[#0A0F1F] ring-1 ring-white/10 shadow-xl p-2 z-50">
              <div className="text-white/60 text-xs px-2 pb-1">Add a city</div>
              <ul>
                {COMMON_ZONES.map(z => (
                  <li key={z.id}>
                    <button
                      onClick={() => {
                        addZone(z.id);
                        setOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-white/90 hover:bg-white/10 text-sm"
                      disabled={favIds.includes(z.id)}
                    >
                      {z.label} <span className="text-white/50 text-xs ml-1">{z.tz}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
