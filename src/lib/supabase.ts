import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client if environment variables are missing
// This allows the app to run without Supabase configured
const createSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase environment variables not configured. Authentication features will be disabled.');
    // Return a mock client that won't crash the app
    return null;
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSupabaseClient();

// Types for our application
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role: 'subscriber' | 'author' | 'editor' | 'admin';
  created_at: string;
  updated_at: string;
}

// Helper function to get current user profile
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) return null;
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

// Helper function to check user role
export async function hasRole(requiredRole: UserProfile['role']): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  if (!profile) return false;

  const roleHierarchy = {
    'subscriber': 1,
    'author': 2,
    'editor': 3,
    'admin': 4
  };

  return roleHierarchy[profile.role] >= roleHierarchy[requiredRole];
}