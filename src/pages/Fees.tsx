import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Fees() {
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
            Fees
          </h1>
          <p className="text-xl text-white/90">
            Stratus Connect charges a seven percent platform fee on completed transactions between brokers and operators. 
            Pilots and crew are not charged. There are no hidden costs, no subscriptions, no advertising, and no sale of data. 
            If no deal closes, you pay nothing.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-2 border-white/20 bg-slate-800/50 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">7%</CardTitle>
              <p className="text-white/80">Platform Fee</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold mb-2 text-white">Brokers and Operators</p>
              <p className="text-sm text-white/80">
                Only charged on completed transactions
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-white/20 bg-slate-800/50 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">10%</CardTitle>
              <p className="text-white/80">Hiring Fee</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold mb-2 text-white">Operators Only</p>
              <p className="text-sm text-white/80">
                On hiring of staff, crew, and pilots
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-white/20 bg-slate-800/50 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-green-600">0%</CardTitle>
              <p className="text-white/80">No Fee</p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="font-semibold mb-2 text-white">Pilots and Crew</p>
              <p className="text-sm text-white/80">
                Complete access at no cost
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/terms')}
            variant="outline"
            className="hover:bg-cyan-400 hover:text-slate-900 border-white/30 text-white"
          >
            See full Terms and Conditions
          </Button>
        </div>
      </div>
    </div>
  );
}