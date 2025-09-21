import { useEffect, useState } from "react";
import { fetchMarketplace } from "@/lib/broker-api";
import type { Listing } from "@/lib/broker-types";
import { getErrorMessage } from "@/utils/errorHandler";
import { toast } from "@/components/ui/use-toast";

export default function MarketplacePanel() {
  const [rows, setRows] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for demo
    const mockData: Listing[] = [
      {
        id: "1",
        origin: "LTN",
        destination: "NCE",
        departure_at: "2025-09-12T09:30:00Z",
        price_gbp: 48000,
        is_empty_leg: false,
        aircraft: {
          id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
          type: "Gulfstream G650",
          tail: "G-GLUX",
          base: "LTN",
          operator: { id: "op1", name: "SkyLux Aviation", verified: true }
        }
      },
      {
        id: "2",
        origin: "FAB",
        destination: "GVA",
        departure_at: "2025-09-13T07:00:00Z",
        price_gbp: 14500,
        is_empty_leg: false,
        aircraft: {
          id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
          type: "Citation XLS",
          tail: "G-CXLS",
          base: "FAB",
          operator: { id: "op1", name: "SkyLux Aviation", verified: true }
        }
      },
      {
        id: "3",
        origin: "CDG",
        destination: "DXB",
        departure_at: "2025-09-15T10:00:00Z",
        price_gbp: 72000,
        is_empty_leg: true,
        aircraft: {
          id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
          type: "Falcon 7X",
          tail: "HB-JOE",
          base: "GVA",
          operator: { id: "op2", name: "JetOne Europe", verified: true }
        }
      }
    ];

    setRows(mockData);
    setLoading(false);

    // Try to fetch real data but fallback to mock
    fetchMarketplace()
      .then((data) => {
        if (data && data.length > 0) {
          setRows(data);
        }
      })
      .catch((error) => {
        console.log("Using mock data:", error);
        toast({
          title: "Using Demo Data",
          description: "Could not fetch live marketplace data, showing demo listings",
          variant: "default"
        });
      });
  }, []);

  if (loading) return <div className="p-4">Loading marketplace...</div>;

  return (
    <div className="space-y-2">
      {rows.map(r => (
        <div key={r.id} className="p-4 rounded-2xl shadow-md border bg-card">
          <div className="text-lg font-semibold text-card-foreground">{r.aircraft.type} {r.aircraft.tail}</div>
          <div className="text-sm text-muted-foreground">{r.origin} to {r.destination} at {new Date(r.departure_at).toLocaleString()}</div>
          <div className="text-sm font-medium">Price £{r.price_gbp.toLocaleString()} {r.is_empty_leg ? "(empty leg)" : ""}</div>
          <div className="text-sm text-muted-foreground">Operator {r.aircraft.operator.name} {r.aircraft.operator.verified ? "✓" : ""}</div>
        </div>
      ))}
    </div>
  );
}