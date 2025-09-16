import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MessageCircle, Reply, ThumbsUp, ThumbsDown, MoreVertical, Edit, Trash, Flag, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  parent_id: string | null;
  depth: number;
  reply_count: number;
  upvote_count: number;
  downvote_count: number;
  current_user_vote: 'upvote' | 'downvote' | null;
  user_email: string;
  username: string;
  avatar_url: string | null;
  full_name: string | null;
  replies?: Comment[];
}

interface CommentsSectionProps {
  resourceType: string;
  resourceSlug: string;
  className?: string;
}

export function CommentsSection({ resourceType, resourceSlug, className }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkUser();
    loadComments();

    // Set up realtime subscription for comments
    const subscription = supabase
      .channel(`comments:${resourceType}:${resourceSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `resource_slug=eq.${resourceSlug}`,
        },
        () => {
          loadComments();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [resourceType, resourceSlug, sortBy]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  };

  const loadComments = async () => {
    setLoading(true);
    try {
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

      if (error) throw error;

      // Load replies for each comment
      const commentsWithReplies = await Promise.all(
        (topLevelComments || []).map(async (comment) => {
          const replies = await loadReplies(comment.id);
          return { ...comment, replies };
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadReplies = async (parentId: string): Promise<Comment[]> => {
    const { data: replies, error } = await supabase
      .from('comments_with_user')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error || !replies) return [];

    // Recursively load nested replies
    const repliesWithNested = await Promise.all(
      replies.map(async (reply) => {
        if (reply.reply_count > 0) {
          const nestedReplies = await loadReplies(reply.id);
          return { ...reply, replies: nestedReplies };
        }
        return reply;
      })
    );

    return repliesWithNested;
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        user_id: user.id,
        resource_type: resourceType,
        resource_slug: resourceSlug,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      await loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user || !replyContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        user_id: user.id,
        resource_type: resourceType,
        resource_slug: resourceSlug,
        parent_id: parentId,
        content: replyContent.trim(),
      });

      if (error) throw error;

      setReplyContent('');
      setReplyingTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error posting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!user || !editContent.trim() || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          content: editContent.trim(),
          is_edited: true,
          edited_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .eq('user_id', user.id);

      if (error) throw error;

      setEditingId(null);
      setEditContent('');
      await loadComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!user || !confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase.rpc('soft_delete_comment', {
        comment_id: commentId,
        deleting_user_id: user.id,
      });

      if (error) throw error;

      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const triggerAuthModal = () => {
    // Use the global auth modal function if available
    if (window.showAuthModal) {
      window.showAuthModal('signin');
    } else {
      // Fallback to redirect if the global function isn't available
      window.location.href = '/auth';
    }
  };

  const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) {
      triggerAuthModal();
      return;
    }

    try {
      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('comment_votes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase
            .from('comment_votes')
            .delete()
            .eq('comment_id', commentId)
            .eq('user_id', user.id);
        } else {
          // Change vote
          await supabase
            .from('comment_votes')
            .update({ vote_type: voteType })
            .eq('comment_id', commentId)
            .eq('user_id', user.id);
        }
      } else {
        // Add new vote
        await supabase.from('comment_votes').insert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType,
        });
      }

      await loadComments();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const toggleThread = (commentId: string) => {
    const newExpanded = new Set(expandedThreads);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedThreads(newExpanded);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const isAuthor = user?.id === comment.user_id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = expandedThreads.has(comment.id);

    return (
      <div className={cn("group", isReply && "ml-8 sm:ml-12")}>
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {comment.avatar_url ? (
              <img
                src={comment.avatar_url}
                alt={comment.username || comment.user_email}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-medium text-primary">
                  {(comment.username || comment.user_email || '?')[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Comment Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm text-foreground">
                  {comment.username || comment.full_name || comment.user_email?.split('@')[0]}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(comment.created_at)}
                </span>
                {comment.is_edited && (
                  <span className="text-xs text-muted-foreground">(edited)</span>
                )}
              </div>

              {/* Actions Menu */}
              {isAuthor && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 hover:bg-muted rounded">
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>

            {/* Content */}
            {editingId === comment.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleEditComment(comment.id);
              }} className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 bg-muted/50 border border-border rounded-lg text-sm"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-1 text-sm text-foreground/90 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1 mt-2">
              <button
                onClick={() => handleVote(comment.id, 'upvote')}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors",
                  comment.current_user_vote === 'upvote'
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ThumbsUp className="w-3 h-3" />
                {comment.upvote_count > 0 && comment.upvote_count}
              </button>

              <button
                onClick={() => handleVote(comment.id, 'downvote')}
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors",
                  comment.current_user_vote === 'downvote'
                    ? "bg-red-500/10 text-red-500"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <ThumbsDown className="w-3 h-3" />
                {comment.downvote_count > 0 && comment.downvote_count}
              </button>

              <button
                onClick={() => {
                  if (!user) {
                    triggerAuthModal();
                    return;
                  }
                  setReplyingTo(comment.id);
                  setReplyContent('');
                }}
                className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Reply className="w-3 h-3" />
                Reply
              </button>

              {isAuthor && (
                <>
                  <button
                    onClick={() => {
                      setEditingId(comment.id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="flex items-center gap-1 px-2 py-1 hover:bg-red-500/10 rounded-lg text-xs text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash className="w-3 h-3" />
                    Delete
                  </button>
                </>
              )}
            </div>

            {/* Reply Form */}
            {replyingTo === comment.id && (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmitReply(comment.id);
              }} className="mt-3">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  className="w-full p-3 bg-muted/50 border border-border rounded-lg text-sm resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    disabled={submitting || !replyContent.trim()}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm disabled:opacity-50"
                  >
                    Post Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Expand/Collapse Replies */}
            {hasReplies && (
              <button
                onClick={() => toggleThread(comment.id)}
                className="flex items-center gap-1 mt-3 text-xs text-primary hover:underline"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3" />
                    Hide {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" />
                    Show {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                  </>
                )}
              </button>
            )}

            {/* Nested Replies */}
            {hasReplies && isExpanded && (
              <div className="mt-4 space-y-4">
                {comment.replies!.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={cn("text-center py-12", className)}>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Comment Form - Only show for logged in users */}
      {user && (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            className="w-full p-4 bg-muted/50 border border-border rounded-xl text-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
            rows={4}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Be respectful and constructive. Read our community guidelines.
            </p>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 transition-colors hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
              Post Comment
            </button>
          </div>
        </form>
      )}

      {/* Show sign in prompt only if not logged in AND wanting to comment */}
      {!user && comments.length === 0 && (
        <div className="text-center py-8 bg-muted/20 rounded-xl">
          <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-foreground font-medium mb-2">Be the first to comment</p>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to share your experience with this product
          </p>
          <button
            onClick={triggerAuthModal}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Comment
          </button>
        </div>
      )}

      {/* Sorting - Always show if there are comments */}
      {comments.length > 0 && (
        <>
          <div className="flex items-center gap-2 pb-4 border-b border-border/50">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex gap-1">
              {(['newest', 'oldest', 'popular'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-sm capitalize transition-colors",
                    sortBy === sort
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>

          {/* Comments List - Always visible */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>

          {/* Add comment prompt for non-logged in users when comments exist */}
          {!user && (
            <div className="flex items-center justify-center gap-3 py-6 border-t border-border/50">
              <MessageCircle className="w-5 h-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Want to join the discussion?
              </p>
              <button
                onClick={triggerAuthModal}
                className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}