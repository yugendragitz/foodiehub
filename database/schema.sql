-- Restaurant Ordering App - Database Schema
-- Run this file to set up the database

CREATE DATABASE IF NOT EXISTS restaurant_app;
USE restaurant_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL DEFAULT 'Guest',
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Menu Items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(500),
    rating DECIMAL(2, 1) DEFAULT 4.0,
    is_veg BOOLEAN DEFAULT TRUE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'confirmed',
    order_type VARCHAR(20) DEFAULT 'manual',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    item_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);

-- Chatbot Logs table
CREATE TABLE IF NOT EXISTS chatbot_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT DEFAULT 1,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    intent VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Seed default user
INSERT INTO users (name, email, phone) VALUES ('Guest User', 'guest@restaurant.com', '0000000000');

-- Seed Menu Items
INSERT INTO menu_items (name, description, price, category, image_url, rating, is_veg) VALUES
('Veg Burger', 'Crispy veggie patty with fresh lettuce, tomato & special sauce', 149.00, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', 4.3, TRUE),
('Chicken Burger', 'Juicy grilled chicken with cheese, lettuce & mayo', 199.00, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.5, FALSE),
('Margherita Pizza', 'Classic pizza with mozzarella, tomato sauce & fresh basil', 299.00, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 4.6, TRUE),
('Pepperoni Pizza', 'Loaded with pepperoni, mozzarella & oregano', 349.00, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 4.4, FALSE),
('Farmhouse Pizza', 'Topped with capsicum, onion, mushroom & olives', 329.00, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 4.2, TRUE),
('French Fries', 'Crispy golden fries with seasoning', 99.00, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 4.1, TRUE),
('Coke', 'Chilled Coca-Cola 300ml', 49.00, 'Beverages', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', 4.0, TRUE),
('Cold Coffee', 'Creamy iced coffee with whipped cream', 129.00, 'Beverages', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 4.5, TRUE),
('Paneer Tikka', 'Marinated cottage cheese grilled to perfection', 219.00, 'Starters', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 4.7, TRUE),
('Chicken Wings', 'Spicy buffalo chicken wings with dip', 249.00, 'Starters', 'https://images.unsplash.com/photo-1608039829572-9b1234ef4d28?w=400', 4.3, FALSE),
('Veg Biryani', 'Aromatic basmati rice with mixed vegetables & spices', 199.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 4.4, TRUE),
('Chicken Biryani', 'Hyderabadi style chicken dum biryani', 279.00, 'Main Course', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 4.8, FALSE),
('Masala Dosa', 'Crispy dosa with potato masala filling & chutneys', 129.00, 'South Indian', 'https://images.unsplash.com/photo-1668236543090-82eb5eace5db?w=400', 4.3, TRUE),
('Chocolate Brownie', 'Rich dark chocolate brownie with vanilla ice cream', 149.00, 'Desserts', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', 4.6, TRUE),
('Gulab Jamun', 'Soft milk dumplings soaked in rose sugar syrup', 89.00, 'Desserts', 'https://images.unsplash.com/photo-1666190094762-2803002bfb04?w=400', 4.5, TRUE),
('Mojito', 'Refreshing mint & lime mocktail', 99.00, 'Beverages', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400', 4.2, TRUE),
('Tandoori Chicken', 'Smoky charcoal grilled chicken marinated in spices', 299.00, 'Starters', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', 4.6, FALSE),
('Pasta Alfredo', 'Creamy white sauce pasta with herbs & mushrooms', 229.00, 'Main Course', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', 4.3, TRUE),
('Naan Bread', 'Soft tandoori naan with butter', 49.00, 'Sides', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 4.1, TRUE),
('Mango Lassi', 'Thick & creamy mango yogurt drink', 79.00, 'Beverages', 'https://images.unsplash.com/photo-1527685609591-44b0aef2400b?w=400', 4.4, TRUE);
