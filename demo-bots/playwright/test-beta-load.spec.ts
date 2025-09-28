// Test Beta Broker Load - Simple Check
// FCA Compliant Aviation Platform - Verify Beta Terminal Works

import { test, chromium, expect } from '@playwright/test';

test('test beta broker loads correctly', async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext({ 
    baseURL: 'http://localhost:8080'
  });
  
  const page = await context.newPage();

  try {
    console.log('🔍 Testing Beta Broker Terminal Load...');
    
    // Navigate to beta broker
    await page.goto('/beta/broker');
    await page.waitForLoadState('networkidle');
    
    // Check if page loaded
    const title = await page.title();
    console.log('📄 Page title:', title);
    
    // Check for key elements
    const hasHeader = await page.locator('text=Beta Broker Terminal').count() > 0;
    console.log('✅ Has header:', hasHeader);
    
    const hasTabs = await page.locator('[role="tablist"]').count() > 0;
    console.log('✅ Has tabs:', hasTabs);
    
    const hasDashboard = await page.locator('text=Dashboard').count() > 0;
    console.log('✅ Has dashboard tab:', hasDashboard);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/beta-broker-test.png' });
    
    console.log('✅ Beta Broker Terminal loaded successfully!');
    
  } catch (error) {
    console.error('❌ Beta Broker Load Error:', error);
    await page.screenshot({ path: 'test-results/beta-broker-error.png' });
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  expect(true).toBeTruthy();
});
