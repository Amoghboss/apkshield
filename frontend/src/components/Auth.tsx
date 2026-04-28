import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, isSupabaseConfigured } from '../supabase';

// ── helpers ──────────────────────────────────────────────────────────────────
function parseError(err: unknown): { msg: string; code: string | null } {
  if (err instanceof Error) {
    const code = (err as any).code ?? (err as any).status ?? null;
    const map: Record<string, string> = {
      invalid_credentials:   'Wrong email or password.',
      user_not_found:        'No account found with this email.',
      email_not_confirmed:   'Check your inbox and confirm your email first.',
      email_exists:          'An account already exists with this email.',
      user_already_exists:   'An account already exists with this email.',
      weak_password:         'Password must be at least 6 characters.',
      invalid_email:         'Enter a valid email address.',
      provider_disabled:     'Google sign-in is not enabled in your Supabase project. Enable it in Authentication → Providers.',
      provider_not_enabled:  'Google sign-in is not enabled in your Supabase project. Enable it in Authentication → Providers.',
      validation_failed:     'Google sign-in is not configured. Enable Google provider in your Supabase dashboard.',
    };
    
    // Handle specific error messages
    if (err.message.includes('provider is not enabled') || err.message.includes('Unsupported provider')) {
      return { msg: 'Google sign-in is not enabled in your Supabase project. Enable it in Authentication → Providers.', code };
    }
    
    return { msg: map[code] ?? err.message, code };
  }
  return { msg: 'Authentication failed. Please try again.', code: null };
}

// ── animated background orbs ─────────────────────────────────────────────────
function Orbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,163,255,0.18) 0%, transparent 70%)', animation: 'orbFloat1 12s ease-in-out infinite' }} />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', animation: 'orbFloat2 15s ease-in-out infinite' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.04) 0%, transparent 60%)' }} />
      {/* grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(0,245,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
    </div>
  );
}

// ── Google SVG icon ───────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// ── input field ───────────────────────────────────────────────────────────────
function Field({ label, type, value, onChange, placeholder, autoComplete }: {
  label: string; type: string; value: string;
  onChange: (v: string) => void; placeholder: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.2em]"
        style={{ color: focused ? '#00f5d4' : '#64748b' }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required
          className="w-full rounded-xl px-4 py-3.5 text-sm text-white outline-none transition-all font-mono"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? 'rgba(0,245,212,0.5)' : 'rgba(255,255,255,0.08)'}`,
            boxShadow: focused ? '0 0 0 3px rgba(0,245,212,0.08)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
interface AuthProps { onAuthenticate: () => void; }

export default function Auth({ onAuthenticate }: AuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add your credentials to frontend/.env.local and restart the server.');
      return;
    }
    
    setLoading(true); setError(null); setSuccess(null);
    try {
      if (mode === 'signup') {
        const { error: err } = await supabase.auth.signUp({
          email: email.trim(), password,
          options: { data: { full_name: name } },
        });
        if (err) throw err;
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setMode('signin');
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (err) throw err;
        onAuthenticate();
      }
    } catch (err) {
      setError(parseError(err).msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    // Check if Supabase is configured
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured. Add your credentials to frontend/.env.local and restart the server.');
      return;
    }
    
    setGoogleLoading(true); setError(null);
    try {
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (err) throw err;
    } catch (err) {
      setError(parseError(err).msg);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: '#020817' }}>
      <Orbs />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* card */}
        <div className="rounded-3xl p-8 relative overflow-hidden"
          style={{ background: 'rgba(13,21,38,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)', boxShadow: '0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,245,212,0.05)' }}>

          {/* top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(0,245,212,0.6), transparent)' }} />

          {/* logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
              style={{ background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.2)' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="rgba(0,245,212,0.15)" stroke="#00f5d4" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#00f5d4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">AEGIS HUD</h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wide">Cybersecurity Command Center</p>
          </div>

          {/* tab toggle */}
          <div className="flex rounded-xl p-1 mb-6"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {(['signin', 'signup'] as const).map(m => (
              <button key={m} type="button" onClick={() => { setMode(m); setError(null); setSuccess(null); }}
                className="flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  background: mode === m ? 'rgba(0,245,212,0.12)' : 'transparent',
                  color: mode === m ? '#00f5d4' : '#64748b',
                  border: mode === m ? '1px solid rgba(0,245,212,0.25)' : '1px solid transparent',
                }}>
                {m === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Google button - only show if Supabase is configured */}
          {isSupabaseConfigured && (
            <>
              <button type="button" onClick={handleGoogle} disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 mb-5 disabled:opacity-50"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}>
                {googleLoading
                  ? <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  : <GoogleIcon />}
                Continue with Google
              </button>

              {/* divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
                <span className="text-[10px] uppercase tracking-widest text-slate-600">or</span>
                <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.07)' }} />
              </div>
            </>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {mode === 'signup' && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <Field label="Full Name" type="text" value={name} onChange={setName} placeholder="Your name" autoComplete="name" />
                </motion.div>
              )}
            </AnimatePresence>

            <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="Min. 6 characters" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />

            {/* error */}
            <AnimatePresence>
              {error && (
                <motion.div key="err" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs leading-5"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div key="ok" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-xs leading-5"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7' }}>
                  <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* submit */}
            <button type="submit" disabled={loading || googleLoading}
              className="w-full py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #00f5d4, #00a3ff)', color: '#020817', boxShadow: '0 0 24px rgba(0,245,212,0.25)' }}>
              {loading
                ? <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* footer */}
          <p className="text-center text-[10px] text-slate-600 mt-6 leading-5">
            By continuing you agree to our{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">Terms of Service</span>
            {' '}and{' '}
            <span className="text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">Privacy Policy</span>
          </p>
        </div>

        {/* setup hint — only shown when Supabase is not configured */}
        {!isSupabaseConfigured && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-4 rounded-2xl px-5 py-4 text-xs leading-6"
            style={{ background: 'rgba(0,163,255,0.06)', border: '1px solid rgba(0,163,255,0.15)', color: '#94a3b8' }}>
            <span className="font-bold text-sky-400">⚠️ Setup Required:</span> Add your Supabase keys to{' '}
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-300">frontend/.env.local</code>
            {' '}as <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-300">VITE_SUPABASE_URL</code> and{' '}
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-slate-300">VITE_SUPABASE_ANON_KEY</code>.
            {' '}Enable Email + Google providers in your{' '}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-sky-400 underline hover:text-sky-300">Supabase dashboard</a>.
            {' '}Then restart the server.
          </motion.div>
        )}

        {/* Google setup hint - shown when Supabase is configured but Google fails */}
        {isSupabaseConfigured && error && error.includes('Google sign-in is not enabled') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-4 rounded-2xl px-5 py-4 text-xs leading-6"
            style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', color: '#94a3b8' }}>
            <span className="font-bold text-yellow-400">💡 Google OAuth Setup:</span> To enable Google sign-in:
            <br />1. Go to{' '}
            <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-yellow-400 underline hover:text-yellow-300">Supabase Dashboard</a>
            <br />2. Authentication → Providers → Enable Google
            <br />3. Add Google OAuth credentials from{' '}
            <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-yellow-400 underline hover:text-yellow-300">Google Cloud Console</a>
          </motion.div>
        )}
      </motion.div>

      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px,30px) scale(1.08); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px,-40px) scale(1.06); }
        }
      `}</style>
    </div>
  );
}
