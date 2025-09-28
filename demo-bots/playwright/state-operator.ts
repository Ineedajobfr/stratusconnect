// Demo Bots Operator State Machine - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic Operator Journey

import { Page, expect } from '@playwright/test';
import { typeHuman, clickHuman, think, scrollHuman, fillHuman, ensureBlankTerminal } from './human';
import { personas } from './personas';

export async function operatorJourney(page: Page, wpm = 36, err = 0.06) {
  const persona = personas.amelia;
  
  try {
    // Login to beta operator terminal
    await page.goto('/beta/operator');
    await think(1200);
    
    // Clear browser data to ensure blank terminal
    await ensureBlankTerminal(page);
    
    // Ensure we're on a blank login screen
    await page.waitForLoadState('networkidle');
    await think(800);
    
    // Beta terminals don't require login - they go straight to dashboard
    // Wait for the beta terminal to load completely
    await think(2000);
    
    // Check if we're on the beta terminal dashboard
    const dashboardIndicators = [
      'text=Beta Operator Terminal',
      'text=FCA Compliant',
      'text=Beta Testing',
      'text=AI Testing Mode'
    ];
    
    let dashboardLoaded = false;
    for (const indicator of dashboardIndicators) {
      if (await page.locator(indicator).count() > 0) {
        dashboardLoaded = true;
        console.log(`✅ Beta Operator Terminal loaded - found: ${indicator}`);
        break;
      }
    }
    
    if (!dashboardLoaded) {
      console.log('⚠️ Beta terminal may not be fully loaded, continuing anyway...');
    }

    // Navigate to requests
    const requestSelectors = [
      'text=Requests',
      'text=RFQs',
      'text=Incoming Requests',
      'a[href*="request"]',
      '[data-testid="requests"]'
    ];

    let foundRequests = false;
    for (const selector of requestSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        foundRequests = true;
        break;
      }
    }

    if (!foundRequests) {
      // Try to find any request-related content
      await scrollHuman(page);
      await think(1000);
    }

    // Look for a request to view
    const viewRequestSelectors = [
      'text=View Request',
      'text=View',
      'text=Details',
      'button:has-text("View")',
      'a:has-text("View")',
      '[data-testid="view-request"]'
    ];

    let foundViewRequest = false;
    for (const selector of viewRequestSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        foundViewRequest = true;
        break;
      }
    }

    if (!foundViewRequest) {
      // Try clicking on any request item
      await clickHuman(page, '.request-item, .rfq-item, [data-testid="request-item"]');
    }

    await think(1200);

    // Look for quote form or response area
    const quoteSelectors = [
      'textarea[name=offer_notes]',
      'textarea[name=notes]',
      'textarea[placeholder*="note"]',
      'textarea[placeholder*="response"]',
      '#notes',
      '#response'
    ];

    for (const selector of quoteSelectors) {
      if (await page.locator(selector).count() > 0) {
        await fillHuman(page, selector, 'We can cover with G550. Crew available. Reposition applies.', wpm, err);
        break;
      }
    }

    // Fill price
    const priceSelectors = [
      'input[name=price]',
      'input[type=number]',
      'input[placeholder*="price"]',
      'input[placeholder*="cost"]',
      '#price'
    ];

    for (const selector of priceSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        const price = String(14500 + Math.floor(Math.random() * 1500));
        await page.keyboard.type(price);
        break;
      }
    }

    await think(1000);

    // Submit quote
    const quoteSubmitSelectors = [
      'button:has-text("Send Quote")',
      'button:has-text("Submit Quote")',
      'button:has-text("Respond")',
      'button:has-text("Send")',
      'button[type=submit]'
    ];

    for (const selector of quoteSubmitSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        break;
      }
    }

    await think(1400);

    // Look for success message
    const successSelectors = [
      'text=Quote sent',
      'text=Response sent',
      'text=Success',
      '.success',
      '[data-testid="success"]'
    ];

    let foundSuccess = false;
    for (const selector of successSelectors) {
      if (await page.locator(selector).count() > 0) {
        await expect(page.locator(selector)).toBeVisible();
        foundSuccess = true;
        break;
      }
    }

    if (!foundSuccess) {
      // If no success message, just wait a bit
      await think(2000);
    }

  } catch (error) {
    console.error('Operator journey error:', error);
    // Continue anyway - this is a demo
  }
}
