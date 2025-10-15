# SwapIt Database Schema Documentation

## ⚠️ IMPORTANT: Table Names and Structure Reference

This document serves as the **single source of truth** for database table names and their structures. Always refer to this document before writing code that interacts with the database.

## Core Tables

### 1. `users` Table (NOT `profiles`)
**⚠️ CRITICAL: The table is called `users`, not `profiles`**

**Purpose**: Stores user profile information and account details

**Columns**:
- `id` (UUID, Primary Key) - References `auth.users.id`
- `email` (VARCHAR, NOT NULL) - User's email address
- `full_name` (VARCHAR, NULLABLE) - User's display name (**NOT** `display_name`)
- `bio` (TEXT, NULLABLE) - User's biography
- `avatar_url` (TEXT, NULLABLE) - URL to user's profile picture
- `location_name` (VARCHAR, NULLABLE) - User's location (**NOT** `location`)
- `location_coordinates` (GEOGRAPHY, NULLABLE) - Geographic coordinates
- `phone` (VARCHAR, NULLABLE) - User's phone number
- `is_verified` (BOOLEAN, DEFAULT false) - Account verification status
- `is_active` (BOOLEAN, DEFAULT true) - Account active status
- `rating_average` (NUMERIC, DEFAULT 0.00) - Average user rating
- `rating_count` (INTEGER, DEFAULT 0) - Number of ratings received
- `successful_swaps` (INTEGER, DEFAULT 0) - Count of completed swaps
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

**Application Usage**:
- Profile pages: Use `full_name` for display name
- Location display: Use `location_name` for text display
- All user-related queries should target the `users` table

### 2. `items` Table
**Purpose**: Stores items available for swap or drop

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id`)
- `category_id` (UUID, Foreign Key → `categories.id`)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT, NOT NULL)
- `condition` (ENUM: 'new', 'likeNew', 'good', 'fair', 'poor')
- `is_free` (BOOLEAN, DEFAULT false)
- `images` (TEXT[], DEFAULT '{}')
- `location_name` (VARCHAR, NULLABLE)
- `location_coordinates` (GEOGRAPHY, NULLABLE)
- `is_available` (BOOLEAN, DEFAULT true)
- `is_boosted` (BOOLEAN, DEFAULT false)
- `boost_expires_at` (TIMESTAMPTZ, NULLABLE)
- `view_count` (INTEGER, DEFAULT 0)
- `save_count` (INTEGER, DEFAULT 0)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### 3. `categories` Table
**Purpose**: Item categories for organization

**Columns**:
- `id` (UUID, Primary Key)
- `name` (VARCHAR, NOT NULL, UNIQUE)
- `description` (TEXT, NULLABLE)
- `icon` (VARCHAR, NULLABLE)
- `parent_id` (UUID, Foreign Key → `categories.id`)
- `is_active` (BOOLEAN, DEFAULT true)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### 4. `saved_items` Table (NOT `favorites`)
**Purpose**: User's saved/favorited items

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id`)
- `item_id` (UUID, Foreign Key → `items.id`)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### 5. `swap_requests` Table
**Purpose**: Swap requests between users

**Columns**:
- `id` (UUID, Primary Key)
- `requester_id` (UUID, Foreign Key → `users.id`)
- `owner_id` (UUID, Foreign Key → `users.id`)
- `requested_item_id` (UUID, Foreign Key → `items.id`)
- `offered_item_id` (UUID, Foreign Key → `items.id`, NULLABLE)
- `message` (TEXT, NULLABLE)
- `status` (ENUM: 'pending', 'accepted', 'declined', 'cancelled', 'completed')
- `is_claim_request` (BOOLEAN, DEFAULT false)
- `meetup_location` (VARCHAR, NULLABLE)
- `meetup_coordinates` (GEOGRAPHY, NULLABLE)
- `meetup_time` (TIMESTAMPTZ, NULLABLE)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())
- `completed_at` (TIMESTAMPTZ, NULLABLE)

### 6. `conversations` Table
**Purpose**: Chat conversations between users

**Columns**:
- `id` (UUID, Primary Key)
- `participant1_id` (UUID, Foreign Key → `users.id`)
- `participant2_id` (UUID, Foreign Key → `users.id`)
- `last_message_id` (UUID, Foreign Key → `messages.id`)
- `last_message_at` (TIMESTAMPTZ, NULLABLE)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### 7. `messages` Table
**Purpose**: Chat messages within conversations

**Columns**:
- `id` (UUID, Primary Key)
- `conversation_id` (UUID, Foreign Key → `conversations.id`)
- `sender_id` (UUID, Foreign Key → `users.id`)
- `content` (TEXT, NOT NULL)
- `message_type` (VARCHAR, DEFAULT 'text')
- `is_read` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

### 8. `reviews` Table
**Purpose**: User reviews and ratings

**Columns**:
- `id` (UUID, Primary Key)
- `swap_request_id` (UUID, Foreign Key → `swap_requests.id`)
- `reviewer_id` (UUID, Foreign Key → `users.id`)
- `reviewee_id` (UUID, Foreign Key → `users.id`)
- `rating` (INTEGER, CHECK: 1-5)
- `comment` (TEXT, NULLABLE)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### 9. `notifications` Table
**Purpose**: User notifications

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `users.id`)
- `type` (ENUM: 'swap_request', 'message', 'review', 'system')
- `title` (VARCHAR, NOT NULL)
- `message` (TEXT, NOT NULL)
- `data` (JSONB, DEFAULT '{}')
- `is_read` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())

### 10. `user_preferences` Table
**Purpose**: User settings and preferences

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key → `auth.users.id`)
- `categories_of_interest` (UUID[], DEFAULT '{}')
- `notification_preferences` (JSONB)
- `location_preferences` (JSONB)
- `privacy_settings` (JSONB)
- `created_at` (TIMESTAMPTZ, DEFAULT NOW())
- `updated_at` (TIMESTAMPTZ, DEFAULT NOW())

## Common Mistakes to Avoid

### ❌ Wrong Table Names
- **DON'T** use `profiles` → **USE** `users`
- **DON'T** use `favorites` → **USE** `saved_items`

### ❌ Wrong Column Names
- **DON'T** use `display_name` → **USE** `full_name`
- **DON'T** use `location` → **USE** `location_name`

### ❌ Wrong Field References in Code
```typescript
// ❌ WRONG
profile.display_name
profile.location

// ✅ CORRECT
profile.full_name
profile.location_name
```

## Application Code Guidelines

### TypeScript Interfaces
Always match the database schema exactly:

```typescript
// ✅ CORRECT UserProfile interface
export interface UserProfile {
  id: string
  email: string
  full_name: string | null        // NOT display_name
  bio: string | null
  avatar_url: string | null
  location_name: string | null    // NOT location
  phone: string | null
  is_verified: boolean
  is_active: boolean
  rating_average: number
  rating_count: number
  successful_swaps: number
  created_at: string
  updated_at: string
}
```

### Supabase Queries
Always use the correct table names:

```typescript
// ✅ CORRECT
const { data } = await supabase
  .from('users')              // NOT 'profiles'
  .select('*')
  .eq('id', userId)

// ✅ CORRECT
const { data } = await supabase
  .from('saved_items')        // NOT 'favorites'
  .select('*')
  .eq('user_id', userId)
```

## Verification Checklist

Before deploying any code that interacts with the database:

- [ ] Verify table names match this documentation
- [ ] Verify column names match this documentation
- [ ] Check TypeScript interfaces match database schema
- [ ] Test queries against actual database structure
- [ ] Update this document if schema changes

## Schema Updates

When making schema changes:

1. Update the migration files
2. **IMMEDIATELY** update this documentation
3. Update all TypeScript interfaces
4. Update all application code references
5. Test all affected functionality

---

**Last Updated**: October 15, 2025
**Version**: 1.0

⚠️ **REMEMBER**: Always refer to this document before writing database-related code!