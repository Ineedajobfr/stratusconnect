import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Database, Eye, Lock, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Updated with cinematic design - force rebuild to clear cache - StarfieldRunwayBackground removed
export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      {/* Animated overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/20 to-slate-900/40" />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-orange-900/10" />
      
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2025</p>
          </div>

          <Card className="terminal-card">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Our Commitment to Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  At StratusConnect, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Database className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Personal Information</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Name, email address, and contact information</li>
                        <li>Professional credentials and certifications</li>
                        <li>Aviation experience and qualifications</li>
                        <li>Payment and billing information</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Eye className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Usage Information</h3>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>Platform activity and interactions</li>
                        <li>Search queries and preferences</li>
                        <li>Device information and IP address</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Service Provision</h3>
                    <p className="text-muted-foreground">
                      We use your information to provide, maintain, and improve our platform services, including matching you with relevant opportunities and facilitating transactions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Communication</h3>
                    <p className="text-muted-foreground">
                      We may contact you about platform updates, security alerts, and important service-related information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Security and Compliance</h3>
                    <p className="text-muted-foreground">
                      We use your information to verify identities, prevent fraud, and ensure compliance with aviation industry regulations.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Protection Measures</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-terminal-success/20 rounded-lg">
                      <Lock className="w-5 h-5 text-terminal-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Encryption</h3>
                      <p className="text-muted-foreground text-sm">
                        All data is encrypted in transit and at rest using industry-standard encryption protocols.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-terminal-success/20 rounded-lg">
                      <Shield className="w-5 h-5 text-terminal-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Access Controls</h3>
                      <p className="text-muted-foreground text-sm">
                        Strict access controls ensure only authorized personnel can access your data.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-terminal-success/20 rounded-lg">
                      <Database className="w-5 h-5 text-terminal-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Data Minimization</h3>
                      <p className="text-muted-foreground text-sm">
                        We only collect and retain data necessary for providing our services.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-terminal-success/20 rounded-lg">
                      <Eye className="w-5 h-5 text-terminal-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Anonymization</h3>
                      <p className="text-muted-foreground text-sm">
                        Personal data is anonymized when used for analytics and research purposes.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Access and Portability</h3>
                    <p className="text-muted-foreground">
                      You have the right to access your personal data and request a copy in a portable format.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Correction and Deletion</h3>
                    <p className="text-muted-foreground">
                      You can request correction of inaccurate data or deletion of your personal information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Opt-out</h3>
                    <p className="text-muted-foreground">
                      You can opt out of marketing communications and certain data processing activities.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Data Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell your personal information. We may share your data only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With trusted service providers under strict confidentiality agreements</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cookies and Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar technologies to enhance your experience, analyze platform usage, and provide personalized content. You can control cookie preferences through your browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">International Transfers</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy or wish to exercise your rights, please contact us at privacy@stratusconnect.com or through our support center.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
