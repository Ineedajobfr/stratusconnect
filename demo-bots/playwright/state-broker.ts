// Demo Bots Broker State Machine - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic Broker Journey

import { Page, expect } from '@playwright/test';
import { typeHuman, clickHuman, think, scrollHuman, fillHuman, ensureBlankTerminal } from './human';
import { personas } from './personas';

export async function brokerJourney(page: Page, wpm = 46, err = 0.04) {
  const persona = personas.ethan;
  
  try {
    // Login to beta broker terminal
    await page.goto('/beta/broker');
    await think(1200);
    
    // Clear browser data to ensure blank terminal
    await ensureBlankTerminal(page);
    
    // Ensure we're on a blank login screen
    await page.waitForLoadState('networkidle');
    await think(800);
    
    // Always start with fresh login - look for login form
    const loginSelectors = [
      'input[name=email]',
      'input[type=email]',
      'input[placeholder*="email"]',
      'input[placeholder*="Email"]'
    ];
    
    let foundLogin = false;
    for (const selector of loginSelectors) {
      if (await page.locator(selector).count() > 0) {
        foundLogin = true;
        break;
      }
    }
    
    if (!foundLogin) {
      // Look for login button/link to get to login form
      const loginButtonSelectors = [
        'text=Login',
        'text=Sign In',
        'button:has-text("Login")',
        'button:has-text("Sign In")',
        'a:has-text("Login")',
        'a:has-text("Sign In")'
      ];
      
      for (const selector of loginButtonSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          await think(800);
          break;
        }
      }
    }
    
    // Now perform fresh login
    await fillHuman(page, 'input[name=email], input[type=email], input[placeholder*="email"], input[placeholder*="Email"]', persona.email, wpm);
    await fillHuman(page, 'input[name=password], input[type=password], input[placeholder*="password"], input[placeholder*="Password"]', persona.password, wpm);
    
    // Submit login
    const submitSelectors = [
      'button[type=submit]',
      'button:has-text("Login")',
      'button:has-text("Sign In")',
      'button:has-text("Submit")'
    ];
    
    for (const selector of submitSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        break;
      }
    }
    
    await think(1600);

    // Browse dashboard
    await scrollHuman(page);
    await think(1000);

    // Look for new request button or RFQ creation
    const newRequestSelectors = [
      'text=New Request',
      'text=Create RFQ',
      'text=Post Request',
      'button:has-text("New")',
      '[data-testid="new-request"]'
    ];

    let foundNewRequest = false;
    for (const selector of newRequestSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        foundNewRequest = true;
        break;
      }
    }

    if (!foundNewRequest) {
      // Try to find any form or input to create a request
      await clickHuman(page, 'input[placeholder*="origin"], input[placeholder*="from"]');
      await think(800);
    }

    // Fill out RFQ form
    const originSelectors = [
      'input[name=origin]',
      'input[placeholder*="origin"]',
      'input[placeholder*="from"]',
      '#origin'
    ];

    for (const selector of originSelectors) {
      if (await page.locator(selector).count() > 0) {
        await fillHuman(page, selector, 'London Luton', wpm, err);
        break;
      }
    }

    const destinationSelectors = [
      'input[name=destination]',
      'input[placeholder*="destination"]',
      'input[placeholder*="to"]',
      '#destination'
    ];

    for (const selector of destinationSelectors) {
      if (await page.locator(selector).count() > 0) {
        await fillHuman(page, selector, 'Nice', wpm, err);
        break;
      }
    }

    // Fill date
    const dateSelectors = [
      'input[name=date]',
      'input[type=date]',
      'input[placeholder*="date"]'
    ];

    for (const selector of dateSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        await page.keyboard.type('2025-10-10');
        break;
      }
    }

    // Select aircraft type
    const aircraftSelectors = [
      'select[name=aircraft_type]',
      'select[name=aircraft]',
      'select[data-testid="aircraft"]'
    ];

    for (const selector of aircraftSelectors) {
      if (await page.locator(selector).count() > 0) {
        await page.selectOption(selector, { label: 'Gulfstream G550' });
        break;
      }
    }

    await think(1500);

    // Submit or abandon
    if (Math.random() < 0.1) {
      // 10% chance to abandon
      const cancelSelectors = [
        'text=Cancel',
        'button:has-text("Cancel")',
        'button:has-text("Close")'
      ];
      
      for (const selector of cancelSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          break;
        }
      }
    } else {
      // Submit the request
      const submitSelectors = [
        'button:has-text("Send Request")',
        'button:has-text("Submit")',
        'button:has-text("Create")',
        'button[type=submit]'
      ];

      for (const selector of submitSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          break;
        }
      }

      await think(1500);

      // Look for success message
      const successSelectors = [
        'text=Request sent',
        'text=RFQ created',
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
    }

  } catch (error) {
    console.error('Broker journey error:', error);
    // Continue anyway - this is a demo
  }
}
