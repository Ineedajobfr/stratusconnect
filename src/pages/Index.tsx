import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Plane, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  Star,
  Zap,
  Globe,
  Lock,
  DollarSign,
  Building2,
  UserCheck,
  ArrowRight,
  Info,
  Percent
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LoginModal } from "@/components/LoginModal";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect authenticated users to their home page
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleAccessTerminal = (roleId: string) => {
    setSelectedRole(roleId);
    setShowLoginModal(true);
  };

  const handleDemoAccess = (demoRoute: string) => {
    navigate(demoRoute);
  };

  return (
    <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              Next-Generation Aviation Platform
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-body mb-6 hero-glow">
              Welcome to <span className="text-accent accent-glow">StratusConnect</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted max-w-4xl mx-auto leading-relaxed text-glow-subtle">
              The industry's most secure and efficient platform connecting brokers, operators, pilots, and crew. 
              Built on zero-trust architecture with military-grade encryption.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent accent-glow">99.9%</div>
              <div className="text-sm text-muted-foreground text-glow-subtle">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent accent-glow">15k+</div>
              <div className="text-sm text-muted-foreground text-glow-subtle">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent accent-glow">$2B+</div>
              <div className="text-sm text-muted-foreground text-glow-subtle">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent accent-glow">50ms</div>
              <div className="text-sm text-muted-foreground text-glow-subtle">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal Access Section */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4 title-glow">Choose Your Terminal</h2>
            <p className="text-xl text-muted-foreground text-glow-subtle">Access your personalized workspace</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Broker Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Building2 className="w-8 h-8 text-accent icon-glow" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl title-glow">Broker Terminal</CardTitle>
                    <CardDescription className="subtitle-glow">Quote management & client relations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  Speed creates advantage. Win more quotes with real-time market intelligence and automated workflows.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("broker")} 
                    className="flex-1 btn-terminal-accent button-glow"
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/broker")} 
                    variant="outline"
                    className="px-6 button-glow"
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Operator Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Plane className="w-8 h-8 text-accent icon-glow" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl title-glow">Operator Terminal</CardTitle>
                    <CardDescription className="subtitle-glow">Fleet management & optimization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  Fill the legs. Lift the yield. Control the risk with comprehensive fleet analytics and crew coordination.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("operator")} 
                    className="flex-1 btn-terminal-accent button-glow"
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/operator")} 
                    variant="outline"
                    className="px-6 button-glow"
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pilot Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <UserCheck className="w-8 h-8 text-accent icon-glow" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl title-glow">Pilot Terminal</CardTitle>
                    <CardDescription className="subtitle-glow">Flight assignments & credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  Credentials speak. Availability sells. Fly the missions that match your experience and schedule.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("pilot")} 
                    className="flex-1 btn-terminal-accent button-glow"
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/pilot")} 
                    variant="outline"
                    className="px-6 button-glow"
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crew Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <Users className="w-8 h-8 text-accent icon-glow" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl title-glow">Crew Terminal</CardTitle>
                    <CardDescription className="subtitle-glow">Service excellence & scheduling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  Professional service wins repeat work. Your calendar is your shop window for premium opportunities.
                </p>
                <div className="flex space-x-3">
                  <Button 
                    onClick={() => handleAccessTerminal("crew")} 
                    className="flex-1 btn-terminal-accent button-glow"
                  >
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button 
                    onClick={() => handleDemoAccess("/demo/crew")} 
                    variant="outline"
                    className="px-6 button-glow"
                  >
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Security & Trust Features */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Fortress of Trust</h2>
            <p className="text-xl text-muted-foreground">Built for the most demanding security requirements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-12 h-12 text-accent" />
                    <div>
                      <CardTitle>Military-Grade Encryption</CardTitle>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">Military-Grade Encryption</DialogTitle>
                        <DialogDescription>
                          Bank-level security protecting your most sensitive aviation data
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          We use the same encryption standards as military and financial institutions:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>AES-256 encryption for all data at rest</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>TLS 1.3 for all data in transit</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>SOC 2 Type II compliant infrastructure</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Regular penetration testing and audits</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  End-to-end AES-256 encryption for all data in transit and at rest. SOC 2 Type II compliant infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-12 h-12 text-accent" />
                    <div>
                      <CardTitle>Zero-Trust Architecture</CardTitle>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">Zero-Trust Architecture</DialogTitle>
                        <DialogDescription>
                          Never trust, always verify - every connection and transaction is authenticated
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Our zero-trust approach ensures maximum security:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Multi-factor authentication required</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Continuous identity verification</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Least privilege access controls</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Real-time threat monitoring</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every connection verified, every transaction authenticated. Multi-factor authentication standard across all terminals.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-12 h-12 text-accent" />
                    <div>
                      <CardTitle>Verified Network</CardTitle>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">Verified Network</DialogTitle>
                        <DialogDescription>
                          Only pre-approved, thoroughly vetted professionals join our network
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Our verification process ensures only qualified professionals:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Comprehensive background checks</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Credential verification and validation</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Reference verification from industry peers</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Ongoing compliance monitoring</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Comprehensive background checks and credential verification. Only pre-approved professionals access the network.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Escrow & Payment Security */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Secure Escrow System</h2>
            <p className="text-xl text-muted-foreground">Your funds are protected at every step</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6">How It Works</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 rounded-full p-2 mt-1">
                    <span className="text-accent font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Funds Secured</h4>
                    <p className="text-muted-foreground">Payment held in secure escrow until flight completion</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 rounded-full p-2 mt-1">
                    <span className="text-accent font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Service Delivered</h4>
                    <p className="text-muted-foreground">Flight completed and verified by all parties</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-accent/20 rounded-full p-2 mt-1">
                    <span className="text-accent font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Automatic Release</h4>
                    <p className="text-muted-foreground">Funds automatically released to service providers</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="terminal-card">
              <CardHeader>
                <DollarSign className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Payment Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">FDIC-insured escrow accounts</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">Real-time transaction monitoring</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">Dispute resolution system</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-white" />
                  <span className="text-muted-foreground">24/7 fraud protection</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Platform Fees & Pricing */}
      <div className="relative z-10 py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Fair fees that grow with your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Percent className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Broker & Operator Sales</CardTitle>
                      <CardDescription>Transaction fees</CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">7% Platform Fee</DialogTitle>
                        <DialogDescription>
                          Applied to all successful broker and operator sales transactions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          This fee is automatically deducted from completed transactions and covers:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Platform maintenance and security</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Payment processing and escrow services</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Customer support and dispute resolution</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Market intelligence and analytics</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">7%</div>
                <p className="text-muted-foreground text-sm">
                  Only charged on successful transactions. No monthly fees or hidden costs.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crew & Pilot Hiring</CardTitle>
                      <CardDescription>Recruitment fees</CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">10% Recruitment Fee</DialogTitle>
                        <DialogDescription>
                          Charged to brokers and operators when hiring crew or pilots for specific flights
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          This one-time fee covers the cost of connecting you with qualified professionals:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Credential verification and background checks</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Matching algorithm and compatibility scoring</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Contract facilitation and documentation</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Ongoing support during the assignment</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">10%</div>
                <p className="text-muted-foreground text-sm">
                  One-time fee per successful crew/pilot placement for specific flights.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <UserCheck className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Crew & Pilots</CardTitle>
                      <CardDescription>Always free</CardDescription>
                    </div>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Info className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terminal-card border-terminal-border">
                      <DialogHeader>
                        <DialogTitle className="text-accent">Free for Crew & Pilots</DialogTitle>
                        <DialogDescription>
                          We believe in supporting the professionals who make aviation possible
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Crew and pilots enjoy full platform access at no cost because:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>You are the backbone of our industry</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>We want to maximize your opportunities</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>No barriers to finding great assignments</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Full access to all platform features</span>
                          </li>
                        </ul>
                        <div className="bg-accent/10 p-4 rounded-lg">
                          <p className="text-sm text-accent font-medium">
                            "We care for our customers - that's why crew and pilots are always free."
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">FREE</div>
                <p className="text-muted-foreground text-sm">
                  No fees, no subscriptions, no hidden costs. We care for our customers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Privacy Protection */}
      <div className="relative z-10 py-16 bg-terminal-card/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Privacy by Design</h2>
            <p className="text-xl text-muted-foreground">Your data is never shared without explicit consent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="terminal-card text-center">
              <CardContent className="pt-6">
                <Globe className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">GDPR Compliant</h3>
                <p className="text-sm text-muted-foreground">Full compliance with global privacy regulations</p>
              </CardContent>
            </Card>

            <Card className="terminal-card text-center">
              <CardContent className="pt-6">
                <Shield className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Data Anonymization</h3>
                <p className="text-sm text-muted-foreground">Personal data encrypted and anonymized</p>
              </CardContent>
            </Card>

            <Card className="terminal-card text-center">
              <CardContent className="pt-6">
                <Lock className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Selective Disclosure</h3>
                <p className="text-sm text-muted-foreground">You control what information is visible</p>
              </CardContent>
            </Card>

            <Card className="terminal-card text-center">
              <CardContent className="pt-6">
                <Clock className="w-10 h-10 text-accent mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Data Retention</h3>
                <p className="text-sm text-muted-foreground">Automatic deletion of expired data</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Performance & Reliability */}
      <div className="relative z-10 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-12">Enterprise Performance</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-5xl font-bold text-accent mb-4">99.99%</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Uptime SLA</h3>
              <p className="text-muted-foreground">Mission-critical reliability with redundant infrastructure</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-4">&lt;50ms</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Response Time</h3>
              <p className="text-muted-foreground">Lightning-fast performance optimized for real-time operations</p>
            </div>
            <div>
              <div className="text-5xl font-bold text-accent mb-4">24/7</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Support</h3>
              <p className="text-muted-foreground">Dedicated support team available around the clock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-terminal-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 StratusConnect. All rights reserved. Built for the aviation industry.
            </p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        selectedRole={selectedRole}
      />
    </div>
  );
}
