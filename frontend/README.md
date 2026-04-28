<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0fc593df-4896-4460-8f21-a36967c45050

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set up Supabase Authentication:
   - Create a project at [supabase.com](https://supabase.com)
   - Go to **Authentication → Providers** and enable **Email** and **Google**
   - Add `http://localhost:3000` (or your dev URL) to **Redirect URLs** under Authentication → URL Configuration
   - Copy your **Project URL** and **anon public API key** from Project Settings → API
   - Create `.env.local` in the `frontend` folder and add:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
4. Run the app:
   `npm run dev`

> **Note:** If you see an error like "This sign-in method is not enabled", make sure Email and Google providers are enabled in your Supabase project dashboard.

