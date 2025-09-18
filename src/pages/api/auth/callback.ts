export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/';
  
  if (!code) {
    return redirect('/auth?error=missing_code');
  }
  
  try {
    const supabase = createSupabaseSSR(cookies);
    
    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return redirect(`/auth?error=${encodeURIComponent(error.message)}`);
    }
    
    if (!data.user) {
      return redirect('/auth?error=no_user');
    }
    
    // Create or update user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
        role: 'subscriber',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (profileError) {
      console.error('Error updating profile:', profileError);
    }
    
    return redirect(next);
  } catch (error) {
    console.error('Auth callback error:', error);
    return redirect('/auth?error=callback_error');
  }
};