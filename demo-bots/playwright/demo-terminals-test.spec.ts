// Demo Terminals Test - All Demo Routes
// FCA Compliant Aviation Platform - Complete Demo Testing

import { test, chromium, expect } from '@playwright/test';

test('test all demo terminals on localhost:8080', async () => {
  const browser = await chromium.launch({ 
    headless: false, // Show browser for testing
    slowMo: 500 // Slow down for better visibility
  });
  
  const context = await browser.newContext({ 
    baseURL: 'http://localhost:8080',
    recordVideo: {
      dir: 'test-results/videos/',
      size: { width: 1280, height: 720 }
    }
  });
  
  const page = await context.newPage();

  try {
    // Test Demo Broker Terminal
    console.log('🎬 Testing Demo Broker Terminal...');
    await page.goto('/demo/broker');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/demo-broker-terminal.png' });
    // Check if page loaded successfully by looking for any content
    await expect(page.locator('body')).toContainText(['StratusConnect']);
    await page.waitForTimeout(2000);

    // Test Demo Operator Terminal  
    console.log('🎬 Testing Demo Operator Terminal...');
    await page.goto('/demo/operator');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/demo-operator-terminal.png' });
    await expect(page.locator('body')).toContainText(['StratusConnect']);
    await page.waitForTimeout(2000);

    // Test Demo Pilot Terminal
    console.log('🎬 Testing Demo Pilot Terminal...');
    await page.goto('/demo/pilot');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/demo-pilot-terminal.png' });
    await expect(page.locator('body')).toContainText(['StratusConnect']);
    await page.waitForTimeout(2000);

    // Test Demo Crew Terminal
    console.log('🎬 Testing Demo Crew Terminal...');
    await page.goto('/demo/crew');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/demo-crew-terminal.png' });
    await expect(page.locator('body')).toContainText(['StratusConnect']);
    await page.waitForTimeout(2000);

    // Test Beta Broker Terminal
    console.log('🎬 Testing Beta Broker Terminal...');
    await page.goto('/beta/broker');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/beta-broker-terminal.png' });
    await expect(page.locator('body')).toContainText(['StratusConnect']);
    await page.waitForTimeout(2000);

    // Test Beta Operator Terminal
    console.log('🎬 Testing Beta Operator Terminal...');
    await page.goto('/beta/operator');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/beta-operator-terminal.png' });
    await expect(page.locator('body')).toContainText(['StratusConnect']);
    await page.waitForTimeout(2000);

    console.log('✅ All demo terminals tested successfully!');
    
  } catch (error) {
    console.error('❌ Demo terminal test error:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  expect(true).toBeTruthy();
});
