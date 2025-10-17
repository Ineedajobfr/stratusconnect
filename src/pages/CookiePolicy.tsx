import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Settings, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Updated with cinematic design - force rebuild to clear cache - StarfieldRunwayBackground removed
export default function CookiePolicy() {
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
            <h1 className="text-4xl font-bold text-foreground mb-4">Cookie Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2025</p>
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
                <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Your Data</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We only collect data necessary to improve your user experience. We never sell your data to third parties.
                </p>
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">Data Collection</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                    <li>Authentication tokens for secure login</li>
                    <li>User preferences for personalized experience</li>
                    <li>Error logs for debugging and platform improvement</li>
                    <li>Session data for security and functionality</li>
                  </ul>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 mt-4">
                  <h3 className="text-lg font-medium text-foreground mb-2">Data Retention</h3>
                  <p className="text-muted-foreground text-sm">
                    Your data is retained as long as your account is active, or as required by law. 
                    We use your data solely to enhance platform functionality and user experience.
                  </p>
                </div>
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
                  If you have questions about our use of cookies or this Cookie Policy, please contact us at privacy@stratusconnect.org or through our support center.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
