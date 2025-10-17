import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, HelpCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HelpCenter() {
  const navigate = useNavigate();

  const helpSections = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn how to set up your account and navigate the platform",
      items: ["Account Setup", "First Login", "Profile Configuration", "Basic Navigation"]
    },
    {
      icon: HelpCircle,
      title: "Account & Billing",
      description: "Manage your account, payments, and subscription settings",
      items: ["Payment Methods", "Billing History", "Account Settings", "Subscription Management"]
    },
    {
      icon: MessageSquare,
      title: "Platform Features",
      description: "Understand and use all StratusConnect features effectively",
      items: ["Terminal Access", "Deal Management", "Document Storage", "Communication Tools"]
    }
  ];

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
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
            <p className="text-white/80 text-lg">Find answers to your questions and get the support you need</p>
          </div>

          {/* Search Section */}
          <Card className="mb-12 bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">How can we help you?</h2>
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Search for help articles, guides, or topics..."
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Sections */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {helpSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <Card key={index} className="bg-slate-800/50 backdrop-blur-sm border-slate-700/30 hover:bg-slate-800/70 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-3 mb-4">
                      <Icon className="w-8 h-8 text-amber-500" />
                      <CardTitle className="text-white">{section.title}</CardTitle>
                    </div>
                    <p className="text-white/70">{section.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-white/60 hover:text-white cursor-pointer transition-colors">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Support */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-white text-center">Still need help?</CardTitle>
              <p className="text-white/70 text-center">Our support team is here to assist you</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-1 gap-6 max-w-md mx-auto">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                  <p className="text-white/70 mb-4">We respond to all inquiries within 24 hours</p>
                  <Button 
                    onClick={() => window.open('mailto:support@stratusconnect.org', '_blank')}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
