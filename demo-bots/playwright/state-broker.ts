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
    
    // Beta terminals don't require login - they go straight to dashboard
    // Wait for the beta terminal to load completely
    await think(2000);
    
    // Check if we're on the beta terminal dashboard
    const dashboardIndicators = [
      'text=Beta Broker Terminal',
      'text=FCA Compliant',
      'text=Beta Testing',
      'text=AI Testing Mode'
    ];
    
    let dashboardLoaded = false;
    for (const indicator of dashboardIndicators) {
      if (await page.locator(indicator).count() > 0) {
        dashboardLoaded = true;
        console.log(`✅ Beta Broker Terminal loaded - found: ${indicator}`);
        break;
      }
    }
    
    if (!dashboardLoaded) {
      console.log('⚠️ Beta terminal may not be fully loaded, continuing anyway...');
    }

    // Browse dashboard
    await scrollHuman(page);
    await think(1000);

    // Navigate to RFQs tab to create new request
    const rfqTabSelectors = [
      '[role="tab"]:has-text("RFQs")',
      'button:has-text("RFQs")',
      'text=RFQs'
    ];

    let foundRfqTab = false;
    for (const selector of rfqTabSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        foundRfqTab = true;
        console.log('✅ Clicked RFQs tab');
        break;
      }
    }

    if (foundRfqTab) {
      await think(1500); // Wait for tab content to load
      
      // Look for "Create New RFQ" button
      const createRfqSelectors = [
        'text=Create New RFQ',
        'button:has-text("Create New RFQ")',
        'button:has-text("Create")',
        'button:has-text("New RFQ")'
      ];

      let foundCreateButton = false;
      for (const selector of createRfqSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          foundCreateButton = true;
          console.log('✅ Clicked Create New RFQ button');
          break;
        }
      }

      if (!foundCreateButton) {
        console.log('⚠️ Could not find Create New RFQ button, continuing...');
      }
    } else {
      console.log('⚠️ Could not find RFQs tab, continuing...');
    }

    // Fill out RFQ form - wait for form to load
    await think(1000);
    
    // Fill From field (IATA code)
    const fromSelectors = [
      'input[id*="from_"]',
      'input[placeholder="LHR"]',
      'input[placeholder*="From"]'
    ];

    let filledFrom = false;
    for (const selector of fromSelectors) {
      if (await page.locator(selector).count() > 0) {
        await fillHuman(page, selector, 'LTN', wpm, err); // London Luton
        filledFrom = true;
        console.log('✅ Filled From field');
        break;
      }
    }

    // Fill To field (IATA code)
    const toSelectors = [
      'input[id*="to_"]',
      'input[placeholder="JFK"]',
      'input[placeholder*="To"]'
    ];

    let filledTo = false;
    for (const selector of toSelectors) {
      if (await page.locator(selector).count() > 0) {
        await fillHuman(page, selector, 'NCE', wpm, err); // Nice
        filledTo = true;
        console.log('✅ Filled To field');
        break;
      }
    }

    // Fill departure date
    const dateSelectors = [
      'input[id*="date_"]',
      'input[type="date"]'
    ];

    let filledDate = false;
    for (const selector of dateSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        await page.keyboard.type('2025-02-15'); // Future date
        filledDate = true;
        console.log('✅ Filled departure date');
        break;
      }
    }

    // Fill departure time
    const timeSelectors = [
      'input[id*="time_"]',
      'input[type="time"]'
    ];

    let filledTime = false;
    for (const selector of timeSelectors) {
      if (await page.locator(selector).count() > 0) {
        await clickHuman(page, selector);
        await page.keyboard.type('10:00'); // 10 AM
        filledTime = true;
        console.log('✅ Filled departure time');
        break;
      }
    }

    // Fill passengers count
    const passengersSelectors = [
      'input[id*="passengers_"]',
      'input[placeholder*="passengers"]'
    ];

    let filledPassengers = false;
    for (const selector of passengersSelectors) {
      if (await page.locator(selector).count() > 0) {
        await fillHuman(page, selector, '8', wpm, err);
        filledPassengers = true;
        console.log('✅ Filled passengers count');
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
        'button:has-text("Close")',
        'button:has-text("Discard")'
      ];
      
      for (const selector of cancelSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          console.log('❌ Abandoned RFQ creation');
          break;
        }
      }
    } else {
      // Submit the request - look for MultiLegRFQ submit button
      const submitSelectors = [
        'button:has-text("Submit RFQ")',
        'button:has-text("Send Request")',
        'button:has-text("Create RFQ")',
        'button:has-text("Submit")',
        'button:has-text("Create")',
        'button[type=submit]'
      ];

      let submitted = false;
      for (const selector of submitSelectors) {
        if (await page.locator(selector).count() > 0) {
          await clickHuman(page, selector);
          submitted = true;
          console.log('✅ Submitted RFQ');
          break;
        }
      }

      if (submitted) {
        await think(2000);

        // Look for success message or confirmation
        const successSelectors = [
          'text=RFQ created',
          'text=Request sent',
          'text=Success',
          'text=Submitted',
          '.success',
          '[data-testid="success"]'
        ];

        let foundSuccess = false;
        for (const selector of successSelectors) {
          if (await page.locator(selector).count() > 0) {
            console.log('✅ RFQ submission confirmed');
            foundSuccess = true;
            break;
          }
        }

        if (!foundSuccess) {
          console.log('⚠️ No success message found, but RFQ may have been submitted');
        }
      } else {
        console.log('⚠️ Could not find submit button');
      }
    }

  } catch (error) {
    console.error('Broker journey error:', error);
    // Continue anyway - this is a demo
  }
}
