import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function Terms() {
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
            Terms and Conditions
          </h1>
        </div>

        <div className="prose prose-lg mx-auto text-white/90 leading-relaxed space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Definitions</h2>
            <p>
              <strong>Broker:</strong> Aviation intermediary facilitating charter transactions<br />
              <strong>Operator:</strong> Entity providing aircraft and crew services<br />
              <strong>Pilot:</strong> Licensed flight crew member<br />
              <strong>Crew:</strong> Cabin crew or support personnel<br />
              <strong>User:</strong> Any verified platform participant<br />
              <strong>Platform:</strong> Stratus Connect system and services
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Platform Access</h2>
            <p>
              Only verified users may transact on the platform. All accounts must maintain accurate 
              and up-to-date information. Misrepresentation of credentials or identity results in 
              immediate termination.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. Use of Service</h2>
            <p>
              Users must comply with all aviation laws and regulations including EASA, CAA UK, 
              and FAA US requirements. Stratus Connect is not responsible for regulatory breaches 
              by users. The platform provides connection services only.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Fees</h2>
            <p>
              Platform charges 7% commission on broker/operator transactions. Pilots and crew 
              are not charged. No hidden fees, subscriptions, or data sales. Commission due 
              only on completed transactions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Payments</h2>
            <p>
              All transactions processed through escrow with regulated financial partners. 
              Stratus Connect is not a financial custodian but facilitates secure payment 
              processing with full audit trails and receipts.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Verification</h2>
            <p>
              Users must provide accurate ID, licenses, and certifications. Document verification 
              is mandatory. False information results in account suspension. Expired credentials 
              must be updated promptly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Data Protection</h2>
            <p>
              Full compliance with GDPR, UK DPA 2018, and aviation data standards. Data encrypted 
              in transit and at rest. No data sales. Expired documents deleted unless legally 
              required. Users retain data export and deletion rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Limitation of Liability</h2>
            <p>
              Stratus Connect provides platform services only. Not responsible for operational 
              safety, flight regulatory compliance, or user disputes beyond escrow handling. 
              Users responsible for service quality and aviation standards.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Dispute Resolution</h2>
            <p>
              Commercial disputes handled through platform escrow process. Legal disputes 
              governed by English law with exclusive jurisdiction of England and Wales courts. 
              Mediation preferred before litigation.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Amendments</h2>
            <p>
              Terms may be updated with advance notice to users. Continued platform use 
              constitutes acceptance of revised terms. Major changes require explicit consent.
            </p>
          </div>

          <div className="text-sm text-white/60 pt-8 border-t border-white/20">
            <p><strong>Governing Law:</strong> England and Wales</p>
            <p><strong>Jurisdiction:</strong> Courts of England and Wales</p>
            <p><strong>Last Updated:</strong> January 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}