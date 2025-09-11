import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, type UserProfile } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getCachedProfile = (userId: string): UserProfile | null => {
    try {
      const cached = localStorage.getItem(`profile_${userId}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  };

  const setCachedProfile = (userId: string, profile: UserProfile) => {
    try {
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profile));
      localStorage.setItem(`profile_${userId}_timestamp`, Date.now().toString());
    } catch (error) {
      console.warn('Failed to cache profile:', error);
    }
  };

  const isCacheValid = (userId: string, maxAge: number = 5 * 60 * 1000): boolean => {
    try {
      const timestamp = localStorage.getItem(`profile_${userId}_timestamp`);
      if (!timestamp) return false;
      return Date.now() - parseInt(timestamp) < maxAge;
    } catch {
      return false;
    }
  };

  const fetchUserProfile = async (userId: string, useCache: boolean = true) => {
    try {
      // Check cache first if enabled
      if (useCache && isCacheValid(userId)) {
        const cached = getCachedProfile(userId);
        if (cached) {
          console.log('👤 Using cached profile:', cached?.full_name || cached?.email || 'No name');
          return cached;
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profiles table doesn't exist yet, show helpful error
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          console.warn('⚠️  Profiles table not found. Please run the database schema in Supabase. See SETUP_DATABASE.md for instructions.');
        } else {
          console.error('Error fetching profile:', error);
        }
        return null;
      }

      // Cache the profile data
      if (data) {
        setCachedProfile(userId, data);
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('📧 Initial session check:', session?.user?.email || 'No user');
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          console.log('👤 Profile loaded:', profile?.full_name || profile?.email || 'No profile');
          setProfile(profile);
        });
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          console.log('👤 Profile updated:', userProfile?.full_name || userProfile?.email || 'No profile');
          setProfile(userProfile);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    
    // Clear cached profile data
    if (user) {
      try {
        localStorage.removeItem(`profile_${user.id}`);
        localStorage.removeItem(`profile_${user.id}_timestamp`);
      } catch (error) {
        console.warn('Failed to clear profile cache:', error);
      }
    }
    
    return { error };
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: { message: 'No user logged in' } };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (!error && profile) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      // Update cache with new profile data
      setCachedProfile(user.id, updatedProfile);
    }

    return { error };
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};