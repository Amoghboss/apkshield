import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../supabase';
import APKProtectionTool from './APKProtectionTool';
import Auth from './Auth';
import Monitor from './Monitor';
import Profile from './Profile';
import { 
  Shield, 
  User as UserIcon, 
  Activity, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function UnifiedAPKGuardian() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scanner' | 'auth' | 'monitor' | 'profile'>('scanner');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setActiveTab('scanner');
    setSidebarOpen(false);
  };

  const handleAuthenticate = () => {
    setActiveTab('scanner');
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#020817' }}>
        <div className="w-16 h-16 rounded-full border-2 border-transparent border-t-[#00f5d4] animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'scanner', label: 'APK Scanner', icon: Shield, public: true },
    { id: 'auth', label: user ? 'Account' : 'Sign In', icon: UserIcon, public: true },
    ...(user ? [
      { id: 'monitor', label: 'Monitor', icon: Activity, public: false },
      { id: 'profile', label: 'Profile', icon: UserIcon, public: false },
    ] : [])
  ];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#020817' }}>
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,163,255,0.18) 0%, transparent 70%)', animation: 'orbFloat1 12s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', animation: 'orbFloat2 15s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,245,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,212,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-white/10 backdrop-blur-xl" style={{ background: 'rgba(13,21,38,0.85)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" 
                style={{ background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.2)' }}>
                <Shield className="w-6 h-6" style={{ color: '#00f5d4' }} />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">APK Guardian</h1>
                <p className="text-xs text-slate-500">Mobile Threat Intelligence</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: isActive ? 'rgba(0,245,212,0.12)' : 'transparent',
                      color: isActive ? '#00f5d4' : '#94a3b8',
                      border: isActive ? '1px solid rgba(0,245,212,0.25)' : '1px solid transparent',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
              
              {user && (
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 z-50 w-64 h-full md:hidden"
              style={{ background: 'rgba(13,21,38,0.95)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-bold text-white">Menu</h2>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                          setSidebarOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                        style={{
                          background: isActive ? 'rgba(0,245,212,0.12)' : 'transparent',
                          color: isActive ? '#00f5d4' : '#94a3b8',
                          border: isActive ? '1px solid rgba(0,245,212,0.25)' : '1px solid transparent',
                        }}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                  
                  {user && (
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white transition-colors mt-4 border-t border-white/10 pt-6"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  )}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'scanner' && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <APKProtectionTool />
            </motion.div>
          )}

          {activeTab === 'auth' && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {user ? (
                <div className="min-h-screen flex items-center justify-center p-4">
                  <div className="max-w-md w-full rounded-3xl p-8" 
                    style={{ background: 'rgba(13,21,38,0.85)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(24px)' }}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
                        style={{ background: 'rgba(0,245,212,0.08)', border: '1px solid rgba(0,245,212,0.2)' }}>
                        <UserIcon className="w-8 h-8" style={{ color: '#00f5d4' }} />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                      <p className="text-slate-400 mb-6">You're signed in as {user.email}</p>
                      
                      <div className="space-y-3">
                        <button
                          onClick={() => setActiveTab('monitor')}
                          className="w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200"
                          style={{ background: 'linear-gradient(135deg, #00f5d4, #00a3ff)', color: '#020817' }}
                        >
                          View Dashboard
                        </button>
                        <button
                          onClick={() => setActiveTab('profile')}
                          className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                          Manage Profile
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="w-full py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Auth onAuthenticate={handleAuthenticate} />
              )}
            </motion.div>
          )}

          {activeTab === 'monitor' && user && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Monitor />
            </motion.div>
          )}

          {activeTab === 'profile' && user && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Profile />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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