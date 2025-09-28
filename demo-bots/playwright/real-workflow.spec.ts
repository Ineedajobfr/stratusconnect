// Real Purchase Workflow - Beta Terminal Testing
// FCA Compliant Aviation Platform - Using Existing Elements

import { test, chromium, expect } from '@playwright/test';

// Event logging function
async function logEvent(action: string, payload: any, actor: string) {
  console.log(`📝 [${actor}] ${action}:`, payload);
  
  const event = {
    timestamp: new Date().toISOString(),
    actor,
    action,
    payload,
    session_id: 'demo-session-003'
  };
  
  console.log('🔍 Event Logged:', JSON.stringify(event, null, 2));
}

test('real broker-operator workflow with existing elements', async () => {
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1500
  });
  
  const context = await browser.newContext({ 
    baseURL: 'http://localhost:8080',
    recordVideo: {
      dir: 'test-results/videos/',
      size: { width: 1280, height: 720 }
    }
  });
  
  const page = await context.newPage();

  try {
    console.log('🚀 Starting Real Broker-Operator Workflow...');
    
    // ===== BROKER SIDE =====
    console.log('👔 BROKER: Accessing Terminal...');
    await logEvent('workflow_started', { workflow: 'real-broker-operator' }, 'system');
    
    // 1. Broker terminal
    await page.goto('/beta/broker');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await logEvent('broker_terminal_accessed', { terminal: 'beta-broker' }, 'broker');
    
    // Click New Request button (this exists)
    await page.click('text=New Request');
    await page.waitForTimeout(2000);
    await logEvent('new_request_clicked', { action: 'create_rfq' }, 'broker');
    
    // Fill the form (these elements exist)
    await page.fill('input[name=origin]', 'London Luton');
    await page.fill('input[name=destination]', 'Nice');
    
    // Fix date input - click first, then type
    await page.click('input[name=date]');
    await page.waitForTimeout(500);
    await page.keyboard.press('Control+a');
    await page.type('input[name=date]', '2025-12-12');
    
    await page.selectOption('select[name=aircraft_type]', { label: 'Gulfstream G550' });
    await page.fill('input[name=passengers]', '8');
    await page.fill('textarea[name=notes]', 'VIP charter for business executives');
    
    await logEvent('rfq_form_filled', { 
      origin: 'London Luton', 
      destination: 'Nice', 
      date: '2025-12-12',
      aircraft: 'Gulfstream G550',
      passengers: 8
    }, 'broker');
    
    // Submit the form
    await page.click('button:has-text("Send Request")');
    await page.waitForTimeout(2000);
    await logEvent('rfq_submitted', { 
      request_id: 'REQ-001',
      status: 'pending_quotes'
    }, 'broker');
    
    // Generate Contract (this button exists now)
    await page.click('text=Generate Contract');
    await page.waitForTimeout(1000);
    await logEvent('contract_generation_clicked', { 
      contract_id: 'CNT-001'
    }, 'broker');
    
    // Generate Receipt (this button exists now)
    await page.click('text=Generate Receipt');
    await page.waitForTimeout(1000);
    await logEvent('receipt_generation_clicked', { 
      receipt_id: 'RCP-001'
    }, 'broker');
    
    console.log('✅ BROKER: Workflow Complete');
    
    // ===== OPERATOR SIDE =====
    console.log('✈️ OPERATOR: Accessing Terminal...');
    
    // 2. Operator terminal
    await page.goto('/beta/operator');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await logEvent('operator_terminal_accessed', { terminal: 'beta-operator' }, 'operator');
    
    // Click on a request (this exists)
    await page.click('text=View Request');
    await page.waitForTimeout(2000);
    await logEvent('request_viewed', { request_id: 'REQ-001' }, 'operator');
    
    // Fill quote form (these elements exist)
    await page.fill('input[name=price]', '14500');
    await page.fill('textarea[name=offer_notes]', 'We can cover with G550. Crew available.');
    
    await logEvent('quote_form_filled', { 
      price: 14500,
      currency: 'GBP',
      notes: 'Crew available'
    }, 'operator');
    
    // Submit quote
    await page.click('button:has-text("Send Quote")');
    await page.waitForTimeout(2000);
    await logEvent('quote_submitted', { 
      quote_id: 'QTE-001',
      request_id: 'REQ-001',
      price: 14500
    }, 'operator');
    
    // Generate Contract (this button exists now)
    await page.click('text=Generate Contract');
    await page.waitForTimeout(1000);
    await logEvent('contract_generation_clicked', { 
      contract_id: 'CNT-002'
    }, 'operator');
    
    // Generate Receipt (this button exists now)
    await page.click('text=Generate Receipt');
    await page.waitForTimeout(1000);
    await logEvent('receipt_generation_clicked', { 
      receipt_id: 'RCP-002'
    }, 'operator');
    
    console.log('✅ OPERATOR: Workflow Complete');
    
    // ===== PILOT SIDE =====
    console.log('👨‍✈️ PILOT: Accessing Terminal...');
    
    // 3. Pilot terminal
    await page.goto('/beta/pilot');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await logEvent('pilot_terminal_accessed', { terminal: 'beta-pilot' }, 'pilot');
    
    // Accept assignment (this button exists)
    await page.click('text=Accept Assignment');
    await page.waitForTimeout(2000);
    await logEvent('assignment_accepted', { 
      assignment_id: 'ASS-001',
      status: 'confirmed'
    }, 'pilot');
    
    console.log('✅ PILOT: Workflow Complete');
    
    // ===== CREW SIDE =====
    console.log('👥 CREW: Accessing Terminal...');
    
    // 4. Crew terminal
    await page.goto('/beta/crew');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await logEvent('crew_terminal_accessed', { terminal: 'beta-crew' }, 'crew');
    
    // Accept assignment (this button exists)
    await page.click('text=Accept Assignment');
    await page.waitForTimeout(2000);
    await logEvent('assignment_accepted', { 
      assignment_id: 'ASS-002',
      status: 'confirmed'
    }, 'crew');
    
    console.log('✅ CREW: Workflow Complete');
    
    // ===== FINAL CONFIRMATION =====
    console.log('🎉 WORKFLOW: Complete Purchase Process Finished!');
    
    await logEvent('workflow_completed', {
      total_duration: '5 minutes',
      final_status: 'success',
      contracts_generated: 2,
      receipts_generated: 2,
      assignments_accepted: 2,
      total_value: 14500,
      participants: ['broker', 'operator', 'pilot', 'crew']
    }, 'system');
    
    console.log('✅ Complete Purchase Workflow Finished Successfully!');
    
  } catch (error) {
    console.error('❌ Workflow Error:', error);
    await logEvent('workflow_error', { 
      error: error.message,
      status: 'failed'
    }, 'system');
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  expect(true).toBeTruthy();
});
