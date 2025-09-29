// AI Intelligence Demo Component
// Shows the intelligence capabilities in action
// FCA Compliant Aviation Platform

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  Target, 
  DollarSign, 
  BarChart3, 
  AlertCircle,
  Zap,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { aiIntelligenceService, AIAnalysis } from '@/lib/ai-intelligence-service';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  userMessage: string;
  expectedAnalysis: Partial<AIAnalysis>;
  terminalType: 'broker' | 'operator' | 'pilot' | 'crew';
}

const demoScenarios: DemoScenario[] = [
  {
    id: 'market-analysis',
    title: 'Market Intelligence',
    description: 'Real-time market analysis with confidence scoring',
    userMessage: 'Show me current market trends for Gulfstream G650s',
    expectedAnalysis: {
      type: 'market_analysis',
      confidence: 0.92,
      insights: [
        'Market showing strong recovery with 15.3% demand increase',
        'Transatlantic routes leading growth at 22% YoY',
        'Premium aircraft (Gulfstream, Falcon) seeing highest demand'
      ]
    },
    terminalType: 'broker'
  },
  {
    id: 'route-optimization',
    title: 'Route Optimization',
    description: 'Advanced efficiency and cost analysis',
    userMessage: 'Optimize my LHR-JFK route for fuel efficiency',
    expectedAnalysis: {
      type: 'route_optimization',
      confidence: 0.88,
      insights: [
        'Current route efficiency at 78% - significant optimization potential',
        'Alternative routing could save 12.5% on fuel costs',
        'Time reduction of 8.3% possible with optimized routing'
      ]
    },
    terminalType: 'operator'
  },
  {
    id: 'pricing-intelligence',
    title: 'Pricing Intelligence',
    description: 'Competitive pricing strategies and recommendations',
    userMessage: 'What should I charge for a Gulfstream G650 LHR-JFK?',
    expectedAnalysis: {
      type: 'pricing_insight',
      confidence: 0.95,
      insights: [
        'Current market rate: $12,500 for similar routes',
        'Competitor pricing ranges from $11,800 to $13,200',
        'Demand factor indicates 15% premium opportunity'
      ]
    },
    terminalType: 'broker'
  },
  {
    id: 'demand-forecast',
    title: 'Demand Forecasting',
    description: 'Future market predictions with confidence levels',
    userMessage: 'Forecast demand for transatlantic routes next quarter',
    expectedAnalysis: {
      type: 'demand_forecast',
      confidence: 0.87,
      insights: [
        'Demand forecast shows 12.5% growth over next 6 months',
        'Peak periods identified for June and September',
        'Transatlantic routes leading demand growth'
      ]
    },
    terminalType: 'operator'
  },
  {
    id: 'risk-assessment',
    title: 'Risk Assessment',
    description: 'Safety and compliance analysis',
    userMessage: 'Assess the risk for my Gulfstream operation',
    expectedAnalysis: {
      type: 'risk_assessment',
      confidence: 0.91,
      insights: [
        'Overall risk assessment: LOW',
        'Weather risk minimal for planned routes',
        'Operational risk well within acceptable limits'
      ]
    },
    terminalType: 'pilot'
  }
];

export default function AIIntelligenceDemo() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const scenario = demoScenarios[currentScenario];

  useEffect(() => {
    const initDemo = async () => {
      const id = await aiIntelligenceService.initializeConversation(scenario.terminalType);
      setConversationId(id);
    };
    initDemo();
  }, [scenario.terminalType]);

  const runDemo = async () => {
    if (!conversationId) return;
    
    setIsRunning(true);
    setStep(0);
    setAnalysis(null);

    // Step 1: Show user message
    setStep(1);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Show AI processing
    setStep(2);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Show analysis
    setStep(3);
    try {
      const response = await aiIntelligenceService.processMessage(conversationId, scenario.userMessage);
      if (response.metadata?.analysis) {
        setAnalysis(response.metadata.analysis);
      }
    } catch (error) {
      console.error('Demo error:', error);
    }

    setIsRunning(false);
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % demoScenarios.length);
    setAnalysis(null);
    setStep(0);
  };

  const resetDemo = () => {
    setAnalysis(null);
    setStep(0);
    setIsRunning(false);
  };

  const getStepIcon = (stepNumber: number) => {
    if (stepNumber < step) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (stepNumber === step) return <div className="w-5 h-5 border-2 border-accent rounded-full animate-pulse" />;
    return <div className="w-5 h-5 border-2 border-muted rounded-full" />;
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'market_analysis': return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'route_optimization': return <Target className="w-6 h-6 text-blue-500" />;
      case 'pricing_insight': return <DollarSign className="w-6 h-6 text-yellow-500" />;
      case 'demand_forecast': return <BarChart3 className="w-6 h-6 text-purple-500" />;
      case 'risk_assessment': return <AlertCircle className="w-6 h-6 text-red-500" />;
      default: return <Brain className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">AI Intelligence Demo</h1>
        <p className="text-muted-foreground">
          See the intelligence in action - Real-time analysis, predictions, and insights
        </p>
      </div>

      {/* Scenario Selector */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-accent" />
            <span>Scenario {currentScenario + 1} of {demoScenarios.length}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white">{scenario.title}</h3>
              <p className="text-muted-foreground">{scenario.description}</p>
            </div>
            
            <div className="flex space-x-2">
              <Button onClick={runDemo} disabled={isRunning} className="bg-accent hover:bg-accent/90">
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? 'Running...' : 'Run Demo'}
              </Button>
              <Button onClick={nextScenario} variant="outline">
                Next Scenario
              </Button>
              <Button onClick={resetDemo} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Steps */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-accent" />
            <span>AI Processing Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Step 1: User Input */}
            <div className="flex items-center space-x-4">
              {getStepIcon(1)}
              <div className="flex-1">
                <h4 className="font-semibold text-white">User Input</h4>
                <p className="text-sm text-muted-foreground">
                  "{scenario.userMessage}"
                </p>
              </div>
            </div>

            {/* Step 2: AI Processing */}
            <div className="flex items-center space-x-4">
              {getStepIcon(2)}
              <div className="flex-1">
                <h4 className="font-semibold text-white">AI Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Analyzing intent, extracting entities, generating insights...
                </p>
              </div>
            </div>

            {/* Step 3: Analysis Results */}
            <div className="flex items-center space-x-4">
              {getStepIcon(3)}
              <div className="flex-1">
                <h4 className="font-semibold text-white">Analysis Results</h4>
                <p className="text-sm text-muted-foreground">
                  {analysis ? 'Analysis complete!' : 'Waiting for analysis...'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getAnalysisIcon(analysis.type)}
              <span className="capitalize">{analysis.type.replace('_', ' ')} Analysis</span>
              <Badge variant="outline" className="ml-auto">
                {Math.round(analysis.confidence * 100)}% confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Insights */}
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-accent" />
                  <span>Key Insights</span>
                </h4>
                <ul className="space-y-1">
                  {analysis.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-accent flex-shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                  <Target className="w-4 h-4 text-accent" />
                  <span>Recommendations</span>
                </h4>
                <ul className="space-y-1">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                      <ArrowRight className="w-3 h-3 mt-1 text-accent flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Data Points */}
              <div>
                <h4 className="font-semibold text-white mb-2 flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <span>Data Points</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysis.data).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded-lg p-3">
                      <div className="text-xs text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Intelligence Features */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-accent" />
            <span>Intelligence Features</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Advanced NLP</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Intent extraction with confidence scoring</li>
                <li>• Entity recognition (aircraft, routes, dates)</li>
                <li>• Sentiment analysis</li>
                <li>• Context-aware responses</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Real-time Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Market trend analysis</li>
                <li>• Route optimization</li>
                <li>• Pricing intelligence</li>
                <li>• Demand forecasting</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Confidence Scoring</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 87-95% accuracy on predictions</li>
                <li>• Transparent decision making</li>
                <li>• Risk assessment indicators</li>
                <li>• Quality assurance metrics</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Terminal-Specific</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Broker: Market intelligence</li>
                <li>• Operator: Fleet optimization</li>
                <li>• Pilot: Career opportunities</li>
                <li>• Crew: Job matching</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
