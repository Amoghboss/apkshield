# ✅ Supabase Environment Setup — Ready for Your Credentials

Your APK Guardian project is fully configured and ready for Supabase integration!

---

## 🎯 What's Already Done

✅ **Frontend environment file created:** `frontend/.env.local`  
✅ **Supabase client configured:** `frontend/src/supabase.ts`  
✅ **Authentication UI built:** Beautiful login/signup page with Google OAuth  
✅ **Routes configured:** Public scanner + protected dashboard  
✅ **Documentation created:** Complete setup guides  

---

## 🔑 What You Need to Do (2 minutes)

### 1. Add Your Supabase Credentials

Open `frontend/.env.local` and replace these two lines:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
```

**With your actual values:**

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here
```

### 2. Where to Find Your Credentials

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Click: **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → Use as `VITE_SUPABASE_URL`
   - **anon public** key → Use as `VITE_SUPABASE_ANON_KEY`

### 3. Save and Restart

After adding your credentials:

```bash
# Stop the frontend server (Ctrl+C)
# Then restart it:
cd frontend
npm run dev
```

---

## 🔐 Enable Authentication (Optional but Recommended)

### Enable Email Sign-In

1. Go to: **https://supabase.com/dashboard**
2. Select your project
3. Go to: **Authentication** → **Providers**
4. Find **Email** and toggle it **ON**
5. Click **Save**

### Enable Google Sign-In (Optional)

1. In **Authentication** → **Providers**, find **Google**
2. Toggle it **ON**
3. You'll need Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add redirect URI: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`
   - Copy Client ID and Secret to Supabase
4. Click **Save**

### Add Redirect URLs

1. In Supabase Dashboard: **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   http://localhost:3003
   ```
3. Click **Save**

---

## 🗄️ Database Tables (You Already Have These)

You mentioned you already created Supabase tables. Perfect! 

If you need to add scan history storage, here's the SQL:

```sql
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

-- Users can only see their own scans
CREATE POLICY "Users can view own scans"
  ON scan_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON scan_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

---

## 🧪 Test Your Setup

### 1. Test Backend Connection

```bash
# Backend should be running on port 8000
curl http://localhost:8000/health
```

Expected: `{"status":"ok"}`

### 2. Test Frontend

Open: **http://localhost:3002** (or whatever port Vite shows)

You should see the APK Guardian scanner interface.

### 3. Test Authentication

1. Go to: **http://localhost:3002/auth**
2. Click **Sign Up** tab
3. Enter email and password (min 6 characters)
4. Click **Create Account**
5. Check your email for confirmation
6. Click confirmation link
7. Return and sign in

### 4. Test Google Sign-In (if enabled)

1. Go to: **http://localhost:3002/auth**
2. Click **Continue with Google**
3. Select your Google account
4. Authorize the app
5. You'll be redirected back and signed in

---

## 📁 Project Structure

```
apkshield/
├── backend/
│   ├── main.py                    # FastAPI server with APK analysis
│   └── uploads/                   # Temporary APK storage
├── frontend/
│   ├── .env.local                 # ⚠️ ADD YOUR CREDENTIALS HERE
│   ├── .env.template              # Template for reference
│   ├── src/
│   │   ├── supabase.ts           # Supabase client
│   │   ├── App.tsx               # Routes (public + protected)
│   │   └── components/
│   │       ├── Auth.tsx          # Login/signup UI
│   │       ├── APKProtectionTool.tsx  # Main scanner
│   │       ├── Layout.tsx        # Dashboard layout
│   │       ├── Monitor.tsx       # Dashboard page
│   │       ├── Map.tsx           # Map view
│   │       ├── NeuralNetwork.tsx # Neural network viz
│   │       └── Profile.tsx       # User profile
│   └── vite.config.ts            # Proxy config
├── ADD_YOUR_CREDENTIALS.md       # 👈 Quick guide (this file's sibling)
├── QUICK_START.md                # 5-minute setup
├── SUPABASE_SETUP.md             # Complete Supabase guide
├── SETUP.md                      # Full installation guide
├── PROJECT_REPORT.md             # Hackathon report
└── README.md                     # User documentation
```

---

## 🚀 Routes Overview

### Public Routes (No Authentication Required)

- **`/`** — APK Scanner home page
- **`/protect`** — APK Scanner (alias)
- **`/auth`** — Login/Sign up page

### Protected Routes (Requires Authentication)

- **`/dashboard`** — Main dashboard
- **`/dashboard/monitor`** — Monitoring view
- **`/dashboard/map`** — Map view
- **`/dashboard/neural`** — Neural network visualization
- **`/dashboard/profile`** — User profile

---

## 🎨 Features Already Implemented

### APK Scanner Features
✅ Drag-and-drop file upload  
✅ Direct APK URL scanning  
✅ Real-time WebSocket progress (6 steps)  
✅ 35+ permission risk analysis  
✅ 8 fraud pattern detectors  
✅ Certificate validation  
✅ Component analysis  
✅ Plain-English threat summaries  
✅ Share functionality (WhatsApp, Telegram, Email, Clipboard)  
✅ Multi-verdict classification (DANGEROUS/SUSPICIOUS/LOW RISK/SAFE)  

### Authentication Features
✅ Email/password sign-up and sign-in  
✅ Google OAuth integration  
✅ Session persistence  
✅ Protected routes  
✅ Beautiful cybersecurity-themed UI  
✅ Error handling with user-friendly messages  
✅ Loading states and animations  

---

## 🔒 Security Notes

### Environment Variables

✅ `.env.local` is already in `.gitignore`  
✅ Never commit credentials to Git  
✅ Use environment variables in production  

### Verify Git Ignore

```bash
git status
```

You should **NOT** see `frontend/.env.local` in the list.

### Production Deployment

For production (Vercel, Netlify, etc.), add environment variables in the platform's dashboard:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📊 What Happens After You Add Credentials

1. **Supabase client initializes** — No more console warnings
2. **Authentication works** — Users can sign up and sign in
3. **Protected routes work** — Dashboard requires login
4. **Sessions persist** — Users stay logged in across page reloads
5. **Google OAuth works** — If you enable it in Supabase

---

## 🐛 Troubleshooting

### "This sign-in method is not enabled"

**Fix:** Enable Email provider in Supabase Dashboard → Authentication → Providers

### "Invalid redirect URL"

**Fix:** Add your app URL to Supabase → Authentication → URL Configuration → Redirect URLs

### "Invalid API key"

**Fix:** Double-check your `.env.local` file. Ensure:
- No extra spaces or quotes
- URL format: `https://xxxxxxxxxxxxx.supabase.co`
- Key starts with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
- Restart frontend server after changes

### Supabase client initialization failed

**Fix:** Make sure you added both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env.local`

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `ADD_YOUR_CREDENTIALS.md` | Quick 2-minute credential setup |
| `QUICK_START.md` | 5-minute quick start guide |
| `SUPABASE_SETUP.md` | Complete Supabase configuration |
| `SETUP.md` | Full installation and setup |
| `PROJECT_REPORT.md` | Hackathon submission report |
| `README.md` | User-facing documentation |
| `frontend/.env.template` | Environment variable template |

---

## ✅ Checklist

- [ ] Add Supabase URL to `frontend/.env.local`
- [ ] Add Supabase anon key to `frontend/.env.local`
- [ ] Save the file
- [ ] Restart frontend server
- [ ] Enable Email provider in Supabase Dashboard
- [ ] (Optional) Enable Google provider in Supabase Dashboard
- [ ] Add redirect URLs in Supabase Dashboard
- [ ] Test sign-up at `/auth`
- [ ] Test APK scanner at `/`

---

## 🎉 You're All Set!

Once you add your credentials and restart the server, your APK Guardian app will be fully functional with:

- ✅ APK security scanning
- ✅ User authentication
- ✅ Protected dashboard
- ✅ Session management
- ✅ Google OAuth (if enabled)

---

## 📞 Need Help?

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Project Issues:** https://github.com/Amoghboss/apkshield/issues

---

**Ready to add your credentials? Open `frontend/.env.local` now! 🚀**
