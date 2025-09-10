import MainShell from "@/components/MainShell";
import LuxCard from "@/components/LuxCard";
import { useShortcuts } from "@/hooks/use-shortcuts";
import { useRef } from "react";

export default function Index() {
  const searchRef = useRef<HTMLInputElement>(null);

  useShortcuts({
    "mod+k": () => searchRef.current?.focus(),
  });

  return (
    <MainShell>
      <section className="mx-auto max-w-6xl px-2 py-10">
        <div className="mb-8">
          <h1 className="text-5xl font-semibold tracking-tight">Choose your terminal.</h1>
          <p className="mt-2 max-w-2xl text-white/70">Real time. Verified. Precise.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <LuxCard 
            image="/lovable-uploads/5b72b37d-1cf2-4e5d-9c9d-de6ea6c2d8e7.png"   
            title="Brokers"   
            subtitle="Speed creates advantage. Win more quotes with a cleaner cockpit."       
            href="/terminal/broker"   
            demoHref="/demo/broker" 
          />
          <LuxCard 
            image="/lovable-uploads/87f62aae-d379-4cbe-a080-53fabcef5e60.png" 
            title="Operators" 
            subtitle="Fill the legs. Lift the yield. Control the risk."      
            href="/terminal/operator" 
            demoHref="/demo/operator" 
          />
          <LuxCard 
            image="/lovable-uploads/97709032-3f83-4b71-92d5-970343d1f100.png"    
            title="Pilots"    
            subtitle="Credentials speak. Availability sells. Fly the missions that fit."    
            href="/terminal/pilot"    
            demoHref="/demo/pilot" 
          />
          <LuxCard 
            image="/lovable-uploads/a7806c06-d816-42e6-b3ee-eea61f2134ae.png"      
            title="Cabin Crew" 
            subtitle="Professional service wins repeat work. Your calendar is your shop window."  
            href="/terminal/crew"     
            demoHref="/demo/crew" 
          />
        </div>

        {/* Staff Access - Hidden */}
        <div className="mt-16 text-center">
          <a 
            href="/admin-setup"
            className="text-white/40 hover:text-white/60 text-xs font-mono opacity-30 hover:opacity-60 transition-all duration-300"
          >
            Staff Access
          </a>
        </div>
      </section>
    </MainShell>
  );
}