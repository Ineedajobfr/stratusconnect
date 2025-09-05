import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { usePageContent } from "@/hooks/usePageContent";

export default function Privacy() {
  const navigate = useNavigate();
  const { content, loading } = usePageContent('privacy');

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
            {content.title || 'Privacy Policy'}
          </h1>
        </div>

        <div className="prose prose-lg mx-auto text-white/90 leading-relaxed space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Data Protection</h2>
            <p>
              Stratus Connect encrypts all data in transit using TLS 1.3 and at rest using AES-256 encryption. 
              We do not sell or monetise user data under any circumstances.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Document Retention</h2>
            <p>
              ID documents are automatically deleted on expiry unless legal obligations require retention for 
              financial compliance or aviation regulatory purposes. Users can request full account deletion 
              and data export under GDPR Article 20.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Audit Logs</h2>
            <p>
              Audit logs remain immutable as they are required for financial and aviation compliance. These logs 
              contain transaction records, security events, and regulatory compliance data that cannot be altered 
              or deleted under UK financial conduct rules and aviation safety requirements.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Compliance Standards</h2>
            <p>
              We comply with EU GDPR, UK Data Protection Act 2018, and global aviation data standards including 
              EASA, FAA, and ICAO requirements. Our data processing procedures are audited annually to ensure 
              compliance with these standards.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Cookies Policy</h2>
            <p>
              We use essential cookies only by default for authentication and security purposes. No third-party 
              tracking cookies are installed without explicit user opt-in. Users can manage cookie preferences 
              in their account settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Rights</h2>
            <p>
              Under GDPR and UK DPA 2018, you have the right to access, rectify, erase, restrict processing, 
              data portability, and object to processing of your personal data. Contact us through the support 
              system to exercise these rights.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Contact Information</h2>
            <p>
              For privacy-related inquiries, contact our Data Protection Officer through the secure contact 
              system in your account dashboard or via the contact page.
            </p>
          </div>

          <div className="text-sm text-white/60 pt-8 border-t border-white/20">
            <p>Last updated: January 2025</p>
            <p>Governed by the laws of England and Wales</p>
          </div>
        </div>
      </div>
    </div>
  );
}