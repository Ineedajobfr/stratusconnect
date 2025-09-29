import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0B1426' }}>
      <StarfieldRunwayBackground />
      
      <div className="relative z-10 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6 text-gunmetal hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <Card className="terminal-card">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using StratusConnect ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
                <p className="text-muted-foreground leading-relaxed">
                  StratusConnect is a digital marketplace platform that connects aviation professionals including brokers, operators, pilots, and crew members. The platform facilitates aircraft transactions, job matching, and professional networking within the aviation industry.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">2.1 Advertising Policy</h2>
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    StratusConnect maintains strict control over all advertising content displayed on our platform. We do not allow third-party advertising networks, external ad servers, or any form of external advertising on our platform.
                  </p>
                  <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-lg font-medium text-foreground mb-2">Our Advertising Policy:</h3>
                    <ul className="text-muted-foreground space-y-2">
                      <li>• <strong>Internal Advertising Only:</strong> Only StratusConnect-approved advertisements are permitted</li>
                      <li>• <strong>No Third-Party Ads:</strong> External advertising networks are strictly prohibited</li>
                      <li>• <strong>No Tracking Scripts:</strong> Third-party tracking or analytics scripts are blocked</li>
                      <li>• <strong>Quality Control:</strong> All advertisements must meet our professional standards</li>
                      <li>• <strong>User Experience:</strong> Advertising will not interfere with platform functionality</li>
                    </ul>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    This policy ensures a clean, professional environment free from external advertising interference while allowing us to promote relevant aviation services and opportunities.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">3.1 Account Security</h3>
                    <p className="text-muted-foreground">
                      You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">3.2 Accurate Information</h3>
                    <p className="text-muted-foreground">
                      You must provide accurate, current, and complete information during registration and keep your information updated.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">3.3 Compliance</h3>
                    <p className="text-muted-foreground">
                      You agree to comply with all applicable laws, regulations, and aviation industry standards in your use of the platform.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">4. Platform Fees</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">4.1 Transaction Fees</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>7% fee on completed broker and operator sales</li>
                      <li>10% fee on crew and pilot hiring transactions</li>
                      <li>No fees for crew and pilot registration and profile maintenance</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">4.2 Payment Terms</h3>
                    <p className="text-muted-foreground">
                      All fees are processed through secure payment systems. Payment is due upon completion of transactions.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">5. Prohibited Activities</h2>
                <p className="text-muted-foreground mb-4">You may not use the platform to:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful or malicious code</li>
                  <li>Engage in fraudulent or deceptive practices</li>
                  <li>Harass or abuse other users</li>
                  <li>Attempt to gain unauthorized access to the platform</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">6. Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  StratusConnect provides escrow services to protect transactions. In case of disputes, our resolution process includes mediation and, if necessary, binding arbitration. All disputes are subject to the laws of the United Kingdom.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">7. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  StratusConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the platform. Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account at any time for violation of these terms. You may terminate your account at any time by contacting our support team.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the platform constitutes acceptance of modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these terms, please contact us at legal@stratusconnect.com or through our support center.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
