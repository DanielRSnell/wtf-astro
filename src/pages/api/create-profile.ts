import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, email, fullName } = body;

    console.log('Creating profile for:', { userId, email, fullName });

    // Create profile manually
    const { data: profile, error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        full_name: fullName,
        role: 'subscriber'
      })
      .select()
      .single();

    if (createError) {
      console.error('Profile creation error:', createError);
      return new Response(JSON.stringify({ 
        error: `Error creating profile: ${createError.message}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Profile created successfully:', profile);

    return new Response(JSON.stringify({ 
      profile,
      success: true
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Create profile API error:', error);
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error.message}`
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};