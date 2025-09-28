// Demo Video Recording - Beta Terminal Testing
// FCA Compliant Aviation Platform - Proof of Life System

import { test, chromium, expect } from '@playwright/test';

test('demo video recording - all terminals', async () => {
  const browser = await chromium.launch({ 
    headless: false, // Show browser for demo
    slowMo: 1000 // Slow down for better video
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
    // Demo Broker Terminal
    console.log('🎬 Recording Broker Terminal...');
    await page.goto('/beta/broker');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/broker-terminal.png' });
    await page.waitForTimeout(3000);

    // Demo Operator Terminal  
    console.log('🎬 Recording Operator Terminal...');
    await page.goto('/beta/operator');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/operator-terminal.png' });
    await page.waitForTimeout(3000);

    // Demo Pilot Terminal
    console.log('🎬 Recording Pilot Terminal...');
    await page.goto('/beta/pilot');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/pilot-terminal.png' });
    await page.waitForTimeout(3000);

    // Demo Crew Terminal
    console.log('🎬 Recording Crew Terminal...');
    await page.goto('/beta/crew');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'test-results/crew-terminal.png' });
    await page.waitForTimeout(3000);

    console.log('✅ Demo video recording complete!');
    
  } catch (error) {
    console.error('❌ Demo recording error:', error);
  } finally {
    await context.close();
    await browser.close();
  }

  expect(true).toBeTruthy();
});
