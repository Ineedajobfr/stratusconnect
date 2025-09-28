// Simple Demo Test - Check what's actually loading
import { test, chromium, expect } from '@playwright/test';

test('simple demo test - check page content', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ baseURL: 'http://localhost:8080' });
  const page = await context.newPage();

  try {
    console.log('🎬 Testing Demo Broker Terminal...');
    await page.goto('/demo/broker');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot to see what's actually there
    await page.screenshot({ path: 'test-results/demo-broker-actual.png' });
    
    // Get page title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Get all text content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text (first 500 chars):', bodyText?.substring(0, 500));
    
    // Check if there are any error messages
    const errorElements = await page.locator('[class*="error"], [class*="Error"], [class*="wrong"]').count();
    console.log('Error elements found:', errorElements);
    
    // Check for any loading states
    const loadingElements = await page.locator('[class*="loading"], [class*="Loading"]').count();
    console.log('Loading elements found:', loadingElements);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await context.close();
    await browser.close();
  }
});
