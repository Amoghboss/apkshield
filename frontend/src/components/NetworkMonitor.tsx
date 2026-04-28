import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Wifi, 
  Activity, 
  AlertTriangle, 
  Shield, 
  Zap,
  Globe,
  Server,
  Download,
  Upload,
  Eye,
  Lock,
  Unlock,
  Terminal
} from 'lucide-react';
import BottomNavigation from './BottomNavigation';

// Network node simulation
const useNetworkNodes = () => {
  const [nodes, setNodes] = useState([
    { id: 'alpha-7', name: 'Network Node Alpha-7', status: 'active', threat: 'critical', traffic: 14.8, relays: 1204, latency: 12 },
    { id: 'beta-3', name: 'Network Node Beta-3', status: 'active', threat: 'low', traffic: 8.2, relays: 892, latency: 8 },
    { id: 'gamma-1', name: 'Network Node Gamma-1', status: 'standby', threat: 'medium', traffic: 3.1, relays: 445, latency: 15 }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        traffic: Math.max(1, Math.min(20, node.traffic + (Math.random() - 0.5) * 2)),
        relays: node.relays + Math.floor((Math.random() - 0.5) * 50),
        latency: Math.max(5, Math.min(25, node.latency + (Math.random() - 0.5) * 3))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return nodes;
};

// Active connections simulation
const useActiveConnections = () => {
  const [connections, setConnections] = useState([
    { origin: 'Terra-Prime-7', packet: 'Encrypted', status: 'secure', bandwidth: 120, action: 'TERMINATE' },
    { origin: 'Nexus-Station-Alpha', packet: 'Data Stream', status: 'active', bandwidth: 85, action: 'MONITOR' },
    { origin: 'Orbital-Relay-9', packet: 'Command', status: 'priority', bandwidth: 200, action: 'SECURE' }
  ]);

  useEffect(() => {
    const origins = ['Terra-Prime-7', 'Nexus-Station-Alpha', 'Orbital-Relay-9', 'Deep-Space-12', 'Mining-Station-X'];
    const packets = ['Encrypted', 'Data Stream', 'Command', 'Telemetry', 'Emergency'];
    const statuses = ['secure', 'active', 'priority', 'warning'];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newConnection = {
          origin: origins[Math.floor(Math.random() * origins.length)],
          packet: packets[Math.floor(Math.random() * packets.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          bandwidth: Math.floor(Math.random() * 250) + 50,
          action: Math.random() > 0.5 ? 'TERMINATE' : Math.random() > 0.5 ? 'MONITOR' : 'SECURE'
        };
        
        setConnections(prev => [newConnection, ...prev.slice(0, 4)]);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return connections;
};

// Network Stats Component
const NetworkStats = () => {
  const [stats, setStats] = useState({
    latency: 12,
    vulnerability: 'CRITICAL',
    encryption: 'AES-4096',
    uptime: '142.36'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        latency: Math.max(8, Math.min(20, prev.latency + (Math.random() - 0.5) * 2)),
        uptime: (parseFloat(prev.uptime) + 0.01).toFixed(2)
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Stability</div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Latency</div>
        <div className="text-2xl font-black text-cyan-400">{stats.latency.toFixed(0)}ms</div>
        <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full transition-all duration-1000"
            style={{ width: `${Math.max(20, 100 - (stats.latency / 20) * 100)}%` }}
          />
        </div>
        <div className="text-xs text-slate-500 mt-1">MIN: 8ms MAX: 88ms</div>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Vulnerability</div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Threat Level</div>
        <div className="text-2xl font-black text-red-400">{stats.vulnerability}</div>
        <div className="w-full h-1 bg-slate-800 rounded-full mt-2">
          <div className="h-full bg-gradient-to-r from-red-400 to-orange-400 rounded-full w-4/5" />
        </div>
        <div className="text-xs text-slate-500 mt-1">COMPROMISED</div>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Network Entropy</div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Encryption</div>
        <div className="text-lg font-black text-green-400">{stats.encryption}</div>
        <div className="text-xs text-slate-500 mt-1">24.2%</div>
      </div>

      <div className="text-center">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Threat Saturation</div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">Uptime</div>
        <div className="text-lg font-black text-yellow-400">{stats.uptime}h</div>
        <div className="text-xs text-slate-500 mt-1">88.7%</div>
      </div>
    </div>
  );
};

// Network Visualization Component
const NetworkVisualization = ({ nodes }: { nodes: any[] }) => (
  <div className="relative h-64 rounded-xl overflow-hidden"
    style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,50,100,0.2) 100%)' }}>
    {/* Grid background */}
    <div className="absolute inset-0 opacity-20"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0,245,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.3) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />
    
    {/* Network flow lines */}
    <svg className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,245,212,0)" />
          <stop offset="50%" stopColor="rgba(0,245,212,0.8)" />
          <stop offset="100%" stopColor="rgba(0,245,212,0)" />
        </linearGradient>
      </defs>
      
      {/* Animated flow lines */}
      <path d="M 50 50 Q 200 100 350 50" stroke="url(#flowGradient)" strokeWidth="2" fill="none">
        <animate attributeName="stroke-dasharray" values="0 100;50 50;100 0" dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M 100 150 Q 200 100 300 150" stroke="url(#flowGradient)" strokeWidth="2" fill="none">
        <animate attributeName="stroke-dasharray" values="100 0;50 50;0 100" dur="4s" repeatCount="indefinite" />
      </path>
    </svg>
    
    {/* Network nodes */}
    <div className="absolute top-8 left-8">
      <div className="w-4 h-4 rounded-full bg-green-400 animate-pulse" />
      <div className="text-xs text-green-400 mt-1 font-mono">ALPHA</div>
    </div>
    
    <div className="absolute top-20 right-12">
      <div className="w-4 h-4 rounded-full bg-red-400 animate-pulse" />
      <div className="text-xs text-red-400 mt-1 font-mono">THREAT</div>
    </div>
    
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
      <div className="w-6 h-6 rounded-full bg-cyan-400 animate-pulse" />
      <div className="text-xs text-cyan-400 mt-1 font-mono">CORE</div>
    </div>
    
    {/* Stats overlay */}
    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs font-mono">
      <div className="text-cyan-400">
        <div>TRAFFIC VOLUME</div>
        <div className="text-white font-bold">14.8 TB/s</div>
      </div>
      <div className="text-cyan-400">
        <div>ACTIVE RELAYS</div>
        <div className="text-white font-bold">1,204</div>
      </div>
    </div>
  </div>
);

// Active Connections Table
const ActiveConnectionsTable = ({ connections }: { connections: any[] }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 px-4">
      <span>Origin Node</span>
      <span>Data Packet</span>
      <span>Status</span>
      <span>Bandwidth</span>
      <span>Action</span>
    </div>
    
    {connections.map((conn, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${
            conn.status === 'secure' ? 'bg-green-400' :
            conn.status === 'priority' ? 'bg-blue-400' :
            conn.status === 'warning' ? 'bg-yellow-400' :
            'bg-cyan-400'
          } animate-pulse`} />
          <span className="text-sm text-slate-300 font-mono">{conn.origin}</span>
        </div>
        
        <span className="text-sm text-slate-400">{conn.packet}</span>
        
        <div className="flex items-center gap-2">
          {conn.status === 'secure' ? <Lock className="w-4 h-4 text-green-400" /> : 
           conn.status === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
           <Activity className="w-4 h-4 text-cyan-400" />}
          <span className={`text-xs font-bold uppercase ${
            conn.status === 'secure' ? 'text-green-400' :
            conn.status === 'priority' ? 'text-blue-400' :
            conn.status === 'warning' ? 'text-yellow-400' :
            'text-cyan-400'
          }`}>
            {conn.status}
          </span>
        </div>
        
        <span className="text-sm text-cyan-400 font-mono">{conn.bandwidth} MB/s</span>
        
        <button className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
          conn.action === 'TERMINATE' ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' :
          conn.action === 'SECURE' ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30' :
          'bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30'
        }`}>
          {conn.action}
        </button>
      </motion.div>
    ))}
  </div>
);

export default function NetworkMonitor({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const nodes = useNetworkNodes();
  const connections = useActiveConnections();
  const [selectedNode, setSelectedNode] = useState(nodes[0]);

  return (
    <div className="min-h-screen p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Network Operations</h1>
              <p className="text-slate-400">Real-time network monitoring and threat analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors">
                EXPORT LOG
              </button>
              <button className="px-4 py-2 rounded-xl text-sm font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors">
                PURGE CACHE
              </button>
            </div>
          </div>
        </div>

        {/* Live Stream Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm font-bold text-slate-300">LIVE STREAM FEED</span>
              </div>
              <h2 className="text-2xl font-black text-white">{selectedNode.name}</h2>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 uppercase tracking-wider">System Status</div>
              <div className="text-sm font-bold text-green-400">LIVE FEED ACTIVE</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column - Network Visualization */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <NetworkVisualization nodes={nodes} />
            </div>
            
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Network Statistics</h3>
              <NetworkStats />
            </div>
          </div>

          {/* Right Column - Node Details */}
          <div className="space-y-6">
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Node Status</h3>
                <div className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  VULNERABILITY DETECTED
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Traffic Volume</div>
                  <div className="text-2xl font-black text-white">{selectedNode.traffic.toFixed(1)} <span className="text-sm text-slate-400">TB/s</span></div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active Relays</div>
                  <div className="text-2xl font-black text-white">{selectedNode.relays.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Network Latency</span>
                  <span className="text-sm font-mono text-cyan-400">{selectedNode.latency}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Threat Level</span>
                  <span className={`text-sm font-bold uppercase ${
                    selectedNode.threat === 'critical' ? 'text-red-400' :
                    selectedNode.threat === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {selectedNode.threat}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Encryption Status</span>
                  <span className="text-sm font-mono text-green-400">AES-4096</span>
                </div>
              </div>
            </div>
            
            {/* Threat Analysis */}
            <div className="rounded-2xl p-6"
              style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">Threat Analysis</h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-red-400">DEEP PACKET INSPECTION</div>
                    <div className="text-xs text-slate-400">Real-time analysis of sub-atomic data packets across the quantum mesh to identify polymorphic malware signatures.</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Shield className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-green-400">MEMORY FORENSICS</div>
                    <div className="text-xs text-slate-400">Volatile memory imaging to capture encrypted threat artifacts before they self-destruct or migrate to redundant arrays.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Connections */}
        <div className="rounded-2xl p-6 mb-6"
          style={{ background: 'rgba(13,21,38,0.6)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Active Connections</h3>
            <div className="text-xs text-slate-400">Monitoring real-time quantum handshakes</div>
          </div>
          
          <ActiveConnectionsTable connections={connections} />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation activeTab="network" onNavigate={onNavigate || (() => {})} />
      </div>
    </div>
  );
}