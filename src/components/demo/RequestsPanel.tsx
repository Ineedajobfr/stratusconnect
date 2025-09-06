import { useEffect, useState } from "react";
import { fetchRequests, fetchQuotes, createQuote } from "@/lib/broker-api";
import type { RequestItem, Quote } from "@/lib/broker-types";
import { Button } from "@/components/ui/button";

const DEMO_BROKER = "11111111-1111-1111-1111-111111111111";
const DEMO_OPERATOR = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1";
const DEMO_AIRCRAFT = "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3";

export default function RequestsPanel() {
  const [reqs, setReqs] = useState<RequestItem[]>([]);
  const [quotesByReq, setQuotesByReq] = useState<Record<string, Quote[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const requests = await fetchRequests(DEMO_BROKER);
        setReqs(requests);
        
        const all: Record<string, Quote[]> = {};
        for (const req of requests) {
          all[req.id] = await fetchQuotes(req.id);
        }
        setQuotesByReq(all);
      } catch (error) {
        console.error("Error loading requests:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  async function quickQuote(request_id: string) {
    try {
      const mockQuote = {
        id: `quote-${Date.now()}`,
        request_id,
        amount_gbp: Math.floor(12000 + Math.random() * 5000),
        valid_until: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        status: "sent" as const,
        notes: "Demo quick quote"
      };

      setQuotesByReq(prev => ({ 
        ...prev, 
        [request_id]: [...(prev[request_id] || []), mockQuote] 
      }));

      // Try to create real quote but don't block on failure
      createQuote({
        request_id,
        operator_id: DEMO_OPERATOR,
        aircraft_id: DEMO_AIRCRAFT,
        amount_gbp: mockQuote.amount_gbp,
        valid_until: mockQuote.valid_until,
        notes: mockQuote.notes
      }).catch((error) => {
        console.log("Could not save quote to database:", error);
      });
    } catch (error) {
      console.error("Error creating quote:", error);
    }
  }

  if (loading) return <div className="p-4">Loading requests...</div>;

  return (
    <div className="space-y-3">
      {reqs.map(r => (
        <div key={r.id} className="p-4 rounded-2xl border shadow-sm bg-card">
          <div className="font-semibold text-card-foreground">{r.client_name}</div>
          <div className="text-sm text-muted-foreground">{r.origin} to {r.destination} on {new Date(r.departure_at).toLocaleString()}</div>
          <div className="text-sm">Status: <span className="capitalize">{r.status.replace('_', ' ')}</span></div>
          <Button 
            variant="outline" 
            size="sm"
            className="mt-2" 
            onClick={() => quickQuote(r.id)}
          >
            Send quick quote
          </Button>
          <div className="mt-3 space-y-1">
            {(quotesByReq[r.id] || []).map(q => (
              <div key={q.id} className="text-sm text-muted-foreground">
                Quote £{q.amount_gbp.toLocaleString()} valid until {new Date(q.valid_until).toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}