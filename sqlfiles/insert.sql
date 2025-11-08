-- Sample Admin Account
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@zaika.com', 'admin123', 'admin');

-- Sample Categories
INSERT INTO categories (category_name, description)
VALUES
('Starters', 'Appetizers to start your meal'),
('Main Course', 'Delicious main dishes'),
('Desserts', 'Sweet treats'),
('Beverages', 'Refreshing drinks');

-- Sample Menu Items
INSERT INTO menu_items (name, description, price, category_id)
VALUES
('Paneer Tikka', 'Grilled paneer with spices', 180, 1),
('Butter Chicken', 'Creamy chicken curry', 250, 2),
('Gulab Jamun', 'Traditional Indian sweet', 80, 3),
('Mango Shake', 'Fresh mango milkshake', 120, 4);