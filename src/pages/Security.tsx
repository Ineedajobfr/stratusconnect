import { useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Lock, Database, Eye, AlertTriangle, FileCheck, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Security() {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "All data encrypted at rest with military-grade AES-256 encryption"
    },
    {
      icon: Globe,
      title: "TLS 1.3 Transit",
      description: "All transmissions protected with the latest TLS 1.3 protocol"
    },
    {
      icon: Database,
      title: "Role-Based Access",
      description: "Row-level database security with role-based access controls"
    },
    {
      icon: FileCheck,
      title: "Immutable Audit Logs",
      description: "Complete audit trail of all user actions and transactions"
    },
    {
      icon: Shield,
      title: "Regulated Escrow",
      description: "FCA-regulated payment processors with secure escrow system"
    },
    {
      icon: AlertTriangle,
      title: "Document Expiry",
      description: "Automatic detection and deletion of expired documents"
    },
    {
      icon: Zap,
      title: "Token Rotation",
      description: "Dynamic security tokens prevent static vulnerabilities"
    },
    {
      icon: Eye,
      title: "Activity Monitoring",
      description: "24/7 monitoring with alerts for suspicious activity"
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarfieldRunwayBackground intensity={0.7} starCount={260} />
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
        <NavigationArrows />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
            Security
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Stratus Connect was built with security as its first principle. We protect every action, 
            every payment, and every document.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-white/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <CardHeader className="text-center pb-2">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                  <CardTitle className="text-sm font-semibold text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-center text-white/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="prose prose-lg mx-auto text-white/90 leading-relaxed">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Additional Security Measures</h2>
            <ul className="space-y-3 text-white/80">
              <li>• DDoS and firewall protection with real-time threat detection</li>
              <li>• Monthly sanctions and PEP screening for all users</li>
              <li>• Independent security audits scheduled annually</li>
              <li>• Multi-factor authentication available for all accounts</li>
              <li>• Automated vulnerability scanning and patching</li>
              <li>• Secure API endpoints with rate limiting</li>
              <li>• Regular penetration testing by certified security firms</li>
            </ul>
          </div>

          <div className="text-center bg-slate-800/20 backdrop-blur-sm rounded-lg p-8">
            <p className="text-xl font-semibold text-white">
              We built Stratus Connect like a control tower.
            </p>
            <p className="text-lg text-white/80 mt-2">
              Nothing moves without clearance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}