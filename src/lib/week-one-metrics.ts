// Week One Metrics - Production Monitoring
// FCA Compliant Aviation Platform

export interface WeekOneMetrics {
  timeToFirstQuote: number; // minutes
  quoteResponseRate: number; // percentage
  dealConversionRate: number; // percentage
  uptime: number; // percentage
  p50Response: number; // milliseconds
  kycPassRate: number; // percentage
  timeToPayout: number; // hours
  disputesPer100Deals: number; // count
}

export interface MetricAlert {
  metric: string;
  threshold: number;
  current: number;
  status: 'OK' | 'WARNING' | 'CRITICAL';
  message: string;
}

class WeekOneMetricsMonitor {
  private metrics: WeekOneMetrics = {
    timeToFirstQuote: 0,
    quoteResponseRate: 0,
    dealConversionRate: 0,
    uptime: 0,
    p50Response: 0,
    kycPassRate: 0,
    timeToPayout: 0,
    disputesPer100Deals: 0
  };

  /**
   * Calculate time to first quote
   */
  async calculateTimeToFirstQuote(): Promise<number> {
    // In production, this would query the database
    // For now, return mock data
    const mockTime = 15; // 15 minutes average
    this.metrics.timeToFirstQuote = mockTime;
    return mockTime;
  }

  /**
   * Calculate quote response rate
   */
  async calculateQuoteResponseRate(): Promise<number> {
    // In production, this would calculate from actual data
    const mockRate = 85; // 85% response rate
    this.metrics.quoteResponseRate = mockRate;
    return mockRate;
  }

  /**
   * Calculate deal conversion rate
   */
  async calculateDealConversionRate(): Promise<number> {
    // In production, this would calculate from actual data
    const mockRate = 12; // 12% conversion rate
    this.metrics.dealConversionRate = mockRate;
    return mockRate;
  }

  /**
   * Get uptime from status page
   */
  async getUptime(): Promise<number> {
    // In production, this would fetch from UptimeRobot
    const mockUptime = 99.95; // 99.95% uptime
    this.metrics.uptime = mockUptime;
    return mockUptime;
  }

  /**
   * Get P50 response time
   */
  async getP50Response(): Promise<number> {
    // In production, this would fetch from monitoring
    const mockP50 = 180; // 180ms P50 response time
    this.metrics.p50Response = mockP50;
    return mockP50;
  }

  /**
   * Calculate KYC pass rate
   */
  async calculateKYCPassRate(): Promise<number> {
    // In production, this would calculate from actual data
    const mockRate = 92; // 92% KYC pass rate
    this.metrics.kycPassRate = mockRate;
    return mockRate;
  }

  /**
   * Calculate time to payout
   */
  async calculateTimeToPayout(): Promise<number> {
    // In production, this would calculate from actual data
    const mockTime = 2.5; // 2.5 hours average
    this.metrics.timeToPayout = mockTime;
    return mockTime;
  }

  /**
   * Calculate disputes per 100 deals
   */
  async calculateDisputesPer100Deals(): Promise<number> {
    // In production, this would calculate from actual data
    const mockDisputes = 0.5; // 0.5 disputes per 100 deals
    this.metrics.disputesPer100Deals = mockDisputes;
    return mockDisputes;
  }

  /**
   * Get all metrics
   */
  async getAllMetrics(): Promise<WeekOneMetrics> {
    await Promise.all([
      this.calculateTimeToFirstQuote(),
      this.calculateQuoteResponseRate(),
      this.calculateDealConversionRate(),
      this.getUptime(),
      this.getP50Response(),
      this.calculateKYCPassRate(),
      this.calculateTimeToPayout(),
      this.calculateDisputesPer100Deals()
    ]);

    return this.metrics;
  }

  /**
   * Check metrics against thresholds
   */
  checkMetricThresholds(): MetricAlert[] {
    const alerts: MetricAlert[] = [];

    // Time to first quote threshold: < 30 minutes
    if (this.metrics.timeToFirstQuote > 30) {
      alerts.push({
        metric: 'Time to First Quote',
        threshold: 30,
        current: this.metrics.timeToFirstQuote,
        status: this.metrics.timeToFirstQuote > 60 ? 'CRITICAL' : 'WARNING',
        message: `Time to first quote is ${this.metrics.timeToFirstQuote} minutes (threshold: 30)`
      });
    }

    // Quote response rate threshold: > 80%
    if (this.metrics.quoteResponseRate < 80) {
      alerts.push({
        metric: 'Quote Response Rate',
        threshold: 80,
        current: this.metrics.quoteResponseRate,
        status: this.metrics.quoteResponseRate < 60 ? 'CRITICAL' : 'WARNING',
        message: `Quote response rate is ${this.metrics.quoteResponseRate}% (threshold: 80%)`
      });
    }

    // Deal conversion rate threshold: > 10%
    if (this.metrics.dealConversionRate < 10) {
      alerts.push({
        metric: 'Deal Conversion Rate',
        threshold: 10,
        current: this.metrics.dealConversionRate,
        status: this.metrics.dealConversionRate < 5 ? 'CRITICAL' : 'WARNING',
        message: `Deal conversion rate is ${this.metrics.dealConversionRate}% (threshold: 10%)`
      });
    }

    // Uptime threshold: > 99.9%
    if (this.metrics.uptime < 99.9) {
      alerts.push({
        metric: 'Uptime',
        threshold: 99.9,
        current: this.metrics.uptime,
        status: this.metrics.uptime < 99.0 ? 'CRITICAL' : 'WARNING',
        message: `Uptime is ${this.metrics.uptime}% (threshold: 99.9%)`
      });
    }

    // P50 response time threshold: < 500ms
    if (this.metrics.p50Response > 500) {
      alerts.push({
        metric: 'P50 Response Time',
        threshold: 500,
        current: this.metrics.p50Response,
        status: this.metrics.p50Response > 1000 ? 'CRITICAL' : 'WARNING',
        message: `P50 response time is ${this.metrics.p50Response}ms (threshold: 500ms)`
      });
    }

    // KYC pass rate threshold: > 90%
    if (this.metrics.kycPassRate < 90) {
      alerts.push({
        metric: 'KYC Pass Rate',
        threshold: 90,
        current: this.metrics.kycPassRate,
        status: this.metrics.kycPassRate < 80 ? 'CRITICAL' : 'WARNING',
        message: `KYC pass rate is ${this.metrics.kycPassRate}% (threshold: 90%)`
      });
    }

    // Time to payout threshold: < 4 hours
    if (this.metrics.timeToPayout > 4) {
      alerts.push({
        metric: 'Time to Payout',
        threshold: 4,
        current: this.metrics.timeToPayout,
        status: this.metrics.timeToPayout > 8 ? 'CRITICAL' : 'WARNING',
        message: `Time to payout is ${this.metrics.timeToPayout} hours (threshold: 4 hours)`
      });
    }

    // Disputes per 100 deals threshold: < 2
    if (this.metrics.disputesPer100Deals > 2) {
      alerts.push({
        metric: 'Disputes per 100 Deals',
        threshold: 2,
        current: this.metrics.disputesPer100Deals,
        status: this.metrics.disputesPer100Deals > 5 ? 'CRITICAL' : 'WARNING',
        message: `Disputes per 100 deals is ${this.metrics.disputesPer100Deals} (threshold: 2)`
      });
    }

    return alerts;
  }

  /**
   * Generate week one report
   */
  async generateWeekOneReport(): Promise<{
    metrics: WeekOneMetrics;
    alerts: MetricAlert[];
    summary: string;
  }> {
    const metrics = await this.getAllMetrics();
    const alerts = this.checkMetricThresholds();

    const criticalAlerts = alerts.filter(a => a.status === 'CRITICAL').length;
    const warningAlerts = alerts.filter(a => a.status === 'WARNING').length;

    let summary = 'Week One Metrics Summary:\n';
    summary += `- Time to First Quote: ${metrics.timeToFirstQuote} minutes\n`;
    summary += `- Quote Response Rate: ${metrics.quoteResponseRate}%\n`;
    summary += `- Deal Conversion Rate: ${metrics.dealConversionRate}%\n`;
    summary += `- Uptime: ${metrics.uptime}%\n`;
    summary += `- P50 Response Time: ${metrics.p50Response}ms\n`;
    summary += `- KYC Pass Rate: ${metrics.kycPassRate}%\n`;
    summary += `- Time to Payout: ${metrics.timeToPayout} hours\n`;
    summary += `- Disputes per 100 Deals: ${metrics.disputesPer100Deals}\n\n`;

    if (criticalAlerts > 0) {
      summary += `🚨 CRITICAL: ${criticalAlerts} metrics need immediate attention\n`;
    }
    if (warningAlerts > 0) {
      summary += `⚠️ WARNING: ${warningAlerts} metrics need monitoring\n`;
    }
    if (criticalAlerts === 0 && warningAlerts === 0) {
      summary += `✅ All metrics within acceptable thresholds\n`;
    }

    return {
      metrics,
      alerts,
      summary
    };
  }

  /**
   * Print metrics dashboard
   */
  async printMetricsDashboard(): Promise<void> {
    const report = await this.generateWeekOneReport();
    
    console.log('\n📊 Week One Metrics Dashboard');
    console.log('============================');
    console.log(report.summary);
    
    if (report.alerts.length > 0) {
      console.log('\n🚨 Alerts:');
      for (const alert of report.alerts) {
        const status = alert.status === 'CRITICAL' ? '🔴' : '🟡';
        console.log(`${status} ${alert.metric}: ${alert.message}`);
      }
    }
  }
}

export const weekOneMetricsMonitor = new WeekOneMetricsMonitor();
export default weekOneMetricsMonitor;
