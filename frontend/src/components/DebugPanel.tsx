import React, { useState, useEffect } from 'react';

export default function DebugPanel() {
  const [apiStatus, setApiStatus] = useState<string>('Checking...');
  const [wsStatus, setWsStatus] = useState<string>('Checking...');
  const [backendInfo, setBackendInfo] = useState<any>(null);

  useEffect(() => {
    // Test API connection
    fetch('/api/health')
      .then(response => response.json())
      .then(data => {
        setApiStatus(`✅ Connected (${data.status})`);
      })
      .catch(error => {
        setApiStatus(`❌ Failed: ${error.message}`);
      });

    // Get backend info
    fetch('/api/status')
      .then(response => response.json())
      .then(data => {
        setBackendInfo(data);
      })
      .catch(error => {
        console.error('Failed to get backend info:', error);
      });

    // Test WebSocket connection
    const testWs = new WebSocket(`ws://${window.location.hostname}:8000/ws/debug-test`);
    
    testWs.onopen = () => {
      setWsStatus('✅ Connected');
      testWs.close();
    };
    
    testWs.onerror = (error) => {
      setWsStatus(`❌ Failed: ${error}`);
    };
    
    testWs.onclose = () => {
      if (wsStatus === 'Checking...') {
        setWsStatus('❌ Connection closed');
      }
    };

    return () => {
      if (testWs.readyState === WebSocket.OPEN) {
        testWs.close();
      }
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 p-4 rounded-lg bg-black/80 text-white text-sm font-mono">
      <h3 className="font-bold mb-2">🔧 Debug Panel</h3>
      <div className="space-y-1">
        <div>API: {apiStatus}</div>
        <div>WebSocket: {wsStatus}</div>
        {backendInfo && (
          <div>
            <div>Scanner: {backendInfo.scanner}</div>
            <div>Version: {backendInfo.version}</div>
            <div>Max APK: {backendInfo.max_apk_mb}MB</div>
          </div>
        )}
      </div>
    </div>
  );
}