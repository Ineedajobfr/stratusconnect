import { useEffect } from "react";

export function useShortcuts(map: Record<string, () => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = [];
      if (e.ctrlKey || e.metaKey) k.push("mod");
      if (e.shiftKey) k.push("shift");
      k.push(e.key.toLowerCase());
      const key = k.join("+");
      const fn = map[key];
      if (fn) { e.preventDefault(); fn(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [map]);
}
