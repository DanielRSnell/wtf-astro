-- Create comments table with support for threaded replies
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'wordpress-resource', 'blog-post', etc.
    resource_slug VARCHAR(255) NOT NULL, -- The slug of the resource being commented on
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For threaded replies
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Denormalized fields for performance
    reply_count INTEGER DEFAULT 0,
    depth INTEGER DEFAULT 0, -- 0 for top-level, 1 for first reply, etc.
    path TEXT[], -- Array path for efficient thread queries (e.g., ['parent_id', 'child_id'])
    
    -- Moderation
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES auth.users(id),
    
    -- Voting/reactions (optional, for future)
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    
    -- Indexes for performance
    CONSTRAINT content_length CHECK (char_length(content) BETWEEN 1 AND 10000)
);

-- Create indexes for efficient querying
CREATE INDEX idx_comments_resource ON public.comments(resource_type, resource_slug) WHERE NOT is_deleted;
CREATE INDEX idx_comments_user ON public.comments(user_id) WHERE NOT is_deleted;
CREATE INDEX idx_comments_parent ON public.comments(parent_id) WHERE NOT is_deleted;
CREATE INDEX idx_comments_created ON public.comments(created_at DESC) WHERE NOT is_deleted;
CREATE INDEX idx_comments_path ON public.comments USING GIN(path) WHERE NOT is_deleted;

-- Create comment votes table (for upvotes/downvotes)
CREATE TABLE IF NOT EXISTS public.comment_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) CHECK (vote_type IN ('upvote', 'downvote')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one vote per user per comment
    UNIQUE(comment_id, user_id)
);

-- Create comment reports table (for moderation)
CREATE TABLE IF NOT EXISTS public.comment_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate reports from same user
    UNIQUE(comment_id, reporter_id)
);

-- Function to update reply count and depth
CREATE OR REPLACE FUNCTION update_comment_metadata()
RETURNS TRIGGER AS $$
BEGIN
    -- Update depth based on parent
    IF NEW.parent_id IS NOT NULL THEN
        SELECT depth + 1, array_append(path, NEW.id::text)
        INTO NEW.depth, NEW.path
        FROM comments
        WHERE id = NEW.parent_id;
        
        -- Update parent's reply count
        UPDATE comments 
        SET reply_count = reply_count + 1
        WHERE id = NEW.parent_id;
    ELSE
        NEW.depth = 0;
        NEW.path = ARRAY[NEW.id::text];
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new comments
CREATE TRIGGER trigger_update_comment_metadata
BEFORE INSERT ON public.comments
FOR EACH ROW
EXECUTE FUNCTION update_comment_metadata();

-- Function to handle comment deletion (soft delete)
CREATE OR REPLACE FUNCTION soft_delete_comment(
    comment_id UUID,
    deleting_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    comment_user_id UUID;
    has_replies BOOLEAN;
BEGIN
    -- Get comment owner and check if it has replies
    SELECT user_id, reply_count > 0
    INTO comment_user_id, has_replies
    FROM comments
    WHERE id = comment_id AND NOT is_deleted;
    
    -- Check if user can delete (owner or has replies that need preservation)
    IF comment_user_id IS NULL THEN
        RETURN FALSE; -- Comment doesn't exist or already deleted
    END IF;
    
    IF comment_user_id != deleting_user_id THEN
        RETURN FALSE; -- Not the owner
    END IF;
    
    -- If has replies, just mark content as deleted but keep structure
    IF has_replies THEN
        UPDATE comments
        SET 
            content = '[Comment deleted by user]',
            is_deleted = TRUE,
            deleted_at = NOW(),
            deleted_by = deleting_user_id
        WHERE id = comment_id;
    ELSE
        -- No replies, can fully delete
        DELETE FROM comments WHERE id = comment_id;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reports ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view non-deleted comments"
    ON public.comments FOR SELECT
    USING (NOT is_deleted);

CREATE POLICY "Authenticated users can create comments"
    ON public.comments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
    ON public.comments FOR UPDATE
    USING (auth.uid() = user_id AND NOT is_deleted)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
    ON public.comments FOR DELETE
    USING (auth.uid() = user_id AND reply_count = 0);

-- Votes policies
CREATE POLICY "Anyone can view votes"
    ON public.comment_votes FOR SELECT
    USING (TRUE);

CREATE POLICY "Authenticated users can vote"
    ON public.comment_votes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change their vote"
    ON public.comment_votes FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their vote"
    ON public.comment_votes FOR DELETE
    USING (auth.uid() = user_id);

-- Reports policies
CREATE POLICY "Users can report comments"
    ON public.comment_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view their own reports"
    ON public.comment_reports FOR SELECT
    USING (auth.uid() = reporter_id);

-- Create view for comment with user info
CREATE OR REPLACE VIEW public.comments_with_user AS
SELECT 
    c.*,
    u.email as user_email,
    p.username,
    p.avatar_url,
    p.full_name,
    COALESCE(
        (SELECT COUNT(*) FROM comment_votes WHERE comment_id = c.id AND vote_type = 'upvote'),
        0
    ) as upvote_count,
    COALESCE(
        (SELECT COUNT(*) FROM comment_votes WHERE comment_id = c.id AND vote_type = 'downvote'),
        0
    ) as downvote_count,
    (
        SELECT vote_type 
        FROM comment_votes 
        WHERE comment_id = c.id AND user_id = auth.uid()
        LIMIT 1
    ) as current_user_vote
FROM public.comments c
LEFT JOIN auth.users u ON c.user_id = u.id
LEFT JOIN public.profiles p ON c.user_id = p.id
WHERE NOT c.is_deleted;

-- Grant permissions
GRANT ALL ON public.comments TO authenticated;
GRANT ALL ON public.comment_votes TO authenticated;
GRANT ALL ON public.comment_reports TO authenticated;
GRANT SELECT ON public.comments_with_user TO authenticated;
GRANT SELECT ON public.comments_with_user TO anon;