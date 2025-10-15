-- Update categories with comprehensive list for barter marketplace
-- This migration replaces the existing categories with a more comprehensive list

-- First, update any existing items to have null category_id to avoid foreign key constraint issues
UPDATE items SET category_id = NULL WHERE category_id IS NOT NULL;

-- Now delete existing categories
DELETE FROM categories;

-- Insert comprehensive categories for barter marketplace
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
('Food & Beverages', 'Specialty foods, beverages, cooking ingredients, and treats', 'coffee');

-- Update any existing items that might have old category references
-- Since we deleted all categories, any items with category_id will now have null
-- This is acceptable as the category_id field allows null values
UPDATE items SET category_id = NULL WHERE category_id IS NOT NULL;

-- Note: Users will need to re-categorize their existing items
-- This is acceptable for a development/staging environment
-- In production, you would want to create a mapping migration instead