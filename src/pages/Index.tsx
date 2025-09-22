import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plane, Shield, Users, Clock, CheckCircle, Star, Zap, Globe, Lock, DollarSign, Building2, UserCheck, ArrowRight, Info, Percent, MessageSquare, BookOpen, Play, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";
import { useAuth } from "@/contexts/AuthContext";
export default function Index() {
  const navigate = useNavigate();
  const {
    user
  } = useAuth();

  // Redirect authenticated users to their home page
  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user, navigate]);
  const handleAccessTerminal = (roleId: string) => {
    navigate(`/login/${roleId}`);
  };
  const handleDemoAccess = (demoRoute: string) => {
    navigate(demoRoute);
  };
  return <div className="min-h-screen bg-app relative overflow-hidden">
      <StarfieldRunwayBackground />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="mb-8 animate-fade-in-up">
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
              The Ethical Backbone <span className="text-accent">Private Aviation Needs</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're not just a platform. We're your trusted partner in success. 
              Empowering every professional through technology, transparency, and genuine partnership.
            </p>
          </div>

          {/* Key Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">15k+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">$2B+</div>
              <div className="text-sm text-muted-foreground">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">50ms</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
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
            <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                    <Building2 className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Broker Terminal</CardTitle>
                    <CardDescription className="text-muted-foreground">Quote management & client relations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  We're your partner in success. Access real-time aircraft listings, manage client relationships, and close deals faster than ever. 
                  Our AI-powered matching system connects you with the right opportunities. We succeed together or not at all.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Real-time market data
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Automated quote generation
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Secure escrow payments
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => handleAccessTerminal("broker")} className="flex-1 btn-terminal-accent button-glow">
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button onClick={() => handleDemoAccess("/demo/broker")} variant="outline" className="px-6 button-glow">
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Operator Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.1s'
          }}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                    <Plane className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Operator Terminal</CardTitle>
                    <CardDescription className="text-muted-foreground">Fleet management & optimization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  We're your partner in success. Maximize your fleet's potential with intelligent scheduling, crew management, and real-time performance tracking. 
                  We're invested in your long-term growth, not just quick transactions.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Fleet optimization tools
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Crew scheduling automation
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Real-time performance metrics
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => handleAccessTerminal("operator")} className="flex-1 btn-terminal-accent button-glow">
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button onClick={() => handleDemoAccess("/demo/operator")} variant="outline" className="px-6 button-glow">
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pilot Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.2s'
          }}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                    <UserCheck className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Pilot Terminal</CardTitle>
                    <CardDescription className="text-muted-foreground">Flight assignments & credentials</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  We're your lifeline in a complex industry. Find the best flying opportunities that match your skills and schedule. 
                  We're here to help you succeed and build your reputation with verified operators.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Job matching algorithm
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Credential verification
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Secure payment processing
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => handleAccessTerminal("pilot")} className="flex-1 btn-terminal-accent button-glow">
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button onClick={() => handleDemoAccess("/demo/pilot")} variant="outline" className="px-6 button-glow">
                    Demo
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crew Terminal */}
            <Card className="group terminal-card hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.3s'
          }}>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/20 rounded-xl animate-pulse-glow">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">Crew Terminal</CardTitle>
                    <CardDescription className="text-muted-foreground">Service excellence & scheduling</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 text-glow-subtle">
                  We're your lifeline in a complex industry. Connect with top operators and build lasting relationships. 
                  We're here to help you succeed and showcase your skills to find the best crew assignments.
                </p>
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Premium crew opportunities
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Flexible scheduling
                  </div>
                  <div className="flex items-center text-sm text-gunmetal">
                    <CheckCircle className="w-4 h-4 text-terminal-success mr-2" />
                    Reputation building tools
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={() => handleAccessTerminal("crew")} className="flex-1 btn-terminal-accent button-glow">
                    Access Terminal <ArrowRight className="w-4 h-4 ml-2 icon-glow" />
                  </Button>
                  <Button onClick={() => handleDemoAccess("/demo/crew")} variant="outline" className="px-6 button-glow">
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
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-12 h-12 text-accent" />
                    <div>
                <CardTitle>Empowerment Through Technology</CardTitle>
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
                        <DialogTitle className="text-accent">Empowerment Through Technology</DialogTitle>
                        <DialogDescription>
                          AI that actually helps, tools that make your job easier, data that drives real decisions
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Our technology is designed to empower, not overwhelm:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>AI that understands your challenges</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Tools that level the playing field</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Automation that frees you to focus on what matters</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Data that drives real decisions</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  AI that actually helps, tools that make your job easier, data that drives real decisions. 
                  Automation that frees you to focus on what matters.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Lock className="w-12 h-12 text-accent" />
                    <div>
                <CardTitle>Partnership Over Transaction</CardTitle>
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
                        <DialogTitle className="text-accent">Partnership Over Transaction</DialogTitle>
                        <DialogDescription>
                          We succeed together or not at all. Your success is our success.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          We believe in genuine partnership:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>We succeed together or not at all</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Your success is our success</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>We're invested in your long-term growth</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>We're not just a vendor, we're your partner</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We succeed together or not at all. Your success is our success. 
                  We're invested in your long-term growth, not just quick transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-12 h-12 text-accent" />
                    <div>
                <CardTitle>Trust Through Transparency</CardTitle>
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
                        <DialogTitle className="text-accent">Trust Through Transparency</DialogTitle>
                        <DialogDescription>
                          Clear, honest communication and transparent processes build lasting trust
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          We believe in complete transparency:
                        </p>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Clear, honest communication</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Transparent pricing and processes</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Open about our capabilities and limitations</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-accent" />
                            <span>Regular updates on platform improvements</span>
                          </li>
                        </ul>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clear, honest communication and transparent processes. 
                  We're open about our capabilities and limitations, building trust through transparency.
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
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-foreground mb-4">Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Fair fees that grow with your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="terminal-card group hover:terminal-glow cursor-pointer animate-fade-in-up" style={{
            animationDelay: '0.1s'
          }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-accent/20 rounded-lg animate-pulse-glow">
                      <Percent className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">Broker & Operator Sales</CardTitle>
                      <CardDescription className="text-muted-foreground">Transaction fees</CardDescription>
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

       {/* How to Use StratusConnect */}
       <div className="relative z-10 py-24">
         <div className="max-w-6xl mx-auto px-4">
           <div className="text-center mb-12">
             <h2 className="text-4xl font-bold text-foreground mb-4">Your Partner in Success</h2>
             <p className="text-xl text-muted-foreground">We're your lifeline in a complex industry. Complete guides and support for every professional</p>
           </div>

           <Card className="terminal-card group hover:terminal-glow cursor-pointer transition-all duration-300">
             <CardHeader>
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-4">
                   <div className="p-3 bg-accent/20 rounded-xl">
                     <BookOpen className="w-12 h-12 text-accent" />
                   </div>
                   <div>
                     <CardTitle className="text-2xl text-foreground">We're Here to Help You Succeed</CardTitle>
                     <CardDescription className="text-muted-foreground">
                       Master every aspect of the platform with detailed tutorials, AI feature guides, and terminal-specific instructions. 
                       We're your trusted partner in success.
                     </CardDescription>
                   </div>
                 </div>
                 <Button 
                   onClick={() => navigate('/how-to-use')} 
                   className="btn-terminal-accent button-glow"
                 >
                   <BookOpen className="w-4 h-4 mr-2" />
                   View Complete Guide
                 </Button>
               </div>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="text-center">
                   <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Building2 className="w-8 h-8 text-accent" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">Terminal Guides</h3>
                   <p className="text-sm text-muted-foreground">Step-by-step instructions for each terminal type</p>
                 </div>
                 <div className="text-center">
                   <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Zap className="w-8 h-8 text-accent" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">AI Features</h3>
                   <p className="text-sm text-muted-foreground">Master AI-powered tools and automation</p>
                 </div>
                 <div className="text-center">
                   <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Play className="w-8 h-8 text-accent" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">Quick Start</h3>
                   <p className="text-sm text-muted-foreground">Get up and running in minutes</p>
                 </div>
                 <div className="text-center">
                   <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                     <Download className="w-8 h-8 text-accent" />
                   </div>
                   <h3 className="font-semibold text-foreground mb-2">Resources</h3>
                   <p className="text-sm text-muted-foreground">Download guides and access support</p>
                 </div>
               </div>
             </CardContent>
           </Card>
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
      <footer className="relative z-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">StratusConnect</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              The ethical backbone that private aviation needs. We're your trusted partner in success, 
              empowering every professional through technology, transparency, and genuine partnership.
            </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <Globe className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
                  <MessageSquare className="w-5 h-5" />
                </Button>
              </div>
            </div>

             {/* Legal */}
             <div className="space-y-6">
               <h3 className="text-lg font-bold text-white">Legal</h3>
               <div className="space-y-4">
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/terms-of-service')}>
                     Terms of Service
                   </Button>
                 </div>
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/privacy-policy')}>
                     Privacy Policy
                   </Button>
                 </div>
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/cookie-policy')}>
                     Cookie Policy
                   </Button>
                 </div>
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal" onClick={() => navigate('/user-agreement')}>
                     User Agreement
                   </Button>
                 </div>
               </div>
             </div>

             {/* Support */}
             <div className="space-y-6">
               <h3 className="text-lg font-bold text-white">Support</h3>
               <div className="space-y-4">
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                     Help Center
                   </Button>
                 </div>
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                     Contact Us
                   </Button>
                 </div>
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                     Status Page
                   </Button>
                 </div>
                 <div>
                   <Button variant="link" className="p-0 h-auto text-sm text-gray-300 hover:text-white justify-start font-normal">
                     API Documentation
                   </Button>
                 </div>
               </div>
             </div>

            {/* Security */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-white">Security</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <Shield className="w-4 h-4 text-green-400 mr-3" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Lock className="w-4 h-4 text-green-400 mr-3" />
                  End-to-End Encryption
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                  Zero-Trust Architecture
                </div>
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div className="border-t border-gray-700 mb-8"></div>

          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
             <p className="text-sm text-gray-400">
               © September 2025 StratusConnect. All rights reserved. Built for the aviation industry.
             </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>FCA Compliant</span>
              <span>•</span>
              <span>GDPR Ready</span>
              <span>•</span>
              <span>ISO 27001</span>
            </div>
          </div>
        </div>
      </footer>

    </div>;
}