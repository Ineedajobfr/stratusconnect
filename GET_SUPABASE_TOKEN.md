# Get Supabase Access Token

## 🎯 Quick Steps

### Step 1: Go to Supabase Dashboard
1. **Open**: https://supabase.com/dashboard/account/tokens
2. **Login** with your Supabase account

### Step 2: Create New Token
1. **Click**: "Generate new token"
2. **Name**: "StratusConnect Auth Config" (or any name you want)
3. **Expires**: Choose "No expiration" for development
4. **Scopes**: Select "All" or at least:
   - ✅ `Projects:read`
   - ✅ `Projects:write`

### Step 3: Copy Token
1. **Copy** the generated token (it looks like: `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
2. **Save it somewhere safe** - you won't be able to see it again!

## 🚀 Run the Configuration Script

### Option 1: PowerShell (Recommended for Windows)
```powershell
# Run this in PowerShell
.\configure_supabase_auth.ps1
```

### Option 2: Node.js
```bash
# Run this in terminal
node configure_supabase_auth.js
```

### Option 3: Bash (if you have Git Bash)
```bash
# Run this in Git Bash
./configure_supabase_auth.sh
```

## 📋 What the Script Does

✅ **Enables email signup**  
✅ **Enables email confirmations**  
✅ **Sets site URL** to `http://localhost:8081`  
✅ **Configures redirect URLs** for all terminals  
✅ **Customizes email templates** with StratusConnect branding  
✅ **Enables email provider**  

## 🔧 Manual Alternative

If the script doesn't work, you can configure these settings manually in the Supabase Dashboard:

### Authentication → Settings → Auth Providers → Email:
- ✅ Enable email signup
- ✅ Enable email confirmations  
- ✅ Enable email change confirmations

### Authentication → Settings → URL Configuration:
- **Site URL**: `http://localhost:8081`
- **Redirect URLs**: 
  - `http://localhost:8081/auth/callback`
  - `http://localhost:8081/**`

### Authentication → Settings → Emails → Templates:
- **Magic Link Template**: Customize with your branding
- **Confirm Signup Template**: Customize with your branding

## 🎉 After Configuration

Once configured, your magic link authentication will work for:
- ✅ **Admin login** (`/staff-portal`)
- ✅ **Broker login** (`/login/broker`)  
- ✅ **Operator login** (`/login/operator`)
- ✅ **Pilot login** (`/login/pilot`)
- ✅ **Crew login** (`/login/crew`)
- ✅ **General login** (`/login`)

## 🔍 Troubleshooting

### Issue: "Invalid token" error
**Solution**: Make sure you copied the full token including the `sbp_` prefix

### Issue: "Permission denied" error  
**Solution**: Make sure your token has the correct scopes (Projects:read, Projects:write)

### Issue: "Network error"
**Solution**: Check your internet connection and try again

### Issue: Script doesn't exist
**Solution**: Make sure you're in the right directory where the script files are located

---

**Token URL**: https://supabase.com/dashboard/account/tokens  
**Script Files**: 
- `configure_supabase_auth.ps1` (PowerShell)
- `configure_supabase_auth.js` (Node.js)  
- `configure_supabase_auth.sh` (Bash)

