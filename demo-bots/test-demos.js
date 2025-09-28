#!/usr/bin/env node
// Demo Bots Test Script - Beta Terminal Testing
// FCA Compliant Aviation Platform - Proof of Life System

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Demo Bots System...\n');

// Test 1: Check Playwright setup
console.log('1. Testing Playwright setup...');
const playwrightDir = path.join(__dirname, 'playwright');
const playwrightPackageJson = path.join(playwrightDir, 'package.json');
const playwrightConfig = path.join(playwrightDir, 'playwright.config.ts');

if (fs.existsSync(playwrightPackageJson)) {
  console.log('   ✅ Playwright package.json exists');
  const pkg = JSON.parse(fs.readFileSync(playwrightPackageJson, 'utf8'));
  if (pkg.scripts && pkg.scripts.test) {
    console.log('   ✅ Playwright test script configured');
  } else {
    console.log('   ❌ Playwright test script missing');
  }
} else {
  console.log('   ❌ Playwright package.json missing');
}

if (fs.existsSync(playwrightConfig)) {
  console.log('   ✅ Playwright config exists');
} else {
  console.log('   ❌ Playwright config missing');
}

// Test 2: Check Edge Functions setup
console.log('\n2. Testing Edge Functions setup...');
const edgeDir = path.join(__dirname, 'edge', 'events-recorder');
const edgeIndex = path.join(edgeDir, 'index.ts');
const edgeDenoJson = path.join(edgeDir, 'deno.json');

if (fs.existsSync(edgeIndex)) {
  console.log('   ✅ Edge function index.ts exists');
  const content = fs.readFileSync(edgeIndex, 'utf8');
  if (content.includes('SUPABASE_URL') && content.includes('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log('   ✅ Edge function has required environment variables');
  } else {
    console.log('   ❌ Edge function missing environment variables');
  }
} else {
  console.log('   ❌ Edge function index.ts missing');
}

if (fs.existsSync(edgeDenoJson)) {
  console.log('   ✅ Edge function deno.json exists');
} else {
  console.log('   ❌ Edge function deno.json missing');
}

// Test 3: Check Supabase setup
console.log('\n3. Testing Supabase setup...');
const supabaseDir = path.join(__dirname, 'supabase');
const schemaFile = path.join(supabaseDir, 'schema_demo.sql');
const seedFile = path.join(supabaseDir, 'seed_demo.sql');

if (fs.existsSync(schemaFile)) {
  console.log('   ✅ Supabase schema exists');
  const content = fs.readFileSync(schemaFile, 'utf8');
  if (content.includes('demo_events') && content.includes('demo_feedback')) {
    console.log('   ✅ Schema includes demo tables');
  } else {
    console.log('   ❌ Schema missing demo tables');
  }
} else {
  console.log('   ❌ Supabase schema missing');
}

if (fs.existsSync(seedFile)) {
  console.log('   ✅ Supabase seed data exists');
  const content = fs.readFileSync(seedFile, 'utf8');
  if (content.includes('demo.broker1@stratus.test') && content.includes('demo.operator1@stratus.test')) {
    console.log('   ✅ Seed data includes demo users');
  } else {
    console.log('   ❌ Seed data missing demo users');
  }
} else {
  console.log('   ❌ Supabase seed data missing');
}

// Test 4: Check test files
console.log('\n4. Testing Playwright test files...');
const testFiles = [
  'demo-video.spec.ts',
  'broker.spec.ts',
  'operator.spec.ts',
  'pilot.spec.ts',
  'full-workflow.spec.ts'
];

testFiles.forEach(file => {
  const filePath = path.join(playwrightDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

// Test 5: Check helper files
console.log('\n5. Testing helper files...');
const helperFiles = [
  'personas.ts',
  'human.ts',
  'state-broker.ts',
  'state-operator.ts',
  'state-pilot.ts'
];

helperFiles.forEach(file => {
  const filePath = path.join(playwrightDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
  }
});

console.log('\n🎯 Demo Bots System Test Complete!');
console.log('\n📋 Next Steps:');
console.log('1. Set environment variables:');
console.log('   - STRATUS_URL (e.g., http://localhost:8080)');
console.log('   - SUPABASE_EVENTS_URL (your Supabase Edge Function URL)');
console.log('   - SUPABASE_URL (your Supabase project URL)');
console.log('   - SUPABASE_SERVICE_ROLE_KEY (your service role key)');
console.log('\n2. Apply database schema and seed data');
console.log('\n3. Deploy Edge Function');
console.log('\n4. Run Playwright tests:');
console.log('   cd demo-bots/playwright');
console.log('   npm test');
console.log('\n5. View test reports and videos in test-results/');
