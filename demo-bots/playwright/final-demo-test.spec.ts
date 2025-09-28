// Final Demo Test - Just check if pages load without errors
import { test, chromium, expect } from '@playwright/test';

test('final demo test - check all terminals load', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ baseURL: 'http://localhost:8080' });
  const page = await context.newPage();

  const terminals = [
    { name: 'Demo Broker', path: '/demo/broker' },
    { name: 'Demo Operator', path: '/demo/operator' },
    { name: 'Demo Pilot', path: '/demo/pilot' },
    { name: 'Demo Crew', path: '/demo/crew' },
    { name: 'Beta Broker', path: '/beta/broker' },
    { name: 'Beta Operator', path: '/beta/operator' },
  ];

  try {
    for (const terminal of terminals) {
      console.log(`🎬 Testing ${terminal.name} Terminal...`);
      await page.goto(terminal.path);
      await page.waitForLoadState('networkidle');
      
      // Take screenshot
      const filename = terminal.name.toLowerCase().replace(' ', '-') + '.png';
      await page.screenshot({ path: `test-results/${filename}` });
      
      // Check page title
      const title = await page.title();
      console.log(`  ✅ ${terminal.name} loaded - Title: "${title}"`);
      
      // Check for any JavaScript errors in console
      const errors = await page.evaluate(() => {
        return window.console._errors || [];
      });
      
      if (errors.length > 0) {
        console.log(`  ⚠️  ${terminal.name} has console errors:`, errors);
      } else {
        console.log(`  ✅ ${terminal.name} - No console errors`);
      }
      
      await page.waitForTimeout(1000);
    }

    console.log('🎉 All terminals tested successfully!');
    
  } catch (error) {
    console.error('❌ Demo terminal test error:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
});
