import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    // Get access token from Authorization header or cookies
    const authorization = request.headers.get('Authorization');
    const accessToken = authorization?.replace('Bearer ', '') || cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ 
        user: null, 
        session: null,
        error: 'No access token provided' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Set the session for this request
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return new Response(JSON.stringify({ 
        user: null, 
        session: null,
        error: error?.message || 'Invalid session' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      user,
      session: { access_token: accessToken },
      error: null 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Session API error:', error);
    return new Response(JSON.stringify({ 
      user: null, 
      session: null,
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};