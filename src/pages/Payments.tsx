import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, FileText, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Payments() {
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
            How Payments Work
          </h1>
        </div>

        <div className="prose prose-lg mx-auto text-white/90 leading-relaxed mb-12">
          <p className="text-lg">
            All payments on Stratus Connect run through secure escrow. Funds are held until both parties confirm 
            completion of the service. This ensures protection for operators, brokers, pilots, and crew. Every payment 
            generates a digital receipt and an immutable audit log. These records can be downloaded by the user at any 
            time from their account dashboard.
          </p>
          
          <p className="text-lg">
            Stratus Connect never handles cash directly. We integrate only with FCA and globally regulated providers 
            such as Stripe, Wise, or equivalent secure processors. Users are reminded by automated email and 
            in-dashboard notices of every transaction. Audit receipts list the exact time, amount, and user actions 
            tied to the payment.
          </p>
          
          <p className="text-lg">
            This system ensures full compliance with UK financial conduct rules, EU GDPR, US FAA operational standards, 
            and global aviation data protection requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-white/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
              <CardTitle className="text-white">Secure Escrow</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80">
                Funds are protected until both parties confirm service completion
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-white/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <CardHeader className="text-center">
              <FileText className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
              <CardTitle className="text-white">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80">
                Every transaction generates immutable receipts and audit logs
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-white/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
            <CardHeader className="text-center">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-cyan-400" />
              <CardTitle className="text-white">Regulated Processors</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-white/80">
                Payments processed through FCA-regulated providers like Stripe
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}