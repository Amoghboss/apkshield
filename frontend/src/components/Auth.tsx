import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Chrome, Loader2, LockKeyhole, Mail, Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface AuthProps {
  onAuthenticate: () => void;
}

type AuthMode = 'signin' | 'signup';

function readableAuthError(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return 'Authentication failed. Please try again.';
  }

  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/user-not-found': 'No account exists with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/popup-closed-by-user': 'Google sign-in was closed before it finished.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled in Firebase Authentication.',
    'auth/network-request-failed': 'Could not reach Firebase Auth. If using the emulator, make sure it is running on port 9099. Otherwise, check your network connection.',
    'auth/unauthorized-domain': 'Add localhost to Authorized domains in Firebase Authentication settings (Firebase Console → Authentication → Sign-in method).',
  };

  return messages[error.code] || error.message;
}

function getErrorCode(error: unknown): string | null {
  if (error instanceof FirebaseError) {
    return error.code;
  }
  return null;
}

export default function Auth({ onAuthenticate }: AuthProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      onAuthenticate();
    } catch (err) {
      setError(readableAuthError(err));
      setErrorCode(getErrorCode(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setErrorCode(null);

    try {
      await signInWithPopup(auth, googleProvider);
      onAuthenticate();
    } catch (err) {
      setError(readableAuthError(err));
      setErrorCode(getErrorCode(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-surface-container-lowest font-sans selection:bg-primary-container selection:text-on-primary-container overflow-hidden">
      <div className="fixed inset-0 nebula-bg opacity-40" />
      <div className="fixed inset-0 star-field pointer-events-none" />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 refracting-border-gradient relative z-10 flex flex-col md:flex-row gap-12 items-stretch"
      >
        <div className="hidden md:block w-1/2 relative rounded-3xl overflow-hidden border border-white/10 group">
          <img
            src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop"
            className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
            referrerPolicy="no-referrer"
            alt="Cyber security authentication"
          />
          <div className="absolute inset-0 bg-primary-container/20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80" />

          <div className="absolute bottom-12 left-12 space-y-4">
            <div className="flex items-center gap-3 font-label-caps text-[10px] text-primary-container tracking-[0.4em] font-bold uppercase">
              <Shield size={16} fill="currentColor" className="animate-pulse" />
              Firebase Auth Active
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">
              SAFESCAN<br />
              <span className="font-serif italic font-light lowercase text-primary-container/80">Intelligence</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 w-full flex flex-col justify-center min-h-[500px]">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface leading-tight">
                ACCESS<br />TERMINAL
              </h2>
              <div className="h-1 w-20 bg-primary-container shadow-[0_0_15px_#00a3ff] rounded-full" />
              <p className="text-sm text-outline leading-6">
                Sign in with a Firebase account. New users can create an account with email and password.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition ${
                  mode === 'signin' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:text-on-surface'
                }`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition ${
                  mode === 'signup' ? 'bg-primary-container text-on-primary-container' : 'text-outline hover:text-on-surface'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-6">
              <label className="block space-y-2 group">
                <span className="font-label-caps text-[10px] text-outline group-focus-within:text-primary-container transition-colors tracking-widest uppercase">
                  Email address
                </span>
                <div className="flex items-center gap-3 border-b border-white/10 focus-within:border-primary-container transition-colors">
                  <Mail size={18} className="text-outline" />
                  <input
                    type="email"
                    className="w-full bg-transparent py-4 text-on-surface outline-none font-mono tracking-wide"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2 group">
                <span className="font-label-caps text-[10px] text-outline group-focus-within:text-primary-container transition-colors tracking-widest uppercase">
                  Password
                </span>
                <div className="flex items-center gap-3 border-b border-white/10 focus-within:border-primary-container transition-colors">
                  <LockKeyhole size={18} className="text-outline" />
                  <input
                    type="password"
                    className="w-full bg-transparent py-4 text-on-surface outline-none font-mono tracking-wide"
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    minLength={6}
                    required
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary-container text-on-primary-container rounded-2xl font-black text-xs tracking-[0.35em] uppercase hover:shadow-[0_0_25px_#00a3ff66] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <ArrowRight size={18} />}
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-[10px] font-label-caps text-outline uppercase tracking-widest">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full group flex items-center justify-between p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all hover:border-primary-container/50 disabled:opacity-50"
              type="button"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Chrome className="text-primary-container" size={22} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-on-surface">Continue with Google</span>
                  <span className="text-[10px] text-outline font-label-caps uppercase tracking-widest">Firebase OAuth</span>
                </div>
              </div>
              {loading ? <Loader2 className="animate-spin text-primary-container" /> : <ArrowRight className="text-outline group-hover:text-primary-container transition-colors" />}
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className="p-4 bg-error-container/20 border border-error/20 text-error rounded-xl text-xs font-medium leading-5 flex items-start gap-3">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <span>AUTH_ERROR: {error}</span>
                </div>

                {(errorCode === 'auth/operation-not-allowed' || errorCode === 'auth/network-request-failed') && (
                  <div className="p-4 rounded-xl border border-primary-container/30 bg-primary-container/10 text-on-surface">
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-2 text-primary-container flex items-center gap-2">
                      <RefreshCw size={12} />
                      How to fix
                    </h4>
                    <div className="mb-3 p-3 rounded-lg bg-primary-container/20 border border-primary-container/30">
                      <p className="text-[11px] leading-5 text-on-surface font-semibold">
                        Quick fix (recommended for local development):
                      </p>
                      <p className="text-[11px] leading-5 text-outline">
                        Run the Firebase Auth Emulator on port <code className="bg-white/10 px-1 py-0.5 rounded text-[10px]">9099</code>:
                      </p>
                      <code className="block mt-1 bg-black/40 px-2 py-1.5 rounded text-[10px] font-mono text-primary-container">
                        firebase emulators:start --only auth
                      </code>
                      <p className="text-[10px] text-outline mt-1">
                        Then start the app with <code className="bg-white/10 px-1 rounded text-[10px]">VITE_FIREBASE_AUTH_EMULATOR=true npm run dev</code>
                      </p>
                    </div>
                    <p className="text-[11px] leading-5 text-outline mb-2">
                      Or enable the sign-in providers in your live Firebase project:
                    </p>
                    <ol className="list-decimal list-inside text-[11px] leading-5 space-y-1 text-outline">
                      <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline text-primary-container hover:text-on-primary-container">Firebase Console</a></li>
                      <li>Go to <strong>Authentication → Sign-in method</strong></li>
                      <li>Enable <strong>Email/Password</strong> and <strong>Google</strong> providers</li>
                      <li>Add <code className="bg-white/10 px-1 py-0.5 rounded text-[10px]">localhost</code> to <strong>Authorized domains</strong></li>
                    </ol>
                  </div>
                )}

                {errorCode === 'auth/unauthorized-domain' && (
                  <div className="p-4 rounded-xl border border-primary-container/30 bg-primary-container/10 text-on-surface">
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-2 text-primary-container flex items-center gap-2">
                      <RefreshCw size={12} />
                      How to fix
                    </h4>
                    <p className="text-[11px] leading-5 text-outline">
                      Add <code className="bg-white/10 px-1 py-0.5 rounded text-[10px]">{location.hostname}</code> to
                      <strong> Authorized domains</strong> in Firebase Console → Authentication → Settings → Authorized domains.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            <p className="text-[10px] leading-5 text-outline">
              Firebase setup required: enable Email/Password and Google providers in Firebase Authentication. Add
              localhost to Authorized domains if Google sign-in says unauthorized domain.
            </p>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
