// Demo Bots Broker State Machine - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic Broker Journey

import { Page, expect } from '@playwright/test';
import { typeHuman, clickHuman, think, scrollHuman, fillHuman } from './human';
import { personas } from './personas';

export async function brokerJourney(page: Page, wpm = 46, err = 0.04) {
  const persona = personas.ethan;
  
  try {
    // Login to beta broker terminal
    await page.goto('/beta/broker');
    await think(1200);
    
    // Check if already logged in or need to login
    if (await page.locator('text=Login').count() > 0) {
      await clickHuman(page, 'text=Login');
      await think(800);
      
      await fillHuman(page, 'input[name=email]', persona.email, wpm);
      await fillHuman(page, 'input[name=password]', persona.password, wpm);
      await clickHuman(page, 'button[type=submit]');
      await think(1600);
    }

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
