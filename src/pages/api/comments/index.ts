export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const url = new URL(request.url);
    const resourceType = url.searchParams.get('resourceType');
    const resourceSlug = url.searchParams.get('resourceSlug');
    const sortBy = url.searchParams.get('sortBy') || 'newest';

    if (!resourceType || !resourceSlug) {
      return new Response(
        JSON.stringify({ error: 'resourceType and resourceSlug are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createSupabaseSSR(cookies);
    
    // Get current user for vote status
    const { data: { user } } = await supabase.auth.getUser();
    
    // Build query for top-level comments
    let query = supabase
      .from('comments_with_user')
      .select('*')
      .eq('resource_type', resourceType)
      .eq('resource_slug', resourceSlug)
      .is('parent_id', null);

    // Apply sorting
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'oldest') {
      query = query.order('created_at', { ascending: true });
    } else if (sortBy === 'popular') {
      query = query.order('upvote_count', { ascending: false });
    }

    const { data: topLevelComments, error } = await query;

    if (error) {
      console.error('Error loading comments:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to load comments' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Load replies for each comment recursively
    const loadReplies = async (parentId: string): Promise<any[]> => {
      const { data: replies, error: repliesError } = await supabase
        .from('comments_with_user')
        .select('*')
        .eq('parent_id', parentId)
        .order('created_at', { ascending: true });

      if (repliesError || !replies) return [];

      // Get user votes for replies if user is logged in
      if (user) {
        for (const reply of replies) {
          const { data: vote } = await supabase
            .from('comment_votes')
            .select('vote_type')
            .eq('comment_id', reply.id)
            .eq('user_id', user.id)
            .single();
          
          reply.current_user_vote = vote?.vote_type || null;
        }
      }

      // Recursively load nested replies
      const repliesWithNested = await Promise.all(
        replies.map(async (reply) => {
          if (reply.reply_count > 0) {
            const nestedReplies = await loadReplies(reply.id);
            return { ...reply, replies: nestedReplies };
          }
          return { ...reply, replies: [] };
        })
      );

      return repliesWithNested;
    };

    // Load replies and user votes for top-level comments
    const commentsWithReplies = await Promise.all(
      (topLevelComments || []).map(async (comment) => {
        // Get user vote if logged in
        if (user) {
          const { data: vote } = await supabase
            .from('comment_votes')
            .select('vote_type')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id)
            .single();
          
          comment.current_user_vote = vote?.vote_type || null;
        }

        const replies = await loadReplies(comment.id);
        return { ...comment, replies };
      })
    );

    return new Response(
      JSON.stringify({ comments: commentsWithReplies }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Comments API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createSupabaseSSR(cookies);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { resourceType, resourceSlug, content, parentId } = await request.json();

    if (!resourceType || !resourceSlug || !content?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the comment
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        resource_type: resourceType,
        resource_slug: resourceSlug,
        content: content.trim(),
        parent_id: parentId || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error posting comment:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to post comment' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, comment }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Post comment error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};