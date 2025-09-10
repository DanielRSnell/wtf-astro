import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GET: APIRoute = async ({ request }) => {
  try {
    console.log('Debug profiles API called');
    
    // Get all profiles (for debugging)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*');

    console.log('All profiles in database:', profiles);
    console.log('Profile query error:', profileError);

    return new Response(JSON.stringify({ 
      profiles: profiles || [],
      error: profileError?.message || null,
      count: profiles?.length || 0
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Debug profiles API error:', error);
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error.message}`,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};