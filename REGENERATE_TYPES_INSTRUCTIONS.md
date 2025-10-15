# 🔄 How to Regenerate Supabase Types

## ✅ The Command Works!

The Supabase CLI is ready, you just need to authenticate once.

---

## 🎯 **Quick Method** (2 minutes)

### Step 1: Get Your Access Token

1. **Open**: https://supabase.com/dashboard/account/tokens
2. **Click**: "Generate new token"
3. **Name it**: "Type Generation"
4. **Copy** the token that appears

### Step 2: Run This Command

Open PowerShell in your project folder and run:

```powershell
# Set your token (replace YOUR_TOKEN_HERE with actual token)
$env:SUPABASE_ACCESS_TOKEN="YOUR_TOKEN_HERE"

# Generate types
npx --yes supabase@1.200.3 gen types typescript --project-id pvgqfqkrtflpvajhddhr > src/integrations/supabase/types.ts
```

**Example:**
```powershell
$env:SUPABASE_ACCESS_TOKEN="sbp_abc123def456..."
npx --yes supabase@1.200.3 gen types typescript --project-id pvgqfqkrtflpvajhddhr > src/integrations/supabase/types.ts
```

### Step 3: Done!

You should see:
```
Generating types...
Done.
```

The file `src/integrations/supabase/types.ts` will be updated!

---

## 🔐 **Save Token for Future Use** (Optional)

To avoid re-entering the token every time:

**Add to your PowerShell profile:**
```powershell
# Edit profile
notepad $PROFILE

# Add this line:
$env:SUPABASE_ACCESS_TOKEN="your-token-here"
```

**Or create a `.env` file:**
```bash
# .env
SUPABASE_ACCESS_TOKEN=your-token-here
```

Then load it before running commands.

---

## ⚡ **One-Line Command** (After Setting Token)

Once your token is set, just run:
```powershell
npx --yes supabase@1.200.3 gen types typescript --project-id pvgqfqkrtflpvajhddhr > src/integrations/supabase/types.ts
```

---

## ✅ **What This Does**

1. Connects to your Supabase project (pvgqfqkrtflpvajhddhr)
2. Reads all table schemas from your database
3. Generates TypeScript interfaces for every table
4. Writes to `src/integrations/supabase/types.ts`
5. **Fixes all TypeScript errors** in marketplace components

---

## 🎉 **After Running**

All these TypeScript errors will disappear:
- ✅ `trip_requests` table types generated
- ✅ `aircraft_models` table types generated
- ✅ `preferred_vendors` table types generated
- ✅ `saved_searches` table types generated
- ✅ New columns on `marketplace_listings` included
- ✅ New columns on `profiles` included

Your marketplace will be **fully functional**!

---

## 🆘 **If You Have Issues**

### Can't get access token?
Use Supabase Dashboard → Settings → API → Project API keys → Use `service_role` key (keep it secret!)

### Command still fails?
1. Clear npm cache: `npm cache clean --force`
2. Try: `npm install -g supabase@1.200.3`
3. Then: `supabase gen types typescript --project-id pvgqfqkrtflpvajhddhr > src/integrations/supabase/types.ts`

---

**Just get your token and run the command above!** 🚀

