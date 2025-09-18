export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password, fullName } = await request.json();
    
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createSupabaseSSR(cookies);
    
    // Sign up the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || email.split('@')[0]
        }
      }
    });
    
    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    if (!data.user) {
      return new Response(
        JSON.stringify({ error: 'Sign up failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // If email confirmation is required
    if (!data.session) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Please check your email to confirm your account'
        }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName || email.split('@')[0],
        role: 'subscriber'
      });
    
    if (profileError) {
      console.error('Error creating profile:', profileError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        user: data.user
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Sign up error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};