# Comments System Setup Guide

## Overview

The comments system supports:
- Threaded comments with unlimited nesting
- User authentication requirement
- Upvote/downvote functionality
- Edit and soft delete capabilities
- Real-time updates via Supabase subscriptions
- Comment sorting (newest, oldest, popular)

## Database Setup

### 1. Run the Migration

Apply the comments migration to your Supabase project:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL in:
# supabase/migrations/002_comments.sql
```

### 2. Database Schema

The system creates the following tables:

#### `comments` Table
- **id**: UUID primary key
- **user_id**: References auth.users
- **resource_type**: Type of resource (e.g., 'wordpress-resource')
- **resource_slug**: Slug identifier for the resource
- **parent_id**: For threading (references parent comment)
- **content**: Comment text
- **depth**: Nesting level (0 for top-level)
- **path**: Array path for efficient thread queries
- **reply_count**: Count of direct replies
- **is_edited**: Boolean flag for edited comments
- **is_deleted**: Soft delete flag
- **upvotes/downvotes**: Vote counts

#### `comment_votes` Table
- Tracks user votes on comments
- Ensures one vote per user per comment

#### `comment_reports` Table
- For content moderation
- Tracks user reports with reasons

### 3. Row Level Security

The migration sets up RLS policies:
- Anyone can view non-deleted comments
- Authenticated users can create comments
- Users can edit/delete their own comments
- Users can vote on any comment

## Component Integration

### Using the Comments Component

The `CommentsSection` component is already integrated into the resource layout:

```tsx
<CommentsSection
  client:load
  resourceType="wordpress-resource"
  resourceSlug={resource.data.slug}
/>
```

### Props

- **resourceType**: String identifying the resource type
- **resourceSlug**: Unique slug for the specific resource
- **className**: Optional CSS classes

## Features

### Threading
- Comments support unlimited nesting depth
- Replies are collapsible/expandable
- Thread paths are optimized for efficient queries

### Voting System
- Users can upvote or downvote comments
- One vote per user per comment
- Votes can be changed or removed

### Soft Delete
- Comments with replies show "[Comment deleted by user]"
- Comments without replies are fully removed
- Maintains thread structure integrity

### Real-time Updates
- Uses Supabase subscriptions for live updates
- New comments appear instantly
- Votes update in real-time

### Sorting Options
- **Newest**: Most recent first (default)
- **Oldest**: Chronological order
- **Popular**: By upvote count

## Authentication

Comments require authentication. Users are redirected to `/auth` to sign in if not authenticated.

## Customization

### Styling
The component uses Tailwind classes and respects the theme system:
- `text-foreground` for main text
- `text-muted-foreground` for secondary text
- `bg-muted` for backgrounds
- `border-border` for borders
- `bg-primary` for primary actions

### Modify Vote System
To add reaction types beyond upvote/downvote, extend the `vote_type` enum in the database and update the component.

### Add Moderation
The `comment_reports` table is ready for moderation features. Add admin UI to review and act on reports.

## API Endpoints (Optional)

While the component uses Supabase directly, you can create API endpoints for additional control:

```typescript
// Example: /api/comments/[action].ts
export async function POST({ request }) {
  const { action, commentId, content } = await request.json();
  
  switch(action) {
    case 'flag':
      // Custom moderation logic
      break;
    case 'pin':
      // Pin important comments
      break;
  }
}
```

## Troubleshooting

### Comments not loading
1. Check Supabase connection in `/src/lib/supabase.ts`
2. Verify RLS policies are applied
3. Check browser console for errors

### Can't post comments
1. Ensure user is authenticated
2. Check user profile exists in profiles table
3. Verify write permissions in RLS

### Real-time not working
1. Check Supabase subscription limits
2. Verify WebSocket connection
3. Check for browser blocking WebSockets

## Future Enhancements

Consider adding:
- Rich text editing (markdown support)
- Comment notifications
- User mentions (@username)
- Comment search
- Moderation queue
- Comment analytics
- Rate limiting
- Spam detection