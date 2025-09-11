import MainShell from "@/components/MainShell";

export default function TerminalTemplate({
  left, main, right, bottom,
}: { left: React.ReactNode; main: React.ReactNode; right: React.ReactNode; bottom: React.ReactNode }) {
  return (
    <MainShell>
      <div className="grid grid-cols-12 gap-3">
        <section className="col-span-12 md:col-span-3 rounded-lg border border-line bg-glass p-3">{left}</section>
        <section className="col-span-12 md:col-span-6 rounded-lg border border-line bg-glass p-3">{main}</section>
        <section className="col-span-12 md:col-span-3 rounded-lg border border-line bg-glass p-3">{right}</section>
      </div>
      <section className="mt-3 rounded-lg border border-line bg-glass p-3">{bottom}</section>
    </MainShell>
  );
}
