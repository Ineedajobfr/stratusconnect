import React from "react";
import {
  Brain, Target, ShieldCheck, Lock, CheckCircle, DollarSign, Globe,
  Fingerprint, EyeOff, Clock, Book, Sparkles, PlayCircle, DownloadCloud,
  Users, Search
} from "lucide-react";

/** StratusConnect public landing page */
export default function Index() {
  return (
    <div className="relative min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      {/* star field + grain + vignette */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 star-bg" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 vignette" />
      <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-[0.08] mix-blend-overlay">
        <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-white">StratusConnect</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">FCA Compliant</span>
              </div>
              <button className="text-white hover:text-gray-300 text-sm">Help</button>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-orange-400 font-medium">New: AI is getting an upgrade</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8">
            Save 4 hours per person
            <br />
            <span className="text-orange-500">
              every single week
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            <span className="text-orange-500 font-bold">
              StratusConnect
            </span> is the most productive aviation platform ever made. 
            Collaborate faster and get more done with AI-native aviation management.
          </p>

          <div className="flex items-center justify-center gap-8 mb-12">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-4 text-lg rounded-lg">
              Get Started
            </button>
            <button className="border border-white/20 text-white hover:bg-white/10 font-medium px-8 py-4 text-lg rounded-lg flex items-center gap-2">
              <Search className="w-5 h-5" />
              Explore Features
            </button>
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">15 M</div>
            <p className="text-gray-400 text-lg">
              <span className="text-orange-500 font-bold">
                StratusConnect
              </span> saves teams over 15 million hours every single year.
            </p>
          </div>
        </div>
      </section>

      {/* CHOOSE YOUR TERMINAL */}
      <Section title="Choose Your Terminal" subtitle="Access your personalized workspace">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <TerminalCard
            icon="📊" title="Broker Terminal" subtitle="Quote management & client relations"
            bullets={["Real-time market data","Automated quote generation","Secure escrow payments"]}
          />
          <TerminalCard
            icon="✈️" title="Operator Terminal" subtitle="Fleet management & optimization"
            bullets={["Fleet optimization tools","Crew scheduling automation","Real-time performance metrics"]}
          />
          <TerminalCard
            icon="👤" title="Pilot Terminal" subtitle="Flight assignments & credentials"
            bullets={["Job matching algorithm","Credential verification","Secure payment processing"]}
          />
          <TerminalCard
            icon="👥" title="Crew Terminal" subtitle="Service excellence & scheduling"
            bullets={["Premium crew opportunities","Flexible scheduling","Reputation building tools"]}
          />
        </div>
      </Section>

      {/* WHY DIFFERENT */}
      <Section title="Why We're Different" subtitle="The features that set us apart from the competition">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard icon={<Brain className="h-6 w-6" />} title="AI That Actually Works"
            description="Finds better deals, predicts demand, automates the boring stuff. Built to empower, not overwhelm." />
          <FeatureCard icon={<Target className="h-6 w-6" />} title="We Only Win When You Win"
            description="No monthly fees. No hidden costs. We only make money when you close deals." />
          <FeatureCard icon={<ShieldCheck className="h-6 w-6" />} title="Transparency & Trust"
            description="You see what we do, how we do it, and what it costs. No surprises. Just results." />
        </div>
      </Section>

      {/* ESCROW */}
      <Section title="Secure Escrow System" subtitle="Your funds are protected at every step">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <StepItem number={1} title="Funds Secured" description="Payment held in secure escrow until flight completion." />
            <StepItem number={2} title="Service Delivered" description="Flight completed and verified by all parties." />
            <StepItem number={3} title="Automatic Release" description="Funds automatically released to service providers." />
          </div>
          <div className="rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-brand" />
              <h3 className="text-xl font-semibold">Payment Protection</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-success" /> FDIC-insured escrow accounts</li>
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-success" /> Real-time transaction monitoring</li>
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-success" /> Dispute resolution system</li>
              <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-success" /> 24/7 fraud protection</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section title="Transparent Pricing" subtitle="Fair fees that grow with your success">
        <div className="grid gap-6 md:grid-cols-3">
          <PricingCard icon={<DollarSign className="h-6 w-6" />} title="Broker & Operator" price="7%"
            description="Only charged on successful transactions. No monthly fees or hidden costs." />
          <PricingCard icon={<Users className="h-6 w-6" />} title="Crew & Pilot Hiring" price="10%"
            description="One-time fee per successful placement for specific flights." />
          <PricingCard icon={<ShieldCheck className="h-6 w-6" />} title="Crew & Pilots" price="FREE"
            description="No fees. No subscriptions. No hidden costs." />
        </div>
      </Section>

      {/* PRIVACY */}
      <Section title="Privacy by Design" subtitle="Your data is never shared without explicit consent">
        <div className="grid gap-6 md:grid-cols-4">
          <PrivacyCard icon={<Globe className="h-6 w-6" />} title="GDPR Compliant" description="Full compliance with global privacy regulations." />
          <PrivacyCard icon={<Fingerprint className="h-6 w-6" />} title="Data Anonymisation" description="Personal data encrypted and anonymised." />
          <PrivacyCard icon={<EyeOff className="h-6 w-6" />} title="Selective Disclosure" description="You control what information is visible." />
          <PrivacyCard icon={<Clock className="h-6 w-6" />} title="Data Retention" description="Automatic deletion of expired data." />
        </div>
      </Section>

      {/* GUIDES */}
      <Section title="Stop Guessing, Start Winning" subtitle="Complete guides, AI assistance, and everything you need to succeed">
        <div className="rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">Master the Platform in Minutes</h3>
              <p className="mt-1 text-sm text-text-muted">
                Step-by-step guides, AI assistance, and terminal-specific tutorials that get you up and running fast.
              </p>
            </div>
            <a href="#" className="rounded-md bg-fire px-3 py-2 text-sm font-medium text-white hover:bg-fire-600 focus:outline-none focus:ring-2 focus:ring-white/20">
              View Complete Guide
            </a>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <MiniGuide icon={<Book className="h-5 w-5" />} title="Terminal Guides" desc="Instructions for each terminal." />
            <MiniGuide icon={<Sparkles className="h-5 w-5" />} title="AI Features" desc="Automation and tooling." />
            <MiniGuide icon={<PlayCircle className="h-5 w-5" />} title="Quick Start" desc="Be productive in minutes." />
            <MiniGuide icon={<DownloadCloud className="h-5 w-5" />} title="Resources" desc="Downloads and support." />
          </div>
        </div>
      </Section>

      {/* ENTERPRISE */}
      <Section title="Enterprise Performance" subtitle="Mission-critical reliability with redundant infrastructure">
        <div className="grid gap-6 md:grid-cols-3">
          <StatsCard title="99.99% Uptime" description="Mission-critical reliability with redundant infrastructure." />
          <StatsCard title="<50ms Response" description="Lightning-fast performance optimised for real-time operations." />
          <StatsCard title="24/7 Support" description="Dedicated support team available around the clock." />
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="bg-surface-2 text-text-muted border-t border-white/10">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text)]">StratusConnect</h3>
            <p className="mt-4 text-sm">The platform that's already processing millions in deals.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Cookie Policy</a></li>
              <li><a href="#" className="hover:underline">User Agreement</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">Status Page</a></li>
              <li><a href="#" className="hover:underline">API Documentation</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">Security</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a href="#" className="hover:underline">SOC 2 Compliant</a></li>
              <li><a href="#" className="hover:underline">End-to-End Encryption</a></li>
              <li><a href="#" className="hover:underline">Zero-Trust Architecture</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">
          © {new Date().getFullYear()} StratusConnect. Built for the aviation industry.
        </div>
      </footer>
    </div>
  );
}

/* ---------- small components ---------- */

function Section({title, subtitle, children}:{title:string;subtitle?:string;children:React.ReactNode}){
  return (
    <section className="border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl font-semibold">{title}</h2>
        {subtitle && <p className="mx-auto mt-2 max-w-3xl text-center text-text-muted">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function Metric({value,label}:{value:string;label:string}){
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-fire">{value}</div>
      <div className="mt-1 text-xs text-text-muted">{label}</div>
    </div>
  );
}


function TerminalCard({icon,title,subtitle,bullets}:{icon:string;title:string;subtitle:string;bullets:string[];}){
  return (
    <div className="rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-orange-500">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-text-muted">
        {bullets.map((b,i)=>(
          <li key={i} className="flex items-start gap-2">
            <CheckCircle className="mt-0.5 h-4 w-4 text-success"/>{b}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center gap-3">
        <button className="rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-white/20">
          Access Terminal →
        </button>
        <button className="rounded-md bg-white/5 px-3 py-2 text-sm text-[var(--text)] hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20">
          Demo
        </button>
      </div>
    </div>
  );
}

function FeatureCard({icon,title,description}:{icon:React.ReactNode;title:string;description:string;}){
  return (
    <div className="rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card hover:ring-brand transition">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-text-muted">{description}</p>
        </div>
      </div>
    </div>
  );
}

function StepItem({number,title,description}:{number:number;title:string;description:string;}){
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/20 text-lg font-semibold text-brand">{number}</div>
      <div>
        <h4 className="text-base font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-text-muted">{description}</p>
      </div>
    </div>
  );
}

function PricingCard({icon,title,price,description}:{icon:React.ReactNode;title:string;price:string;description:string;}){
  return (
    <div className="flex flex-col rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fire/20 text-fire">
          {icon}
        </div>
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <div className="mt-4 text-4xl font-bold text-fire">{price}</div>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
    </div>
  );
}

function PrivacyCard({icon,title,description}:{icon:React.ReactNode;title:string;description:string;}){
  return (
    <div className="rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/20 text-brand">
          {icon}
        </div>
        <h4 className="text-lg font-semibold">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
    </div>
  );
}

function MiniGuide({icon,title,desc}:{icon:React.ReactNode;title:string;desc:string;}){
  return (
    <div className="flex items-start gap-3 rounded-lg bg-white/5 p-3">
      <div className="text-fire">{icon}</div>
      <div>
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-text-muted">{desc}</div>
      </div>
    </div>
  );
}

function StatsCard({title,description}:{title:string;description:string;}){
  return (
    <div className="rounded-xl bg-surface-1 p-6 ring-1 ring-white/10 shadow-card">
      <div className="text-3xl font-bold text-brand">{title}</div>
      <p className="mt-2 text-sm text-text-muted">{description}</p>
    </div>
  );
}