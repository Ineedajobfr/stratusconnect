import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Cookie, 
  Shield, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Eye
} from 'lucide-react';

export default function Cookies() {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
  });

  const [showPreferences, setShowPreferences] = useState(false);

  const handlePreferenceChange = (type: keyof typeof cookiePreferences, value: boolean) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    setCookiePreferences(prev => ({ ...prev, [type]: value }));
  };

  const savePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookie_preferences', JSON.stringify(cookiePreferences));
    
    // Apply cookie settings
    if (!cookiePreferences.analytics) {
      // Disable analytics cookies
      const analyticsCookies = ['_ga', '_gid', '_gat', '_gcl_au'];
      analyticsCookies.forEach(cookie => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
    }
    
    if (!cookiePreferences.marketing) {
      // Disable marketing cookies
      const marketingCookies = ['_fbp', '_fbc', 'fr'];
      marketingCookies.forEach(cookie => {
        document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      });
    }
    
    setShowPreferences(false);
    alert('Cookie preferences saved successfully!');
  };

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
    savePreferences();
  };

  const rejectAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
    });
    savePreferences();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Cookies Policy
          </h1>
          <div className="flex items-center justify-center gap-4 text-gunmetal">
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4" />
              <span>Last Updated: January 15, 2025</span>
            </div>
            <Badge variant="outline">GDPR Compliant</Badge>
          </div>
        </div>

        {/* Cookie Consent Banner */}
        <Card className="mb-8 border-accent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Cookie className="w-8 h-8 text-accent mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Cookie Consent
                </h3>
                <p className="text-gunmetal mb-4">
                  We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                  You can customize your preferences or accept all cookies.
                </p>
                <div className="flex gap-3">
                  <Button onClick={acceptAll} className="btn-terminal-accent">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Accept All
                  </Button>
                  <Button onClick={rejectAll} variant="outline">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject All
                  </Button>
                  <Button 
                    onClick={() => setShowPreferences(true)} 
                    variant="outline"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookie Preferences Modal */}
        {showPreferences && (
          <Card className="mb-8 border-2 border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Necessary Cookies */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-foreground">Necessary Cookies</h4>
                    <p className="text-gunmetal text-sm">Required for basic site functionality</p>
                  </div>
                </div>
                <Switch
                  checked={cookiePreferences.necessary}
                  disabled
                  className="opacity-50"
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-foreground">Analytics Cookies</h4>
                    <p className="text-gunmetal text-sm">Help us understand how visitors use our site</p>
                  </div>
                </div>
                <Switch
                  checked={cookiePreferences.analytics}
                  onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-foreground">Marketing Cookies</h4>
                    <p className="text-gunmetal text-sm">Used to deliver relevant advertisements</p>
                  </div>
                </div>
                <Switch
                  checked={cookiePreferences.marketing}
                  onCheckedChange={(value) => handlePreferenceChange('marketing', value)}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={savePreferences} className="btn-terminal-accent">
                  Save Preferences
                </Button>
                <Button onClick={() => setShowPreferences(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cookie Information */}
        <div className="space-y-8">
          {/* What are Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                What are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                understanding how you use our site.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Cookie Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Necessary Cookies */}
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Strictly Necessary Cookies
                </h4>
                <p className="text-gunmetal text-sm mt-1 mb-3">
                  These cookies are essential for the website to function properly. They cannot be disabled.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-2">Examples:</p>
                  <ul className="text-sm text-gunmetal space-y-1">
                    <li>• Authentication cookies (session management)</li>
                    <li>• Security cookies (CSRF protection)</li>
                    <li>• Load balancing cookies</li>
                    <li>• Cookie consent preferences</li>
                  </ul>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Analytics Cookies
                </h4>
                <p className="text-gunmetal text-sm mt-1 mb-3">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-2">Examples:</p>
                  <ul className="text-sm text-gunmetal space-y-1">
                    <li>• Google Analytics (_ga, _gid, _gat)</li>
                    <li>• Page view tracking</li>
                    <li>• User journey analysis</li>
                    <li>• Performance monitoring</li>
                  </ul>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-foreground flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Marketing Cookies
                </h4>
                <p className="text-gunmetal text-sm mt-1 mb-3">
                  These cookies are used to deliver advertisements that are relevant to you and your interests.
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-foreground mb-2">Examples:</p>
                  <ul className="text-sm text-gunmetal space-y-1">
                    <li>• Facebook Pixel (_fbp, _fbc)</li>
                    <li>• Google Ads conversion tracking</li>
                    <li>• Retargeting cookies</li>
                    <li>• Social media integration</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookie Details Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5" />
                Detailed Cookie Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-medium text-foreground">Cookie Name</th>
                      <th className="text-left p-2 font-medium text-foreground">Purpose</th>
                      <th className="text-left p-2 font-medium text-foreground">Duration</th>
                      <th className="text-left p-2 font-medium text-foreground">Type</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b">
                      <td className="p-2 font-mono text-gunmetal">session_id</td>
                      <td className="p-2 text-gunmetal">User session management</td>
                      <td className="p-2 text-gunmetal">Session</td>
                      <td className="p-2"><Badge className="bg-green-100 text-green-800">Necessary</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-gunmetal">csrf_token</td>
                      <td className="p-2 text-gunmetal">Security protection</td>
                      <td className="p-2 text-gunmetal">Session</td>
                      <td className="p-2"><Badge className="bg-green-100 text-green-800">Necessary</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-gunmetal">cookie_preferences</td>
                      <td className="p-2 text-gunmetal">Remember cookie choices</td>
                      <td className="p-2 text-gunmetal">1 year</td>
                      <td className="p-2"><Badge className="bg-green-100 text-green-800">Necessary</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-gunmetal">_ga</td>
                      <td className="p-2 text-gunmetal">Google Analytics</td>
                      <td className="p-2 text-gunmetal">2 years</td>
                      <td className="p-2"><Badge className="bg-blue-100 text-blue-800">Analytics</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-gunmetal">_gid</td>
                      <td className="p-2 text-gunmetal">Google Analytics</td>
                      <td className="p-2 text-gunmetal">24 hours</td>
                      <td className="p-2"><Badge className="bg-blue-100 text-blue-800">Analytics</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-mono text-gunmetal">_fbp</td>
                      <td className="p-2 text-gunmetal">Facebook Pixel</td>
                      <td className="p-2 text-gunmetal">3 months</td>
                      <td className="p-2"><Badge className="bg-purple-100 text-purple-800">Marketing</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-gunmetal">_fbc</td>
                      <td className="p-2 text-gunmetal">Facebook conversion tracking</td>
                      <td className="p-2 text-gunmetal">3 months</td>
                      <td className="p-2"><Badge className="bg-purple-100 text-purple-800">Marketing</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Managing Cookies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Managing Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gunmetal">
                You can manage your cookie preferences at any time:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gunmetal ml-4">
                <li>Use the cookie preference center above</li>
                <li>Change settings in your browser</li>
                <li>Contact us at privacy@stratusconnect.com</li>
              </ul>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-yellow-800 font-medium">Browser Settings</p>
                    <p className="text-yellow-700 text-sm mt-1">
                      You can also disable cookies through your browser settings, but this may affect 
                      the functionality of our website.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gunmetal">
                If you have questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <p className="font-medium text-foreground">Privacy Team</p>
                <p className="text-gunmetal text-sm mt-1">
                  Email: privacy@stratusconnect.com<br />
                  Phone: [Contact Number]
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gunmetal text-sm">
          <p>
            This cookies policy is effective from January 15, 2025. We will notify you of any changes.
          </p>
        </div>
      </div>
    </div>
  );
}
