import { useState } from "react";
import { Menu, Bell, Search, LogOut } from "lucide-react";

export default function AppShell({
  nav,
  children,
}: {
  nav: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="relative min-h-screen w-full" style={{ background: "var(--bg)" }}>
      <div aria-hidden className="pointer-events-none absolute inset-0"
        style={{
          background: `
            radial-gradient(60% 60% at 15% 20%, rgba(11,107,255,0.28) 0%, rgba(0,0,0,0) 60%),
            radial-gradient(55% 55% at 85% 75%, rgba(255,122,26,0.18) 0%, rgba(0,0,0,0) 60%)
          `
        }}
      />
      <div aria-hidden className="absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }}
      />

      <div className="relative z-10 flex">
        <aside className={`h-screen shrink-0 bg-surface-2/90 ring-1 ring-white/5 backdrop-blur ${open ? "w-64" : "w-16"} transition-[width]`}>
          <div className="flex h-14 items-center gap-2 px-3">
            <button onClick={() => setOpen(v => !v)} className="rounded-md p-2 hover:bg-white/5">
              <Menu size={18} className="text-text" />
            </button>
            {open && <span className="text-text text-sm font-semibold">Stratus Terminal</span>}
          </div>
          <nav className="mt-2 space-y-1 px-2">{nav}</nav>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-surface-2/80 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-text/50" />
                <input
                  placeholder="Search requests, deals, operators"
                  className="w-full rounded-lg bg-white/5 pl-9 pr-3 py-2 text-sm text-text placeholder:text-text/50 ring-1 ring-white/10 focus:outline-none focus:ring-white/20"
                />
              </div>
              <button className="rounded-md p-2 hover:bg-white/5"><Bell className="h-5 w-5 text-text" /></button>
              <button className="rounded-md bg-white/5 px-3 py-2 text-sm text-text/90 hover:bg-white/10">Account</button>
              <button className="rounded-md p-2 hover:bg-white/5"><LogOut className="h-5 w-5 text-text/80" /></button>
            </div>
          </header>

          <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
        </div>

        <aside className="hidden xl:block w-80 border-l border-white/5 bg-surface-2/70 backdrop-blur">
          <div className="p-4">
            <h4 className="text-text/80 text-sm font-medium">Live feed</h4>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg bg-surface-1 p-3 ring-1 ring-white/5 text-text/80 text-sm">
                System ready
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
