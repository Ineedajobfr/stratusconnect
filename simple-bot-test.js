// SIMPLE STRATUSCONNECT BOT TESTING SYSTEM
// Uses HTTP requests to simulate real users without browser automation

import https from 'https';
import http from 'http';
import { URL } from 'url';

class SimpleBot {
  constructor(id, baseUrl = 'http://localhost:8082') {
    this.id = id;
    this.baseUrl = baseUrl;
    this.results = {
      terminalTests: [],
      errors: [],
      startTime: Date.now()
    };
  }

  async makeRequest(path) {
    return new Promise((resolve, reject) => {
      const url = new URL(path, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': `StratusConnectBot/${this.id} (Testing)`,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        },
        timeout: 30000
      };

      const startTime = Date.now();
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = Date.now();
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: data,
            loadTime: endTime - startTime,
            contentLength: data.length
          });
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.end();
    });
  }

  async testTerminal(path, terminalName) {
    try {
      console.log(`🔍 Bot ${this.id}: Testing ${terminalName}...`);
      
      const response = await this.makeRequest(path);
      
      // Analyze response
      const isSuccess = response.statusCode === 200;
      const hasContent = response.contentLength > 1000; // Should have substantial content
      const hasStratusContent = response.data.includes('stratus') || 
                               response.data.includes('terminal') ||
                               response.data.includes('broker') ||
                               response.data.includes('pilot') ||
                               response.data.includes('operator') ||
                               response.data.includes('crew');
      
      const testResult = {
        terminal: terminalName,
        path: path,
        success: isSuccess && hasContent && hasStratusContent,
        statusCode: response.statusCode,
        loadTime: response.loadTime,
        contentLength: response.contentLength,
        hasStratusContent: hasStratusContent,
        timestamp: new Date().toISOString()
      };

      this.results.terminalTests.push(testResult);
      
      if (testResult.success) {
        console.log(`✅ Bot ${this.id}: ${terminalName} - SUCCESS (${response.loadTime}ms, ${response.contentLength} bytes)`);
      } else {
        console.log(`❌ Bot ${this.id}: ${terminalName} - FAILED (Status: ${response.statusCode}, Content: ${response.contentLength} bytes)`);
      }

      return testResult;
    } catch (error) {
      console.error(`❌ Bot ${this.id}: ${terminalName} - ERROR -`, error.message);
      
      const testResult = {
        terminal: terminalName,
        path: path,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.results.terminalTests.push(testResult);
      this.results.errors.push({
        terminal: terminalName,
        path: path,
        error: error.message,
        timestamp: new Date().toISOString()
      });

      return testResult;
    }
  }

  async runFullTest() {
    console.log(`🚀 Bot ${this.id}: Starting full test suite...`);
    
    const terminals = [
      { path: '/', name: 'Home Page' },
      { path: '/demo/broker', name: 'Demo Broker Terminal' },
      { path: '/demo/operator', name: 'Demo Operator Terminal' },
      { path: '/demo/pilot', name: 'Demo Pilot Terminal' },
      { path: '/demo/crew', name: 'Demo Crew Terminal' },
      { path: '/beta/broker', name: 'Beta Broker Terminal' },
      { path: '/beta/operator', name: 'Beta Operator Terminal' },
      { path: '/beta/pilot', name: 'Beta Pilot Terminal' },
      { path: '/beta/crew', name: 'Beta Crew Terminal' }
    ];

    // Test each terminal with random delays
    for (const terminal of terminals) {
      await this.testTerminal(terminal.path, terminal.name);
      
      // Random delay between requests (1-3 seconds)
      const delay = 1000 + Math.random() * 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    const totalTime = Date.now() - this.results.startTime;
    const successCount = this.results.terminalTests.filter(t => t.success).length;
    const successRate = successCount / this.results.terminalTests.length;

    console.log(`🏁 Bot ${this.id}: Test complete - ${(successRate * 100).toFixed(1)}% success rate (${totalTime}ms)`);
  }

  getResults() {
    return this.results;
  }
}

class SimpleBotOrchestrator {
  constructor(baseUrl = 'http://localhost:8082', botCount = 25) {
    this.baseUrl = baseUrl;
    this.botCount = botCount;
    this.bots = [];
    this.results = {
      totalBots: botCount,
      startTime: Date.now(),
      botResults: [],
      summary: {}
    };
  }

  async runTest() {
    console.log(`🎯 STRATUSCONNECT SIMPLE BOT TESTING SYSTEM`);
    console.log(`=============================================`);
    console.log(`🤖 Deploying ${this.botCount} bots to test ${this.baseUrl}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log(``);

    // Create bots
    for (let i = 1; i <= this.botCount; i++) {
      this.bots.push(new SimpleBot(i, this.baseUrl));
    }

    console.log(`✅ Created ${this.botCount} bots`);
    console.log(``);

    // Run tests concurrently in batches
    const batchSize = 10;
    for (let i = 0; i < this.bots.length; i += batchSize) {
      const batch = this.bots.slice(i, i + batchSize);
      console.log(`🚀 Running batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(this.bots.length/batchSize)} (${batch.length} bots)`);
      
      await Promise.all(batch.map(bot => bot.runFullTest()));
      
      // Brief pause between batches
      if (i + batchSize < this.bots.length) {
        console.log(`⏸️  Pausing between batches...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    // Collect results
    for (const bot of this.bots) {
      this.results.botResults.push(bot.getResults());
    }

    // Generate summary
    this.generateSummary();
    this.printResults();

    return this.results;
  }

  generateSummary() {
    const allTests = this.results.botResults.flatMap(bot => bot.terminalTests);
    const allErrors = this.results.botResults.flatMap(bot => bot.errors);
    
    const terminalStats = {};
    allTests.forEach(test => {
      if (!terminalStats[test.terminal]) {
        terminalStats[test.terminal] = { 
          total: 0, 
          successful: 0, 
          avgLoadTime: 0,
          avgContentLength: 0,
          statusCodes: {}
        };
      }
      terminalStats[test.terminal].total++;
      if (test.success) terminalStats[test.terminal].successful++;
      terminalStats[test.terminal].avgLoadTime += test.loadTime || 0;
      terminalStats[test.terminal].avgContentLength += test.contentLength || 0;
      
      const status = test.statusCode || 'error';
      terminalStats[test.terminal].statusCodes[status] = (terminalStats[test.terminal].statusCodes[status] || 0) + 1;
    });

    // Calculate averages
    Object.keys(terminalStats).forEach(terminal => {
      terminalStats[terminal].avgLoadTime = Math.round(
        terminalStats[terminal].avgLoadTime / terminalStats[terminal].total
      );
      terminalStats[terminal].avgContentLength = Math.round(
        terminalStats[terminal].avgContentLength / terminalStats[terminal].total
      );
      terminalStats[terminal].successRate = 
        terminalStats[terminal].successful / terminalStats[terminal].total;
    });

    this.results.summary = {
      totalTests: allTests.length,
      successfulTests: allTests.filter(t => t.success).length,
      failedTests: allTests.filter(t => !t.success).length,
      totalErrors: allErrors.length,
      overallSuccessRate: allTests.filter(t => t.success).length / allTests.length,
      terminalStats,
      totalTime: Date.now() - this.results.startTime,
      avgLoadTime: allTests.reduce((sum, t) => sum + (t.loadTime || 0), 0) / allTests.length,
      totalRequests: allTests.length,
      requestsPerSecond: allTests.length / ((Date.now() - this.results.startTime) / 1000)
    };
  }

  printResults() {
    console.log(``);
    console.log(`📊 BOT TESTING RESULTS`);
    console.log(`=====================`);
    console.log(`🤖 Total Bots: ${this.botCount}`);
    console.log(`🧪 Total Tests: ${this.results.summary.totalTests}`);
    console.log(`✅ Successful: ${this.results.summary.successfulTests}`);
    console.log(`❌ Failed: ${this.results.summary.failedTests}`);
    console.log(`📈 Success Rate: ${(this.results.summary.overallSuccessRate * 100).toFixed(1)}%`);
    console.log(`⏱️  Average Load Time: ${this.results.summary.avgLoadTime.toFixed(0)}ms`);
    console.log(`🕐 Total Test Time: ${(this.results.summary.totalTime / 1000).toFixed(1)}s`);
    console.log(`📊 Requests/Second: ${this.results.summary.requestsPerSecond.toFixed(1)}`);
    console.log(``);

    console.log(`📋 TERMINAL PERFORMANCE:`);
    Object.entries(this.results.summary.terminalStats).forEach(([terminal, stats]) => {
      console.log(`   ${terminal}:`);
      console.log(`     Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
      console.log(`     Avg Load Time: ${stats.avgLoadTime}ms`);
      console.log(`     Avg Content: ${stats.avgContentLength} bytes`);
      console.log(`     Tests: ${stats.successful}/${stats.total}`);
      console.log(`     Status Codes: ${JSON.stringify(stats.statusCodes)}`);
    });

    if (this.results.summary.totalErrors > 0) {
      console.log(``);
      console.log(`❌ ERROR SUMMARY:`);
      const errorTypes = {};
      this.results.botResults.flatMap(bot => bot.errors).forEach(error => {
        const type = error.error.split(':')[0];
        errorTypes[type] = (errorTypes[type] || 0) + 1;
      });
      Object.entries(errorTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} occurrences`);
      });
    }

    console.log(``);
    console.log(`🎯 STRESS TEST COMPLETE!`);
    console.log(`   StratusConnect handled ${this.results.summary.totalTests} concurrent requests`);
    console.log(`   with ${(this.results.summary.overallSuccessRate * 100).toFixed(1)}% success rate`);
    console.log(`   at ${this.results.summary.requestsPerSecond.toFixed(1)} requests/second`);
    
    if (this.results.summary.overallSuccessRate > 0.95) {
      console.log(`🏆 EXCELLENT: System handled the load very well!`);
    } else if (this.results.summary.overallSuccessRate > 0.8) {
      console.log(`✅ GOOD: System handled the load well with minor issues`);
    } else {
      console.log(`⚠️  NEEDS ATTENTION: System struggled with the load`);
    }
  }
}

// Main execution
async function main() {
  const botCount = process.argv[2] ? parseInt(process.argv[2]) : 25;
  const baseUrl = process.argv[3] || 'http://localhost:8082';
  
  console.log(`🎯 Starting StratusConnect Simple Bot Testing System`);
  console.log(`   Bots: ${botCount}`);
  console.log(`   URL: ${baseUrl}`);
  console.log(``);

  const orchestrator = new SimpleBotOrchestrator(baseUrl, botCount);
  
  try {
    await orchestrator.runTest();
  } catch (error) {
    console.error(`💥 Bot testing failed:`, error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { SimpleBot, SimpleBotOrchestrator };
