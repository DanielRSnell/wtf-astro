import type { APIRoute } from 'astro';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseSSR(cookies);
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body
    const { username, fullName } = await request.json();
    
    // Validate input
    if (!username || typeof username !== 'string') {
      return new Response(JSON.stringify({ error: 'Username is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Clean and validate username
    const cleanUsername = username.trim();
    
    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      return new Response(JSON.stringify({ 
        error: 'Username can only contain letters, numbers, and underscores' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return new Response(JSON.stringify({ 
        error: 'Username must be between 3 and 30 characters' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if username is already taken (excluding current user)
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', cleanUsername)
      .neq('id', user.id)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Username check error:', checkError);
      return new Response(JSON.stringify({ error: 'Error checking username availability' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (existingProfile) {
      return new Response(JSON.stringify({ error: 'Username is already taken' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update profile
    const updateData: any = {
      username: cleanUsername,
      updated_at: new Date().toISOString()
    };
    
    if (fullName !== undefined) {
      updateData.full_name = fullName.trim() || null;
    }
    
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
      
    if (updateError) {
      console.error('Profile update error:', updateError);
      return new Response(JSON.stringify({ error: 'Failed to update profile' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      message: 'Profile updated successfully',
      profile: updatedProfile 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};