import MarketplacePanel from "@/components/demo/MarketplacePanel";
import RequestsPanel from "@/components/demo/RequestsPanel";
import MessagingPanel from "@/components/demo/MessagingPanel";
import AnalyticsPanel from "@/components/demo/AnalyticsPanel";
import AlertsPanel from "@/components/demo/AlertsPanel";
import SavedJetsPanel from "@/components/demo/SavedJetsPanel";
import ProfilePanel from "@/components/demo/ProfilePanel";

export default function DemoBrokerTerminal() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        <div className="text-2xl font-bold text-foreground">Broker Demo Terminal</div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Marketplace</div>
              <MarketplacePanel />
            </section>

            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Requests and Quotes</div>
              <RequestsPanel />
            </section>

            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Messaging</div>
              <MessagingPanel />
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Analytics</div>
              <AnalyticsPanel />
            </section>

            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Alerts</div>
              <AlertsPanel />
            </section>

            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Saved Jets</div>
              <SavedJetsPanel />
            </section>

            <section>
              <div className="text-xl font-semibold mb-3 text-foreground">Profile</div>
              <ProfilePanel />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}