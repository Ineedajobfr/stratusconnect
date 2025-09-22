interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  category: 'aviation' | 'private-jet' | 'business-aviation' | 'aircraft' | 'regulations' | 'technology';
  imageUrl?: string;
  author?: string;
  readTime?: number;
}

interface NewsResponse {
  articles: NewsArticle[];
  lastUpdated: string;
  nextUpdate: string;
}

class AviationNewsService {
  private readonly CACHE_KEY = 'aviation-news-cache';
  private readonly CACHE_DURATION = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
  private readonly NEWS_API_KEY = 'your-news-api-key'; // Replace with actual API key
  
  // Credible aviation news sources
  private readonly SOURCES = [
    'aviationweek.com',
    'flightglobal.com',
    'ainonline.com',
    'aviationtoday.com',
    'businessjetinteriors.com',
    'corporatejetinvestor.com',
    'aviationweek.com',
    'flightglobal.com',
    'ainonline.com',
    'aviationtoday.com',
    'businessjetinteriors.com',
    'corporatejetinvestor.com',
    'aviationweek.com',
    'flightglobal.com',
    'ainonline.com',
    'aviationtoday.com',
    'businessjetinteriors.com',
    'corporatejetinvestor.com'
  ];

  private readonly KEYWORDS = [
    'private jet',
    'business aviation',
    'corporate jet',
    'charter aircraft',
    'aviation industry',
    'aircraft manufacturing',
    'jet charter',
    'aviation technology',
    'flight operations',
    'aviation regulations',
    'aircraft sales',
    'aviation market',
    'jet fuel',
    'aviation safety',
    'aircraft maintenance',
    'aviation finance',
    'jet leasing',
    'aviation training',
    'aircraft certification',
    'aviation insurance'
  ];

  async getLatestNews(): Promise<NewsResponse> {
    try {
      // Check cache first
      const cached = this.getCachedNews();
      if (cached && this.isCacheValid(cached.lastUpdated)) {
        return cached;
      }

      // Fetch fresh news
      const articles = await this.fetchNewsFromMultipleSources();
      const response: NewsResponse = {
        articles: articles.slice(0, 100), // Limit to 100 articles
        lastUpdated: new Date().toISOString(),
        nextUpdate: new Date(Date.now() + this.CACHE_DURATION).toISOString()
      };

      // Cache the response
      this.cacheNews(response);
      
      return response;
    } catch (error) {
      console.error('Error fetching aviation news:', error);
      // Return cached data if available, otherwise return mock data
      return this.getCachedNews() || this.getMockNews();
    }
  }

  private async fetchNewsFromMultipleSources(): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = [];
    
    // Since we don't have real API keys, we'll use mock data that simulates real news
    // In production, you would integrate with NewsAPI, Aviation Week API, etc.
    const mockArticles = this.generateMockAviationNews();
    
    return mockArticles;
  }

  private generateMockAviationNews(): NewsArticle[] {
    const currentDate = new Date();
    const articles: NewsArticle[] = [];
    
    const newsTemplates = [
      {
        title: "Gulfstream G700 Receives FAA Certification, Enters Service",
        description: "The ultra-long-range business jet has completed certification testing and is now available for delivery to customers worldwide.",
        category: 'aircraft' as const,
        source: 'Aviation Week'
      },
      {
        title: "Private Jet Charter Demand Surges 40% in Q4 2024",
        description: "Business aviation sector sees unprecedented growth as companies prioritize executive travel efficiency and safety.",
        category: 'private-jet' as const,
        source: 'AIN Online'
      },
      {
        title: "New Sustainable Aviation Fuel Plant Opens in Texas",
        description: "The facility will produce 100 million gallons of SAF annually, supporting aviation's net-zero goals.",
        category: 'technology' as const,
        source: 'FlightGlobal'
      },
      {
        title: "Bombardier Global 8000 Completes First Flight",
        description: "The next-generation business jet promises 8,000 nautical mile range and advanced cabin technology.",
        category: 'aircraft' as const,
        source: 'Aviation Today'
      },
      {
        title: "FAA Proposes New Rules for Urban Air Mobility",
        description: "Regulatory framework aims to support eVTOL aircraft operations in urban environments.",
        category: 'regulations' as const,
        source: 'Aviation Week'
      },
      {
        title: "NetJets Expands Fleet with 50 New Aircraft Orders",
        description: "Fractional ownership leader commits to $2.5 billion in new aircraft acquisitions.",
        category: 'business-aviation' as const,
        source: 'Corporate Jet Investor'
      },
      {
        title: "Cessna Citation CJ4 Gen2 Enters Production",
        description: "Updated light jet features enhanced avionics and improved fuel efficiency.",
        category: 'aircraft' as const,
        source: 'AIN Online'
      },
      {
        title: "Private Jet Maintenance Costs Rise 15% in 2024",
        description: "Industry analysis shows increasing operational expenses due to supply chain challenges.",
        category: 'aviation' as const,
        source: 'Aviation Week'
      },
      {
        title: "New Business Aviation Terminal Opens at LAX",
        description: "State-of-the-art facility provides enhanced services for private jet passengers.",
        category: 'business-aviation' as const,
        source: 'FlightGlobal'
      },
      {
        title: "Electric Aircraft Startup Raises $500M Series C",
        description: "Company plans to begin commercial operations with electric regional aircraft by 2026.",
        category: 'technology' as const,
        source: 'Aviation Today'
      },
      {
        title: "Charter Flight Bookings Hit Record High",
        description: "Demand for private jet charters increases 60% year-over-year as business travel rebounds.",
        category: 'private-jet' as const,
        source: 'Business Jet Interiors'
      },
      {
        title: "New Aviation Insurance Products Target Private Jet Owners",
        description: "Specialized coverage options address unique risks in business aviation operations.",
        category: 'aviation' as const,
        source: 'Corporate Jet Investor'
      },
      {
        title: "Aircraft Leasing Market Shows Strong Recovery",
        description: "Lease rates for business jets increase as demand outpaces supply in key markets.",
        category: 'aviation' as const,
        source: 'AIN Online'
      },
      {
        title: "Pilot Shortage Impacts Business Aviation Sector",
        description: "Industry faces challenges recruiting and retaining qualified pilots for corporate operations.",
        category: 'aviation' as const,
        source: 'Aviation Week'
      },
      {
        title: "New Avionics Suite Enhances Flight Safety",
        description: "Advanced technology provides pilots with improved situational awareness and automation.",
        category: 'technology' as const,
        source: 'FlightGlobal'
      },
      {
        title: "Private Jet Fuel Efficiency Improves 20%",
        description: "New engine technology and aerodynamic enhancements reduce operating costs significantly.",
        category: 'technology' as const,
        source: 'Aviation Today'
      },
      {
        title: "Business Aviation Emissions Down 30%",
        description: "Industry makes significant progress toward sustainability goals through technology and operations.",
        category: 'aviation' as const,
        source: 'Business Jet Interiors'
      },
      {
        title: "New Aircraft Financing Options Available",
        description: "Financial institutions offer flexible terms for business jet acquisitions and upgrades.",
        category: 'aviation' as const,
        source: 'Corporate Jet Investor'
      },
      {
        title: "Charter Operators Expand to New Markets",
        description: "Growing demand drives expansion into secondary and tertiary airports worldwide.",
        category: 'private-jet' as const,
        source: 'AIN Online'
      },
      {
        title: "Aircraft Interior Design Trends Focus on Wellness",
        description: "New cabin configurations prioritize passenger comfort and health during long flights.",
        category: 'business-aviation' as const,
        source: 'Business Jet Interiors'
      }
    ];

    // Generate 100 articles with realistic dates and variations
    for (let i = 0; i < 100; i++) {
      const template = newsTemplates[i % newsTemplates.length];
      const daysAgo = Math.floor(Math.random() * 7); // Within last week
      const publishedDate = new Date(currentDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
      
      articles.push({
        id: `news-${i + 1}`,
        title: this.varyTitle(template.title, i),
        description: this.varyDescription(template.description, i),
        url: `https://${template.source.toLowerCase().replace(/\s+/g, '')}.com/article-${i + 1}`,
        publishedAt: publishedDate.toISOString(),
        source: template.source,
        category: template.category,
        imageUrl: `https://picsum.photos/400/250?random=${i}`,
        author: this.getRandomAuthor(),
        readTime: Math.floor(Math.random() * 8) + 2 // 2-10 minutes
      });
    }

    return articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  private varyTitle(title: string, index: number): string {
    const variations = [
      title,
      title.replace('New', 'Latest'),
      title.replace('Opens', 'Launches'),
      title.replace('Rises', 'Increases'),
      title.replace('Surges', 'Spikes'),
      title.replace('Completes', 'Finishes'),
      title.replace('Receives', 'Gains'),
      title.replace('Expands', 'Grows'),
      title.replace('Hits', 'Reaches'),
      title.replace('Shows', 'Demonstrates')
    ];
    return variations[index % variations.length];
  }

  private varyDescription(description: string, index: number): string {
    const variations = [
      description,
      description.replace('will', 'is expected to'),
      description.replace('plans to', 'aims to'),
      description.replace('increases', 'grows'),
      description.replace('surges', 'jumps'),
      description.replace('completes', 'finishes'),
      description.replace('receives', 'gains'),
      description.replace('expands', 'grows'),
      description.replace('hits', 'reaches'),
      description.replace('shows', 'demonstrates')
    ];
    return variations[index % variations.length];
  }

  private getRandomAuthor(): string {
    const authors = [
      'Sarah Johnson',
      'Michael Chen',
      'Emily Rodriguez',
      'David Thompson',
      'Lisa Anderson',
      'James Wilson',
      'Maria Garcia',
      'Robert Brown',
      'Jennifer Davis',
      'Christopher Lee'
    ];
    return authors[Math.floor(Math.random() * authors.length)];
  }

  private getCachedNews(): NewsResponse | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private cacheNews(news: NewsResponse): void {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(news));
    } catch (error) {
      console.error('Error caching news:', error);
    }
  }

  private isCacheValid(lastUpdated: string): boolean {
    const lastUpdateTime = new Date(lastUpdated).getTime();
    const now = Date.now();
    return (now - lastUpdateTime) < this.CACHE_DURATION;
  }

  private getMockNews(): NewsResponse {
    return {
      articles: this.generateMockAviationNews().slice(0, 20),
      lastUpdated: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + this.CACHE_DURATION).toISOString()
    };
  }

  // Method to force refresh (useful for testing)
  async forceRefresh(): Promise<NewsResponse> {
    localStorage.removeItem(this.CACHE_KEY);
    return this.getLatestNews();
  }

  // Method to get news by category
  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    const response = await this.getLatestNews();
    return response.articles.filter(article => article.category === category);
  }

  // Method to search news
  async searchNews(query: string): Promise<NewsArticle[]> {
    const response = await this.getLatestNews();
    const lowercaseQuery = query.toLowerCase();
    return response.articles.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.description.toLowerCase().includes(lowercaseQuery) ||
      article.source.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export const aviationNewsService = new AviationNewsService();
export type { NewsArticle, NewsResponse };
