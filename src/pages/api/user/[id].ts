import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

// Create Supabase client directly here to avoid import issues
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GET: APIRoute = async ({ params, request, cookies }) => {
  try {
    console.log('User API called with params:', params);
    
    const userId = params.id;

    if (!userId) {
      console.log('No user ID provided');
      return new Response(JSON.stringify({ 
        error: 'User ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Looking for user ID:', userId);

    // Get access token from Authorization header
    const authorization = request.headers.get('Authorization');
    console.log('Authorization header:', authorization ? 'Present' : 'Missing');
    
    const accessToken = authorization?.replace('Bearer ', '');

    if (!accessToken) {
      console.log('No access token found');
      return new Response(JSON.stringify({ 
        error: 'Authentication required' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Access token found, verifying...');

    // Verify the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    console.log('Auth check result:', { user: user?.email, error: authError?.message });

    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: `Invalid session: ${authError?.message || 'No user found'}` 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if requesting own profile
    const isOwnProfile = user.id === userId;
    console.log('Is own profile:', isOwnProfile, 'User ID:', user.id, 'Requested ID:', userId);
    
    // For now, only allow users to access their own profile
    if (!isOwnProfile) {
      return new Response(JSON.stringify({ 
        error: 'Access denied - you can only view your own profile' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching profile from database...');

    // Fetch user profile (without .single() first to see what we get)
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId);

    console.log('Profile fetch result:', { 
      profileCount: profiles?.length, 
      profiles: profiles, 
      error: profileError?.message 
    });

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return new Response(JSON.stringify({ 
        error: `Error fetching profile data: ${profileError.message}` 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!profiles || profiles.length === 0) {
      console.log('No profile found for user ID:', userId);
      return new Response(JSON.stringify({ 
        error: 'Profile not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (profiles.length > 1) {
      console.log('Multiple profiles found for user ID:', userId, 'Count:', profiles.length);
      return new Response(JSON.stringify({ 
        error: 'Multiple profiles found - data integrity issue' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const profile = profiles[0];

    console.log('Success! Returning profile data');

    return new Response(JSON.stringify({ 
      user,
      profile,
      isOwnProfile,
      error: null 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('User API error:', error);
    return new Response(JSON.stringify({ 
      error: `Internal server error: ${error.message}`,
      stack: error.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  try {
    const userId = params.id;

    if (!userId) {
      return new Response(JSON.stringify({ 
        error: 'User ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get access token
    const authorization = request.headers.get('Authorization');
    const accessToken = authorization?.replace('Bearer ', '') || cookies.get('sb-access-token')?.value;

    if (!accessToken) {
      return new Response(JSON.stringify({ 
        error: 'Authentication required' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify the user session
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid session' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Only allow users to update their own profile
    if (user.id !== userId) {
      return new Response(JSON.stringify({ 
        error: 'Access denied - you can only update your own profile' 
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse request body
    const updates = await request.json();

    // Validate allowed fields (prevent role changes, etc.)
    const allowedFields = ['full_name', 'avatar_url'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    if (Object.keys(filteredUpdates).length === 0) {
      return new Response(JSON.stringify({ 
        error: 'No valid fields to update' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update profile
    const { data: profile, error: updateError } = await supabase
      .from('profiles')
      .update(filteredUpdates)
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error('Profile update error:', updateError);
      return new Response(JSON.stringify({ 
        error: 'Error updating profile' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      profile,
      error: null 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Profile update API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};