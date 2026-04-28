# 🔧 Supabase Setup Guide for AEGIS HUD

## ❌ Current Issue
You're seeing "Invalid API key" because your Supabase credentials are not properly configured.

## ✅ Quick Fix

### Step 1: Get Supabase Credentials
1. Go to **https://supabase.com/dashboard**
2. **Create a new project** or select existing one
3. Go to **Settings → API**
4. Copy these two values:
   - **Project URL** (e.g., `https://abcdefghijk.supabase.co`)
   - **Anon public key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

### Step 2: Update Environment File
Edit `frontend/.env.local` and replace:

```env
# Replace this URL with your actual project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Replace this with your actual anon key (NOT the URL!)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

### Step 3: Enable Authentication
In your Supabase dashboard:
1. Go to **Authentication → Providers**
2. Make sure **Email** is enabled
3. **Optional**: Enable Google OAuth if you want Google sign-in

### Step 4: Restart Frontend Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🎯 What Should Happen
- ✅ No more "Invalid API key" errors
- ✅ Sign up/sign in works properly
- ✅ You can access all AEGIS HUD features

## 🆘 Still Having Issues?
1. **Check browser console** for detailed error messages
2. **Verify your Supabase project** is active and not paused
3. **Double-check the anon key** - it should be very long and start with `eyJ`
4. **Make sure you copied the anon key, not the service role key**

## 📋 Example Valid Configuration
```env
VITE_SUPABASE_URL=https://znvvffqbutweumjfdcvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudnZmZnFidXR3ZXVtamZkY3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg1NzYwMDAsImV4cCI6MjAwNDEzMjAwMH0.actual-signature-here
```

The anon key should be **much longer** than what you currently have!