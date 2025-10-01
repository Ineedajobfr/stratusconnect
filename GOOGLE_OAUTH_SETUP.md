# 🔐 GOOGLE OAUTH SETUP FOR STRATUSCONNECT

## ✅ YOUR SUPABASE PROJECT
**Project ID**: `pvgqfqkrtflpvajhddhr`
**Project URL**: `https://pvgqfqkrtflpvajhddhr.supabase.co`

---

## 🚀 QUICK SETUP (5 MINUTES)

### **STEP 1: Enable Google in Supabase**

1. Go to: [https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers](https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers)

2. Scroll down to find **"Google"**

3. Toggle **ON** "Enable Sign in with Google"

4. **OPTION A - Use Supabase OAuth (Easiest):**
   - Just toggle it ON
   - Click **Save**
   - ✅ **DONE! That's it!**

5. **OPTION B - Use Your Own Google OAuth (Advanced):**
   - Follow the instructions below to get your own Google credentials

---

## 🔧 OPTION B: CUSTOM GOOGLE OAUTH SETUP

### **A. Create Google OAuth Credentials**

1. Go to: [https://console.cloud.google.com](https://console.cloud.google.com)

2. Create a new project:
   - Click project dropdown (top left)
   - Click **"NEW PROJECT"**
   - **Project name**: "StratusConnect"
   - Click **Create**

3. Enable Google+ API:
   - Go to **APIs & Services** → **Library**
   - Search for "Google+ API"
   - Click **Enable**

### **B. Create OAuth 2.0 Credentials**

1. Go to **APIs & Services** → **Credentials**

2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**

3. Configure consent screen (if prompted):
   - **User Type**: External
   - Click **Create**
   - **App name**: "StratusConnect"
   - **User support email**: Your email
   - **Developer contact**: Your email
   - Click **Save and Continue** (3 times)
   - Click **Back to Dashboard**

4. Create OAuth client ID:
   - **Application type**: Web application
   - **Name**: "StratusConnect Web Auth"
   
5. **Authorized JavaScript origins**:
   ```
   http://localhost:5173
   https://pvgqfqkrtflpvajhddhr.supabase.co
   ```

6. **Authorized redirect URIs**:
   ```
   http://localhost:8080/auth/callback
   https://pvgqfqkrtflpvajhddhr.supabase.co/auth/v1/callback
   ```

7. Click **CREATE**

8. **COPY YOUR CREDENTIALS**:
   - **Client ID**: `xxxxxxxxxx.apps.googleusercontent.com`
   - **Client Secret**: `GOCSPX-xxxxxxxxxxxxx`
   - ⚠️ **Save these somewhere safe!**

### **C. Add Credentials to Supabase**

1. Go back to Supabase: [https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers](https://supabase.com/dashboard/project/pvgqfqkrtflpvajhddhr/auth/providers)

2. Find **Google** provider

3. Paste your credentials:
   - **Authorized Client ID**: Your Google Client ID
   - **Client Secret (optional)**: Your Google Client Secret

4. Click **Save**

---

## 🧪 TEST THE INTEGRATION

### **1. Start Your Development Server**
```bash
npm run dev
```

### **2. Navigate to Auth Page**
```
http://localhost:5173/auth
```

### **3. Test Google Sign-In**
1. Click **"Continue with Google"**
2. Google login popup should appear
3. Select your Google account
4. Grant permissions
5. You'll be redirected to `/auth/callback`
6. Should see your email on the loading screen
7. Auto-redirect to terminal selection or dashboard

### **4. Check Browser Console**
Open DevTools (F12) → Console to see:
- "User authenticated: {user data}"
- Any errors will appear here

---

## 🐛 TROUBLESHOOTING

### **❌ "Redirect URI mismatch"**
**Fix**: Make sure these match EXACTLY in Google Console:
```
http://localhost:5173/auth/callback
https://pvgqfqkrtflpvajhddhr.supabase.co/auth/v1/callback
```

### **❌ "Access blocked: This app's request is invalid"**
**Fix**: 
- Complete the OAuth consent screen in Google Cloud Console
- Add your email to test users
- Make sure Google+ API is enabled

### **❌ Stuck on callback page**
**Fix**:
- Check browser console for errors
- Verify Supabase URL in `client.ts` is correct
- Clear browser cache and cookies
- Try again

### **❌ "Invalid client"**
**Fix**:
- Double-check Client ID and Secret
- Make sure you copied them correctly (no extra spaces)
- Regenerate credentials if needed

---

## ✅ CURRENT STATUS

**Code Status**: ✅ **100% READY**
- ✅ Google OAuth integrated in AuthContext
- ✅ Auth page updated with Google button
- ✅ Callback page created with email display
- ✅ Route registered in App.tsx
- ✅ Error handling implemented
- ✅ Role-based routing ready

**Supabase Configuration**: ⏳ **NEEDS YOUR ACTION**
- Enable Google provider in Supabase dashboard
- Either use Supabase's OAuth OR add your own Google credentials

---

## 🎯 NEXT STEPS

1. **Enable Google in Supabase** (takes 30 seconds)
2. **Test login** at `http://localhost:5173/auth`
3. **Verify redirect** works to `/auth/callback`
4. **Confirm** user email shows during loading
5. **Check** auto-routing to terminal works

**That's it!** Once you enable Google in Supabase, everything will work! 🎉

---

## 📞 NEED HELP?

If you get stuck, share:
1. Screenshot of any error messages
2. Browser console output (F12)
3. Which step you're on

I'll help you troubleshoot! 👨‍✈️✨

