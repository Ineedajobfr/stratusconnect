// Demo Bots Pilot State Machine - Beta Terminal Testing
// FCA Compliant Aviation Platform - Realistic Pilot Journey

import { Page, expect } from '@playwright/test';
import { typeHuman, clickHuman, think, scrollHuman, fillHuman } from './human';
import { personas } from './personas';

export async function pilotJourney(page: Page, wpm = 40, err = 0.03) {
  const persona = personas.sam;
  
  try {
    // Login to beta pilot terminal
    await page.goto('/beta/pilot');
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
