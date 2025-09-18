export const prerender = false;

import type { APIRoute } from 'astro';
import { createSupabaseSSR } from '@/lib/supabase-ssr';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  try {
    const { id: commentId } = params;
    const supabase = createSupabaseSSR(cookies);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { voteType } = await request.json();

    if (!voteType || !['upvote', 'downvote'].includes(voteType)) {
      return new Response(
        JSON.stringify({ error: 'Invalid vote type' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if user already voted
    const { data: existingVote, error: checkError } = await supabase
      .from('comment_votes')
      .select('*')
      .eq('comment_id', commentId)
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error checking vote:', checkError);
      return new Response(
        JSON.stringify({ error: 'Failed to process vote' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same vote type
        const { error: deleteError } = await supabase
          .from('comment_votes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error removing vote:', deleteError);
          return new Response(
            JSON.stringify({ error: 'Failed to remove vote' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, action: 'removed' }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
      } else {
        // Change vote type
        const { error: updateError } = await supabase
          .from('comment_votes')
          .update({ vote_type: voteType })
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        if (updateError) {
          console.error('Error updating vote:', updateError);
          return new Response(
            JSON.stringify({ error: 'Failed to update vote' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ success: true, action: 'changed' }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    } else {
      // Add new vote
      const { error: insertError } = await supabase
        .from('comment_votes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType
        });

      if (insertError) {
        console.error('Error adding vote:', insertError);
        return new Response(
          JSON.stringify({ error: 'Failed to add vote' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, action: 'added' }),
        { 
          status: 200, 
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
  } catch (error) {
    console.error('Vote error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};