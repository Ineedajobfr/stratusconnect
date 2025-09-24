import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarfieldRunwayBackground intensity={0.7} starCount={260} />
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
        <NavigationArrows />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
            About Stratus Connect
          </h1>
        </div>

        <div className="prose prose-lg mx-auto text-white/90 leading-relaxed">
          <p className="text-xl">
            Stratus Connect is the professional aviation terminal for brokers, operators, pilots, and crew. 
            It is built to cut through distraction and bring clarity to aviation. The platform allows operators 
            to list aircraft, brokers to request flights, pilots and crew to be hired directly, and every deal 
            to be verified and secure.
          </p>
          
          <p className="text-xl">
            Payments run through escrow, receipts and audit logs are generated automatically, and every user 
            is verified by ID and role. Aviation works on discipline and order. Stratus Connect applies that 
            same standard to digital operations.
          </p>
          
          <p className="text-xl font-semibold text-center mt-12">
            Precise. Secure. Built for results.
          </p>
        </div>
      </div>
    </div>
  );
}