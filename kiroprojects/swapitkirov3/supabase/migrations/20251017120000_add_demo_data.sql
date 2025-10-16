-- Demo Data Migration for SwapIt Platform
-- This migration adds realistic demo users and items to showcase the platform

-- First, let's add some demo users
INSERT INTO users (
  id,
  email,
  full_name,
  avatar_url,
  location_name,
  location_coordinates,
  phone,
  is_verified,
  rating_average,
  rating_count,
  created_at,
  updated_at
) VALUES
-- User 1: Emma from Zurich
(
  '550e8400-e29b-41d4-a716-446655440001',
  'emma.mueller@example.com',
  'Emma Müller',
  'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face',
  'Zurich, Switzerland',
  ST_GeogFromText('POINT(8.5417 47.3769)'),
  '+41 79 123 4567',
  true,
  4.8,
  24,
  NOW() - INTERVAL '3 months',
  NOW() - INTERVAL '1 week'
),
-- User 2: Marco from Geneva
(
  '550e8400-e29b-41d4-a716-446655440002',
  'marco.rossi@example.com',
  'Marco Rossi',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'Geneva, Switzerland',
  ST_GeogFromText('POINT(6.1432 46.2044)'),
  '+41 79 234 5678',
  true,
  4.6,
  18,
  NOW() - INTERVAL '2 months',
  NOW() - INTERVAL '3 days'
),
-- User 3: Sophie from Basel
(
  '550e8400-e29b-41d4-a716-446655440003',
  'sophie.martin@example.com',
  'Sophie Martin',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'Basel, Switzerland',
  ST_GeogFromText('POINT(7.5886 47.5596)'),
  '+41 79 345 6789',
  true,
  4.9,
  31,
  NOW() - INTERVAL '4 months',
  NOW() - INTERVAL '2 days'
),
-- User 4: Luca from Bern
(
  '550e8400-e29b-41d4-a716-446655440004',
  'luca.weber@example.com',
  'Luca Weber',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'Bern, Switzerland',
  ST_GeogFromText('POINT(7.4474 46.9481)'),
  '+41 79 456 7890',
  true,
  4.7,
  22,
  NOW() - INTERVAL '1 month',
  NOW() - INTERVAL '5 days'
),
-- User 5: Anna from Lausanne
(
  '550e8400-e29b-41d4-a716-446655440005',
  'anna.fischer@example.com',
  'Anna Fischer',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  'Lausanne, Switzerland',
  ST_GeogFromText('POINT(6.6323 46.5197)'),
  '+41 79 567 8901',
  true,
  4.5,
  15,
  NOW() - INTERVAL '6 weeks',
  NOW() - INTERVAL '1 day'
),
-- User 6: David from St. Gallen
(
  '550e8400-e29b-41d4-a716-446655440006',
  'david.schneider@example.com',
  'David Schneider',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'St. Gallen, Switzerland',
  ST_GeogFromText('POINT(9.3767 47.4245)'),
  '+41 79 678 9012',
  true,
  4.8,
  27,
  NOW() - INTERVAL '5 months',
  NOW() - INTERVAL '4 hours'
);

-- Now let's add some demo items
INSERT INTO items (
  id,
  user_id,
  category_id,
  title,
  description,
  condition,
  is_free,
  images,
  location_name,
  location_coordinates,
  looking_for,
  is_available,
  is_boosted,
  boost_type,
  boost_expires_at,
  view_count,
  save_count,
  created_at,
  updated_at
) VALUES
-- Emma's Items (Zurich)
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1),
  'iPhone 13 Pro - Excellent Condition',
  'Selling my iPhone 13 Pro in excellent condition. Always used with a case and screen protector. Battery health at 89%. Includes original box, charger, and unused EarPods. Perfect for someone looking to upgrade!',
  'like_new',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
  ],
  'Zurich, Switzerland',
  ST_GeogFromText('POINT(8.5417 47.3769)'),
  'MacBook, iPad, AirPods Pro',
  true,
  true,
  'premium',
  NOW() + INTERVAL '2 days',
  45,
  12,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 hour'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM categories WHERE name = 'Books' LIMIT 1),
  'Programming Books Collection',
  'Collection of programming books including "Clean Code", "Design Patterns", and "JavaScript: The Good Parts". All in great condition, perfect for computer science students or developers.',
  'good',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  ],
  'Zurich, Switzerland',
  ST_GeogFromText('POINT(8.5417 47.3769)'),
  null,
  true,
  false,
  null,
  null,
  23,
  8,
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '2 hours'
),

-- Marco's Items (Geneva)
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM categories WHERE name = 'Sports' LIMIT 1),
  'Mountain Bike - Trek X-Caliber 8',
  'Excellent Trek mountain bike, perfect for trails and city riding. Recently serviced, new tires and brake pads. Great for weekend adventures in the Swiss Alps!',
  'good',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=400&fit=crop'
  ],
  'Geneva, Switzerland',
  ST_GeogFromText('POINT(6.1432 46.2044)'),
  'Road bike, E-bike, Skiing equipment',
  true,
  true,
  'featured',
  NOW() + INTERVAL '4 days',
  67,
  18,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '30 minutes'
),
(
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM categories WHERE name = 'Home & Garden' LIMIT 1),
  'Vintage Coffee Table',
  'Beautiful vintage wooden coffee table from the 1960s. Some minor wear but adds character. Perfect centerpiece for a living room with vintage or modern decor.',
  'fair',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop'
  ],
  'Geneva, Switzerland',
  ST_GeogFromText('POINT(6.1432 46.2044)'),
  'Dining table, Bookshelf, Vintage furniture',
  true,
  false,
  null,
  null,
  34,
  9,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '3 hours'
),

-- Sophie's Items (Basel)
(
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1),
  'Designer Handbag - Michael Kors',
  'Authentic Michael Kors handbag in excellent condition. Used only a few times for special occasions. Comes with dust bag and authenticity card. Perfect for someone who loves luxury accessories!',
  'like_new',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'
  ],
  'Basel, Switzerland',
  ST_GeogFromText('POINT(7.5886 47.5596)'),
  'Designer shoes, Jewelry, Watches',
  true,
  true,
  'urgent',
  NOW() + INTERVAL '1 day',
  89,
  25,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '15 minutes'
),
(
  '660e8400-e29b-41d4-a716-446655440006',
  '550e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM categories WHERE name = 'Toys & Games' LIMIT 1),
  'LEGO Architecture Set - Statue of Liberty',
  'Complete LEGO Architecture Statue of Liberty set. All pieces included, built once and displayed. Perfect for LEGO enthusiasts or as a gift. Box included but shows some wear.',
  'good',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop'
  ],
  'Basel, Switzerland',
  ST_GeogFromText('POINT(7.5886 47.5596)'),
  null,
  true,
  false,
  null,
  null,
  41,
  15,
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '6 hours'
),

-- Luca's Items (Bern)
(
  '660e8400-e29b-41d4-a716-446655440007',
  '550e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1),
  'Gaming Setup - Monitor + Keyboard + Mouse',
  'Complete gaming setup including 27" 144Hz monitor, mechanical keyboard (Cherry MX Blue), and gaming mouse. Perfect for competitive gaming or work from home setup.',
  'good',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=400&h=400&fit=crop'
  ],
  'Bern, Switzerland',
  ST_GeogFromText('POINT(7.4474 46.9481)'),
  'Graphics card, Gaming chair, Headset',
  true,
  false,
  null,
  null,
  52,
  14,
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '4 hours'
),
(
  '660e8400-e29b-41d4-a716-446655440008',
  '550e8400-e29b-41d4-a716-446655440004',
  (SELECT id FROM categories WHERE name = 'Music' LIMIT 1),
  'Acoustic Guitar - Yamaha FG830',
  'Beautiful Yamaha acoustic guitar in excellent condition. Perfect for beginners or intermediate players. Includes soft case, picks, and tuner. Sounds amazing!',
  'like_new',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop'
  ],
  'Bern, Switzerland',
  ST_GeogFromText('POINT(7.4474 46.9481)'),
  'Electric guitar, Amplifier, Piano',
  true,
  true,
  'premium',
  NOW() + INTERVAL '3 days',
  38,
  11,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '45 minutes'
),

-- Anna's Items (Lausanne)
(
  '660e8400-e29b-41d4-a716-446655440009',
  '550e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM categories WHERE name = 'Home & Garden' LIMIT 1),
  'Indoor Plant Collection',
  'Beautiful collection of indoor plants including Monstera, Snake Plant, and Pothos. All healthy and well-maintained. Perfect for someone starting their plant parent journey!',
  'good',
  true,
  ARRAY[
    'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=400&fit=crop'
  ],
  'Lausanne, Switzerland',
  ST_GeogFromText('POINT(6.6323 46.5197)'),
  null,
  true,
  false,
  null,
  null,
  29,
  7,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 hours'
),
(
  '660e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440005',
  (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1),
  'Winter Coat - North Face',
  'Warm and stylish North Face winter coat, size M. Perfect for Swiss winters! Barely worn, excellent condition. Great for hiking or city wear.',
  'like_new',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  ],
  'Lausanne, Switzerland',
  ST_GeogFromText('POINT(6.6323 46.5197)'),
  'Hiking boots, Backpack, Outdoor gear',
  true,
  false,
  null,
  null,
  33,
  10,
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '5 hours'
),

-- David's Items (St. Gallen)
(
  '660e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440006',
  (SELECT id FROM categories WHERE name = 'Sports' LIMIT 1),
  'Ski Equipment Set',
  'Complete ski set including skis, boots (size 42), poles, and helmet. Perfect for intermediate skiers. Recently waxed and ready for the slopes!',
  'good',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1551524164-6cf2ac2c0d15?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop'
  ],
  'St. Gallen, Switzerland',
  ST_GeogFromText('POINT(9.3767 47.4245)'),
  'Snowboard, Winter sports gear, Ski pass',
  true,
  true,
  'featured',
  NOW() + INTERVAL '5 days',
  76,
  22,
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 hour'
),
(
  '660e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440006',
  (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1),
  'Vintage Camera - Canon AE-1',
  'Classic Canon AE-1 film camera in working condition. Perfect for photography enthusiasts who love the analog experience. Includes 50mm lens and camera bag.',
  'fair',
  false,
  ARRAY[
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop'
  ],
  'St. Gallen, Switzerland',
  ST_GeogFromText('POINT(9.3767 47.4245)'),
  'Film rolls, Photography equipment, Vintage electronics',
  true,
  false,
  null,
  null,
  44,
  13,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '3 hours'
);

-- Add some saved items to show the saved functionality
INSERT INTO saved_items (user_id, item_id, created_at) VALUES
-- Emma saves Marco's bike and Sophie's handbag
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '2 hours'),

-- Marco saves Luca's guitar and David's ski equipment
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440008', NOW() - INTERVAL '3 hours'),
('550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440011', NOW() - INTERVAL '1 hour'),

-- Sophie saves Anna's plants and Emma's books
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440009', NOW() - INTERVAL '4 hours'),
('550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '30 minutes'),

-- Luca saves David's camera and Marco's coffee table
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440012', NOW() - INTERVAL '2 days'),
('550e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004', NOW() - INTERVAL '6 hours'),

-- Anna saves Emma's iPhone and Sophie's LEGO
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '3 hours'),

-- David saves Luca's gaming setup and Anna's coat
('550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '5 hours'),
('550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440010', NOW() - INTERVAL '2 hours');

-- Add some demo swap requests to show the request functionality
INSERT INTO swap_requests (
  id,
  requester_id,
  requested_item_id,
  offered_item_id,
  message,
  status,
  is_claim_request,
  created_at,
  updated_at
) VALUES
-- Marco wants Emma's iPhone, offers his bike
(
  '770e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '660e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440003',
  'Hi Emma! I''m really interested in your iPhone. I have a Trek mountain bike that might interest you. It''s perfect for exploring Zurich and the surrounding areas. Let me know if you''d like to swap!',
  'pending',
  false,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),
-- Sophie wants to claim Anna's plants (free item)
(
  '770e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  '660e8400-e29b-41d4-a716-446655440009',
  null,
  'Hi Anna! I would love to take care of these beautiful plants. I have a sunny apartment in Basel that would be perfect for them. Thank you for offering them for free!',
  'pending',
  true,
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
),
-- Luca wants Sophie's handbag, offers his guitar
(
  '770e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '660e8400-e29b-41d4-a716-446655440005',
  '660e8400-e29b-41d4-a716-446655440008',
  'Hello Sophie! My girlfriend would love this Michael Kors handbag. I have a beautiful Yamaha acoustic guitar that I think you might enjoy. Are you interested in music?',
  'accepted',
  false,
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '6 hours'
),
-- David wants to claim Emma's books (free item)
(
  '770e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440006',
  '660e8400-e29b-41d4-a716-446655440002',
  null,
  'Hi Emma! As a software developer, these programming books would be incredibly useful for me. Thank you so much for offering them for free to the community!',
  'completed',
  true,
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '2 days'
);

-- Add some conversations to show the chat functionality
INSERT INTO conversations (
  id,
  user1_id,
  user2_id,
  last_message_at,
  created_at,
  updated_at
) VALUES
-- Emma and Marco conversation
(
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '30 minutes'
),
-- Sophie and Anna conversation
(
  '880e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440005',
  NOW() - INTERVAL '45 minutes',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '45 minutes'
),
-- Luca and Sophie conversation
(
  '880e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440003',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '4 hours'
);

-- Add some messages to the conversations
INSERT INTO messages (
  id,
  conversation_id,
  sender_id,
  content,
  message_type,
  created_at,
  updated_at
) VALUES
-- Emma and Marco conversation messages
(
  '990e8400-e29b-41d4-a716-446655440001',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  'Hi Emma! I saw your iPhone listing and I''m really interested. Would you be open to swapping for my mountain bike?',
  'text',
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),
(
  '990e8400-e29b-41d4-a716-446655440002',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'Hi Marco! That sounds interesting. Can you tell me more about the bike? What condition is it in?',
  'text',
  NOW() - INTERVAL '90 minutes',
  NOW() - INTERVAL '90 minutes'
),
(
  '990e8400-e29b-41d4-a716-446655440003',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  'It''s in great condition! I just had it serviced last month. New tires and brake pads. Perfect for city riding and weekend trail adventures.',
  'text',
  NOW() - INTERVAL '75 minutes',
  NOW() - INTERVAL '75 minutes'
),
(
  '990e8400-e29b-41d4-a716-446655440004',
  '880e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'That sounds perfect! I''ve been wanting to get more into cycling. When would be a good time to meet and check it out?',
  'text',
  NOW() - INTERVAL '30 minutes',
  NOW() - INTERVAL '30 minutes'
),

-- Sophie and Anna conversation messages
(
  '990e8400-e29b-41d4-a716-446655440005',
  '880e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  'Hi Anna! I''d love to take care of your plants. I have a bright apartment with lots of natural light.',
  'text',
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
),
(
  '990e8400-e29b-41d4-a716-446655440006',
  '880e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440005',
  'That''s wonderful! I''m moving and can''t take them with me. They need someone who will love them as much as I do.',
  'text',
  NOW() - INTERVAL '50 minutes',
  NOW() - INTERVAL '50 minutes'
),
(
  '990e8400-e29b-41d4-a716-446655440007',
  '880e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  'I promise I''ll take great care of them! I already have a few plants and they''re thriving. When can I pick them up?',
  'text',
  NOW() - INTERVAL '45 minutes',
  NOW() - INTERVAL '45 minutes'
),

-- Luca and Sophie conversation messages
(
  '990e8400-e29b-41d4-a716-446655440008',
  '880e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  'Hi Sophie! I''m interested in the Michael Kors handbag for my girlfriend. Would you consider swapping for my guitar?',
  'text',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  '990e8400-e29b-41d4-a716-446655440009',
  '880e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003',
  'That''s so sweet! I''ve actually been wanting to learn guitar. Is it suitable for beginners?',
  'text',
  NOW() - INTERVAL '20 hours',
  NOW() - INTERVAL '20 hours'
),
(
  '990e8400-e29b-41d4-a716-446655440010',
  '880e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  'Absolutely! It''s perfect for beginners. I''ll even throw in some beginner books and a tuner. Deal?',
  'text',
  NOW() - INTERVAL '18 hours',
  NOW() - INTERVAL '18 hours'
),
(
  '990e8400-e29b-41d4-a716-446655440011',
  '880e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003',
  'Perfect! That sounds like a great deal. Let''s arrange the swap!',
  'text',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '4 hours'
);

-- Update some statistics to make the platform look active
UPDATE users SET 
  rating_count = rating_count + FLOOR(RANDOM() * 10 + 5),
  updated_at = NOW()
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440006'
);

-- Add some notifications to show the notification system
INSERT INTO notifications (
  id,
  user_id,
  type,
  title,
  message,
  data,
  is_read,
  created_at,
  updated_at
) VALUES
-- Emma gets notification about Marco's swap request
(
  'aa0e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  'swap_request',
  'New Swap Request',
  'Marco Rossi wants to swap your iPhone 13 Pro for a Mountain Bike',
  '{"swap_request_id": "770e8400-e29b-41d4-a716-446655440001", "item_id": "660e8400-e29b-41d4-a716-446655440001"}',
  false,
  NOW() - INTERVAL '2 hours',
  NOW() - INTERVAL '2 hours'
),
-- Anna gets notification about Sophie's claim request
(
  'aa0e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440005',
  'claim_request',
  'Someone Wants Your Plants!',
  'Sophie Martin would like to claim your Indoor Plant Collection',
  '{"swap_request_id": "770e8400-e29b-41d4-a716-446655440002", "item_id": "660e8400-e29b-41d4-a716-446655440009"}',
  false,
  NOW() - INTERVAL '1 hour',
  NOW() - INTERVAL '1 hour'
),
-- Sophie gets notification about accepted swap
(
  'aa0e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440003',
  'swap_accepted',
  'Swap Request Accepted!',
  'Luca Weber accepted your swap request for the Designer Handbag',
  '{"swap_request_id": "770e8400-e29b-41d4-a716-446655440003", "item_id": "660e8400-e29b-41d4-a716-446655440005"}',
  true,
  NOW() - INTERVAL '6 hours',
  NOW() - INTERVAL '4 hours'
),
-- Emma gets notification about completed swap
(
  'aa0e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440001',
  'swap_completed',
  'Swap Completed!',
  'Your Programming Books have been successfully claimed by David Schneider',
  '{"swap_request_id": "770e8400-e29b-41d4-a716-446655440004", "item_id": "660e8400-e29b-41d4-a716-446655440002"}',
  true,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
);

-- Add some user interests to show personalized recommendations
INSERT INTO user_interests (user_id, category_id, created_at) VALUES
-- Emma likes Electronics and Books
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1), NOW() - INTERVAL '3 months'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM categories WHERE name = 'Books' LIMIT 1), NOW() - INTERVAL '3 months'),

-- Marco likes Sports and Home & Garden
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM categories WHERE name = 'Sports' LIMIT 1), NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440002', (SELECT id FROM categories WHERE name = 'Home & Garden' LIMIT 1), NOW() - INTERVAL '2 months'),

-- Sophie likes Fashion and Toys & Games
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1), NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440003', (SELECT id FROM categories WHERE name = 'Toys & Games' LIMIT 1), NOW() - INTERVAL '4 months'),

-- Luca likes Electronics and Music
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1), NOW() - INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440004', (SELECT id FROM categories WHERE name = 'Music' LIMIT 1), NOW() - INTERVAL '1 month'),

-- Anna likes Home & Garden and Fashion
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM categories WHERE name = 'Home & Garden' LIMIT 1), NOW() - INTERVAL '6 weeks'),
('550e8400-e29b-41d4-a716-446655440005', (SELECT id FROM categories WHERE name = 'Fashion' LIMIT 1), NOW() - INTERVAL '6 weeks'),

-- David likes Sports and Electronics
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM categories WHERE name = 'Sports' LIMIT 1), NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440006', (SELECT id FROM categories WHERE name = 'Electronics' LIMIT 1), NOW() - INTERVAL '5 months');

-- Update view counts and save counts to make items look popular
UPDATE items SET 
  view_count = view_count + FLOOR(RANDOM() * 50 + 10),
  save_count = save_count + FLOOR(RANDOM() * 15 + 3),
  updated_at = NOW()
WHERE id IN (
  SELECT id FROM items 
  WHERE user_id IN (
    '550e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440006'
  )
);