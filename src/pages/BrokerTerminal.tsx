import TerminalTemplate from "@/components/TerminalTemplate";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { useRef } from "react";

export default function BrokerTerminal() {
  const searchRef = useRef<HTMLInputElement>(null);

  useShortcuts({
    "mod+k": () => searchRef.current?.focus(),
    "mod+f": () => {/* open filters */},
  });

  return (
    <TerminalTemplate
      left={
        <div className="space-y-4">
          <div className="text-sm font-semibold">Filters & Search</div>
          <div className="space-y-2">
            <div className="text-xs text-textDim">Quote Requests Today</div>
            <div className="text-2xl font-mono tabular">47</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-textDim">Response Median</div>
            <div className="text-2xl font-mono tabular">2.3m</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-textDim">Risk Alerts</div>
            <div className="text-2xl font-mono tabular text-red-400">3</div>
          </div>
        </div>
      }
      main={
        <div className="space-y-4">
          <div className="text-sm font-semibold">Live RFQs & Quotes</div>
          <div className="overflow-auto rounded-md border border-line">
            <table className="min-w-full border-separate border-spacing-0 text-sm">
              <thead className="bg-white/5 text-white/80">
                <tr>
                  <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Route</th>
                  <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Aircraft</th>
                  <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Quote</th>
                  <th className="sticky top-0 z-10 border-b border-line px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="px-3 py-2 font-mono text-xs">JFK → LAX</td>
                  <td className="px-3 py-2 text-xs">G650</td>
                  <td className="px-3 py-2 font-mono text-xs tabular">$45,000</td>
                  <td className="px-3 py-2 text-xs text-green-400">Active</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-xs">LHR → CDG</td>
                  <td className="px-3 py-2 text-xs">A320</td>
                  <td className="px-3 py-2 font-mono text-xs tabular">$12,500</td>
                  <td className="px-3 py-2 text-xs text-yellow-400">Pending</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono text-xs">SFO → NRT</td>
                  <td className="px-3 py-2 text-xs">B777</td>
                  <td className="px-3 py-2 font-mono text-xs tabular">$78,000</td>
                  <td className="px-3 py-2 text-xs text-green-400">Active</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      }
      right={
        <div className="space-y-4">
          <div className="text-sm font-semibold">Risk & Alerts</div>
          <div className="space-y-2">
            <div className="text-xs text-textDim">Market Risk</div>
            <div className="text-lg font-mono tabular text-green-400">Low</div>
          </div>
          <div className="space-y-2">
            <div className="text-xs text-textDim">Messages</div>
            <div className="text-lg font-mono tabular">12</div>
          </div>
        </div>
      }
      bottom={
        <div className="space-y-2">
          <div className="text-sm font-semibold">Market Tape</div>
          <div className="font-mono text-xs text-textDim">
            JFK-LAX: $45K ↑ | LHR-CDG: $12.5K → | SFO-NRT: $78K ↑ | Empty legs: 23 available
          </div>
        </div>
      }
    />
  );
}