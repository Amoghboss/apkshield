import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  Eye, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Timer
} from 'lucide-react';
import BottomNavigation from './BottomNavigation';

// Biometric scanner simulation
const useBiometricScanner = () => {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  const startScan = () => {
    setScanState('scanning');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanState(Math.random() > 0.2 ? 'success' : 'failed');
          setTimeout(() => setScanState('idle'), 3000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  return { scanState, progress, startScan };
};

// Biometric Authorization Component
const BiometricAuth = ({ onAuthorized }: { onAuthorized: () => void }) => {
  const { scanState, progress, startScan } = useBiometricScanner();
  const [authStep, setAuthStep] = useState<'fingerprint' | 'retina' | 'complete'>('fingerprint');

  useEffect(() => {
    if (scanState === 'success') {
      if (authStep === 'fingerprint') {
        setTimeout(() => setAuthStep('retina'), 1000);
      } else if (authStep === 'retina') {
        setTimeout(() => {
          setAuthStep('complete');
          onAuthorized();
        }, 1000);
      }
    }
  }, [scanState, authStep, onAuthorized]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-black text-white mb-2">Biometric Authorization</h2>
      <p className="text-slate-400 mb-8">Multi-factor authentication required for vault access</p>
      
      <div className="relative w-64 h-64 mx-auto mb-8">
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30">
          {scanState === 'scanning' && (
            <div 
              className="absolute inset-0 rounded-full border-2 border-cyan-400 transition-all duration-100"
              style={{ 
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + (progress / 100) * 50}% 0%, ${50 + (progress / 100) * 50}% 100%, 50% 100%)`,
                transform: `rotate(${(progress / 100) * 360}deg)`
              }}
            />
          )}
        </div>
        
        <div className="absolute inset-8 rounded-full flex items-center justify-center"
          style={{ 
            background: scanState === 'success' ? 'rgba(16,185,129,0.2)' : 
                       scanState === 'failed' ? 'rgba(239,68,68,0.2)' :
                       'rgba(0,245,212,0.1)',
            border: `2px solid ${
              scanState === 'success' ? 'rgba(16,185,129,0.5)' : 
              scanState === 'failed' ? 'rgba(239,68,68,0.5)' :
              'rgba(0,245,212,0.3)'
            }`
          }}>
          
          {authStep === 'fingerprint' && (
            <Fingerprint className={`w-16 h-16 ${
              scanState === 'success' ? 'text-green-400' :
              scanState === 'failed' ? 'text-red-400' :
              scanState === 'scanning' ? 'text-cyan-400 animate-pulse' :
              'text-slate-400'
            }`} />
          )}
          
          {authStep === 'retina' && (
            <Eye className={`w-16 h-16 ${
              scanState === 'success' ? 'text-green-400' :
              scanState === 'failed' ? 'text-red-400' :
              scanState === 'scanning' ? 'text-cyan-400 animate-pulse' :
              'text-slate-400'
            }`} />
          )}
          
          {authStep === 'complete' && (
            <CheckCircle className="w-16 h-16 text-green-400" />
          )}
        </div>
        
        {scanState === 'scanning' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <div className="text-xs text-cyan-400 font-mono">{progress.toFixed(0)}%</div>
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {authStep === 'fingerprint' && scanState === 'idle' && (
          <div>
            <p className="text-slate-300 mb-4">Place palm on primary terminal interface</p>
            <button 
              onClick={startScan}
              className="px-8 py-3 rounded-xl text-sm font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
            >
              Begin Fingerprint Scan
            </button>
          </div>
        )}
        
        {authStep === 'retina' && scanState === 'idle' && (
          <div>
            <p className="text-slate-300 mb-4">Look directly into the scanner</p>
            <button 
              onClick={startScan}
              className="px-8 py-3 rounded-xl text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
            >
              Begin Retinal Scan
            </button>
          </div>
        )}
        
        {scanState === 'scanning' && (
          <p className="text-cyan-400 animate-pulse">
            {authStep === 'fingerprint' ? 'Scanning fingerprint...' : 'Scanning retina...'}
          </p>
        )}
        
        {scanState === 'success' && (
          <div className="flex items-center justify-center gap-2 text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span>{authStep === 'fingerprint' ? 'Fingerprint verified' : 'Retinal scan complete'}</span>
          </div>
        )}
        
        {scanState === 'failed' && (
          <div className="flex items-center justify-center gap-2 text-red-400">
            <XCircle className="w-5 h-5" />
            <span>Authentication failed - try again</span>
          </div>
        )}
        
        {authStep === 'complete' && (
          <div className="text-green-400">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="font-bold">Access Granted</p>
          </div>
        )}
      </div>
      
      <div className="flex justify-center gap-4 mt-8">
        <div className={`w-3 h-3 rounded-full ${
          authStep === 'fingerprint' ? 'bg-cyan-400' : 
          scanState === 'success' || authStep === 'retina' || authStep === 'complete' ? 'bg-green-400' : 
          'bg-slate-600'
        }`} />
        <div className={`w-3 h-3 rounded-full ${
          authStep === 'retina' ? 'bg-cyan-400' : 
          authStep === 'complete' ? 'bg-green-400' : 
          'bg-slate-600'
        }`} />
      </div>
    </div>
  );
};

// Security Override Component
const SecurityOverride = () => {
  const [overrideState, setOverrideState] = useState<'pending' | 'authorizing' | 'executing' | 'complete'>('pending');
  const [countdown, setCountdown] = useState(10);

  const executeOverride = () => {
    setOverrideState('authorizing');
    
    setTimeout(() => {
      setOverrideState('executing');
      
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setOverrideState('complete');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-6 rounded-2xl"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
        <AlertTriangle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
        <h2 className="text-2xl font-black text-white mb-2">Override Required</h2>
        <p className="text-slate-300 max-w-2xl mx-auto">
          A deep-sector anomaly has been detected within the core neural network. To neutralize this threat, AEGIS requires Full System Permission Override to execute autonomous defense measures.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Security Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-slate-400">Network Latency</span>
              <span className="text-cyan-400 font-mono">0.002ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Threat Level</span>
              <span className="text-red-400 font-bold">CRITICAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Encryption</span>
              <span className="text-green-400 font-mono">AES-4096</span>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl p-6"
          style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Defensive Actions</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">Deep Packet Inspection</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Shield className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">Memory Forensics</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        {overrideState === 'pending' && (
          <button 
            onClick={executeOverride}
            className="px-12 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
          >
            Execute Override
          </button>
        )}
        
        {overrideState === 'authorizing' && (
          <div className="flex items-center justify-center gap-3 text-yellow-400">
            <Timer className="w-6 h-6 animate-spin" />
            <span className="text-lg font-bold">Authorizing Override...</span>
          </div>
        )}
        
        {overrideState === 'executing' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 text-cyan-400">
              <Zap className="w-6 h-6 animate-pulse" />
              <span className="text-lg font-bold">Executing Defense Protocols</span>
            </div>
            <div className="text-4xl font-black text-white">{countdown}</div>
            <div className="text-slate-400">Autonomous systems engaging...</div>
          </div>
        )}
        
        {overrideState === 'complete' && (
          <div className="space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <div className="text-2xl font-black text-green-400">Override Complete</div>
            <div className="text-slate-400">Threat neutralized. Systems secured.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function VaultSystem({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [showOverride, setShowOverride] = useState(false);

  const handleAuthorization = () => {
    setIsAuthorized(true);
    setTimeout(() => setShowOverride(true), 1000);
  };

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Security Vault</h1>
          <p className="text-slate-400">Biometric authorization and security protocol management</p>
        </div>

        <AnimatePresence mode="wait">
          {!isAuthorized && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl p-8"
              style={{ 
                background: 'rgba(13,21,38,0.6)', 
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)'
              }}
            >
              <BiometricAuth onAuthorized={handleAuthorization} />
            </motion.div>
          )}

          {isAuthorized && !showOverride && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center py-16"
            >
              <div className="w-16 h-16 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-cyan-400 text-lg font-bold">Accessing Secure Vault...</p>
            </motion.div>
          )}

          {showOverride && (
            <motion.div
              key="override"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-8"
              style={{ 
                background: 'rgba(13,21,38,0.6)', 
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(24px)'
              }}
            >
              <SecurityOverride />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8">
          <BottomNavigation activeTab="vault" onNavigate={onNavigate || (() => {})} />
        </div>

        <div className="fixed bottom-8 right-8">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ 
              background: 'rgba(13,21,38,0.9)', 
              border: '1px solid rgba(255,255,255,0.08)',
              backdropFilter: 'blur(24px)'
            }}>
            <div className={`w-3 h-3 rounded-full ${
              isAuthorized ? 'bg-green-400 animate-pulse' : 'bg-red-400'
            }`} />
            <span className="text-sm font-bold text-slate-300">
              {isAuthorized ? 'AUTHORIZED' : 'LOCKED'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}