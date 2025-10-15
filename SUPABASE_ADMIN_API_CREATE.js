// SUPABASE ADMIN API - Create Admin User
// Run this in Node.js or browser console

const SUPABASE_URL = 'https://pvgqfqkrtflpvajhddhr.supabase.co';
const SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY'; // Get this from Supabase Dashboard > Settings > API

async function createAdminUser() {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        email: 'stratuscharters@gmail.com',
        password: 'admin123',
        email_confirm: true,
        user_metadata: {
          full_name: 'StratusConnect Admin',
          role: 'admin',
          username: 'admin',
          verification_status: 'approved'
        }
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin user created:', data);
      return data;
    } else {
      console.error('❌ Error creating admin:', data);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return null;
  }
}

// Run the function
createAdminUser();

