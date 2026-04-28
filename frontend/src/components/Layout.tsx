import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Terminal, Brain, ShieldCheck, Sun, Moon, User, Bell, Settings } from 'lucide-react';
import { motion } from 'motion/react';
import React, { useState, useEffect } from 'react';

export default function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const navigate = useNavigate();

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="flex min-h-screen relative overflow-hidden nebula-bg">
      <div className="star-field absolute inset-0 pointer-events-none" />

      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-12 bg-surface-container-lowest/15 backdrop-blur-[20px] border-b border-white/10 shadow-[0_0_15px_rgba(0,163,255,0.1)]">
        <div 
          onClick={() => navigate('/monitor')}
          className="flex flex-col cursor-pointer"
        >
          <span className="text-2xl font-black tracking-tighter text-on-surface">SAFESCAN</span>
          <span className="text-xs font-serif italic text-primary-container -mt-1 ml-4 opacity-80 uppercase tracking-widest">Intelligence System</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-2">
          <NavLink 
            to="/monitor" 
            className={({ isActive }) => 
              `px-4 py-1 text-xs font-semibold tracking-widest uppercase transition-all ${
                isActive ? 'text-primary-container border-b-2 border-primary-container' : 'text-outline hover:text-on-surface hover:bg-white/5'
              }`
            }
          >
            Monitor
          </NavLink>
          <NavLink 
            to="/map" 
            className={({ isActive }) => 
              `px-4 py-1 text-xs font-semibold tracking-widest uppercase transition-all ${
                isActive ? 'text-primary-container border-b-2 border-primary-container' : 'text-outline hover:text-on-surface hover:bg-white/5'
              }`
            }
          >
            Map
          </NavLink>
          <NavLink 
            to="/neural" 
            className={({ isActive }) => 
              `px-4 py-1 text-xs font-semibold tracking-widest uppercase transition-all ${
                isActive ? 'text-primary-container border-b-2 border-primary-container' : 'text-outline hover:text-on-surface hover:bg-white/5'
              }`
            }
          >
            Neural
          </NavLink>
        </nav>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary-container/30">
            <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,163,255,0.5)]" />
            <span className="text-[10px] font-label-caps text-primary-container uppercase tracking-widest">Secure Status</span>
          </div>
          
          <div className="flex items-center gap-4 text-outline border-l border-white/10 pl-6 ml-2">
            <button 
              onClick={toggleTheme}
              className="hover:text-on-surface transition-all p-2 rounded-full hover:bg-white/5"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="hover:text-on-surface transition-colors p-2 rounded-full hover:bg-white/5"><Bell size={20} /></button>
            <button 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 transition-all text-outline hover:text-on-surface"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 overflow-hidden bg-white/5">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop" alt="User" className="w-full h-full object-cover" />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Side Nav */}
      <aside className="fixed left-0 top-0 h-full w-20 hover:w-64 z-40 transition-all duration-500 group bg-surface-container-lowest/25 backdrop-blur-[40px] border-r border-white/10 flex flex-col py-8 overflow-hidden">
        <div className="mt-20 px-6 mb-12">
          <div className="text-primary-container font-bold tracking-widest text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            SYSTEM INTEGRITY
          </div>
          <div className="text-outline text-[10px] tracking-tighter whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            V.2.0.4-VOID
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink 
            to="/monitor"
            className={({ isActive }) => 
              `flex items-center px-6 py-4 transition-all ${
                isActive ? 'bg-primary-container/10 text-primary-container border-r-4 border-primary-container' : 'text-outline hover:text-primary hover:bg-white/5'
              }`
            }
          >
            <Terminal size={24} className="min-w-[24px]" />
            <span className="ml-6 text-xs font-label-caps tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Console</span>
          </NavLink>
          <NavLink 
            to="/neural"
            className={({ isActive }) => 
              `flex items-center px-6 py-4 transition-all ${
                isActive ? 'bg-primary-container/10 text-primary-container border-r-4 border-primary-container' : 'text-outline hover:text-primary hover:bg-white/5'
              }`
            }
          >
            <Brain size={24} className="min-w-[24px]" />
            <span className="ml-6 text-xs font-label-caps tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Neural Engine</span>
          </NavLink>
          <NavLink 
            to="/profile"
            className={({ isActive }) => 
              `flex items-center px-6 py-4 transition-all ${
                isActive ? 'bg-primary-container/10 text-primary-container border-r-4 border-primary-container' : 'text-outline hover:text-primary hover:bg-white/5'
              }`
            }
          >
            <User size={24} className="min-w-[24px]" />
            <span className="ml-6 text-xs font-label-caps tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Identity</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20 mt-20 p-8 min-h-[calc(100vh-80px)] relative">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 h-14 z-30 flex items-center justify-between px-12 bg-surface-container-lowest/40 backdrop-blur-md border-t border-white/5">
        <div className="text-[10px] tracking-widest text-outline uppercase">
          © 2144 SAFESCAN AI | LATENCY: 14MS
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex gap-6">
            <a href="#" className="text-[10px] tracking-widest text-outline hover:text-on-surface transition-colors uppercase">Terms</a>
            <a href="#" className="text-[10px] tracking-widest text-outline hover:text-on-surface transition-colors uppercase">Privacy</a>
            <a href="#" className="text-[10px] tracking-widest text-outline hover:text-on-surface transition-colors uppercase">Security</a>
          </div>
          <div className="flex items-center gap-2">
            <motion.div 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-primary shadow-[0_0_5px_#98cbff]" 
            />
            <span className="text-[10px] tracking-widest text-primary-container uppercase">Live Feed Active</span>
          </div>
        </div>
      </footer>

      {/* Security HUD Decorative Elements */}
      <div className="fixed top-24 right-12 pointer-events-none z-20 text-right space-y-1">
        <div className="text-[9px] font-label-caps text-outline uppercase tracking-[0.3em] font-bold">Terminal Entry // 0x447A</div>
        <div className="text-[9px] font-label-caps text-primary-container uppercase tracking-[0.3em] font-bold opacity-60">Status: Secure Layer 7</div>
      </div>

      <div className="fixed bottom-24 left-12 pointer-events-none z-20 space-y-1 -rotate-90 origin-bottom-left ml-6">
        <div className="text-[9px] font-label-caps text-outline uppercase tracking-[0.4em] font-bold">Neural Link: Established</div>
      </div>

      {/* Global Background Scan Line */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-20 pointer-events-none animate-[scan_6s_linear_infinite]" />
    </div>
  );
}
