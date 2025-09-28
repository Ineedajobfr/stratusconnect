// Demo Bots Pilot Spec - Beta Terminal Testing
// FCA Compliant Aviation Platform - Proof of Life System

import { test, chromium, expect } from '@playwright/test';
import { pilotJourney } from './state-pilot';

async function record(action: string, payload?: Record<string, unknown>) {
  const url = process.env.SUPABASE_EVENTS_URL;
  if (!url) {
    console.log(`No SUPABASE_EVENTS_URL set, skipping event: ${action}`);
    return;
  }
  
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ 
        actor_role: 'pilot', 
        action, 
        payload, 
        client_tz: 'Europe/London',
        context: 'beta-terminal-testing'
      }])
    });
    console.log(`Recorded event: ${action}`);
  } catch (error) {
    console.error(`Failed to record event ${action}:`, error);
  }
}

test('pilot journey - beta terminal', async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ 
    baseURL: process.env.STRATUS_URL || 'http://localhost:8086'
  });
  const page = await ctx.newPage();

  try {
    await record('start_session', { 
      terminal: 'beta-pilot',
      timestamp: new Date().toISOString()
    });

    await pilotJourney(page);

    await record('end_session', { 
      terminal: 'beta-pilot',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    await record('session_error', { 
      error: error.message,
      terminal: 'beta-pilot'
    });
    throw error;
  } finally {
    await browser.close();
  }

  expect(true).toBeTruthy();
});
