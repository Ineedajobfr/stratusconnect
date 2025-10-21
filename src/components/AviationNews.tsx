import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface NewsItem {
  id: string;
  source: string;
  title: string;
  summary: string;
  url: string;
}

export const AviationNews = () => {
  const [news] = useState<NewsItem[]>([
    {
      id: '1',
      source: 'Bloomberg',
      title: 'Private Jet Owners Order Safety Checks After Air India Crash',
      summary: 'Spooked by the Air India plane crash, private jet owners are doubling down on safety precautions with special one-time audits...',
      url: 'https://www.bloomberg.com/news/articles/2025-07-02/private-jet-owners-order-safety-checks-after-air-india-crash'
    },
    {
      id: '2',
      source: 'Reuters',
      title: 'Bombardier Revenue Dips While Profits Rise on Jet Demand',
      summary: 'High deliveries and strong demand boost net income beyond expectations as private jet market remains robust...',
      url: 'https://www.reuters.com/business/aerospace-defense/bombardiers-second-quarter-revenue-dips-while-profits-rise-2025-07-31/'
    },
    {
      id: '3',
      source: 'Aviation Week',
      title: 'Business Aviation Leaders\' Predictions For 2025',
      summary: 'Industry leaders share insights on the biggest challenges and achievements expected in business aviation this year...',
      url: 'https://aviationweek.com/business-aviation/safety-ops-regulation/business-aviation-leaders-predictions-2025'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="terminal-subheader">Latest Aviation News</h3>
        <div className="flex items-center space-x-2 text-green-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full terminal-pulse"></div>
          <span className="font-mono text-xs">LIVE FEED</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="terminal-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="terminal-label mr-3">{item.source}</div>
                </div>
                <h4 className="text-white font-semibold mb-2 hover:text-blue-400 transition-colors">
                  <a 
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    {item.title}
                    <ExternalLink className="w-4 h-4 ml-2 opacity-60" />
                  </a>
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.summary}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
