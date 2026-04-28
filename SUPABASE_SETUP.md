# 🔐 Supabase Setup Guide

Complete guide to configure Supabase authentication for APK Guardian.

---

## 📋 What You Need

From your Supabase Dashboard, you need:
1. **Project URL** (e.g., `https://xxxxxxxxxxxxx.supabase.co`)
2. **Anon/Public Key** (long JWT token starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

---

## 🔑 Step 1: Get Your Supabase Credentials

### Option A: From Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** (gear icon in sidebar)
4. Click **API** in the settings menu
5. Copy these two values:
   - **Project URL** (under "Project URL")
   - **anon public** key (under "Project API keys")

### Option B: From Project Settings

1. Open your Supabase project
2. Go to **Project Settings → API**
3. Find the **Configuration** section
4. Copy:
   - **URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 📝 Step 2: Add Credentials to `.env.local`

1. Open `frontend/.env.local` in your code editor
2. Replace the placeholder values:

```env
# Replace YOUR_SUPABASE_PROJECT_URL_HERE with your actual URL
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co

# Replace YOUR_SUPABASE_ANON_KEY_HERE with your actual anon key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhreHh4eHh4eHh4eHh4eHh4eHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODg1NzYwMDAsImV4cCI6MjAwNDEzMjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

3. Save the file

---

## ⚙️ Step 3: Configure Supabase Authentication

### Enable Email Provider

1. In Supabase Dashboard, go to **Authentication → Providers**
2. Find **Email** in the list
3. Toggle it **ON** (if not already enabled)
4. Click **Save**

### Enable Google OAuth (Optional)

1. In **Authentication → Providers**, find **Google**
2. Toggle it **ON**
3. You'll need to set up Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select existing)
   - Enable **Google+ API**
   - Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: Add your Supabase callback URL
     - Format: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
   - Copy **Client ID** and **Client Secret**
4. Back in Supabase, paste the Google credentials
5. Click **Save**

### Add Redirect URLs

1. In Supabase Dashboard, go to **Authentication → URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   http://localhost:3003
   ```
   (Add all ports your dev server might use)
3. If deploying to production, also add:
   ```
   https://yourdomain.com
   https://www.yourdomain.com
   ```
4. Click **Save**

---

## 🗄️ Step 4: Set Up Database Tables (Optional)

If you want to store scan history or user data:

### Create Tables

Run this SQL in **SQL Editor** in Supabase Dashboard:

```sql
-- Users table (automatically created by Supabase Auth)
-- No action needed

-- Scan history table
CREATE TABLE scan_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  app_name TEXT NOT NULL,
  package_name TEXT NOT NULL,
  verdict TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  sha256 TEXT NOT NULL,
  scan_date TIMESTAMPTZ DEFAULT NOW(),
  findings JSONB,
  fraud_signals JSONB,
  source_url TEXT
);

-- Enable Row Level Security
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own scans
CREATE POLICY "Users can view own scans"
  ON scan_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own scans
CREATE POLICY "Users can insert own scans"
  ON scan_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own scans
CREATE POLICY "Users can delete own scans"
  ON scan_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_scan_history_user_id ON scan_history(user_id);
CREATE INDEX idx_scan_history_scan_date ON scan_history(scan_date DESC);
```

---

## 🧪 Step 5: Test the Setup

### Test Backend Connection

1. Restart your frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

2. Open browser console (F12)
3. Check for Supabase initialization messages
4. Should see no errors about missing credentials

### Test Email Sign Up

1. Go to http://localhost:3002/auth
2. Click **Register** tab
3. Enter email and password (min 6 characters)
4. Click **Create account**
5. Check your email for confirmation link
6. Click the confirmation link
7. Return to app and sign in

### Test Google Sign In

1. Go to http://localhost:3002/auth
2. Click **Continue with Google**
3. Select your Google account
4. Authorize the app
5. You should be redirected back and signed in

---

## 🔍 Troubleshooting

### Error: "This sign-in method is not enabled"

**Cause:** Email or Google provider is disabled in Supabase

**Fix:**
1. Go to **Authentication → Providers**
2. Enable **Email** and/or **Google**
3. Click **Save**
4. Restart frontend server

---

### Error: "Invalid redirect URL"

**Cause:** Your app URL is not in the allowed redirect URLs list

**Fix:**
1. Go to **Authentication → URL Configuration**
2. Add your app URL to **Redirect URLs**
3. Include all ports: `http://localhost:3000`, `http://localhost:3001`, etc.
4. Click **Save**

---

### Error: "Invalid API key"

**Cause:** Wrong anon key or project URL

**Fix:**
1. Double-check your `.env.local` file
2. Ensure no extra spaces or quotes
3. Verify the key starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
4. Verify the URL format: `https://xxxxxxxxxxxxx.supabase.co`
5. Restart frontend server after changes

---

### Error: "Failed to fetch"

**Cause:** Network issue or Supabase project is paused

**Fix:**
1. Check your internet connection
2. Go to Supabase Dashboard
3. Ensure your project is **Active** (not paused)
4. If paused, click **Resume project**

---

## 🔒 Security Best Practices

### Never Commit `.env.local`

The `.env.local` file is already in `.gitignore`. Never commit it to Git!

```bash
# Check if .env.local is ignored
git status

# Should NOT show .env.local in the list
```

### Use Environment Variables in Production

For production deployment:

**Vercel:**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

**Netlify:**
```bash
# Add in Netlify Dashboard → Site Settings → Environment Variables
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Enable Row Level Security (RLS)

Always enable RLS on your tables:

```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

Then create policies to restrict access.

---

## 📊 Monitoring

### View Auth Logs

1. Go to **Authentication → Users**
2. See all registered users
3. Click a user to see their sessions and metadata

### View Database Activity

1. Go to **Database → Logs**
2. See all queries and errors
3. Monitor performance

---

## 🚀 Next Steps

After Supabase is configured:

1. ✅ Users can sign up and sign in
2. ✅ Google OAuth works (if enabled)
3. ✅ Protected routes require authentication
4. ✅ User sessions persist across page reloads

**Optional Enhancements:**
- Store scan history in database
- Add user profiles
- Implement scan quotas
- Add email notifications
- Create admin dashboard

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **GitHub Issues:** https://github.com/Amoghboss/apkshield/issues

---

**Your Supabase setup is complete! 🎉**

The APK Guardian app now has full authentication support.
