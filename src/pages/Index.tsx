import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Index() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [cookiesAccepted, setCookiesAccepted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-slate-950">
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 200 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="relative z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">StratusConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ChevronLeft className="w-4 h-4 text-slate-400" />
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="text-white hover:text-slate-300 transition-colors"
              >
                Log in
              </button>
              <Button 
                onClick={() => navigate('/signup')}
                className="bg-white text-slate-950 hover:bg-slate-100 px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign up
              </Button>
              <Button 
                onClick={() => navigate('/demo')}
                className="bg-slate-800 text-white hover:bg-slate-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                Demo
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center">
          <div className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tight">
            <div className="text-2xl md:text-3xl mb-4">Welcome to</div>
            <div className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              STRATUS
            </div>
            <div className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              CONNECT
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Consent Banner */}
      {!cookiesAccepted && (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 p-4 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-sm text-slate-300">
              Essential cookies only. Strict settings by default. No tracking without consent.
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setCookiesAccepted(true)}
                className="bg-slate-700 text-white hover:bg-slate-600 px-4 py-2 rounded-md text-sm"
              >
                Essential only
              </Button>
              <Button 
                onClick={() => setCookiesAccepted(true)}
                className="bg-white text-slate-950 hover:bg-slate-100 px-4 py-2 rounded-md text-sm"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}