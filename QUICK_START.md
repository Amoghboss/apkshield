# ⚡ Quick Start — APK Guardian

Get up and running in 5 minutes.

---

## 🎯 What You'll Do

1. Add Supabase credentials
2. Start backend server
3. Start frontend server
4. Open app in browser

---

## 📝 Step 1: Add Your Supabase Credentials

Open `frontend/.env.local` and replace the placeholders:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Where to find these:**
- Go to https://supabase.com/dashboard
- Select your project
- Settings → API
- Copy **Project URL** and **anon public** key

---

## 🚀 Step 2: Start Backend

```bash
# Activate virtual environment
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux

# Start FastAPI server
cd backend
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

✅ Backend running at **http://localhost:8000**

---

## 🎨 Step 3: Start Frontend

Open a **new terminal**:

```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v6.4.2  ready in 866 ms
➜  Local:   http://localhost:3000/
```

✅ Frontend running at **http://localhost:3000** (or next available port)

---

## 🌐 Step 4: Open in Browser

Navigate to the frontend URL (e.g., http://localhost:3002)

You should see the **APK Guardian** scanner interface.

---

## 🧪 Step 5: Test It

### Test APK Scan

1. Download a sample APK (e.g., from APKMirror)
2. Drag and drop it into the upload zone
3. Watch the real-time progress
4. Review the threat report

### Test URL Scan

1. Click **"Download Link"** tab
2. Paste a direct APK URL
3. Click **"Scan Link"**
4. View the results

### Test Authentication (Optional)

1. Go to http://localhost:3002/auth
2. Click **Register** tab
3. Create an account with email/password
4. Or click **"Continue with Google"**

---

## 🎉 You're Done!

The app is now fully functional.

**Main Routes:**
- `/` — APK Scanner (public, no auth required)
- `/protect` — APK Scanner (alias)
- `/auth` — Sign in / Sign up
- `/dashboard` — Dashboard (requires auth)

---

## 🐛 Quick Troubleshooting

### Backend won't start

```bash
# Reinstall dependencies
pip install fastapi uvicorn androguard httpx cryptography
```

### Frontend won't start

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to backend

1. Check backend is running on port 8000
2. Check `frontend/vite.config.ts` proxy settings
3. Restart both servers

### Supabase errors

1. Verify credentials in `.env.local`
2. Enable Email provider in Supabase Dashboard
3. Add redirect URLs in Supabase → Authentication → URL Configuration
4. Restart frontend server

---

## 📚 Full Documentation

- **Complete Setup:** See `SETUP.md`
- **Supabase Guide:** See `SUPABASE_SETUP.md`
- **Project Report:** See `PROJECT_REPORT.md`
- **README:** See `README.md`

---

**Happy Scanning! 🛡️**
