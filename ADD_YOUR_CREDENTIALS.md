# 🔑 Add Your Supabase Credentials

**Quick 2-minute setup** — You already have your Supabase project and credentials ready!

---

## Step 1: Open the Environment File

Open this file in your editor:
```
frontend/.env.local
```

---

## Step 2: Replace the Placeholder Values

You'll see this:
```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY_HERE
```

**Replace with your actual values:**

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_key_here
```

### Where to find these values:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **Settings** → **API**
4. Copy:
   - **Project URL** → paste as `VITE_SUPABASE_URL`
   - **anon public** key → paste as `VITE_SUPABASE_ANON_KEY`

---

## Step 3: Save the File

Save `frontend/.env.local` after adding your credentials.

---

## Step 4: Restart the Frontend Server

Stop the current server (Ctrl+C) and restart:

```bash
cd frontend
npm run dev
```

---

## Step 5: Enable Authentication Providers (Optional)

If you want to use Email or Google sign-in:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Authentication** → **Providers**
4. Enable:
   - ✅ **Email** (for email/password sign-in)
   - ✅ **Google** (for Google OAuth - requires Google Cloud setup)
5. Click **Save**

---

## Step 6: Add Redirect URLs (Optional)

For authentication to work properly:

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Under **Redirect URLs**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3002
   http://localhost:3003
   ```
3. Click **Save**

---

## ✅ That's It!

Your app is now connected to Supabase!

### Test it:
- Go to http://localhost:3002/auth
- Try signing up with email
- Or click "Continue with Google" (if enabled)

### Routes:
- `/` or `/protect` → APK Scanner (no login required)
- `/auth` → Login/Sign up page
- `/dashboard` → Protected dashboard (requires login)

---

## 🔒 Security Note

**Never commit `.env.local` to Git!**

It's already in `.gitignore`, so you're safe. But double-check:

```bash
git status
```

You should NOT see `frontend/.env.local` in the list.

---

## 📚 Need More Help?

See the full setup guide: `SUPABASE_SETUP.md`

---

**Happy coding! 🚀**
