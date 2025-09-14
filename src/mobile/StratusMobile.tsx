import React, { useMemo, useState } from "react";
import { Search, Home, Briefcase, MessageCircle, Wallet, Plus, Bell, Filter, CheckCircle2, Plane, Clock, Shield, ChevronRight, Star, Users2, Upload, FileText, ShieldCheck, Calendar, Map, Send } from "lucide-react";

// StratusConnect Mobile Shell
// Goal: Overhaul mobile experience with a LinkedIn-like flow while leaving desktop unchanged.
// Pattern: Top search plus alerts, card-first lists, bottom tab bar, floating primary action.
// Tailwind required. No external design system.

// Token palette
const brand = {
  bg: "bg-[#0A0F1F]", // deep night blue
  panel: "bg-white/3 backdrop-blur",
  card: "bg-white/5",
  ink: "text-white/90",
  mute: "text-white/60",
  gold: "text-[#E0C072]",
  accent: "bg-[#E0C072]",
};

// Demo data
const demoRFQs = [
  {
    id: "rfq-921",
    route: "LON → NCE",
    date: "22 Sep, 09:00",
    pax: 6,
    type: "Super Light",
    budget: "£14,800",
    quotes: 3,
    status: "Awaiting quotes",
  },
  {
    id: "rfq-922",
    route: "LHR → DXB",
    date: "05 Oct, 21:30",
    pax: 9,
    type: "Super Mid",
    budget: "£58,400",
    quotes: 5,
    status: "Negotiating",
  },
];

const demoJets = [
  {
    id: "jet-1",
    title: "Phenom 300E",
    meta: "Range 2,000 nm • Seats 7",
    price: "From £3,600 hr",
    badge: "Verified Operator",
    base: "Farnborough EGLF",
  },
  {
    id: "jet-2",
    title: "Challenger 350",
    meta: "Range 3,200 nm • Seats 9",
    price: "From £5,800 hr",
    badge: "IS-BAO Stage II",
    base: "Luton EGGW",
  },
];

const demoMessages = [
  {
    id: "msg-1",
    name: "AeroPrime Ops",
    last: "Understood. Can release funds when client approves the final manifest.",
    time: "12:41",
    unread: 2,
  },
  {
    id: "msg-2",
    name: "Falcon Wings",
    last: "G650 available for your MIA-LHR route. Quote attached.",
    time: "11:23",
    unread: 0,
  },
];

const demoWallet = {
  escrow: "£127,400",
  available: "£23,100",
  pending: "£89,300",
  fees: "£15,000",
};

const tabs = [
  { id: "home", label: "Home", icon: Home },
  { id: "market", label: "Market", icon: Briefcase },
  { id: "requests", label: "Requests", icon: FileText },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export default function StratusMobile() {
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");

  const renderHome = () => (
    <div className="space-y-4">
      {/* Starfield Header */}
      <div className={`${brand.bg} relative overflow-hidden rounded-xl p-6`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-12 w-1 h-1 bg-white rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-6 left-16 w-1 h-1 bg-white rounded-full animate-pulse delay-2000"></div>
          <div className="absolute bottom-4 right-8 w-1 h-1 bg-white rounded-full animate-pulse delay-500"></div>
        </div>
        <div className="relative">
          <h1 className={`${brand.ink} text-2xl font-bold mb-2`}>StratusConnect</h1>
          <p className={`${brand.mute} text-sm`}>Elite Aviation Brokerage</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`${brand.card} rounded-xl p-4`}>
          <div className={`${brand.mute} text-xs mb-1`}>Active Requests</div>
          <div className={`${brand.ink} text-xl font-bold`}>3</div>
        </div>
        <div className={`${brand.card} rounded-xl p-4`}>
          <div className={`${brand.mute} text-xs mb-1`}>Quotes Received</div>
          <div className={`${brand.ink} text-xl font-bold`}>12</div>
        </div>
      </div>

      {/* Live Opportunities */}
      <div>
        <h2 className={`${brand.ink} text-lg font-semibold mb-3`}>Live Opportunities</h2>
        <div className="space-y-3">
          {demoJets.map((jet) => (
            <div key={jet.id} className={`${brand.card} rounded-xl p-4`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className={`${brand.ink} font-semibold`}>{jet.title}</h3>
                  <p className={`${brand.mute} text-sm`}>{jet.meta}</p>
                </div>
                <div className="text-right">
                  <div className={`${brand.gold} font-semibold text-sm`}>{jet.price}</div>
                  <div className={`${brand.mute} text-xs`}>{jet.base}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={`${brand.panel} px-2 py-1 rounded-full text-xs ${brand.ink}`}>
                  {jet.badge}
                </span>
                <button className={`${brand.accent} text-black px-4 py-2 rounded-lg text-sm font-medium`}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="space-y-4">
      {/* Filters */}
      <div className={`${brand.panel} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${brand.ink} font-semibold`}>Market Filters</h2>
          <Filter className={`${brand.mute} h-4 w-4`} />
        </div>
        <div className="flex space-x-2">
          <button className={`${brand.card} px-3 py-2 rounded-lg text-sm ${brand.ink}`}>
            All Types
          </button>
          <button className={`${brand.card} px-3 py-2 rounded-lg text-sm ${brand.mute}`}>
            Light Jets
          </button>
          <button className={`${brand.card} px-3 py-2 rounded-lg text-sm ${brand.mute}`}>
            Heavy Jets
          </button>
        </div>
      </div>

      {/* Market Feed */}
      <div className="space-y-3">
        {demoJets.map((jet) => (
          <div key={jet.id} className={`${brand.card} rounded-xl p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`${brand.accent} p-2 rounded-lg`}>
                  <Plane className="h-5 w-5 text-black" />
                </div>
                <div>
                  <h3 className={`${brand.ink} font-semibold`}>{jet.title}</h3>
                  <p className={`${brand.mute} text-sm`}>{jet.meta}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`${brand.gold} font-semibold`}>{jet.price}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className={`${brand.mute} h-4 w-4`} />
                <span className={`${brand.mute} text-sm`}>{jet.badge}</span>
              </div>
              <button className={`${brand.accent} text-black px-4 py-2 rounded-lg text-sm font-medium`}>
                Request Quote
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRequests = () => (
    <div className="space-y-4">
      {/* Request Status */}
      <div className={`${brand.panel} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3">
          <h2 className={`${brand.ink} font-semibold`}>Your Requests</h2>
          <button className={`${brand.accent} text-black px-3 py-1 rounded-lg text-sm font-medium`}>
            New RFQ
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className={`${brand.ink} text-lg font-bold`}>3</div>
            <div className={`${brand.mute} text-xs`}>Active</div>
          </div>
          <div className="text-center">
            <div className={`${brand.ink} text-lg font-bold`}>12</div>
            <div className={`${brand.mute} text-xs`}>Quotes</div>
          </div>
          <div className="text-center">
            <div className={`${brand.ink} text-lg font-bold`}>2</div>
            <div className={`${brand.mute} text-xs`}>Booked</div>
          </div>
        </div>
      </div>

      {/* Request Feed */}
      <div className="space-y-3">
        {demoRFQs.map((rfq) => (
          <div key={rfq.id} className={`${brand.card} rounded-xl p-4`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className={`${brand.ink} font-semibold`}>{rfq.route}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Calendar className={`${brand.mute} h-3 w-3`} />
                  <span className={`${brand.mute} text-sm`}>{rfq.date}</span>
                  <Users2 className={`${brand.mute} h-3 w-3 ml-2`} />
                  <span className={`${brand.mute} text-sm`}>{rfq.pax} pax</span>
                </div>
              </div>
              <div className="text-right">
                <div className={`${brand.gold} font-semibold`}>{rfq.budget}</div>
                <div className={`${brand.mute} text-xs`}>{rfq.type}</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className={`${brand.mute} h-4 w-4`} />
                <span className={`${brand.mute} text-sm`}>{rfq.quotes} quotes</span>
              </div>
              <span className={`${brand.panel} px-2 py-1 rounded-full text-xs ${brand.ink}`}>
                {rfq.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessages = () => (
    <div className="space-y-3">
      {demoMessages.map((msg) => (
        <div key={msg.id} className={`${brand.card} rounded-xl p-4`}>
          <div className="flex items-start space-x-3">
            <div className={`${brand.accent} p-2 rounded-full`}>
              <Users2 className="h-4 w-4 text-black" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`${brand.ink} font-semibold`}>{msg.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`${brand.mute} text-xs`}>{msg.time}</span>
                  {msg.unread > 0 && (
                    <span className={`${brand.accent} text-black px-2 py-1 rounded-full text-xs font-medium`}>
                      {msg.unread}
                    </span>
                  )}
                </div>
              </div>
              <p className={`${brand.mute} text-sm line-clamp-2`}>{msg.last}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWallet = () => (
    <div className="space-y-4">
      {/* Wallet Overview */}
      <div className={`${brand.panel} rounded-xl p-4`}>
        <h2 className={`${brand.ink} font-semibold mb-4`}>Wallet Overview</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className={`${brand.card} rounded-lg p-3`}>
            <div className={`${brand.mute} text-xs mb-1`}>Available</div>
            <div className={`${brand.gold} font-bold text-lg`}>{demoWallet.available}</div>
          </div>
          <div className={`${brand.card} rounded-lg p-3`}>
            <div className={`${brand.mute} text-xs mb-1`}>In Escrow</div>
            <div className={`${brand.gold} font-bold text-lg`}>{demoWallet.escrow}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`${brand.card} rounded-xl p-4`}>
        <h3 className={`${brand.ink} font-semibold mb-3`}>Quick Actions</h3>
        <div className="space-y-3">
          <button className={`${brand.panel} w-full p-3 rounded-lg flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <Upload className={`${brand.mute} h-4 w-4`} />
              <span className={`${brand.ink}`}>Add Funds</span>
            </div>
            <ChevronRight className={`${brand.mute} h-4 w-4`} />
          </button>
          <button className={`${brand.panel} w-full p-3 rounded-lg flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <Send className={`${brand.mute} h-4 w-4`} />
              <span className={`${brand.ink}`}>Send Payment</span>
            </div>
            <ChevronRight className={`${brand.mute} h-4 w-4`} />
          </button>
          <button className={`${brand.panel} w-full p-3 rounded-lg flex items-center justify-between`}>
            <div className="flex items-center space-x-3">
              <FileText className={`${brand.mute} h-4 w-4`} />
              <span className={`${brand.ink}`}>Transaction History</span>
            </div>
            <ChevronRight className={`${brand.mute} h-4 w-4`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "home": return renderHome();
      case "market": return renderMarket();
      case "requests": return renderRequests();
      case "messages": return renderMessages();
      case "wallet": return renderWallet();
      default: return renderHome();
    }
  };

  return (
    <div className={`${brand.bg} min-h-screen`}>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-[#0A0F1F]/95 backdrop-blur border-b border-white/10">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`${brand.accent} p-2 rounded-lg`}>
              <Plane className="h-5 w-5 text-black" />
            </div>
            <h1 className={`${brand.ink} text-xl font-bold`}>StratusConnect</h1>
            <div className="flex-1" />
            <button className={`${brand.panel} p-2 rounded-lg`}>
              <Bell className={`${brand.ink} h-5 w-5`} />
            </button>
          </div>
          <div className="relative">
            <Search className={`${brand.mute} absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4`} />
            <input
              type="text"
              placeholder="Search jets, routes, operators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${brand.card} w-full pl-10 pr-4 py-3 rounded-xl ${brand.ink} placeholder-white/40 border-none focus:outline-none focus:ring-2 focus:ring-[#E0C072]/50`}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pb-20">
        <div className="p-4">
          {renderContent()}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className={`${brand.accent} fixed bottom-20 right-4 p-4 rounded-full shadow-lg`}>
        <Plus className="h-6 w-6 text-black" />
      </button>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0F1F]/95 backdrop-blur border-t border-white/10">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-3 px-2 ${
                  isActive ? brand.gold : brand.mute
                }`}
                aria-label={tab.label}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-[#E0C072]' : 'text-white/60'}`} />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
