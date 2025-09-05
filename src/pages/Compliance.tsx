import { useNavigate } from "react-router-dom";
import { ArrowLeft, FileCheck, Shield, Globe, AlertTriangle, Users, Lock, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Compliance() {
  const navigate = useNavigate();

  const complianceStandards = [
    {
      icon: Globe,
      title: "EASA Compliance",
      description: "European Aviation Safety Agency operational standards and data requirements"
    },
    {
      icon: FileCheck,
      title: "FAA Regulations", 
      description: "US Federal Aviation Administration compliance for international operations"
    },
    {
      icon: Shield,
      title: "UK CAA Standards",
      description: "Civil Aviation Authority requirements for UK-based operations"
    },
    {
      icon: Lock,
      title: "GDPR / UK DPA 2018",
      description: "Full data protection compliance for European and UK users"
    },
    {
      icon: Database,
      title: "ISO 27001",
      description: "Information security management system certification"
    },
    {
      icon: Users,
      title: "AML/KYC Standards",
      description: "Anti-money laundering and know your customer compliance"
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
            Compliance
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Stratus Connect operates under the strictest aviation and financial compliance standards globally.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {complianceStandards.map((standard, index) => {
            const Icon = standard.icon;
            return (
              <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-white/20 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                <CardHeader className="text-center pb-2">
                  <Icon className="h-8 w-8 mx-auto mb-2 text-cyan-400" />
                  <CardTitle className="text-sm font-semibold text-white">{standard.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-xs text-center text-white/80">
                    {standard.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="prose prose-lg mx-auto text-white/90 leading-relaxed">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Regulatory Framework</h2>
            <ul className="space-y-3 text-white/80">
              <li>• <strong>Aviation Safety:</strong> Full compliance with EASA Part-OPS, FAA Part 135, and ICAO standards</li>
              <li>• <strong>Financial Services:</strong> FCA regulated payment processing and escrow services</li>
              <li>• <strong>Data Protection:</strong> GDPR Article 25 privacy by design implementation</li>
              <li>• <strong>International Standards:</strong> ISO 27001 information security management</li>
              <li>• <strong>Anti-Money Laundering:</strong> Full KYC/AML compliance for all financial transactions</li>
              <li>• <strong>Aviation Records:</strong> CAA UK and FAA document retention requirements</li>
            </ul>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Audit & Certification</h2>
            <div className="text-white/80 space-y-4">
              <p>
                <strong>Annual Security Audits:</strong> Independent penetration testing and security assessments 
                conducted by certified cybersecurity firms ensure ongoing compliance with ISO 27001 standards.
              </p>
              <p>
                <strong>Financial Compliance:</strong> Regular audits by FCA-approved firms ensure adherence to 
                UK financial conduct rules and payment services regulations.
              </p>
              <p>
                <strong>Aviation Oversight:</strong> Compliance monitoring by aviation law specialists ensures 
                adherence to EASA, CAA, and FAA operational and data requirements.
              </p>
            </div>
          </div>

          <div className="text-center bg-slate-800/20 backdrop-blur-sm rounded-lg p-8">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-amber-500" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Compliance Violations
            </h3>
            <p className="text-lg text-white/80">
              Any user found in violation of regulatory standards will have their account immediately suspended 
              pending investigation. We maintain zero tolerance for compliance breaches.
            </p>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-white/60">
              Last compliance review: January 2025 | Next scheduled audit: June 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}