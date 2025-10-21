import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Updated with cinematic design - force rebuild to clear cache - StarfieldRunwayBackground removed
export default function Contact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send to backend
    toast({
      title: "Request Submitted",
      description: "Your request has been logged. Our team will review and respond as soon as possible.",
    });
    setFormData({ name: '', email: '', requestType: '', message: '' });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
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
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.7)]">
            Contact Us
          </h1>
          <p className="text-xl text-white/90">
            Get in touch with our support team for assistance with your account or any questions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-amber-500/30 shadow-2xl shadow-amber-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mail className="h-5 w-5 text-amber-400" />
                Submit a Request
              </CardTitle>
              <CardDescription className="text-white/80">
                Fill out the form below and our team will respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-white font-medium">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="requestType" className="text-white font-medium">Request Type</Label>
                  <Select value={formData.requestType} onValueChange={(value) => setFormData({...formData, requestType: value})}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white focus:border-amber-500 focus:ring-amber-500/20">
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      <SelectItem value="support" className="text-white hover:bg-slate-700">Support</SelectItem>
                      <SelectItem value="verification" className="text-white hover:bg-slate-700">Verification</SelectItem>
                      <SelectItem value="payments" className="text-white hover:bg-slate-700">Payments</SelectItem>
                      <SelectItem value="technical" className="text-white hover:bg-slate-700">Technical Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-white font-medium">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                    rows={5}
                    placeholder="Please describe your request in detail..."
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-amber-500/30 shadow-2xl shadow-amber-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5 text-amber-400" />
                AI Assistant
              </CardTitle>
              <CardDescription className="text-white/80">
                Chat with our AI assistant for immediate help with common questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg p-6 min-h-[300px] flex items-center justify-center border border-amber-500/20">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-amber-400" />
                  <p className="mb-4 text-white font-semibold">AI Assistant Coming Soon</p>
                  <p className="text-sm text-white/70">
                    Our AI chatbot will be available soon to provide instant support 
                    for common questions and account issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 backdrop-blur-sm rounded-lg p-8 border border-amber-500/20 shadow-xl">
            <h3 className="text-xl font-semibold mb-3 text-white">Response Time</h3>
            <p className="text-white/80 text-lg leading-relaxed">
              We aim to respond to all inquiries within 24 hours during business days. 
              For urgent security issues, please mark your request as high priority.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>24hr Response</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Priority Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Expert Team</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
