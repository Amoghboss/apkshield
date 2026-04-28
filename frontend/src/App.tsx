import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import Auth from './components/Auth';
import Monitor from './components/Monitor';
import MapView from './components/Map';
import NeuralNetwork from './components/NeuralNetwork';
import Profile from './components/Profile';
import Layout from './components/Layout';
import APKProtectionTool from './components/APKProtectionTool';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary-container border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen relative overflow-hidden bg-surface-container-lowest nebula-bg">
        <div className="fixed inset-0 star-field pointer-events-none" />
        
        <Routes>
          <Route path="/protect" element={<APKProtectionTool />} />
          <Route 
            path="/auth" 
            element={
              user ? <Navigate to="/monitor" /> : <Auth onAuthenticate={() => {}} />
            } 
          />
          
          <Route 
            path="/" 
            element={
              user ? <Layout /> : <Navigate to="/auth" />
            }
          >
            <Route index element={<Navigate to="/monitor" />} />
            <Route path="monitor" element={<Monitor />} />
            <Route path="map" element={<MapView />} />
            <Route path="neural" element={<NeuralNetwork />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}
