import { supabase } from "@/integrations/supabase/client";

export async function fetchMarketplace() {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token || "";
    
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://pvgqfqkrtflpvajhddhr.supabase.co'}/functions/v1/get-marketplace`, { 
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch marketplace");
    }
    
    const result = await res.json();
    return result.listings || [];
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    return [];
  }
}

export async function fetchRequests(brokerId: string) {
  // Mock data for demo
  return [
    {
      id: 'cccccccc-cccc-cccc-cccc-ccccccccccc1',
      client_name: 'Private Family',
      origin: 'LTN',
      destination: 'IBZ',
      departure_at: '2025-09-12T12:00:00Z',
      status: 'awaiting_quotes'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-ccccccccccc2',
      client_name: 'Hedge Fund',
      origin: 'FAB',
      destination: 'JFK',
      departure_at: '2025-09-14T08:00:00Z',
      status: 'operator_responded'
    },
    {
      id: 'cccccccc-cccc-cccc-cccc-ccccccccccc3',
      client_name: 'Royal Delegation',
      origin: 'GVA',
      destination: 'RUH',
      departure_at: '2025-09-16T05:30:00Z',
      status: 'pending_approval'
    }
  ];
}

export async function fetchQuotes(requestId: string) {
  // Mock data for demo
  return [
    {
      id: 'quote1',
      request_id: requestId,
      amount_gbp: 13800,
      valid_until: '2025-09-10T23:59:00Z',
      status: 'sent',
      notes: 'Includes light catering'
    }
  ];
}

export async function createQuote(payload: {
  request_id: string; 
  operator_id: string; 
  aircraft_id: string; 
  amount_gbp: number; 
  valid_until: string; 
  notes?: string;
}) {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token || "";
    
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://pvgqfqkrtflpvajhddhr.supabase.co'}/functions/v1/create-quote`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      throw new Error("Failed to create quote");
    }
    
    const result = await res.json();
    return result.quote;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
}

export async function sendMessage(payload: { 
  thread_type: "operator" | "client"; 
  thread_ref: string; 
  text: string; 
  sender_profile_id: string; 
}) {
  try {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token || "";
    
    const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL || 'https://pvgqfqkrtflpvajhddhr.supabase.co'}/functions/v1/send-message`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });
    
    if (!res.ok) {
      throw new Error("Failed to send message");
    }
    
    const result = await res.json();
    return result.message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}