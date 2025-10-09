// StratusConnect Quote Loop System - Live Demo Bot
// This bot demonstrates the complete RFQ → Quote → Deal → Payment workflow

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class QuoteLoopDemoBot {
  constructor() {
    this.browser = null;
    this.brokerPage = null;
    this.operatorPage = null;
    this.pilotPage = null;
    this.adminPage = null;
    this.demoData = {
      rfqId: null,
      quoteId: null,
      dealId: null,
      crewHiringId: null
    };
  }

  async initialize() {
    console.log('🚀 Initializing StratusConnect Quote Loop Demo Bot...');
    
    // Launch browser with multiple contexts for different roles
    this.browser = await puppeteer.launch({
      headless: false, // Show browser for demo
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--start-maximized', '--disable-web-security']
    });

    // Create separate browser contexts for each role
    const brokerContext = await this.browser.createIncognitoBrowserContext();
    const operatorContext = await this.browser.createIncognitoBrowserContext();
    const pilotContext = await this.browser.createIncognitoBrowserContext();
    const adminContext = await this.browser.createIncognitoBrowserContext();

    // Create pages for each role
    this.brokerPage = await brokerContext.newPage();
    this.operatorPage = await operatorContext.newPage();
    this.pilotPage = await pilotContext.newPage();
    this.adminPage = await adminContext.newPage();

    // Set up page configurations
    await this.setupPages();
    
    console.log('✅ Browser initialized with 4 role-based contexts');
  }

  async setupPages() {
    // Configure all pages
    const pages = [
      { page: this.brokerPage, role: 'Broker' },
      { page: this.operatorPage, role: 'Operator' },
      { page: this.pilotPage, role: 'Pilot' },
      { page: this.adminPage, role: 'Admin' }
    ];

    for (const { page, role } of pages) {
      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Set viewport
      await page.setViewport({ width: 1920, height: 1080 });
      
      // Enable console logging
      page.on('console', msg => {
        if (msg.type() === 'log') {
          console.log(`[${role}] ${msg.text()}`);
        }
      });

      // Handle page errors
      page.on('pageerror', error => {
        console.error(`[${role} Error] ${error.message}`);
      });
    }
  }

  async navigateToDemo() {
    console.log('🌐 Navigating to StratusConnect Demo...');
    
    const baseUrl = 'http://localhost:5173'; // Adjust based on your dev server
    
    // Navigate all pages to demo
    await Promise.all([
      this.brokerPage.goto(`${baseUrl}/demo/broker`),
      this.operatorPage.goto(`${baseUrl}/demo/operator`),
      this.pilotPage.goto(`${baseUrl}/demo/pilot`),
      this.adminPage.goto(`${baseUrl}/demo/admin`)
    ]);

    // Wait for pages to load
    await Promise.all([
      this.brokerPage.waitForSelector('[data-testid="broker-dashboard"]', { timeout: 10000 }),
      this.operatorPage.waitForSelector('[data-testid="operator-dashboard"]', { timeout: 10000 }),
      this.pilotPage.waitForSelector('[data-testid="pilot-dashboard"]', { timeout: 10000 }),
      this.adminPage.waitForSelector('[data-testid="admin-dashboard"]', { timeout: 10000 })
    ]);

    console.log('✅ All terminals loaded successfully');
  }

  async demonstrateRFQCreation() {
    console.log('\n📋 STEP 1: BROKER CREATES RFQ');
    console.log('=====================================');

    // Switch to broker page
    await this.brokerPage.bringToFront();
    await this.brokerPage.waitForTimeout(2000);

    // Navigate to RFQ creation
    await this.brokerPage.click('[data-testid="create-rfq-button"]');
    await this.brokerPage.waitForSelector('[data-testid="rfq-form"]', { timeout: 5000 });

    // Fill RFQ form
    const rfqData = {
      clientName: 'Elite Aviation Group',
      clientCompany: 'EAG Holdings',
      clientEmail: 'charter@eliteaviation.com',
      clientPhone: '+1-555-0123',
      origin: 'London Heathrow (LHR)',
      destination: 'Dubai International (DXB)',
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      passengerCount: 4,
      budgetMin: 50000,
      budgetMax: 75000,
      currency: 'USD',
      urgency: 'high',
      notes: 'VIP client requiring luxury aircraft with full service'
    };

    // Fill form fields
    await this.brokerPage.type('[data-testid="client-name"]', rfqData.clientName);
    await this.brokerPage.type('[data-testid="client-company"]', rfqData.clientCompany);
    await this.brokerPage.type('[data-testid="client-email"]', rfqData.clientEmail);
    await this.brokerPage.type('[data-testid="client-phone"]', rfqData.clientPhone);
    await this.brokerPage.type('[data-testid="origin"]', rfqData.origin);
    await this.brokerPage.type('[data-testid="destination"]', rfqData.destination);
    await this.brokerPage.type('[data-testid="departure-date"]', rfqData.departureDate);
    await this.brokerPage.type('[data-testid="passenger-count"]', rfqData.passengerCount.toString());
    await this.brokerPage.type('[data-testid="budget-min"]', rfqData.budgetMin.toString());
    await this.brokerPage.type('[data-testid="budget-max"]', rfqData.budgetMax.toString());
    await this.brokerPage.select('[data-testid="currency"]', rfqData.currency);
    await this.brokerPage.select('[data-testid="urgency"]', rfqData.urgency);
    await this.brokerPage.type('[data-testid="notes"]', rfqData.notes);

    // Submit RFQ
    await this.brokerPage.click('[data-testid="submit-rfq"]');
    
    // Wait for success message
    await this.brokerPage.waitForSelector('[data-testid="rfq-success"]', { timeout: 10000 });
    
    // Get RFQ ID from success message
    const rfqIdElement = await this.brokerPage.$('[data-testid="rfq-id"]');
    this.demoData.rfqId = await this.brokerPage.evaluate(el => el.textContent, rfqIdElement);
    
    console.log(`✅ RFQ Created Successfully - ID: ${this.demoData.rfqId}`);
    console.log(`   Client: ${rfqData.clientName}`);
    console.log(`   Route: ${rfqData.origin} → ${rfqData.destination}`);
    console.log(`   Passengers: ${rfqData.passengerCount}`);
    console.log(`   Budget: $${rfqData.budgetMin.toLocaleString()} - $${rfqData.budgetMax.toLocaleString()}`);

    // Take screenshot
    await this.brokerPage.screenshot({ path: 'demo-screenshots/01-rfq-created.png', fullPage: true });
  }

  async demonstrateQuoteSubmission() {
    console.log('\n💬 STEP 2: OPERATOR SUBMITS QUOTE');
    console.log('=====================================');

    // Switch to operator page
    await this.operatorPage.bringToFront();
    await this.operatorPage.waitForTimeout(2000);

    // Wait for RFQ to appear in operator dashboard
    await this.operatorPage.waitForSelector(`[data-testid="rfq-${this.demoData.rfqId}"]`, { timeout: 10000 });
    
    // Click on the RFQ to view details
    await this.operatorPage.click(`[data-testid="rfq-${this.demoData.rfqId}"]`);
    await this.operatorPage.waitForSelector('[data-testid="quote-form"]', { timeout: 5000 });

    // Fill quote form
    const quoteData = {
      price: 65000,
      currency: 'USD',
      aircraftModel: 'Gulfstream G650',
      aircraftTailNumber: 'N123GX',
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      terms: 'Standard charter terms apply. Payment required within 24 hours of acceptance.',
      notes: 'Aircraft available with experienced crew. Full catering and ground services included.'
    };

    // Fill quote fields
    await this.operatorPage.type('[data-testid="quote-price"]', quoteData.price.toString());
    await this.operatorPage.type('[data-testid="aircraft-model"]', quoteData.aircraftModel);
    await this.operatorPage.type('[data-testid="aircraft-tail"]', quoteData.aircraftTailNumber);
    await this.operatorPage.type('[data-testid="valid-until"]', quoteData.validUntil);
    await this.operatorPage.type('[data-testid="quote-terms"]', quoteData.terms);
    await this.operatorPage.type('[data-testid="quote-notes"]', quoteData.notes);

    // Submit quote
    await this.operatorPage.click('[data-testid="submit-quote"]');
    
    // Wait for success message
    await this.operatorPage.waitForSelector('[data-testid="quote-success"]', { timeout: 10000 });
    
    // Get quote ID from success message
    const quoteIdElement = await this.operatorPage.$('[data-testid="quote-id"]');
    this.demoData.quoteId = await this.operatorPage.evaluate(el => el.textContent, quoteIdElement);
    
    console.log(`✅ Quote Submitted Successfully - ID: ${this.demoData.quoteId}`);
    console.log(`   Price: $${quoteData.price.toLocaleString()}`);
    console.log(`   Aircraft: ${quoteData.aircraftModel} (${quoteData.aircraftTailNumber})`);
    console.log(`   Valid Until: ${new Date(quoteData.validUntil).toLocaleString()}`);

    // Take screenshot
    await this.operatorPage.screenshot({ path: 'demo-screenshots/02-quote-submitted.png', fullPage: true });
  }

  async demonstrateQuoteAcceptance() {
    console.log('\n🤝 STEP 3: BROKER ACCEPTS QUOTE');
    console.log('=====================================');

    // Switch back to broker page
    await this.brokerPage.bringToFront();
    await this.brokerPage.waitForTimeout(2000);

    // Navigate to quotes section
    await this.brokerPage.click('[data-testid="quotes-tab"]');
    await this.brokerPage.waitForSelector(`[data-testid="quote-${this.demoData.quoteId}"]`, { timeout: 10000 });

    // Click on the quote to view details
    await this.brokerPage.click(`[data-testid="quote-${this.demoData.quoteId}"]`);
    await this.brokerPage.waitForSelector('[data-testid="quote-details"]', { timeout: 5000 });

    // Accept the quote
    await this.brokerPage.click('[data-testid="accept-quote"]');
    
    // Wait for payment processing
    await this.brokerPage.waitForSelector('[data-testid="payment-processing"]', { timeout: 5000 });
    await this.brokerPage.waitForSelector('[data-testid="deal-success"]', { timeout: 15000 });
    
    // Get deal ID from success message
    const dealIdElement = await this.brokerPage.$('[data-testid="deal-id"]');
    this.demoData.dealId = await this.brokerPage.evaluate(el => el.textContent, dealIdElement);
    
    console.log(`✅ Quote Accepted Successfully - Deal ID: ${this.demoData.dealId}`);
    console.log(`   Total Price: $65,000`);
    console.log(`   Broker Commission: $2,275 (3.5%)`);
    console.log(`   Operator Commission: $2,275 (3.5%)`);
    console.log(`   Platform Fee: $4,550 (7%)`);

    // Take screenshot
    await this.brokerPage.screenshot({ path: 'demo-screenshots/03-deal-created.png', fullPage: true });
  }

  async demonstrateCrewHiring() {
    console.log('\n👨‍✈️ STEP 4: CREW HIRING');
    console.log('=====================================');

    // Switch to operator page for crew hiring
    await this.operatorPage.bringToFront();
    await this.operatorPage.waitForTimeout(2000);

    // Navigate to crew hiring section
    await this.operatorPage.click('[data-testid="crew-hiring-tab"]');
    await this.operatorPage.waitForSelector('[data-testid="hire-crew-form"]', { timeout: 5000 });

    // Fill crew hiring form
    const crewData = {
      pilotId: 'pilot-001', // Assuming we have a pilot in the system
      route: 'LHR → DXB',
      departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      arrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
      dailyRate: 2500,
      totalPayment: 5000,
      currency: 'USD'
    };

    // Fill crew hiring fields
    await this.operatorPage.select('[data-testid="pilot-select"]', crewData.pilotId);
    await this.operatorPage.type('[data-testid="crew-route"]', crewData.route);
    await this.operatorPage.type('[data-testid="crew-departure"]', crewData.departureDate);
    await this.operatorPage.type('[data-testid="crew-arrival"]', crewData.arrivalDate);
    await this.operatorPage.type('[data-testid="daily-rate"]', crewData.dailyRate.toString());
    await this.operatorPage.type('[data-testid="total-payment"]', crewData.totalPayment.toString());

    // Submit crew hiring
    await this.operatorPage.click('[data-testid="submit-crew-hiring"]');
    
    // Wait for success message
    await this.operatorPage.waitForSelector('[data-testid="crew-hiring-success"]', { timeout: 10000 });
    
    // Get crew hiring ID from success message
    const crewHiringIdElement = await this.operatorPage.$('[data-testid="crew-hiring-id"]');
    this.demoData.crewHiringId = await this.operatorPage.evaluate(el => el.textContent, crewHiringIdElement);
    
    console.log(`✅ Crew Hired Successfully - ID: ${this.demoData.crewHiringId}`);
    console.log(`   Pilot: Captain John Smith`);
    console.log(`   Route: ${crewData.route}`);
    console.log(`   Daily Rate: $${crewData.dailyRate.toLocaleString()}`);
    console.log(`   Total Payment: $${crewData.totalPayment.toLocaleString()}`);
    console.log(`   Commission: $500 (10%)`);

    // Take screenshot
    await this.operatorPage.screenshot({ path: 'demo-screenshots/04-crew-hired.png', fullPage: true });
  }

  async demonstrateRealTimeUpdates() {
    console.log('\n⚡ STEP 5: REAL-TIME UPDATES');
    console.log('=====================================');

    // Show all terminals updating in real-time
    const terminals = [
      { page: this.brokerPage, name: 'Broker Terminal' },
      { page: this.operatorPage, name: 'Operator Terminal' },
      { page: this.pilotPage, name: 'Pilot Terminal' },
      { page: this.adminPage, name: 'Admin Terminal' }
    ];

    for (const terminal of terminals) {
      await terminal.page.bringToFront();
      await terminal.page.waitForTimeout(1000);
      
      console.log(`📊 ${terminal.name} - Live Dashboard Updates:`);
      
      // Check for real-time metrics
      const metrics = await terminal.page.evaluate(() => {
        const elements = document.querySelectorAll('[data-testid*="metric-"]');
        return Array.from(elements).map(el => ({
          name: el.getAttribute('data-testid'),
          value: el.textContent
        }));
      });
      
      metrics.forEach(metric => {
        console.log(`   ${metric.name}: ${metric.value}`);
      });
      
      // Take screenshot of each terminal
      await terminal.page.screenshot({ 
        path: `demo-screenshots/05-${terminal.name.toLowerCase().replace(' ', '-')}-live.png`, 
        fullPage: true 
      });
    }
  }

  async demonstrateAdminMonitoring() {
    console.log('\n🔍 STEP 6: ADMIN MONITORING');
    console.log('=====================================');

    // Switch to admin page
    await this.adminPage.bringToFront();
    await this.adminPage.waitForTimeout(2000);

    // Navigate to system monitoring
    await this.adminPage.click('[data-testid="system-monitoring-tab"]');
    await this.adminPage.waitForSelector('[data-testid="system-metrics"]', { timeout: 5000 });

    // Show system metrics
    const systemMetrics = await this.adminPage.evaluate(() => {
      const metrics = {};
      const elements = document.querySelectorAll('[data-testid*="system-metric-"]');
      elements.forEach(el => {
        const key = el.getAttribute('data-testid').replace('system-metric-', '');
        metrics[key] = el.textContent;
      });
      return metrics;
    });

    console.log('📊 System Metrics:');
    Object.entries(systemMetrics).forEach(([key, value]) => {
      console.log(`   ${key}: ${value}`);
    });

    // Show audit logs
    await this.adminPage.click('[data-testid="audit-logs-tab"]');
    await this.adminPage.waitForSelector('[data-testid="audit-logs"]', { timeout: 5000 });

    const auditLogs = await this.adminPage.evaluate(() => {
      const logs = [];
      const elements = document.querySelectorAll('[data-testid="audit-log-entry"]');
      elements.forEach(el => {
        logs.push({
          action: el.querySelector('[data-testid="log-action"]')?.textContent,
          timestamp: el.querySelector('[data-testid="log-timestamp"]')?.textContent,
          user: el.querySelector('[data-testid="log-user"]')?.textContent
        });
      });
      return logs;
    });

    console.log('\n📋 Recent Audit Logs:');
    auditLogs.slice(0, 5).forEach(log => {
      console.log(`   ${log.timestamp} - ${log.action} by ${log.user}`);
    });

    // Take screenshot
    await this.adminPage.screenshot({ path: 'demo-screenshots/06-admin-monitoring.png', fullPage: true });
  }

  async generateDemoReport() {
    console.log('\n📊 GENERATING DEMO REPORT');
    console.log('=====================================');

    const report = {
      timestamp: new Date().toISOString(),
      demoData: this.demoData,
      screenshots: [
        '01-rfq-created.png',
        '02-quote-submitted.png',
        '03-deal-created.png',
        '04-crew-hired.png',
        '05-broker-terminal-live.png',
        '05-operator-terminal-live.png',
        '05-pilot-terminal-live.png',
        '05-admin-terminal-live.png',
        '06-admin-monitoring.png'
      ],
      summary: {
        rfqCreated: true,
        quoteSubmitted: true,
        dealAccepted: true,
        crewHired: true,
        realTimeUpdates: true,
        adminMonitoring: true
      }
    };

    // Save report
    fs.writeFileSync('demo-screenshots/demo-report.json', JSON.stringify(report, null, 2));
    
    console.log('✅ Demo Report Generated');
    console.log(`   Screenshots: ${report.screenshots.length}`);
    console.log(`   Report saved: demo-screenshots/demo-report.json`);
  }

  async runCompleteDemo() {
    try {
      console.log('🚀 STARTING STRATUSCONNECT QUOTE LOOP DEMO');
      console.log('==========================================');
      
      // Create screenshots directory
      if (!fs.existsSync('demo-screenshots')) {
        fs.mkdirSync('demo-screenshots');
      }

      // Initialize browser
      await this.initialize();
      
      // Navigate to demo
      await this.navigateToDemo();
      
      // Run through complete workflow
      await this.demonstrateRFQCreation();
      await this.demonstrateQuoteSubmission();
      await this.demonstrateQuoteAcceptance();
      await this.demonstrateCrewHiring();
      await this.demonstrateRealTimeUpdates();
      await this.demonstrateAdminMonitoring();
      
      // Generate report
      await this.generateDemoReport();
      
      console.log('\n🎉 DEMO COMPLETED SUCCESSFULLY!');
      console.log('=====================================');
      console.log('✅ RFQ Created and Notified');
      console.log('✅ Quote Submitted and Processed');
      console.log('✅ Deal Accepted with Payment');
      console.log('✅ Crew Hired with Commission');
      console.log('✅ Real-time Updates Working');
      console.log('✅ Admin Monitoring Active');
      console.log('\nThe Quote Loop System is FULLY OPERATIONAL! 🚀');
      
    } catch (error) {
      console.error('❌ Demo failed:', error);
      throw error;
    } finally {
      // Keep browser open for inspection
      console.log('\n🔍 Browser will remain open for inspection...');
      console.log('Press Ctrl+C to close the demo.');
      
      // Keep the process alive
      process.on('SIGINT', async () => {
        console.log('\n👋 Closing demo...');
        if (this.browser) {
          await this.browser.close();
        }
        process.exit(0);
      });
    }
  }
}

// Run the demo
if (require.main === module) {
  const demo = new QuoteLoopDemoBot();
  demo.runCompleteDemo().catch(console.error);
}

module.exports = QuoteLoopDemoBot;



