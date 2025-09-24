import React from "react";
import {
  Brain,
  Target,
  ShieldCheck,
  Lock,
  Plane,
  CheckCircle,
  DollarSign,
  Globe,
  Fingerprint,
  EyeOff,
  Clock,
  Book,
  Sparkles,
  PlayCircle,
  DownloadCloud,
  Users,
} from "lucide-react";

/**
 * Home page for StratusConnect.
 *
 * This component implements a complete marketing landing page with a dark,
 * star‑dusted background and disciplined colour accents. The design is inspired
 * by leading SaaS dashboards like Stripe, Linear and Vercel: clear hierarchy,
 * generous spacing, and a restrained palette. Sections are broken into simple,
 * digestible cards. Metrics and features sit on their own surfaces, set apart
 * from the moving backdrop via rings and shadows. Everything is responsive
 * down to mobile.
 */
export default function IndexPage() {
  return (
    <div className="relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* Global styles and starfield */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --bg: #0B0D12;
            --surface-1: #0F1220;
            --surface-2: #12162A;
            --text: #E6E8EE;
            --muted: #A6ADBF;
            --brand: #0B6BFF;
            --brand-600: #0952C7;
            --brand-300: #5AA2FF;
            --fire: #FF7A1A;
            --fire-600: #D7610F;
            --fire-300: #FFB066;
            --success: #23C483;
            --warn: #E6B800;
            --danger: #FF3B3B;
          }
          /* Starfield background: two layers of dotted radial gradients that drift over time */
          .star-bg {
            background:
              radial-gradient(#ffffff10 1px, transparent 1px) 0 0 / 300px 300px,
              radial-gradient(#ffffff08 1px, transparent 1px) 150px 150px / 300px 300px;
            animation: star-move 120s linear infinite;
          }
          @keyframes star-move {
            from { transform: translate3d(0,0,0); }
            to { transform: translate3d(-300px, -300px, 0); }
          }
        `,
        }}
      />
      {/* Animated star field & noise overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 star-bg"
      >
        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-[0.08] mix-blend-overlay"
        >
          <filter id="noiseFilter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.7"
              numOctaves="2"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>
      <main className="relative z-10 flex flex-col">
        {/* Hero section */}
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <img
            src="Stratus Logo.png"
            alt="Stratus Connect logo"
            className="mx-auto mb-6 h-12 w-auto"
          />
          <h1 className="text-4xl font-bold sm:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-[var(--brand)] via-[var(--fire-300)] to-[var(--brand)] bg-clip-text text-transparent">
              StratusConnect
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-[var(--muted)]">
            The sharp platform connecting brokers, operators, pilots, and crew.
            Join our growing community of aviation professionals with real‑time
            data processing and intelligent automation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <a
              href="/terminal/broker"
              className="rounded-lg bg-[var(--brand)] px-6 py-3 font-medium text-white shadow-glow hover:bg-[var(--brand-600)] active:translate-y-[1px]"
            >
              Broker Terminal
            </a>
            <a
              href="/terminal/operator"
              className="rounded-lg bg-[var(--fire)] px-6 py-3 font-medium text-white shadow-glow hover:bg-[var(--fire-600)] active:translate-y-[1px]"
            >
              Operator Terminal
            </a>
          </div>
        </section>
        {/* Why we're different */}
        <section className="border-t border-white/10 bg-[var(--bg)] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold">
              Why We're Different
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[var(--muted)]">
              The features that set us apart from the competition.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <FeatureCard
                icon={<Brain className="h-6 w-6" />}
                title="AI That Works"
                description="Real AI that finds you better deals, predicts demand, and automates the boring stuff. Designed to empower, not overwhelm."
              />
              <FeatureCard
                icon={<Target className="h-6 w-6" />}
                title="Aligned Incentives"
                description="No monthly fees. No hidden costs. We only make money when you close deals. Your success drives ours."
              />
              <FeatureCard
                icon={<ShieldCheck className="h-6 w-6" />}
                title="Transparency & Trust"
                description="See exactly what we do, how we do it, and what it costs. No surprises, just results."
              />
            </div>
          </div>
        </section>
        {/* How it works & pricing */}
        <section className="border-t border-white/10 bg-[var(--bg)] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold">How It Works</h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[var(--muted)]">
              Funds flow securely from quote to completion.
            </p>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              <div className="space-y-6">
                <StepItem
                  number={1}
                  title="Funds Secured"
                  description="Payment held in a secure escrow until flight completion."
                />
                <StepItem
                  number={2}
                  title="Service Delivered"
                  description="Flight completed and verified by all parties."
                />
                <StepItem
                  number={3}
                  title="Automatic Release"
                  description="Funds automatically released to service providers."
                />
              </div>
              <div className="rounded-xl bg-[var(--surface-1)] p-6 ring-1 ring-white/10 shadow-card">
                <div className="flex items-center gap-4">
                  <Lock className="h-8 w-8 text-[var(--brand)]" />
                  <h3 className="text-xl font-semibold">Payment Protection</h3>
                </div>
                <ul className="mt-4 space-y-2 text-[var(--muted)] text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                    FDIC‑insured escrow accounts
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                    Real‑time transaction monitoring
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                    Dispute resolution system
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 text-[var(--success)]" />
                    24/7 fraud protection
                  </li>
                </ul>
              </div>
            </div>
            {/* Pricing */}
            <div className="mt-14">
              <h3 className="text-center text-3xl font-semibold">
                Transparent Pricing
              </h3>
              <p className="mx-auto mt-2 max-w-3xl text-center text-[var(--muted)]">
                Fair fees that grow with your success.
              </p>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <PricingCard
                  icon={<DollarSign className="h-6 w-6" />}
                  title="Broker & Operator"
                  price="7%"
                  description="Only charged on successful transactions. No monthly fees or hidden costs."
                />
                <PricingCard
                  icon={<Users className="h-6 w-6" />}
                  title="Crew & Pilot Hiring"
                  price="10%"
                  description="One‑time fee per successful crew or pilot placement for specific flights."
                />
                <PricingCard
                  icon={<ShieldCheck className="h-6 w-6" />}
                  title="Crew & Pilots"
                  price="FREE"
                  description="No fees, no subscriptions. We care for our crew and pilots."
                />
              </div>
            </div>
          </div>
        </section>
        {/* Privacy by Design */}
        <section className="border-t border-white/10 bg-[var(--bg)] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold">
              Privacy by Design
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[var(--muted)]">
              Your data is never shared without explicit consent.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <PrivacyCard
                icon={<Globe className="h-6 w-6" />}
                title="GDPR Compliant"
                description="Full compliance with global privacy regulations."
              />
              <PrivacyCard
                icon={<Fingerprint className="h-6 w-6" />}
                title="Data Anonymisation"
                description="Personal data encrypted and anonymised."
              />
              <PrivacyCard
                icon={<EyeOff className="h-6 w-6" />}
                title="Selective Disclosure"
                description="You control what information is visible."
              />
              <PrivacyCard
                icon={<Clock className="h-6 w-6" />}
                title="Data Retention"
                description="Automatic deletion of expired data."
              />
            </div>
          </div>
        </section>
        {/* Guides & Resources */}
        <section className="border-t border-white/10 bg-[var(--bg)] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold">
              Master the Platform in Minutes
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[var(--muted)]">
              Step‑by‑step guides and AI assistance to get you up and running fast.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-4">
              <GuideCard
                icon={<Book className="h-6 w-6" />}
                title="Terminal Guides"
                description="Step‑by‑step instructions for each terminal type."
              />
              <GuideCard
                icon={<Sparkles className="h-6 w-6" />}
                title="AI Tools"
                description="Master AI‑powered tools and automation."
              />
              <GuideCard
                icon={<PlayCircle className="h-6 w-6" />}
                title="Quick Start"
                description="Get up and running in minutes."
              />
              <GuideCard
                icon={<DownloadCloud className="h-6 w-6" />}
                title="Resources"
                description="Download guides and access support."
              />
            </div>
          </div>
        </section>
        {/* Enterprise Performance */}
        <section className="border-t border-white/10 bg-[var(--bg)] py-20">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-center text-3xl font-semibold">
              Enterprise Performance
            </h2>
            <p className="mx-auto mt-2 max-w-3xl text-center text-[var(--muted)]">
              Mission‑critical reliability with redundant infrastructure.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <StatsCard
                title="99.99% Uptime"
                description="Mission‑critical reliability with redundant infrastructure."
              />
              <StatsCard
                title="<50ms Response"
                description="Lightning‑fast performance optimised for real‑time operations."
              />
              <StatsCard
                title="24/7 Support"
                description="Dedicated support team available around the clock."
              />
            </div>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-[var(--surface-2)] text-[var(--muted)] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-16 grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-semibold text-[var(--text)]">
              StratusConnect
            </h3>
            <p className="mt-4 text-sm">
              The platform that's already processing millions in deals.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">Support</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Live Chat
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--text)]">Security</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#" className="hover:underline">
                  SOC 2 Compliant
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  End‑to‑End Encryption
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Trusted Escrow
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs">
          © {new Date().getFullYear()} StratusConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

/**
 * A generic feature card used in the "Why We're Different" section.
 */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--surface-1)] p-6 ring-1 ring-white/10 shadow-card hover:ring-[var(--brand)] transition">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand)]/20 text-[var(--brand)]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
          <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * A numbered step item used in the "How It Works" section.
 */
function StepItem({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)]/20 text-lg font-semibold text-[var(--brand)]">
        {number}
      </div>
      <div>
        <h4 className="text-base font-semibold text-[var(--text)]">{title}</h4>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
    </div>
  );
}

/**
 * A pricing card for the Transparent Pricing section.
 */
function PricingCard({
  icon,
  title,
  price,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  price: string;
  description: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl bg-[var(--surface-1)] p-6 ring-1 ring-white/10 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--fire)]/20 text-[var(--fire)]">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-[var(--text)]">{title}</h4>
      </div>
      <p className="mt-4 text-4xl font-bold text-[var(--fire)]">{price}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

/**
 * A privacy card for the Privacy by Design section.
 */
function PrivacyCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--surface-1)] p-6 ring-1 ring-white/10 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand)]/20 text-[var(--brand)]">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-[var(--text)]">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

/**
 * A guide card for the Master the Platform section.
 */
function GuideCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl bg-[var(--surface-1)] p-6 ring-1 ring-white/10 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--fire)]/20 text-[var(--fire)]">
          {icon}
        </div>
        <h4 className="text-lg font-semibold text-[var(--text)]">{title}</h4>
      </div>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}

/**
 * A simple stats card for the Enterprise Performance section.
 */
function StatsCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-start justify-center rounded-xl bg-[var(--surface-1)] p-6 ring-1 ring-white/10 shadow-card">
      <p className="text-3xl font-bold text-[var(--brand)]">{title}</p>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
    </div>
  );
}