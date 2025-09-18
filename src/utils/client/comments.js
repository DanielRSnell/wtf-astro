// Comments Manager - Vanilla JS
// Manages comments functionality without React

class CommentsManager {
  constructor() {
    this.comments = [];
    this.loading = false;
    this.user = null;
    this.resourceType = '';
    this.resourceSlug = '';
    this.sortBy = 'newest';
    this.expandedThreads = new Set();
    this.submitting = false;
    this.init();
  }

  init() {
    // Wait for DOM and auth manager to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Subscribe to auth state
    if (window.authManager) {
      window.authManager.subscribe((state) => {
        this.user = state.user;
        this.updateAuthUI();
      });
    }
  }

  async initialize(containerId, resourceType, resourceSlug) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Comments container #${containerId} not found`);
      return;
    }

    this.resourceType = resourceType;
    this.resourceSlug = resourceSlug;

    // Load comments
    await this.loadComments();

    // Set up realtime subscription if Supabase is available
    if (window.supabase) {
      this.setupRealtimeSubscription();
    }
  }

  async loadComments() {
    this.loading = true;
    this.render();

    try {
      const response = await fetch(`/api/comments?resourceType=${encodeURIComponent(this.resourceType)}&resourceSlug=${encodeURIComponent(this.resourceSlug)}&sortBy=${this.sortBy}`);
      
      if (!response.ok) throw new Error('Failed to load comments');
      
      const data = await response.json();
      this.comments = data.comments || [];
    } catch (error) {
      console.error('Error loading comments:', error);
      this.comments = [];
    } finally {
      this.loading = false;
      this.render();
    }
  }

  async submitComment(content, parentId = null) {
    if (!this.user || !content.trim() || this.submitting) return;

    this.submitting = true;
    this.render();

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          resourceType: this.resourceType,
          resourceSlug: this.resourceSlug,
          content: content.trim(),
          parentId
        })
      });

      if (!response.ok) throw new Error('Failed to post comment');

      // Clear form and reload comments
      if (!parentId) {
        const textarea = this.container.querySelector('#new-comment-textarea');
        if (textarea) textarea.value = '';
      }
      
      await this.loadComments();
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      this.submitting = false;
      this.render();
    }
  }

  async editComment(commentId, newContent) {
    if (!this.user || !newContent.trim() || this.submitting) return;

    this.submitting = true;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          content: newContent.trim()
        })
      });

      if (!response.ok) throw new Error('Failed to edit comment');

      await this.loadComments();
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit comment. Please try again.');
    } finally {
      this.submitting = false;
    }
  }

  async deleteComment(commentId) {
    if (!this.user || !confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Failed to delete comment');

      await this.loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }

  async vote(commentId, voteType) {
    if (!this.user) {
      if (window.authModal) {
        window.authModal.open('signin');
      }
      return;
    }

    try {
      const response = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ voteType })
      });

      if (!response.ok) throw new Error('Failed to vote');

      await this.loadComments();
    } catch (error) {
      console.error('Error voting:', error);
    }
  }

  toggleThread(commentId) {
    if (this.expandedThreads.has(commentId)) {
      this.expandedThreads.delete(commentId);
    } else {
      this.expandedThreads.add(commentId);
    }
    this.render();
  }

  changeSortOrder(newSort) {
    this.sortBy = newSort;
    this.loadComments();
  }

  formatDate(dateString) {
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
  }

  updateAuthUI() {
    // Re-render when auth state changes
    if (this.container) {
      this.render();
    }
  }

  setupRealtimeSubscription() {
    if (!window.supabase) return;

    const channel = window.supabase
      .channel(`comments:${this.resourceType}:${this.resourceSlug}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `resource_slug=eq.${this.resourceSlug}`,
        },
        () => {
          this.loadComments();
        }
      )
      .subscribe();

    // Store channel for cleanup
    this.realtimeChannel = channel;
  }

  renderComment(comment, isReply = false) {
    const isAuthor = this.user?.id === comment.user_id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isExpanded = this.expandedThreads.has(comment.id);
    
    const avatarHtml = comment.avatar_url 
      ? `<img src="${comment.avatar_url}" alt="${comment.username || comment.user_email}" class="w-8 h-8 rounded-full">`
      : `<div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span class="text-xs font-medium text-primary">
            ${(comment.username || comment.user_email || '?')[0].toUpperCase()}
          </span>
        </div>`;

    const repliesHtml = hasReplies && isExpanded
      ? `<div class="mt-4 space-y-4">
          ${comment.replies.map(reply => this.renderComment(reply, true)).join('')}
        </div>`
      : '';

    return `
      <div class="group ${isReply ? 'ml-8 sm:ml-12' : ''}" data-comment-id="${comment.id}">
        <div class="flex gap-3">
          <div class="flex-shrink-0">
            ${avatarHtml}
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="font-medium text-sm text-foreground">
                  ${comment.username || comment.full_name || comment.user_email?.split('@')[0]}
                </span>
                <span class="text-xs text-muted-foreground">
                  ${this.formatDate(comment.created_at)}
                </span>
                ${comment.is_edited ? '<span class="text-xs text-muted-foreground">(edited)</span>' : ''}
              </div>
              
              ${isAuthor ? `
                <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button class="comment-menu-btn p-1 hover:bg-muted rounded" data-comment-id="${comment.id}">
                    <svg class="w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                  </button>
                </div>
              ` : ''}
            </div>
            
            <div class="comment-content" data-comment-id="${comment.id}">
              <p class="mt-1 text-sm text-foreground/90 whitespace-pre-wrap break-words">
                ${comment.content}
              </p>
            </div>
            
            <div class="flex items-center gap-1 mt-2">
              <button class="vote-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                comment.current_user_vote === 'upvote' 
                  ? 'bg-primary/10 text-primary' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }" data-comment-id="${comment.id}" data-vote-type="upvote">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
                ${comment.upvote_count > 0 ? comment.upvote_count : ''}
              </button>
              
              <button class="vote-btn flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors ${
                comment.current_user_vote === 'downvote' 
                  ? 'bg-red-500/10 text-red-500' 
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              }" data-comment-id="${comment.id}" data-vote-type="downvote">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384" />
                </svg>
                ${comment.downvote_count > 0 ? comment.downvote_count : ''}
              </button>
              
              <button class="reply-btn flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors" data-comment-id="${comment.id}">
                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Reply
              </button>
              
              ${isAuthor ? `
                <button class="edit-btn flex items-center gap-1 px-2 py-1 hover:bg-muted rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors" data-comment-id="${comment.id}">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </button>
                
                <button class="delete-btn flex items-center gap-1 px-2 py-1 hover:bg-red-500/10 rounded-lg text-xs text-muted-foreground hover:text-red-500 transition-colors" data-comment-id="${comment.id}">
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              ` : ''}
            </div>
            
            <div class="reply-form-container" data-parent-id="${comment.id}"></div>
            
            ${hasReplies ? `
              <button class="toggle-thread-btn flex items-center gap-1 mt-3 text-xs text-primary hover:underline" data-comment-id="${comment.id}">
                ${isExpanded ? `
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                  </svg>
                  Hide ${comment.reply_count} ${comment.reply_count === 1 ? 'reply' : 'replies'}
                ` : `
                  <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  Show ${comment.reply_count} ${comment.reply_count === 1 ? 'reply' : 'replies'}
                `}
              </button>
            ` : ''}
            
            ${repliesHtml}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    if (!this.container) return;

    if (this.loading) {
      this.container.innerHTML = `
        <div class="text-center py-12">
          <div class="animate-pulse space-y-4">
            ${[1, 2, 3].map(() => `
              <div class="flex gap-3">
                <div class="w-8 h-8 bg-muted rounded-full"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-muted rounded w-1/4"></div>
                  <div class="h-3 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      return;
    }

    const commentsHtml = this.comments.map(comment => this.renderComment(comment)).join('');

    this.container.innerHTML = `
      <div class="space-y-6">
        ${this.user ? `
          <form id="comment-form" class="space-y-3">
            <textarea
              id="new-comment-textarea"
              placeholder="Share your thoughts..."
              class="w-full p-4 bg-muted/50 border border-border rounded-xl text-foreground resize-none focus:outline-none focus:border-primary/50 transition-colors"
              rows="4"
              ${this.submitting ? 'disabled' : ''}
            ></textarea>
            <div class="flex justify-between items-center">
              <p class="text-xs text-muted-foreground">
                Be respectful and constructive. Read our community guidelines.
              </p>
              <button
                type="submit"
                ${this.submitting ? 'disabled' : ''}
                class="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium disabled:opacity-50 transition-colors hover:bg-primary/90"
              >
                <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                ${this.submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ` : ''}
        
        ${!this.user && this.comments.length === 0 ? `
          <div class="text-center py-8 bg-muted/20 rounded-xl">
            <svg class="w-12 h-12 mx-auto text-muted-foreground mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
            <p class="text-foreground font-medium mb-2">Be the first to comment</p>
            <p class="text-sm text-muted-foreground mb-4">
              Sign in to share your experience with this product
            </p>
            <button
              id="signin-to-comment"
              class="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In to Comment
            </button>
          </div>
        ` : ''}
        
        ${this.comments.length > 0 ? `
          <div class="flex items-center gap-2 pb-4 border-b border-border/50">
            <span class="text-sm text-muted-foreground">Sort by:</span>
            <div class="flex gap-1">
              ${['newest', 'oldest', 'popular'].map(sort => `
                <button
                  class="sort-btn px-3 py-1 rounded-lg text-sm capitalize transition-colors ${
                    this.sortBy === sort
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted'
                  }"
                  data-sort="${sort}"
                >
                  ${sort}
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="space-y-6">
            ${commentsHtml}
          </div>
          
          ${!this.user ? `
            <div class="flex items-center justify-center gap-3 py-6 border-t border-border/50">
              <svg class="w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <p class="text-sm text-muted-foreground">
                Want to join the discussion?
              </p>
              <button
                id="signin-to-join"
                class="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            </div>
          ` : ''}
        ` : ''}
      </div>
    `;

    // Attach event listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    // Comment form submission
    const form = this.container.querySelector('#comment-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const textarea = form.querySelector('#new-comment-textarea');
        if (textarea) {
          this.submitComment(textarea.value);
        }
      });
    }

    // Sort buttons
    this.container.querySelectorAll('.sort-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.changeSortOrder(btn.dataset.sort);
      });
    });

    // Vote buttons
    this.container.querySelectorAll('.vote-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.vote(btn.dataset.commentId, btn.dataset.voteType);
      });
    });

    // Reply buttons
    this.container.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showReplyForm(btn.dataset.commentId);
      });
    });

    // Edit buttons
    this.container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showEditForm(btn.dataset.commentId);
      });
    });

    // Delete buttons
    this.container.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.deleteComment(btn.dataset.commentId);
      });
    });

    // Toggle thread buttons
    this.container.querySelectorAll('.toggle-thread-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleThread(btn.dataset.commentId);
      });
    });

    // Sign in buttons
    const signinButtons = this.container.querySelectorAll('#signin-to-comment, #signin-to-join');
    signinButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.authModal) {
          window.authModal.open('signin');
        }
      });
    });
  }

  showReplyForm(commentId) {
    const container = this.container.querySelector(`.reply-form-container[data-parent-id="${commentId}"]`);
    if (!container) return;

    // Check if form already exists
    if (container.querySelector('form')) {
      container.innerHTML = '';
      return;
    }

    // Check if user is logged in
    if (!this.user) {
      if (window.authModal) {
        window.authModal.open('signin');
      }
      return;
    }

    container.innerHTML = `
      <form class="reply-form mt-3" data-parent-id="${commentId}">
        <textarea
          class="reply-textarea w-full p-3 bg-muted/50 border border-border rounded-lg text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors"
          placeholder="Write your reply..."
          rows="3"
        ></textarea>
        <div class="flex gap-2 mt-2">
          <button
            type="submit"
            class="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            Post Reply
          </button>
          <button
            type="button"
            class="cancel-reply-btn px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    `;

    // Focus textarea
    const textarea = container.querySelector('.reply-textarea');
    if (textarea) textarea.focus();

    // Attach form listeners
    const form = container.querySelector('.reply-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = textarea.value;
      if (content.trim()) {
        this.submitComment(content, commentId);
        container.innerHTML = '';
      }
    });

    container.querySelector('.cancel-reply-btn').addEventListener('click', () => {
      container.innerHTML = '';
    });
  }

  showEditForm(commentId) {
    const commentEl = this.container.querySelector(`[data-comment-id="${commentId}"]`);
    if (!commentEl) return;

    const contentDiv = commentEl.querySelector(`.comment-content[data-comment-id="${commentId}"]`);
    if (!contentDiv) return;

    const comment = this.findComment(commentId);
    if (!comment) return;

    contentDiv.innerHTML = `
      <form class="edit-form mt-2" data-comment-id="${commentId}">
        <textarea
          class="edit-textarea w-full p-2 bg-muted/50 border border-border rounded-lg text-sm"
          rows="3"
        >${comment.content}</textarea>
        <div class="flex gap-2 mt-2">
          <button
            type="submit"
            class="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm"
          >
            Save
          </button>
          <button
            type="button"
            class="cancel-edit-btn px-3 py-1 bg-muted hover:bg-muted/80 rounded-lg text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    `;

    // Focus and select text
    const textarea = contentDiv.querySelector('.edit-textarea');
    if (textarea) {
      textarea.focus();
      textarea.select();
    }

    // Attach form listeners
    const form = contentDiv.querySelector('.edit-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const content = textarea.value;
      if (content.trim()) {
        this.editComment(commentId, content);
      }
    });

    contentDiv.querySelector('.cancel-edit-btn').addEventListener('click', () => {
      this.render();
    });
  }

  findComment(commentId, comments = this.comments) {
    for (const comment of comments) {
      if (comment.id === commentId) return comment;
      if (comment.replies) {
        const found = this.findComment(commentId, comment.replies);
        if (found) return found;
      }
    }
    return null;
  }

  destroy() {
    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }
  }
}

// Create singleton instance
const commentsManager = new CommentsManager();

// Make it globally available
window.commentsManager = commentsManager;

export default commentsManager;