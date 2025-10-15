// Generate Supabase Types using Management API
// Alternative to CLI when there are npm conflicts

const https = require('https');
const fs = require('fs');

const PROJECT_ID = 'pvgqfqkrtflpvajhddhr';
const OUTPUT_FILE = 'src/integrations/supabase/types.ts';

console.log('🔄 Generating Supabase types via API...');
console.log(`Project ID: ${PROJECT_ID}\n`);

// This requires your Supabase access token
console.log('⚠️  This requires a Supabase access token.');
console.log('📝 Steps to get your token:');
console.log('   1. Go to https://supabase.com/dashboard/account/tokens');
console.log('   2. Create a new access token');
console.log('   3. Set environment variable: $env:SUPABASE_ACCESS_TOKEN="your-token"');
console.log('   4. Run this script again\n');

const token = process.env.SUPABASE_ACCESS_TOKEN;

if (!token) {
  console.log('❌ SUPABASE_ACCESS_TOKEN environment variable not set');
  console.log('\n💡 Alternative: Run this command manually in your terminal:');
  console.log(`   npx supabase@1.200.3 gen types typescript --project-id ${PROJECT_ID} > ${OUTPUT_FILE}`);
  process.exit(1);
}

// API call to generate types
const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${PROJECT_ID}/types/typescript`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      fs.writeFileSync(OUTPUT_FILE, data);
      console.log('✅ Types generated successfully!');
      console.log(`📄 Output: ${OUTPUT_FILE}`);
      console.log('\n🎉 All TypeScript errors should now be resolved!');
    } else {
      console.error(`❌ Error: ${res.statusCode}`);
      console.error(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.end();

