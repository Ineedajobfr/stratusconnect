import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Target, Heart, Hand, Plane, BarChart3, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationArrows } from "@/components/NavigationArrows";
import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import StarfieldRunwayBackground from "@/components/StarfieldRunwayBackground";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-app">
      <StarfieldRunwayBackground />
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
        <NavigationArrows />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-6xl">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-foreground">
            We saw the mess.
            <br />
            <span className="text-accent">We built the solution.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The aviation industry was quite messy, and we saw that workers such as pilots, 
            crew, operators, and brokers all struggle with the same issue continuously.
          </p>
        </div>

        {/* The Problem */}
        <section className="mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                The Problem We Saw
              </h2>
              <div className="space-y-4 text-muted-foreground text-lg">
                <p>
                  They were unable to navigate their workspaces with ease. They use multiple 
                  tools just to achieve their goals, constantly switching between platforms, 
                  losing time, and losing focus.
                </p>
                <p>
                  We thought to ourselves: <span className="text-accent font-semibold">
                    "Let's be different."
                  </span>
                </p>
                <p>
                  Let's give them the opportunity to become the best versions of themselves.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="terminal-card">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Multiple Tools</h3>
                  <p className="text-sm text-muted-foreground">Scattered across platforms</p>
                </CardContent>
              </Card>
              <Card className="terminal-card">
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Lost Time</h3>
                  <p className="text-sm text-muted-foreground">Constant switching</p>
                </CardContent>
              </Card>
              <Card className="terminal-card">
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Fragmented Teams</h3>
                  <p className="text-sm text-muted-foreground">Working in silos</p>
                </CardContent>
              </Card>
              <Card className="terminal-card">
                <CardContent className="p-6 text-center">
                  <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Lost Focus</h3>
                  <p className="text-sm text-muted-foreground">Distracted workflows</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Solution */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              Our Solution
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              We designed StratusConnect as a result of this. A software that prioritises 
              its customers more than most companies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="terminal-card text-center">
              <CardHeader>
                <Plane className="w-16 h-16 text-accent mx-auto mb-4" />
                <CardTitle className="text-xl">One Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Everything you need in one place. No more switching between tools, 
                  no more lost context, no more wasted time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="terminal-card text-center">
              <CardHeader>
                <Heart className="w-16 h-16 text-accent mx-auto mb-4" />
                <CardTitle className="text-xl">Built for You</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We see what issues you face and we want to make it a little bit easier 
                  for you. Your success is our success.
                </p>
              </CardContent>
            </Card>
            
            <Card className="terminal-card text-center">
              <CardHeader>
                <Shield className="w-16 h-16 text-accent mx-auto mb-4" />
                <CardTitle className="text-xl">Your Best Self</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  StratusConnect is something that helps you become the better version 
                  of yourself. That's our mission.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Our Philosophy */}
        <section className="mb-20">
          <div className="bg-terminal-card rounded-2xl p-12 text-center">
            <Hand className="w-20 h-20 text-accent mx-auto mb-8" />
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Our Philosophy
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground">
              <p>
                We aim to give you that hand to help you, but we can't do it all on our own. 
                We need you to help you.
              </p>
              <p className="text-xl font-semibold text-accent">
                You need to become the best person of yourself, the best version of yourself 
                to become your own hero.
              </p>
              <p>
                So StratusConnect is here to give you that hand, that foot on the ladder. 
                And that's how we work.
              </p>
            </div>
          </div>
        </section>

        {/* The StratusConnect Way */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              The StratusConnect Way
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real partnership, not just software. We're here to give you the tools 
              to become your own hero.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 rounded-full p-3 mt-1">
                  <span className="text-accent font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">We Listen</h3>
                  <p className="text-muted-foreground">
                    We see the real problems you face every day. Not what we think you need, 
                    but what you actually struggle with.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 rounded-full p-3 mt-1">
                  <span className="text-accent font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">We Build</h3>
                  <p className="text-muted-foreground">
                    We create solutions that actually work for you, not just look good 
                    in a boardroom presentation.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-accent/20 rounded-full p-3 mt-1">
                  <span className="text-accent font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">We Support</h3>
                  <p className="text-muted-foreground">
                    We're here to give you that helping hand, that foot on the ladder. 
                    Your success is literally our business model.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-foreground text-center">
                Join the Revolution
              </h3>
              <p className="text-muted-foreground text-center mb-8">
                Ready to become the best version of yourself? Ready to stop struggling 
                with multiple tools and start thriving with one platform?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/demo')}
                  className="bg-accent hover:bg-accent/90 text-white"
                >
                  Try StratusConnect
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="border-accent text-accent hover:bg-accent/10"
                >
                  Get in Touch
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}