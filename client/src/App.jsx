import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Authentication Pages
import RoleSelection from './pages/RoleSelection';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #334155',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          {/* Default Route - Redirect to Auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Authentication Routes */}
          <Route path="/auth" element={<RoleSelection />} />
          <Route path="/auth/:role/login" element={<Login />} />
          <Route path="/auth/:role/signup" element={<Signup />} />
          
          {/* Dashboard Routes - Placeholder for now */}
          <Route path="/dashboard/:role" element={
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="text-slate-400">Dashboard coming soon...</p>
              </div>
            </div>
          } />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
