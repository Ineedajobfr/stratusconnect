import { useEffect, useState } from "react";
import { sendMessage } from "@/lib/broker-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { 
  id: string; 
  thread_type: "operator"|"client"; 
  text: string; 
  created_at: string; 
};

export default function MessagingPanel() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // Initialize with some demo messages
    setMsgs([
      { 
        id: "1", 
        thread_type: "operator", 
        text: "We can confirm crew availability for the 12th", 
        created_at: new Date().toISOString() 
      },
      { 
        id: "2", 
        thread_type: "client", 
        text: "Please confirm catering in New York", 
        created_at: new Date().toISOString() 
      }
    ]);
  }, []);

  async function send() {
    if (!text.trim()) return;

    const newMsg: Msg = {
      id: `msg-${Date.now()}`,
      thread_type: "operator",
      text,
      created_at: new Date().toISOString()
    };

    setMsgs(prev => [...prev, newMsg]);
    setText("");

    // Try to send real message but don't block on failure
    try {
      await sendMessage({
        thread_type: "operator",
        thread_ref: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
        text: newMsg.text,
        sender_profile_id: "11111111-1111-1111-1111-111111111111"
      });
    } catch (error) {
      console.log("Could not save message to database:", error);
    }
  }

  return (
    <div className="p-4 border rounded-2xl bg-card">
      <div className="space-y-2 max-h-64 overflow-auto">
        {msgs.map(m => (
          <div key={m.id} className="text-sm">
            <span className="font-semibold text-card-foreground">
              {m.thread_type === "operator" ? "Operator" : "Client"}:
            </span>{" "}
            <span className="text-muted-foreground">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input 
          className="flex-1" 
          value={text} 
          onChange={e => setText(e.target.value)} 
          placeholder="Type a message"
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <Button onClick={send} disabled={!text.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}