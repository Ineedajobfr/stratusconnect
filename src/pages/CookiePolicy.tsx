import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie, Settings, Shield, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: December 2024</p>
          </div>

          <Card className="terminal-card">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies?</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling certain functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Cookies</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Settings className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Essential Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies are necessary for the website to function properly and cannot be disabled.
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                        <li>Authentication and login status</li>
                        <li>Security and fraud prevention</li>
                        <li>Load balancing and performance</li>
                        <li>User interface preferences</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Analytics Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies help us understand how visitors interact with our website.
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                        <li>Page views and user journeys</li>
                        <li>Feature usage and performance</li>
                        <li>Error tracking and debugging</li>
                        <li>User behavior patterns</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Functional Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies enable enhanced functionality and personalization.
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                        <li>Language and region preferences</li>
                        <li>Customized dashboard settings</li>
                        <li>Notification preferences</li>
                        <li>Theme and display options</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Cookie Types and Duration</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-terminal-border">
                    <thead>
                      <tr className="bg-terminal-card">
                        <th className="border border-terminal-border p-4 text-left text-foreground">Cookie Type</th>
                        <th className="border border-terminal-border p-4 text-left text-foreground">Purpose</th>
                        <th className="border border-terminal-border p-4 text-left text-foreground">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-terminal-border p-4 text-gunmetal">session_id</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">Maintains user session</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">Session</td>
                      </tr>
                      <tr>
                        <td className="border border-terminal-border p-4 text-gunmetal">auth_token</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">User authentication</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">30 days</td>
                      </tr>
                      <tr>
                        <td className="border border-terminal-border p-4 text-gunmetal">preferences</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">User interface settings</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">1 year</td>
                      </tr>
                      <tr>
                        <td className="border border-terminal-border p-4 text-gunmetal">analytics</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">Usage analytics</td>
                        <td className="border border-terminal-border p-4 text-gunmetal">2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Your Cookie Preferences</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Browser Settings</h3>
                    <p className="text-muted-foreground">
                      You can control cookies through your browser settings. Most browsers allow you to:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                      <li>View and delete existing cookies</li>
                      <li>Block cookies from specific websites</li>
                      <li>Block third-party cookies</li>
                      <li>Receive notifications when cookies are set</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-2">Platform Settings</h3>
                    <p className="text-muted-foreground">
                      You can manage your cookie preferences through your account settings on our platform. 
                      Note that disabling certain cookies may affect platform functionality.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may use third-party services that set their own cookies. These include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                  <li><strong>Analytics providers:</strong> Google Analytics, Mixpanel</li>
                  <li><strong>Payment processors:</strong> Stripe, PayPal</li>
                  <li><strong>Security services:</strong> Cloudflare, reCAPTCHA</li>
                  <li><strong>Communication tools:</strong> Intercom, Zendesk</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Updates to This Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about our use of cookies or this Cookie Policy, please contact us at privacy@stratusconnect.com or through our support center.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
