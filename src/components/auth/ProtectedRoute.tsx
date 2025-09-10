import React from 'react';
import { useAuth } from './AuthProvider';
import type { UserProfile } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserProfile['role'];
  fallback?: React.ReactNode;
  showLogin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'subscriber',
  fallback,
  showLogin = true
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    if (showLogin) {
      return (
        <div className="text-center p-8">
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-muted-foreground mb-4">Please sign in to access this content.</p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
            Sign In
          </button>
        </div>
      );
    }
    return fallback || null;
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Profile Loading</h3>
        <p className="text-muted-foreground">Setting up your account...</p>
      </div>
    );
  }

  // Check role hierarchy
  const roleHierarchy = {
    'subscriber': 1,
    'author': 2,
    'editor': 3,
    'admin': 4
  };

  const userLevel = roleHierarchy[profile.role];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel < requiredLevel) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
        <p className="text-muted-foreground mb-2">
          This content requires <span className="capitalize font-medium">{requiredRole}</span> access.
        </p>
        <p className="text-sm text-muted-foreground">
          Your current role: <span className="capitalize font-medium text-foreground">{profile.role}</span>
        </p>
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
};

// Hook for role-based conditional rendering
export const useRole = () => {
  const { profile } = useAuth();

  const hasRole = (requiredRole: UserProfile['role']): boolean => {
    if (!profile) return false;

    const roleHierarchy = {
      'subscriber': 1,
      'author': 2,
      'editor': 3,
      'admin': 4
    };

    const userLevel = roleHierarchy[profile.role];
    const requiredLevel = roleHierarchy[requiredRole];

    return userLevel >= requiredLevel;
  };

  const isRole = (role: UserProfile['role']): boolean => {
    return profile?.role === role;
  };

  return { hasRole, isRole, currentRole: profile?.role };
};