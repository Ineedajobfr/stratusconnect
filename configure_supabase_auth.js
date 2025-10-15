#!/usr/bin/env node

/**
 * Supabase Authentication Configuration Script (Node.js)
 * This script configures Supabase authentication settings via API calls
 */

const https = require('https');
const readline = require('readline');

const SUPABASE_URL = 'https://pvgqfqkrtflpvajhddhr.supabase.co';
const SUPABASE_PROJECT_REF = 'pvgqfqkrtflpvajhddhr';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'pvgqfqkrtflpvajhddhr.supabase.co',
      port: 443,
      path: `/rest/v1/projects/${SUPABASE_PROJECT_REF}${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function configureSupabaseAuth() {
  console.log('🚀 Configuring Supabase Authentication Settings...\n');

  // Get access token from user
  const token = await question('Enter your Supabase Access Token (get it from https://supabase.com/dashboard/account/tokens): ');
  
  if (!token) {
    console.log('❌ Error: Access token is required');
    console.log('Get your token from: https://supabase.com/dashboard/account/tokens');
    process.exit(1);
  }

  try {
    console.log('📧 Configuring email authentication...');
    
    // Configure email provider settings
    const emailConfig = {
      auth: {
        enable_email_signup: true,
        enable_email_confirmations: true,
        enable_email_change_confirmations: true,
        enable_phone_signup: false,
        enable_phone_confirmations: false,
        enable_anonymous_signup: false,
        enable_signup: true,
        site_url: 'http://localhost:8081',
        redirect_urls: [
          'http://localhost:8081/auth/callback',
          'http://localhost:8081/**'
        ]
      }
    };

    await makeRequest('/config', 'PATCH', emailConfig, token);
    console.log('✅ Email authentication configured successfully');

    console.log('🔗 Configuring URL settings...');
    
    // Configure URL settings
    const urlConfig = {
      auth: {
        site_url: 'http://localhost:8081',
        redirect_urls: [
          'http://localhost:8081/auth/callback',
          'http://localhost:8081/**',
          'http://localhost:8081',
          'http://localhost:8081/',
          'http://localhost:8081/admin',
          'http://localhost:8081/broker-terminal',
          'http://localhost:8081/operator-terminal',
          'http://localhost:8081/pilot-terminal',
          'http://localhost:8081/crew-terminal'
        ]
      }
    };

    await makeRequest('/config', 'PATCH', urlConfig, token);
    console.log('✅ URL settings configured successfully');

    console.log('📧 Configuring email templates...');
    
    // Configure email templates
    const templateConfig = {
      auth: {
        email_templates: {
          magic_link: {
            subject: 'Your StratusConnect Login Link',
            body: `<h2>Welcome to StratusConnect</h2>
<p>Click the link below to access your terminal:</p>
<p><a href="{{ .ConfirmationURL }}">Access StratusConnect</a></p>
<p>This link will expire in 10 minutes.</p>
<p>If you didn't request this link, please ignore this email.</p>`
          },
          confirm_signup: {
            subject: 'Confirm Your StratusConnect Account',
            body: `<h2>Welcome to StratusConnect</h2>
<p>Please confirm your email address to complete your registration:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Your Account</a></p>
<p>This link will expire in 24 hours.</p>`
          }
        }
      }
    };

    await makeRequest('/config', 'PATCH', templateConfig, token);
    console.log('✅ Email templates configured successfully');

    console.log('🔐 Configuring authentication providers...');
    
    // Enable email provider
    const providerConfig = {
      auth: {
        external: {
          email: {
            enabled: true
          }
        }
      }
    };

    await makeRequest('/config', 'PATCH', providerConfig, token);
    console.log('✅ Email provider enabled successfully');

    console.log('📊 Testing configuration...');
    
    // Test the configuration
    const config = await makeRequest('/config', 'GET', null, token);
    console.log('✅ Configuration test successful');
    console.log('Current settings:');
    console.log(`  - Email signup enabled: ${config.auth.enable_email_signup}`);
    console.log(`  - Email confirmations enabled: ${config.auth.enable_email_confirmations}`);
    console.log(`  - Site URL: ${config.auth.site_url}`);

    console.log('\n🎉 Supabase Authentication Configuration Complete!\n');
    console.log('✅ What was configured:');
    console.log('   - Email signup enabled');
    console.log('   - Email confirmations enabled');
    console.log('   - Site URL set to http://localhost:8081');
    console.log('   - Redirect URLs configured for all terminals');
    console.log('   - Magic link email template customized');
    console.log('   - Email provider enabled');
    console.log('\n🚀 Next steps:');
    console.log('   1. Test admin login at: http://localhost:8081/staff-portal');
    console.log('   2. Test user login at: http://localhost:8081/login/broker');
    console.log('   3. Check your email for magic links');
    console.log('\n💡 If you still get OTP errors, wait 2-3 minutes for settings to propagate');

  } catch (error) {
    console.error('❌ Error configuring Supabase:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the configuration
configureSupabaseAuth().catch(console.error);

