import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StatCard } from "@/components/ui/StatCard";
import { StepCard } from "@/components/ui/StepCard";
import { Section } from "@/components/ui/Section";

export default function About() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "About | StratusConnect";
    
    // Analytics tracking
    if (window.analytics?.track) {
      window.analytics.track("about_viewed");
    }
  }, []);

  const handleJoinClick = () => {
    if (window.analytics?.track) {
      window.analytics.track("cta_join_clicked");
    }
    navigate("/enter");
  };

  const handleDemoClick = () => {
    if (window.analytics?.track) {
      window.analytics.track("cta_demo_clicked");
    }
    navigate("/demo");
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">About StratusConnect</h1>
        <p className="mt-6 text-lg text-neutral-300 max-w-3xl">
          We are the hand that lifts you out of the sea. To pull yourself onto the boat, you must go all in for you.
          StratusConnect exists for professionals who choose discipline over noise and results over talk.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 border-t border-neutral-800">
        <h2 className="text-2xl font-semibold">From quiet post to living platform</h2>
        <p className="mt-4 text-neutral-300 max-w-3xl">
          This began as a simple LinkedIn project. Quiet. Focused. Built in plain sight. It grew into a global platform
          for private aviation. No personalities. No spotlight. Only a clear standard and the work to match it.
        </p>
      </section>

      <Section title="What we do">
        <p className="mt-4 text-neutral-300 max-w-3xl">
          StratusConnect is the command centre for private aviation. Brokers, operators, pilots and crew meet in one
          secure place where deals move fast, records are clean, and everyone is accountable.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard 
            title="For brokers" 
            body="Real availability. Faster answers. Clean execution." 
          />
          <StatCard 
            title="For operators" 
            body="Clean demand. Clear terms. Less friction." 
          />
          <StatCard 
            title="For pilots and crew" 
            body="Verified profiles. Direct hiring. Free to join." 
          />
        </div>
      </Section>

      <Section title="How it works">
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <StepCard 
            title="Verification first" 
            body="KYC and AML at the door."
            stepNumber={1}
          />
          <StepCard 
            title="Signal" 
            body="Live requests and true availability."
            stepNumber={2}
          />
          <StepCard 
            title="Negotiate" 
            body="Recorded chat with signed quote PDFs."
            stepNumber={3}
          />
          <StepCard 
            title="Commit" 
            body="Deposit before contact to prevent time wasting and undercutting."
            stepNumber={4}
          />
          <StepCard 
            title="Close" 
            body="Immutable receipts, audit logs, and performance scoring."
            stepNumber={5}
            className="md:col-span-2"
          />
        </div>
      </Section>

      <Section title="The standard">
        <ul className="mt-4 space-y-3 text-neutral-300">
          <li>Evidence by default. Signed quotes and immutable receipts.</li>
          <li>Least privilege access. Encrypted storage. Rigorous audit logging.</li>
          <li>Zero tolerance for games. Strike system for bad actors.</li>
          <li>Abide by the laws of this platform and be rewarded.</li>
        </ul>
      </Section>

      <Section title="Fees">
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard 
            title="Charters" 
            body="Flat 7 percent platform fee shared by broker and operator on completion."
          />
          <StatCard 
            title="Hires" 
            body="Ten percent fee paid by the hiring party."
          />
          <StatCard 
            title="Pilots and crew" 
            body="Free to join."
          />
        </div>
      </Section>

      <Section title="Global from day one" className="py-16">
        <p className="mt-4 text-neutral-300 max-w-3xl">
          Aviation knows no borders. Neither do we. The platform is live. The demo is live. See how it moves when trust
          and speed work together.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={handleJoinClick}
            className="rounded-2xl bg-white text-neutral-950 px-5 py-3 text-sm font-semibold hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-950 transition-colors"
            aria-label="Join the StratusConnect platform"
          >
            Join the platform
          </button>
          <button
            onClick={handleDemoClick}
            className="rounded-2xl border border-neutral-800 px-5 py-3 text-sm font-semibold hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-600 focus:ring-offset-2 focus:ring-offset-neutral-950 transition-colors"
            aria-label="View live StratusConnect demo"
          >
            View live demo
          </button>
        </div>
      </Section>
    </main>
  );
}