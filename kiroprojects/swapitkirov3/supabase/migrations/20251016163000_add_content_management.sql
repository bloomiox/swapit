-- Add content management system
-- This migration creates tables for managing pages, announcements, and content

-- Create content_pages table for managing static pages
CREATE TABLE IF NOT EXISTS content_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    content TEXT,
    excerpt TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    is_published BOOLEAN DEFAULT false,
    publish_date TIMESTAMP WITH TIME ZONE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    template VARCHAR(50) DEFAULT 'default',
    language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create announcements table for platform-wide announcements
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error', 'maintenance')),
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    target_audience VARCHAR(20) DEFAULT 'all' CHECK (target_audience IN ('all', 'users', 'admins')),
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_translations table for multilingual content
CREATE TABLE IF NOT EXISTS content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(50) NOT NULL, -- 'page', 'announcement', 'category', etc.
    content_id UUID NOT NULL,
    language VARCHAR(5) NOT NULL,
    field_name VARCHAR(100) NOT NULL, -- 'title', 'content', 'description', etc.
    translated_text TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    translator_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(content_type, content_id, language, field_name)
);

-- Insert default content pages
INSERT INTO content_pages (title, slug, content, is_published, author_id) VALUES
('About SwapIt', 'about', 'SwapIt is a sustainable marketplace for item exchanges. Our mission is to reduce waste and promote circular economy by making it easy for people to swap items they no longer need for things they want.

## How It Works

1. **List Your Items**: Upload photos and descriptions of items you want to swap
2. **Browse & Discover**: Find items you''re interested in from other users
3. **Make Requests**: Send swap requests to item owners
4. **Meet & Exchange**: Coordinate with other users to complete the swap

## Our Values

- **Sustainability**: Reducing waste through reuse
- **Community**: Building connections between neighbors
- **Trust**: Creating a safe and reliable platform
- **Simplicity**: Making swapping easy and enjoyable

Join thousands of users who are already making a positive impact on the environment while getting the items they need!', true, NULL),

('How It Works', 'how-it-works', '# Getting Started with SwapIt

SwapIt makes it easy to exchange items with people in your community. Here''s everything you need to know:

## For New Users

### 1. Create Your Account
- Sign up with your email or social media account
- Complete your profile with a photo and bio
- Verify your location for local swaps

### 2. List Your First Item
- Take clear, well-lit photos
- Write detailed descriptions
- Set your preferred swap categories
- Choose your availability

### 3. Start Browsing
- Use filters to find items you want
- Save interesting items to your wishlist
- Contact owners through our messaging system

## Making Successful Swaps

### Communication Tips
- Be clear about item condition
- Respond promptly to messages
- Ask questions if you need clarification

### Meeting Safely
- Choose public meeting places
- Bring a friend if possible
- Trust your instincts

### After the Swap
- Rate your experience
- Leave feedback for other users
- List more items to keep swapping!

Ready to start? [Create your account today](/auth/signup)!', true, NULL),

('Community Guidelines', 'guidelines', '# Community Guidelines

To ensure SwapIt remains a safe and welcoming platform for everyone, please follow these guidelines:

## Prohibited Items

The following items are not allowed on SwapIt:
- Illegal items or substances
- Weapons or dangerous materials
- Stolen goods
- Items that violate copyright
- Live animals
- Food items (for safety reasons)
- Adult content or services

## User Conduct

### Be Respectful
- Treat all users with courtesy and respect
- Use appropriate language in all communications
- Respect others'' time and commitments

### Be Honest
- Provide accurate descriptions of your items
- Use your own photos
- Disclose any defects or issues
- Honor your swap commitments

### Be Safe
- Meet in public places
- Don''t share personal information unnecessarily
- Report suspicious behavior
- Trust your instincts

## Consequences

Violations of these guidelines may result in:
- Warning messages
- Temporary account suspension
- Permanent account termination
- Removal of listings

## Reporting Issues

If you encounter problems:
1. Use the report button on listings or profiles
2. Contact our support team
3. Provide detailed information about the issue

Together, we can build a thriving community based on trust, respect, and sustainability!', false, NULL),

('Privacy Policy', 'privacy', '# Privacy Policy

*Last updated: [Date]*

## Information We Collect

### Account Information
- Email address and password
- Profile information (name, photo, bio)
- Location data (for local matching)

### Usage Data
- Items you list and search for
- Messages and communications
- App usage analytics

## How We Use Your Information

- To provide and improve our services
- To facilitate swaps between users
- To send important updates and notifications
- To ensure platform safety and security

## Information Sharing

We do not sell your personal information. We may share data:
- With other users (as part of the swap process)
- With service providers (for app functionality)
- When required by law

## Your Rights

You can:
- Access your personal data
- Update or correct information
- Delete your account
- Control privacy settings

## Contact Us

For privacy questions: privacy@swapit.com

This policy may be updated periodically. We''ll notify you of significant changes.', false, NULL);

-- Insert sample announcements
INSERT INTO announcements (title, content, type, priority, is_active, target_audience, created_by) VALUES
('Welcome to SwapIt!', 'Thank you for joining our community of sustainable swappers. Start by listing your first item and discover amazing things from your neighbors!', 'success', 1, true, 'users', NULL),
('Platform Maintenance', 'We''ll be performing scheduled maintenance on Sunday, 2 AM - 4 AM EST. The platform may be temporarily unavailable during this time.', 'warning', 2, false, 'all', NULL),
('New Feature: Item Boosting', 'You can now boost your items to get more visibility! Check out the new boost options in your item listings.', 'info', 1, true, 'users', NULL);

-- Function to get content management stats
CREATE OR REPLACE FUNCTION get_content_management_stats()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_pages', (SELECT COUNT(*) FROM content_pages),
        'published_pages', (SELECT COUNT(*) FROM content_pages WHERE is_published = true),
        'draft_pages', (SELECT COUNT(*) FROM content_pages WHERE is_published = false),
        'total_announcements', (SELECT COUNT(*) FROM announcements),
        'active_announcements', (SELECT COUNT(*) FROM announcements WHERE is_active = true),
        'scheduled_announcements', (
            SELECT COUNT(*) FROM announcements 
            WHERE is_active = true AND start_date > NOW()
        ),
        'categories_count', (SELECT COUNT(*) FROM categories WHERE is_active = true),
        'translations_count', (SELECT COUNT(*) FROM content_translations),
        'recent_updates', (
            SELECT COUNT(*) FROM content_pages 
            WHERE updated_at >= CURRENT_DATE - INTERVAL '7 days'
        )
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get recent content activity
CREATE OR REPLACE FUNCTION get_recent_content_activity(p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
    id UUID,
    activity_type VARCHAR(50),
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cp.id,
        'page_updated'::VARCHAR(50) as activity_type,
        cp.title,
        ('Page "' || cp.title || '" was updated')::TEXT as description,
        cp.updated_at as created_at
    FROM content_pages cp
    WHERE cp.updated_at >= CURRENT_DATE - INTERVAL '30 days'
    
    UNION ALL
    
    SELECT 
        a.id,
        'announcement_created'::VARCHAR(50) as activity_type,
        a.title,
        ('Announcement "' || a.title || '" was created')::TEXT as description,
        a.created_at
    FROM announcements a
    WHERE a.created_at >= CURRENT_DATE - INTERVAL '30 days'
    
    ORDER BY created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_content_pages_slug ON content_pages(slug);
CREATE INDEX IF NOT EXISTS idx_content_pages_published ON content_pages(is_published);
CREATE INDEX IF NOT EXISTS idx_content_pages_language ON content_pages(language);
CREATE INDEX IF NOT EXISTS idx_content_pages_created_at ON content_pages(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_type ON announcements(type);
CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority DESC);
CREATE INDEX IF NOT EXISTS idx_announcements_dates ON announcements(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_announcements_audience ON announcements(target_audience);

CREATE INDEX IF NOT EXISTS idx_content_translations_content ON content_translations(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_content_translations_language ON content_translations(language);

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_content_pages_updated_at ON content_pages;
CREATE TRIGGER update_content_pages_updated_at 
    BEFORE UPDATE ON content_pages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
CREATE TRIGGER update_announcements_updated_at 
    BEFORE UPDATE ON announcements 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_content_translations_updated_at ON content_translations;
CREATE TRIGGER update_content_translations_updated_at 
    BEFORE UPDATE ON content_translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();