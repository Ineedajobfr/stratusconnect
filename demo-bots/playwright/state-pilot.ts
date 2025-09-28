// Demo Bots Pilot State Machine - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic Pilot Journey

import { Page, expect } from '@playwright/test';
import { typeHuman, clickHuman, think, scrollHuman, fillHuman, ensureBlankTerminal } from './human';
import { personas } from './personas';

export async function pilotJourney(page: Page, wpm = 40, err = 0.03) {
  const persona = personas.sam;
  
  try {
    // Login to beta pilot terminal
    await page.goto('/beta/pilot');
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

    // Navigate to assignments
    const assignmentSelectors = [
      'text=Assignments',
      'text=Jobs',
      'text=Available Flights',
      'text=Opportunities',
      'a[href*="assignment"]',
      '[data-testid="assignments"]'
    ];

    let foundAssignments = false;
    for (const selector of assignmentSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        foundAssignments = true;
        break;
      }
    }

    if (!foundAssignments) {
      // Try to find any assignment-related content
      await scrollHuman(page);
      await think(1000);
    }

    // Look for assignments to accept
    const acceptSelectors = [
      'text=Accept Assignment',
      'text=Accept',
      'text=Apply',
      'button:has-text("Accept")',
      'button:has-text("Apply")',
      '[data-testid="accept-assignment"]'
    ];

    let foundAccept = false;
    for (const selector of acceptSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        foundAccept = true;
        break;
      }
    }

    if (foundAccept) {
      await think(1200);

      // Look for confirmation or success message
      const successSelectors = [
        'text=Assignment accepted',
        'text=Application submitted',
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
    } else {
      // No assignments available, just browse around
      await scrollHuman(page);
      await think(1000);
      
      // Try to find any interactive elements
      const interactiveSelectors = [
        'button',
        'a',
        '[role="button"]',
        '[data-testid]'
      ];

      for (const selector of interactiveSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          await think(500);
          break;
        }
      }
    }

  } catch (error) {
    console.error('Pilot journey error:', error);
    // Continue anyway - this is a demo
  }
}
