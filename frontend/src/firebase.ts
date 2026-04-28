import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Connect to Firebase Auth Emulator when explicitly enabled
const useEmulator = import.meta.env.VITE_FIREBASE_AUTH_EMULATOR === 'true';

if (useEmulator) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
    console.info('[Firebase] Auth emulator connected on http://localhost:9099');
  } catch {
    console.warn(
      '[Firebase] Auth emulator not available on http://localhost:9099. ' +
        'Start it with: firebase emulators:start --only auth'
    );
  }
}
