// STRATUSCONNECT BOT TESTING SYSTEM
// Simulates 20-50 real users testing all terminals

const puppeteer = require('puppeteer');
const { performance } = require('perf_hooks');

class StratusConnectBot {
  constructor(id, baseUrl = 'http://localhost:8082') {
    this.id = id;
    this.baseUrl = baseUrl;
    this.browser = null;
    this.page = null;
    this.results = {
      terminalTests: [],
      errors: [],
      performance: {},
      startTime: Date.now()
    };
  }

  async initialize() {
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      this.page = await this.browser.newPage();
      await this.page.setViewport({ width: 1920, height: 1080 });
      console.log(`🤖 Bot ${this.id}: Initialized`);
    } catch (error) {
      console.error(`❌ Bot ${this.id}: Failed to initialize -`, error.message);
      this.results.errors.push({ type: 'initialization', error: error.message });
    }
  }

  async testTerminal(terminalPath, terminalName) {
    const startTime = performance.now();
    try {
      console.log(`🔍 Bot ${this.id}: Testing ${terminalName}...`);
      
      // Navigate to terminal
      await this.page.goto(`${this.baseUrl}${terminalPath}`, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });

      // Wait for page to load
      await this.page.waitForTimeout(2000);

      // Test basic functionality
      const pageTitle = await this.page.title();
      const url = this.page.url();
      
      // Test if page loaded successfully
      const isLoaded = pageTitle && url.includes(terminalPath);
      
      // Test for key elements (different for each terminal type)
      let keyElementsFound = 0;
      const selectors = [
        'h1', 'h2', 'h3', // Headers
        '[class*="card"]', // Cards
        '[class*="button"]', // Buttons
        '[class*="tab"]', // Tabs
        'nav', // Navigation
        'main', // Main content
        '[class*="terminal"]' // Terminal-specific elements
      ];

      for (const selector of selectors) {
        try {
          const elements = await this.page.$$(selector);
          if (elements.length > 0) keyElementsFound++;
        } catch (e) {
          // Ignore selector errors
        }
      }

      // Test interactive elements
      let interactionsTested = 0;
      try {
        // Try to click on buttons
        const buttons = await this.page.$$('button');
        if (buttons.length > 0) {
          await buttons[0].click();
          interactionsTested++;
        }

        // Try to interact with tabs
        const tabs = await this.page.$$('[role="tab"]');
        if (tabs.length > 1) {
          await tabs[1].click();
          interactionsTested++;
        }
      } catch (e) {
        // Ignore interaction errors
      }

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      const testResult = {
        terminal: terminalName,
        path: terminalPath,
        success: isLoaded && keyElementsFound > 3,
        loadTime: Math.round(loadTime),
        pageTitle,
        url,
        keyElementsFound,
        interactionsTested,
        timestamp: new Date().toISOString()
      };

      this.results.terminalTests.push(testResult);
      
      if (testResult.success) {
        console.log(`✅ Bot ${this.id}: ${terminalName} - SUCCESS (${loadTime.toFixed(0)}ms)`);
      } else {
        console.log(`❌ Bot ${this.id}: ${terminalName} - FAILED`);
      }

      return testResult;
    } catch (error) {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      console.error(`❌ Bot ${this.id}: ${terminalName} - ERROR -`, error.message);
      
      this.results.errors.push({
        terminal: terminalName,
        path: terminalPath,
        error: error.message,
        loadTime: Math.round(loadTime),
        timestamp: new Date().toISOString()
      });

      return {
        terminal: terminalName,
        path: terminalPath,
        success: false,
        loadTime: Math.round(loadTime),
        error: error.message,
        timestamp: new Date().toISOString()
      };
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

    // Test each terminal
    for (const terminal of terminals) {
      await this.testTerminal(terminal.path, terminal.name);
      await this.page.waitForTimeout(1000 + Math.random() * 2000); // Random delay
    }

    // Test navigation between terminals
    await this.testNavigation();

    this.results.performance.totalTime = Date.now() - this.results.startTime;
    this.results.performance.terminalsTested = this.results.terminalTests.length;
    this.results.performance.successRate = this.results.terminalTests.filter(t => t.success).length / this.results.terminalTests.length;

    console.log(`🏁 Bot ${this.id}: Test complete - ${this.results.performance.successRate * 100}% success rate`);
  }

  async testNavigation() {
    try {
      console.log(`🧭 Bot ${this.id}: Testing navigation...`);
      
      // Test clicking on terminal cards/links
      const links = await this.page.$$('a[href*="/demo/"], a[href*="/beta/"]');
      if (links.length > 0) {
        const randomLink = links[Math.floor(Math.random() * links.length)];
        await randomLink.click();
        await this.page.waitForTimeout(2000);
      }
    } catch (error) {
      console.error(`❌ Bot ${this.id}: Navigation test failed -`, error.message);
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  getResults() {
    return this.results;
  }
}

class BotTestingOrchestrator {
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
    console.log(`🎯 STRATUSCONNECT BOT TESTING SYSTEM`);
    console.log(`=====================================`);
    console.log(`🤖 Deploying ${this.botCount} bots to test ${this.baseUrl}`);
    console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    console.log(``);

    // Create and initialize bots
    for (let i = 1; i <= this.botCount; i++) {
      const bot = new StratusConnectBot(i, this.baseUrl);
      this.bots.push(bot);
      await bot.initialize();
      
      // Stagger bot starts
      if (i % 5 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`✅ All ${this.botCount} bots initialized`);
    console.log(``);

    // Run tests concurrently in batches
    const batchSize = 5;
    for (let i = 0; i < this.bots.length; i += batchSize) {
      const batch = this.bots.slice(i, i + batchSize);
      console.log(`🚀 Running batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(this.bots.length/batchSize)}`);
      
      await Promise.all(batch.map(bot => bot.runFullTest()));
      
      // Brief pause between batches
      if (i + batchSize < this.bots.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Collect results
    for (const bot of this.bots) {
      this.results.botResults.push(bot.getResults());
      await bot.cleanup();
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
        terminalStats[test.terminal] = { total: 0, successful: 0, avgLoadTime: 0 };
      }
      terminalStats[test.terminal].total++;
      if (test.success) terminalStats[test.terminal].successful++;
      terminalStats[test.terminal].avgLoadTime += test.loadTime;
    });

    // Calculate averages
    Object.keys(terminalStats).forEach(terminal => {
      terminalStats[terminal].avgLoadTime = Math.round(
        terminalStats[terminal].avgLoadTime / terminalStats[terminal].total
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
      avgLoadTime: allTests.reduce((sum, t) => sum + t.loadTime, 0) / allTests.length
    };
  }

  printResults() {
    console.log(``);
    console.log(`📊 BOT TESTING RESULTS`);
    console.log(`=====================`);
    console.log(`🤖 Total Bots: ${this.results.summary.totalTests / 9}`);
    console.log(`🧪 Total Tests: ${this.results.summary.totalTests}`);
    console.log(`✅ Successful: ${this.results.summary.successfulTests}`);
    console.log(`❌ Failed: ${this.results.summary.failedTests}`);
    console.log(`📈 Success Rate: ${(this.results.summary.overallSuccessRate * 100).toFixed(1)}%`);
    console.log(`⏱️  Average Load Time: ${this.results.summary.avgLoadTime.toFixed(0)}ms`);
    console.log(`🕐 Total Test Time: ${(this.results.summary.totalTime / 1000).toFixed(1)}s`);
    console.log(``);

    console.log(`📋 TERMINAL PERFORMANCE:`);
    Object.entries(this.results.summary.terminalStats).forEach(([terminal, stats]) => {
      console.log(`   ${terminal}:`);
      console.log(`     Success Rate: ${(stats.successRate * 100).toFixed(1)}%`);
      console.log(`     Avg Load Time: ${stats.avgLoadTime}ms`);
      console.log(`     Tests: ${stats.successful}/${stats.total}`);
    });

    if (this.results.summary.totalErrors > 0) {
      console.log(``);
      console.log(`❌ ERRORS FOUND:`);
      this.results.botResults.flatMap(bot => bot.errors).forEach(error => {
        console.log(`   ${error.terminal}: ${error.error}`);
      });
    }

    console.log(``);
    console.log(`🎯 STRESS TEST COMPLETE!`);
    console.log(`   StratusConnect handled ${this.results.summary.totalTests} concurrent tests`);
    console.log(`   with ${(this.results.summary.overallSuccessRate * 100).toFixed(1)}% success rate`);
  }
}

// Main execution
async function main() {
  const botCount = process.argv[2] ? parseInt(process.argv[2]) : 25;
  const baseUrl = process.argv[3] || 'http://localhost:8082';
  
  console.log(`🎯 Starting StratusConnect Bot Testing System`);
  console.log(`   Bots: ${botCount}`);
  console.log(`   URL: ${baseUrl}`);
  console.log(``);

  const orchestrator = new BotTestingOrchestrator(baseUrl, botCount);
  
  try {
    await orchestrator.runTest();
  } catch (error) {
    console.error(`💥 Bot testing failed:`, error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { StratusConnectBot, BotTestingOrchestrator };


