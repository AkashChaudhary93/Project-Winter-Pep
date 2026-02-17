-- LPU Block 34 Food Court
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Tikka Roll', 'Snacks', 120.0, true, true, '', 'Block 34', 'Kathi Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Biryani', 'Main Course', 250.0, true, false, '', 'Block 34', 'Biryani Blues');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Masala Dosa', 'South Indian', 80.0, true, true, '', 'Block 34', 'Sagar Ratna');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Egg Roll', 'Snacks', 90.0, true, false, '', 'Block 34', 'Kathi Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Thali', 'Main Course', 180.0, true, true, '', 'Block 34', 'Annapurna');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Idli Sambar', 'South Indian', 60.0, true, true, '', 'Block 34', 'Sagar Ratna');

-- BH7 Food Court
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Double Patty Burger', 'Fast Food', 150.0, true, false, '', 'BH7', 'Burger King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Farmhouse Pizza', 'Pizza', 350.0, true, true, '', 'BH7', 'Dominos');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chocolate Shake', 'Beverages', 100.0, true, true, '', 'BH7', 'Keventers');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Whopper', 'Fast Food', 199.0, true, false, '', 'BH7', 'Burger King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Peppy Paneer Pizza', 'Pizza', 320.0, true, true, '', 'BH7', 'Dominos');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Oreo Shake', 'Beverages', 120.0, true, true, '', 'BH7', 'Keventers');

-- UniHospital Food Court
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Garlic Breadsticks', 'Sides', 99.0, true, true, '', 'UniHospital', 'Oven Express');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Loaded Pizza', 'Pizza', 220.0, true, true, '', 'UniHospital', 'Oven Express');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Iced Coffee', 'Beverages', 120.0, true, true, '', 'UniHospital', 'Nescafe');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Red Sauce Pasta', 'Italian', 180.0, true, true, '', 'UniHospital', 'La Pinoz');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Choco Lava Cake', 'Dessert', 80.0, true, true, '', 'UniHospital', 'Dominos');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Hot Cappuccino', 'Beverages', 90.0, true, true, '', 'UniHospital', 'Nescafe');

-- Demo Orders
INSERT INTO orders (student_id, total_amount, status, created_at) VALUES ('12109876', 220.0, 'PENDING', CURRENT_TIMESTAMP);
INSERT INTO orders (student_id, total_amount, status, created_at) VALUES ('12104321', 450.0, 'COOKING', CURRENT_TIMESTAMP);
INSERT INTO orders (student_id, total_amount, status, created_at) VALUES ('12101111', 120.0, 'READY', CURRENT_TIMESTAMP);
INSERT INTO orders (student_id, total_amount, status, created_at) VALUES ('12105555', 99.0, 'COMPLETED', CURRENT_TIMESTAMP);
INSERT INTO orders (student_id, total_amount, status, created_at) VALUES ('12106666', 350.0, 'PENDING', CURRENT_TIMESTAMP);
INSERT INTO orders (student_id, total_amount, status, created_at) VALUES ('12107777', 180.0, 'READY', CURRENT_TIMESTAMP);

-- Link items to orders
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (1, 1, 1);
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (2, 4, 1);
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (2, 6, 1);
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (3, 9, 1);
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (4, 13, 1);
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (5, 8, 1);
INSERT INTO order_item (order_id, menu_item_id, quantity) VALUES (6, 5, 1);

-- Vendors for Block 34
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Kathi Junction Owner', '9876543210', 'VENDOR', 'Kathi Junction', 'Block 34 (Main Cafeteria)');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Biryani Blues Owner', '9876543211', 'VENDOR', 'Biryani Blues', 'Block 34 (Main Cafeteria)');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Sagar Ratna Owner', '9876543212', 'VENDOR', 'Sagar Ratna', 'Block 34 (Main Cafeteria)');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Annapurna Owner', '9876543213', 'VENDOR', 'Annapurna', 'Block 34 (Main Cafeteria)');

-- Vendors for BH7
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Burger King Owner', '9876543214', 'VENDOR', 'Burger King', 'BH7');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Dominos Owner', '9876543215', 'VENDOR', 'Dominos', 'BH7');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Keventers Owner', '9876543216', 'VENDOR', 'Keventers', 'BH7');

-- Vendors for UniHospital
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Oven Express Owner', '9876543217', 'VENDOR', 'Oven Express', 'UniHospital');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Nescafe Owner', '9876543218', 'VENDOR', 'Nescafe', 'UniHospital');
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('La Pinoz Owner', '9876543219', 'VENDOR', 'La Pinoz', 'UniHospital');

-- Apartment 1: Amul Parlour
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Amul Parlour Owner', '9998887771', 'VENDOR', 'Amul Parlour', 'Apartment 1');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Amul Gold Milk (500ml)', 'Dairy', 33.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chocolate Cone', 'Ice Cream', 40.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Vanilla Cup', 'Ice Cream', 20.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Butterscotch Brick', 'Ice Cream', 180.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Pack (200g)', 'Dairy', 95.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cheese Slices (100g)', 'Dairy', 85.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Amul Kool Badam', 'Beverages', 30.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Hot Coffee', 'Beverages', 25.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Sweet Lassi', 'Beverages', 25.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Cheese Sandwich', 'Snacks', 60.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Garlic Toast', 'Snacks', 45.0, true, true, '', 'Apartment 1', 'Amul Parlour');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Amul Chocolate Bar', 'Snacks', 50.0, true, true, '', 'Apartment 1', 'Amul Parlour');

-- Apartment 2: Baskin Robbins
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Baskin Robbins Owner', '9998887772', 'VENDOR', 'Baskin Robbins', 'Apartment 2');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Belgian Chocolate', 'Premium Ice Cream', 120.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mississippi Mud', 'Premium Ice Cream', 120.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cotton Candy', 'Premium Ice Cream', 99.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Bavarian Chocolate', 'Premium Ice Cream', 110.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mint Milk Chocolate', 'Premium Ice Cream', 110.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mango Magic', 'Fruit Ice Cream', 90.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Pralines N Cream', 'Premium Ice Cream', 130.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Fruit Overload', 'Fruit Ice Cream', 110.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Roasted Coffee', 'Premium Ice Cream', 110.0, true, true, '', 'Apartment 2', 'Baskin Robbins');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Honey Nut Crunch', 'Premium Ice Cream', 120.0, true, true, '', 'Apartment 2', 'Baskin Robbins');

-- Block 33: Rolls King
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Rolls King Owner', '9998887773', 'VENDOR', 'Rolls King', 'Block 33');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Classic Veg Roll', 'Veg Rolls', 80.0, true, true, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Tikka Roll', 'Veg Rolls', 120.0, true, true, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cheese Corn Roll', 'Veg Rolls', 100.0, true, true, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mix Veg Roll', 'Veg Rolls', 90.0, true, true, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Egg Roll', 'Non-Veg Rolls', 70.0, true, false, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Double Egg Roll', 'Non-Veg Rolls', 90.0, true, false, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Seekh Roll', 'Non-Veg Rolls', 150.0, true, false, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Double Chicken Roll', 'Non-Veg Rolls', 180.0, true, false, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mutton Keema Roll', 'Non-Veg Rolls', 220.0, true, false, '', 'Block 33', 'Rolls King');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Butter Chicken Roll', 'Non-Veg Rolls', 190.0, true, false, '', 'Block 33', 'Rolls King');

-- Block 38: Chai Point
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Chai Point Owner', '9998887774', 'VENDOR', 'Chai Point', 'Block 38');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Ginger Chai (Large)', 'Hot Chai', 45.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Masala Chai (Large)', 'Hot Chai', 45.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Elaichi Chai (Large)', 'Hot Chai', 45.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Lemon Tea', 'Hot Chai', 35.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Green Tea', 'Hot Chai', 35.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Samosa (2 pcs)', 'Snacks', 30.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Vada Pav', 'Snacks', 40.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Bun Maska', 'Snacks', 50.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Classic Poha', 'Snacks', 60.0, true, true, '', 'Block 38', 'Chai Point');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Masala Upma', 'Snacks', 60.0, true, true, '', 'Block 38', 'Chai Point');

-- Block 36: Momo Mia
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Momo Mia Owner', '9998887775', 'VENDOR', 'Momo Mia', 'Block 36');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Steamed Momos', 'Momos', 80.0, true, true, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Fried Momos', 'Momos', 90.0, true, true, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Steamed Momos', 'Momos', 110.0, true, true, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Steamed Momos', 'Momos', 120.0, true, false, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Fried Momos', 'Momos', 130.0, true, false, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Kurkure Veg Momos', 'Special Momos', 140.0, true, true, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Kurkure Chicken Momos', 'Special Momos', 160.0, true, false, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Thukpa', 'Mains', 150.0, true, true, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Thukpa', 'Mains', 180.0, true, false, '', 'Block 36', 'Momo Mia');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Wai Wai', 'Snacks', 100.0, true, false, '', 'Block 36', 'Momo Mia');

-- Uni-Mall: UniCafe & Bistro
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('UniCafe Owner', '9998887776', 'VENDOR', 'UniCafe & Bistro', 'Uni-Mall');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Margarita Pizza', 'Mains', 150.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('White Sauce Pasta', 'Mains', 120.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Cheese Burger', 'Snacks', 90.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Crispy Chicken Burger', 'Snacks', 120.0, true, false, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Garlic Bread Sticks', 'Snacks', 80.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cold Coffee', 'Beverages', 100.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Fresh Lime Soda', 'Beverages', 60.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('French Fries', 'Snacks', 70.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Choco Lava Cake', 'Desserts', 90.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Club Sandwich', 'Snacks', 110.0, true, true, '', 'Uni-Mall', 'UniCafe & Bistro');

-- M-Block: Engineer's Junction
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Engineer Owner', '9998887777', 'VENDOR', 'Engineer''s Junction', 'M-Block');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Plain Maggi', 'Quick Bites', 40.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Masala Maggi', 'Quick Bites', 50.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cheese Maggi', 'Quick Bites', 65.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Egg Maggi', 'Quick Bites', 70.0, true, false, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Grilled Corn Sandwich', 'Snacks', 55.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Aloo Patties', 'Quick Bites', 20.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Patties', 'Quick Bites', 30.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Masala Tea', 'Beverages', 15.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Iced Tea', 'Beverages', 45.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cold Drink (300ml)', 'Beverages', 40.0, true, true, '', 'M-Block', 'Engineer''s Junction');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Bread Omelette', 'Quick Bites', 50.0, true, false, '', 'M-Block', 'Engineer''s Junction');

-- BH 1: Home Plate
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('BH1 Chef', '9998887778', 'VENDOR', 'Home Plate', 'BH 1');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mini Thali', 'Thalis', 80.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Deluxe Thali', 'Thalis', 120.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Dal Tadka', 'Mains', 90.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Butter Masala', 'Mains', 160.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Jeera Rice', 'Mains', 50.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Tandoori Roti', 'Breads', 15.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Butter Naan', 'Breads', 40.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Gulab Jamun (2 pcs)', 'Desserts', 40.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Mix Veg', 'Mains', 80.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Curd Bowl', 'Sides', 20.0, true, true, '', 'BH 1', 'Home Plate');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Roasted Papad', 'Sides', 10.0, true, true, '', 'BH 1', 'Home Plate');

-- BH 2: Fit & Fuel
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Fit Chef', '9998887779', 'VENDOR', 'Fit & Fuel', 'BH 2');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Greek Salad', 'Salads', 110.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Caesar Salad', 'Salads', 120.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Fruit Platter', 'Healthy Snacks', 90.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Watermelon Juice', 'Beverages', 50.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Pineapple Juice', 'Beverages', 60.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Protein Shake', 'Supplements', 150.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Sprouts Bhel', 'Healthy Snacks', 60.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Peanut Bowl', 'Healthy Snacks', 40.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Green Smoothie', 'Beverages', 130.0, true, true, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Boiled Eggs (4)', 'Mains', 60.0, true, false, '', 'BH 2', 'Fit & Fuel');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Oatmeal Bowl', 'Healthy Breakfast', 90.0, true, true, '', 'BH 2', 'Fit & Fuel');

-- BH 3: The Night Owl
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Owl Owner', '9998887780', 'VENDOR', 'The Night Owl', 'BH 3');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Zinger Burger', 'Snacks', 130.0, true, false, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('BBQ Wings (6)', 'Snacks', 160.0, true, false, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Peri Peri Fries', 'Sides', 90.0, true, true, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Onion Rings', 'Sides', 80.0, true, true, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Loaded Nachos', 'Snacks', 140.0, true, true, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chicken Nuggets', 'Snacks', 90.0, true, false, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Oreo Shake', 'Beverages', 110.0, true, true, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Energy Drink', 'Beverages', 120.0, true, true, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Zinger Burger', 'Snacks', 120.0, true, true, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Hot Chicken Wings', 'Snacks', 170.0, true, false, '', 'BH 3', 'The Night Owl');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cheese Balls', 'Snacks', 80.0, true, true, '', 'BH 3', 'The Night Owl');

-- GH 1: The Pink Bakery
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Baking Queen', '9998887781', 'VENDOR', 'The Pink Bakery', 'GH 1');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Red Velvet Pastry', 'Pastries', 70.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Cheesecake Slice', 'Pastries', 110.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Chocolate Mini Cake', 'Cakes', 350.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Vanilla Cupcake', 'Bakery', 40.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Oatmeal Cookies', 'Bakery', 80.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Fruit Tart', 'Bakery', 60.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Hot Chocolate', 'Beverages', 90.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Macarons (4)', 'Bakery', 160.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Banana Bread', 'Bakery', 50.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Strawberry Mousse', 'Desserts', 80.0, true, true, '', 'GH 1', 'The Pink Bakery');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Garlic Cheese Bread', 'Bakery', 70.0, true, true, '', 'GH 1', 'The Pink Bakery');

-- GH 2: Gourmet Garden
INSERT INTO users (name, phone_number, role, shop_name, block) VALUES ('Gourmet Chef', '9998887782', 'VENDOR', 'Gourmet Garden', 'GH 2');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Hummus & Pita', 'Snacks', 130.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Veg Falafel Wrap', 'Wraps', 110.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Paneer Tikka Salad', 'Salads', 140.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Pomegranate Juice', 'Beverages', 70.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Avocado Toast', 'Healthy Breakfast', 150.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Quinoa Bowl', 'Mains', 160.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Detox Water', 'Beverages', 40.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Berry Smoothie', 'Beverages', 120.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Grilled Tofu Wrap', 'Wraps', 140.0, true, true, '', 'GH 2', 'Gourmet Garden');
INSERT INTO menu_item (name, category, price, is_available, is_veg, image_url, location, stall_name) VALUES ('Yogurt Parfait', 'Desserts', 100.0, true, true, '', 'GH 2', 'Gourmet Garden');
