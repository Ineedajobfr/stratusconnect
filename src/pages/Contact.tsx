import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavigationArrows } from "@/components/NavigationArrows";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

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
            Contact Us
          </h1>
          <p className="text-xl text-white/90">
            Get in touch with our support team for assistance with your account or any questions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-slate-800/50 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Mail className="h-5 w-5 text-cyan-400" />
                Submit a Request
              </CardTitle>
              <CardDescription className="text-white/80">
                Fill out the form below and our team will respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="requestType" className="text-white">Request Type</Label>
                  <Select value={formData.requestType} onValueChange={(value) => setFormData({...formData, requestType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Support</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message" className="text-white">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-5 w-5 text-cyan-400" />
                AI Assistant
              </CardTitle>
              <CardDescription className="text-white/80">
                Chat with our AI assistant for immediate help with common questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-700/50 rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                <div className="text-center text-white/70">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4" />
                  <p className="mb-4 text-white">AI Assistant Coming Soon</p>
                  <p className="text-sm">
                    Our AI chatbot will be available soon to provide instant support 
                    for common questions and account issues.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2 text-white">Response Time</h3>
            <p className="text-white/80">
              We aim to respond to all inquiries within 24 hours during business days. 
              For urgent security issues, please mark your request as high priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}