import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Users, Shield, DollarSign, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function UserAgreement() {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">User Agreement</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <Card className="terminal-card">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Agreement Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This User Agreement ("Agreement") governs your use of the StratusConnect platform and services. 
                  By creating an account or using our services, you agree to be bound by the terms of this Agreement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Account Registration</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Eligibility</h3>
                      <p className="text-muted-foreground">
                        You must be at least 18 years old and have the legal capacity to enter into this Agreement. 
                        You must be a licensed aviation professional or have a legitimate business interest in aviation services.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Verification Requirements</h3>
                      <p className="text-muted-foreground">
                        You must provide accurate information and complete our verification process, including:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                        <li>Professional credentials and certifications</li>
                        <li>Identity verification documents</li>
                        <li>Business registration (for operators and brokers)</li>
                        <li>References from industry professionals</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">User Responsibilities</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Professional Conduct</h3>
                    <p className="text-muted-foreground">
                      You agree to maintain the highest standards of professional conduct and ethics in all your interactions on the platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Accurate Information</h3>
                    <p className="text-muted-foreground">
                      You must provide accurate, current, and complete information and update it promptly when changes occur.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Compliance</h3>
                    <p className="text-muted-foreground">
                      You must comply with all applicable laws, regulations, and aviation industry standards in your use of the platform.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Security</h3>
                    <p className="text-muted-foreground">
                      You are responsible for maintaining the security of your account credentials and for all activities under your account.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Platform Services</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <DollarSign className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Transaction Facilitation</h3>
                      <p className="text-muted-foreground">
                        StratusConnect facilitates transactions between users but is not a party to these transactions. 
                        We provide escrow services and dispute resolution mechanisms.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Verification Services</h3>
                      <p className="text-muted-foreground">
                        We provide identity and credential verification services to enhance trust and security on the platform.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Communication Tools</h3>
                      <p className="text-muted-foreground">
                        We provide secure communication tools for users to interact and coordinate transactions.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Fees and Payments</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Transaction Fees</h3>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>7% fee on completed broker and operator sales</li>
                      <li>10% fee on crew and pilot hiring transactions</li>
                      <li>No monthly subscription fees until you generate revenue</li>
                      <li>Additional fees may apply for premium services</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Payment Processing</h3>
                    <p className="text-muted-foreground">
                      All payments are processed through secure, third-party payment processors. 
                      We do not store your payment information on our servers.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Refunds</h3>
                    <p className="text-muted-foreground">
                      Refunds are handled on a case-by-case basis through our dispute resolution process. 
                      Platform fees are generally non-refundable unless required by law.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Activities</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-terminal-danger/20 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-terminal-danger" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">You may not:</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Provide false or misleading information</li>
                        <li>Engage in fraudulent or deceptive practices</li>
                        <li>Violate any applicable laws or regulations</li>
                        <li>Infringe on intellectual property rights</li>
                        <li>Harass, abuse, or threaten other users</li>
                        <li>Attempt to circumvent platform security measures</li>
                        <li>Use the platform for illegal purposes</li>
                        <li>Interfere with platform operations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Dispute Resolution</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We provide a comprehensive dispute resolution process for transaction-related disputes. 
                  This includes mediation services and, if necessary, binding arbitration. 
                  All disputes are subject to the laws of the United Kingdom.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Termination</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Termination by You</h3>
                    <p className="text-muted-foreground">
                      You may terminate your account at any time by contacting our support team. 
                      Outstanding obligations must be fulfilled before account closure.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Termination by Us</h3>
                    <p className="text-muted-foreground">
                      We may suspend or terminate your account for violations of this Agreement, 
                      fraudulent activity, or other reasons as outlined in our Terms of Service.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  StratusConnect's liability is limited to the maximum extent permitted by law. 
                  We are not responsible for transactions between users or for any indirect, incidental, 
                  or consequential damages arising from your use of the platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this User Agreement, please contact us at legal@stratusconnect.com 
                  or through our support center.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
