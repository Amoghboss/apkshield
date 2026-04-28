# Fix Firebase Auth Error: AUTH_ERROR / operation-not-allowed

## Steps
1. [x] Add Firebase Auth Emulator support to `frontend/src/firebase.ts`
2. [x] Improve error UI for `auth/operation-not-allowed` in `frontend/src/components/Auth.tsx`
3. [x] Update `frontend/README.md` with Firebase Auth setup instructions
4. [x] Test the changes — `npm run build` and `npm run lint` both pass

## Summary
- `firebase.ts` now auto-connects to the Firebase Auth Emulator on `localhost`/`127.0.0.1` with a clear console warning if it's not running.
- `Auth.tsx` HTML structure was fixed (missing `</div>` tags) and the `operation-not-allowed` error UI now prominently shows the emulator command as the quick fix.
- `README.md` now recommends starting the emulator first, with a note explaining why `operation-not-allowed` happens when it's not running.
- `APKProtectionTool.tsx` type error with dynamic Lucide icon rendering was fixed with a proper `React.ElementType` type assertion.
- `@types/react` and `@types/react-dom` were installed as dev dependencies to resolve JSX type errors.
