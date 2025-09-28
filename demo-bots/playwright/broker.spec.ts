// Demo Bots Broker Spec - Beta Terminal Testing
// FCA Compliant Aviation Platform - Proof of Life System

import { test, chromium, expect } from '@playwright/test';
import { brokerJourney } from './state-broker';

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
        actor_role: 'broker', 
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

test('broker journey - beta terminal', async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ 
    baseURL: process.env.STRATUS_URL || 'http://localhost:8086'
  });
  const page = await ctx.newPage();

  try {
    await record('start_session', { 
      terminal: 'beta-broker',
      timestamp: new Date().toISOString()
    });

    await brokerJourney(page);

    await record('end_session', { 
      terminal: 'beta-broker',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    await record('session_error', { 
      error: error.message,
      terminal: 'beta-broker'
    });
    throw error;
  } finally {
    await browser.close();
  }

  expect(true).toBeTruthy();
});
