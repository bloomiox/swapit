-- Seed data for SwapIt development
-- This file contains initial data for testing and development

-- Insert categories (ignore if already exists)
INSERT INTO categories (name, description, icon) VALUES
('Electronics', 'Phones, laptops, tablets, cameras, and electronic devices', 'smartphone'),
('Clothing & Fashion', 'Clothes, shoes, bags, accessories, and fashion items', 'shirt'),
('Books & Media', 'Books, magazines, DVDs, CDs, and reading materials', 'book'),
('Home & Furniture', 'Furniture, decor, appliances, and household items', 'home'),
('Sports & Fitness', 'Sports equipment, gym gear, outdoor activities, and fitness items', 'dumbbell'),
('Toys & Games', 'Toys, board games, video games, and entertainment items', 'gamepad-2'),
('Music & Instruments', 'Musical instruments, audio equipment, and music accessories', 'music'),
('Art & Crafts', 'Art supplies, handmade items, craft materials, and creative tools', 'palette'),
('Automotive', 'Car parts, motorcycle gear, automotive tools, and accessories', 'car'),
('Health & Beauty', 'Cosmetics, skincare, health products, and wellness items', 'heart'),
('Baby & Kids', 'Baby items, children clothes, toys, and kid accessories', 'baby'),
('Pet Supplies', 'Pet food, toys, accessories, grooming, and pet care items', 'dog'),
('Tools & Hardware', 'Hand tools, power tools, hardware, and DIY equipment', 'wrench'),
('Kitchen & Dining', 'Cookware, appliances, utensils, and dining accessories', 'chef-hat'),
('Office & Business', 'Office equipment, stationery, furniture, and work supplies', 'briefcase'),
('Garden & Outdoor', 'Plants, gardening tools, outdoor furniture, and patio items', 'flower'),
('Jewelry & Watches', 'Jewelry, watches, precious items, and accessories', 'gem'),
('Collectibles & Antiques', 'Vintage items, collectibles, antiques, and rare finds', 'crown'),
('Travel & Luggage', 'Suitcases, travel gear, camping equipment, and accessories', 'plane'),
('Photography', 'Cameras, lenses, tripods, and photography equipment', 'camera'),
('Computer & Gaming', 'PC parts, gaming consoles, accessories, and software', 'monitor'),
('Mobile & Tablets', 'Smartphones, tablets, cases, and mobile accessories', 'tablet'),
('Audio & Headphones', 'Headphones, speakers, audio equipment, and accessories', 'headphones'),
('Bicycles & Scooters', 'Bikes, scooters, parts, and cycling accessories', 'bike'),
('Food & Beverages', 'Specialty foods, beverages, cooking ingredients, and treats', 'coffee')
ON CONFLICT (name) DO NOTHING;

-- Note: User data will be created automatically when users sign up through auth
-- The trigger will create user profiles in the users table

-- Insert some sample items (these would normally be created by users)
-- We'll leave this empty for now as items should be created through the app

-- You can add more seed data here as needed for development and testing