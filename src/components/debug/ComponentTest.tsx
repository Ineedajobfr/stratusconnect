import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const ComponentTest: React.FC = () => {
  const [testResults, setTestResults] = React.useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];
    
    try {
      // Test ChatGPT Service
      const { chatGPTService } = require('@/services/chatgptService');
      results.push('✅ ChatGPT Service: Loaded');
    } catch (error) {
      results.push(`❌ ChatGPT Service: ${error}`);
    }

    try {
      // Test Market Intelligence
      const { MarketIntelligence } = require('@/components/market/MarketIntelligence');
      results.push('✅ Market Intelligence: Loaded');
    } catch (error) {
      results.push(`❌ Market Intelligence: ${error}`);
    }

    try {
      // Test Modern Help Guide
      const { ModernHelpGuide } = require('@/components/ModernHelpGuide');
      results.push('✅ Modern Help Guide: Loaded');
    } catch (error) {
      results.push(`❌ Modern Help Guide: ${error}`);
    }

    try {
      // Test ChatGPTHelper
      const { ChatGPTHelper } = require('@/components/ai/ChatGPTHelper');
      results.push('✅ ChatGPTHelper: Loaded');
    } catch (error) {
      results.push(`❌ ChatGPTHelper: ${error}`);
    }

    setTestResults(results);
  };

  return (
    <Card className="card-predictive">
      <CardHeader>
        <CardTitle>Component Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runTests} className="mb-4">
          Run Component Tests
        </Button>
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm">
              {result}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
