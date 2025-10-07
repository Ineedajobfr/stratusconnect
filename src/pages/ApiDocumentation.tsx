import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Code, Database, Globe, Key, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ApiDocumentation() {
  const navigate = useNavigate();

  const apiEndpoints = [
    {
      method: "GET",
      path: "/api/v1/deals",
      description: "Retrieve all deals for the authenticated user",
      category: "Deals"
    },
    {
      method: "POST",
      path: "/api/v1/deals",
      description: "Create a new deal",
      category: "Deals"
    },
    {
      method: "GET",
      path: "/api/v1/aircraft",
      description: "Get available aircraft listings",
      category: "Aircraft"
    },
    {
      method: "POST",
      path: "/api/v1/quotes",
      description: "Submit a new quote",
      category: "Quotes"
    },
    {
      method: "GET",
      path: "/api/v1/users/profile",
      description: "Get user profile information",
      category: "Users"
    },
    {
      method: "PUT",
      path: "/api/v1/users/profile",
      description: "Update user profile",
      category: "Users"
    }
  ];

  const codeExample = `// Example: Fetching deals
const response = await fetch('/api/v1/deals', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_TOKEN',
    'Content-Type': 'application/json'
  }
});

const deals = await response.json();
console.log(deals);`;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cinematic Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139, 69, 19, 0.9) 0%, rgba(91, 30, 13, 0.95) 25%, rgba(59, 30, 13, 0.98) 50%, rgba(20, 20, 20, 0.99) 75%, rgba(10, 10, 12, 1) 100%), linear-gradient(135deg, #3b1e0d 0%, #2d1a0a 25%, #1a0f08 50%, #0f0a06 75%, #0a0a0c 100%)',
        }}
      />
      {/* Animated overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-slate-900/20 to-slate-900/40" />
      <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/10 via-transparent to-orange-900/10" />
      
      <div className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6 text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
            <p className="text-white/80 text-lg">Integrate with StratusConnect using our RESTful API</p>
          </div>

          {/* Quick Start */}
          <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-amber-500" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Key className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">1. Get API Key</h3>
                  <p className="text-white/70">Generate your API key from the dashboard</p>
                </div>
                <div className="text-center">
                  <Code className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">2. Make Requests</h3>
                  <p className="text-white/70">Use REST endpoints with your API key</p>
                </div>
                <div className="text-center">
                  <Database className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">3. Get Data</h3>
                  <p className="text-white/70">Receive JSON responses with your data</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication */}
          <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-6 h-6 mr-2 text-amber-500" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70 mb-4">
                All API requests require authentication using a Bearer token in the Authorization header.
              </p>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <code className="text-green-400">
                  Authorization: Bearer YOUR_API_TOKEN
                </code>
              </div>
            </CardContent>
          </Card>

          {/* Code Example */}
          <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Code className="w-6 h-6 mr-2 text-amber-500" />
                Example Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <pre className="text-green-400 text-sm overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints */}
          <Card className="mb-8 bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-6 h-6 mr-2 text-amber-500" />
                API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg border border-slate-700">
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 rounded text-xs font-mono ${
                        endpoint.method === 'GET' ? 'bg-green-600 text-white' :
                        endpoint.method === 'POST' ? 'bg-blue-600 text-white' :
                        endpoint.method === 'PUT' ? 'bg-yellow-600 text-black' :
                        'bg-red-600 text-white'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-amber-400 font-mono">{endpoint.path}</code>
                      <span className="text-white/60">{endpoint.description}</span>
                    </div>
                    <span className="text-white/40 text-sm">{endpoint.category}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-amber-500" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">SDKs & Libraries</h3>
                  <ul className="space-y-2 text-white/70">
                    <li>• JavaScript SDK</li>
                    <li>• Python SDK</li>
                    <li>• PHP SDK</li>
                    <li>• Ruby SDK</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Support</h3>
                  <ul className="space-y-2 text-white/70">
                    <li>• API Status Page</li>
                    <li>• Rate Limits</li>
                    <li>• Error Codes</li>
                    <li>• Contact Support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
