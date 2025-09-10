import Starfield from "@/components/Starfield";
import { ReactNode, useEffect, useState } from "react";

export default function MainShell({ header, children, footer }: {
  header?: ReactNode; children: ReactNode; footer?: ReactNode;
}) {
  const [utc, setUtc] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setUtc(d.toUTCString().slice(17, 25));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      <Starfield />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-40 bg-black/30 backdrop-blur-sm" />
      <header className="sticky top-0 z-20 border-b border-line bg-black/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
          <div className="text-sm font-semibold tracking-tight">Stratus Connect</div>
          <input
            id="global-search"
            placeholder="Search or run a command"
            className="ml-4 w-full rounded-md border border-line bg-white/5 px-3 py-1.5 text-sm outline-none focus:border-cyan-400/40"
          />
          <div className="text-xs text-textDim tabular">UTC {utc}</div>
          {header}
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-4">{children}</main>

      <footer className="sticky bottom-0 z-10 border-t border-line bg-black/60 px-4 py-1.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-xs text-textDim">
          <div>API healthy</div>
          <div>Notifications 0</div>
          {footer}
        </div>
      </footer>
    </div>
  );
}
