export type Listing = {
  id: string;
  origin: string;
  destination: string;
  departure_at: string;
  price_gbp: number;
  is_empty_leg: boolean;
  aircraft: {
    id: string;
    type: string;
    tail: string;
    base: string | null;
    operator: { 
      id: string; 
      name: string; 
      verified: boolean | null 
    };
  };
};

export type RequestItem = {
  id: string;
  client_name: string;
  origin: string;
  destination: string;
  departure_at: string;
  status: string;
};

export type Quote = {
  id: string;
  request_id: string;
  amount_gbp: number;
  valid_until: string;
  status: string;
  notes?: string | null;
};

export type Alert = {
  id: string;
  title: string;
  body?: string | null;
  severity: "info" | "success" | "warning" | "critical";
  created_at: string;
  seen: boolean;
};