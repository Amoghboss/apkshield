# Migrate from Firebase to Supabase

## Steps
1. [x] Install `@supabase/supabase-js` and uninstall `firebase`
2. [x] Create `frontend/src/supabase.ts` with Supabase client initialization
3. [x] Update `frontend/src/App.tsx` to use Supabase auth state (`onAuthStateChange`)
4. [x] Rewrite `frontend/src/components/Auth.tsx` to use Supabase email/password + Google OAuth
5. [x] Delete Firebase config files (`firebase.ts`, `firebase-applet-config.json`, `firebase-blueprint.json`, `firestore.rules`)
6. [x] Update `frontend/src/vite-env.d.ts` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
7. [x] Update `frontend/README.md` with Supabase setup instructions
8. [x] Remove `@firebase/eslint-plugin-security-rules` dev dependency
9. [x] Test the changes — `npm run build` and `npm run lint` both pass

## Summary
- Replaced Firebase Auth with Supabase Auth (email/password + Google OAuth).
- `App.tsx` now listens to `supabase.auth.onAuthStateChange` for session changes.
- `Auth.tsx` uses `supabase.auth.signInWithPassword`, `supabase.auth.signUp`, and `supabase.auth.signInWithOAuth({ provider: 'google' })`.
- Error messages and "How to fix" UI now reference Supabase Dashboard instead of Firebase Console.
- All Firebase config files and dependencies have been removed.
- Google OAuth now uses Supabase's redirect-based flow (more reliable than popups).

