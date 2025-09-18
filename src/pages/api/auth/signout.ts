export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseSSR(cookies);
  
  try {
    await supabase.auth.signOut();
    
    // Clear all auth-related cookies
    const cookieNames = ['sb-access-token', 'sb-refresh-token', 'supabase-auth-token'];
    cookieNames.forEach(name => {
      cookies.delete(name, {
        path: '/',
        domain: undefined,
        httpOnly: false,
        secure: true,
        sameSite: 'lax'
      });
    });
    
    return redirect('/');
  } catch (error) {
    console.error('Sign out error:', error);
    return redirect('/');
  }
};