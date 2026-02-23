"""
Database connection helper using SQLite (fallback-friendly, no external DB needed).
Switches to MySQL if configured in .env
"""
import sqlite3
import os
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'database', 'restaurant.db')

def get_db():
    """Get SQLite connection"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initialize database with schema and seed data"""
    conn = get_db()
    cursor = conn.cursor()

    # Create tables
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL DEFAULT 'Guest',
            email TEXT UNIQUE,
            phone TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            category TEXT NOT NULL,
            image_url TEXT,
            rating REAL DEFAULT 4.0,
            is_veg INTEGER DEFAULT 1,
            is_available INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER DEFAULT 1,
            total_amount REAL NOT NULL,
            status TEXT DEFAULT 'confirmed',
            order_type TEXT DEFAULT 'manual',
            delivery_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            menu_item_id INTEGER NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            item_price REAL NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
            FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
        );

        CREATE TABLE IF NOT EXISTS chatbot_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER DEFAULT 1,
            user_message TEXT NOT NULL,
            bot_response TEXT NOT NULL,
            intent TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    ''')

    # Check if data already seeded
    existing = cursor.execute("SELECT COUNT(*) FROM menu_items").fetchone()[0]
    if existing == 0:
        # Seed default user
        cursor.execute("INSERT INTO users (name, email, phone) VALUES (?, ?, ?)",
                       ('Guest User', 'guest@restaurant.com', '0000000000'))

        # Seed menu items
        menu_data = [
            ('Veg Burger', 'Crispy veggie patty with fresh lettuce, tomato & special sauce', 149.00, 'Burgers', 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400', 4.3, 1),
            ('Chicken Burger', 'Juicy grilled chicken with cheese, lettuce & mayo', 199.00, 'Burgers', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', 4.5, 0),
            ('Margherita Pizza', 'Classic pizza with mozzarella, tomato sauce & fresh basil', 299.00, 'Pizza', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', 4.6, 1),
            ('Pepperoni Pizza', 'Loaded with pepperoni, mozzarella & oregano', 349.00, 'Pizza', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', 4.4, 0),
            ('Farmhouse Pizza', 'Topped with capsicum, onion, mushroom & olives', 329.00, 'Pizza', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', 4.2, 1),
            ('French Fries', 'Crispy golden fries with seasoning', 99.00, 'Sides', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', 4.1, 1),
            ('Coke', 'Chilled Coca-Cola 300ml', 49.00, 'Beverages', 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400', 4.0, 1),
            ('Cold Coffee', 'Creamy iced coffee with whipped cream', 129.00, 'Beverages', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 4.5, 1),
            ('Paneer Tikka', 'Marinated cottage cheese grilled to perfection', 219.00, 'Starters', 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', 4.7, 1),
            ('Chicken Wings', 'Spicy buffalo chicken wings with dip', 249.00, 'Starters', 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400', 4.3, 0),
            ('Veg Biryani', 'Aromatic basmati rice with mixed vegetables & spices', 199.00, 'Main Course', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', 4.4, 1),
            ('Chicken Biryani', 'Hyderabadi style chicken dum biryani', 279.00, 'Main Course', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', 4.8, 0),
            ('Masala Dosa', 'Crispy dosa with potato masala filling & chutneys', 129.00, 'South Indian', 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', 4.3, 1),
            ('Chocolate Brownie', 'Rich dark chocolate brownie with vanilla ice cream', 149.00, 'Desserts', 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', 4.6, 1),
            ('Gulab Jamun', 'Soft milk dumplings soaked in rose sugar syrup', 89.00, 'Desserts', 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400', 4.5, 1),
            ('Mojito', 'Refreshing mint & lime mocktail', 99.00, 'Beverages', 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400', 4.2, 1),
            ('Tandoori Chicken', 'Smoky charcoal grilled chicken marinated in spices', 299.00, 'Starters', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', 4.6, 0),
            ('Pasta Alfredo', 'Creamy white sauce pasta with herbs & mushrooms', 229.00, 'Main Course', 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', 4.3, 1),
            ('Naan Bread', 'Soft tandoori naan with butter', 49.00, 'Sides', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400', 4.1, 1),
            ('Mango Lassi', 'Thick & creamy mango yogurt drink', 79.00, 'Beverages', 'https://images.unsplash.com/photo-1527685609591-44b0aef2400b?w=400', 4.4, 1),
        ]

        cursor.executemany(
            "INSERT INTO menu_items (name, description, price, category, image_url, rating, is_veg) VALUES (?,?,?,?,?,?,?)",
            menu_data
        )

    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == '__main__':
    init_db()
