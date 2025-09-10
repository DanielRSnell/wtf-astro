import React, { useState } from 'react';
import { useAuth } from './AuthProvider';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onToggleMode: () => void;
  onClose?: () => void;
  className?: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({ 
  mode, 
  onToggleMode, 
  onClose,
  className 
}) => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setIsLoading(false);
        return;
      }
    }

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Successfully signed in!');
          onClose?.();
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          setError(error.message);
        } else {
          setSuccess('Check your email for the confirmation link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setIsLoading(false);
  };

  const isSignIn = mode === 'signin';

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSignIn ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-muted-foreground">
            {isSignIn 
              ? 'Sign in to your account to continue' 
              : 'Join our community and get started'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                placeholder="Enter your full name"
                required={!isSignIn}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          {!isSignIn && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                placeholder="Confirm your password"
                required={!isSignIn}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Loading...' : (isSignIn ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">
            {isSignIn ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={onToggleMode}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};