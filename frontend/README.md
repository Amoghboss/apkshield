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
3. Choose your Firebase Auth setup:
   - **Recommended for local development:** Start the Firebase Auth Emulator:
     ```bash
     firebase emulators:start --only auth
     ```
     Then run the app with the emulator flag:
     ```bash
     VITE_FIREBASE_AUTH_EMULATOR=true npm run dev
     ```
   - **Using live Firebase:** Enable Email/Password and Google sign-in in the [Firebase Console](https://console.firebase.google.com/), then add `localhost` to Authorized domains under Authentication → Sign-in method.
4. Run the app (if not already running):
   `npm run dev`

> **Note:** The frontend only connects to the Firebase Auth Emulator when `VITE_FIREBASE_AUTH_EMULATOR=true` is set. This prevents accidental live-project auth during development. If you see `auth/operation-not-allowed`, either start the emulator with the flag above, or enable the sign-in providers in your live Firebase project.
