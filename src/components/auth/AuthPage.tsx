import React, { useState } from 'react';
import { AuthProvider } from './AuthProvider';
import { AuthForm } from './AuthForm';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  
  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome</h1>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>
          <AuthForm 
            mode={mode}
            onToggleMode={toggleMode}
          />
        </div>
      </div>
    </AuthProvider>
  );
};