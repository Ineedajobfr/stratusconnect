import { StratusConnectLogo } from "@/components/StratusConnectLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Hand, Heart, Plane, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cinematic Burnt Orange to Obsidian Gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      
      {/* Cinematic Vignette - Creates spotlight effect on center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, transparent 0%, transparent 40%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0.3) 80%, rgba(0, 0, 0, 0.6) 100%)',
        }}
      />
      
      {/* Enhanced golden-orange glow in the center */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at center, rgba(255, 140, 0, 0.25) 0%, rgba(255, 140, 0, 0.15) 20%, rgba(255, 140, 0, 0.08) 40%, rgba(255, 140, 0, 0.04) 60%, transparent 80%)',
        }}
      />
      
      {/* Additional orange glow layer for more intensity */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at center, rgba(255, 165, 0, 0.12) 0%, rgba(255, 140, 0, 0.08) 30%, rgba(255, 140, 0, 0.04) 50%, transparent 70%)',
        }}
      />
      
      {/* Subtle pulsing orange glow effect */}
      <div 
        className="absolute inset-0 animate-pulse"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at center, rgba(255, 140, 0, 0.08) 0%, rgba(255, 140, 0, 0.04) 25%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />
      
      <div className="absolute top-4 left-4 z-40">
        <StratusConnectLogo />
      </div>
      
      <div className="absolute top-4 right-4 z-40">
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


        {/* The StratusConnect Way */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-foreground">
              The StratusConnect Way
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Real partnership, not just software. We're here to give you the tools to become your own hero.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
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
                  onClick={() => navigate('/roles')}
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
