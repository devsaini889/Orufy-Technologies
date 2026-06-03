import React, { useState } from 'react';
import AuthView from './views/AuthView';
import DashboardView from './views/DashboardView';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <div class="min-h-screen bg-[var(--bg)] font-sans antialiased text-[var(--text)]">
      {!isAuthenticated ? (
        <AuthView 
          onLoginSuccess={(email) => {
            setUserEmail(email);
            setIsAuthenticated(true);
          }} 
        />
      ) : (
        <DashboardView 
          userEmail={userEmail} 
          onLogout={() => setIsAuthenticated(false)} 
        />
      )}
    </div>
  );
}