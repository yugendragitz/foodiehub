"""
Flask REST API for Restaurant Ordering Application
"""
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
from database.db import get_db, init_db
from ai_module.chatbot import FoodChatbot
from datetime import datetime

app = Flask(__name__)
# Allow all origins in dev; restrict in production via CORS_ORIGINS env var
allowed_origins = os.getenv('CORS_ORIGINS', '*').split(',')
CORS(app, resources={r"/api/*": {"origins": allowed_origins}})
app.config['SECRET_KEY'] = os.getenv('FLASK_SECRET_KEY', 'dev-secret-key')

# Initialize database on startup
init_db()

# Global chatbot instance (initialized with menu on first request)
chatbot_instance = None

def get_chatbot():
    """Lazy-load chatbot with latest menu data"""
    global chatbot_instance
    if chatbot_instance is None:
        conn = get_db()
        rows = conn.execute("SELECT * FROM menu_items WHERE is_available = 1").fetchall()
        menu = [dict(r) for r in rows]
        conn.close()
        chatbot_instance = FoodChatbot(menu)
    return chatbot_instance


# ─── MENU ENDPOINTS ───────────────────────────────────────────

@app.route('/api/menu', methods=['GET'])
def get_menu():
    """Get all available menu items, optionally filtered by category"""
    try:
        conn = get_db()
        category = request.args.get('category')

        if category and category != 'All':
            rows = conn.execute(
                "SELECT * FROM menu_items WHERE is_available = 1 AND category = ?",
                (category,)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM menu_items WHERE is_available = 1"
            ).fetchall()

        items = [dict(r) for r in rows]
        conn.close()

        return jsonify({'success': True, 'data': items})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/menu/categories', methods=['GET'])
def get_categories():
    """Get all unique menu categories"""
    try:
        conn = get_db()
        rows = conn.execute(
            "SELECT DISTINCT category FROM menu_items WHERE is_available = 1"
        ).fetchall()
        categories = ['All'] + [r['category'] for r in rows]
        conn.close()

        return jsonify({'success': True, 'data': categories})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ─── CART ENDPOINTS ────────────────────────────────────────────

@app.route('/api/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart (managed on frontend, this validates the item)"""
    try:
        data = request.json
        item_id = data.get('item_id')
        quantity = data.get('quantity', 1)

        conn = get_db()
        item = conn.execute(
            "SELECT * FROM menu_items WHERE id = ? AND is_available = 1",
            (item_id,)
        ).fetchone()
        conn.close()

        if not item:
            return jsonify({'success': False, 'error': 'Item not found'}), 404

        return jsonify({
            'success': True,
            'data': {
                'id': item['id'],
                'name': item['name'],
                'price': item['price'],
                'quantity': quantity,
                'image_url': item['image_url'],
                'is_veg': item['is_veg']
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/cart/remove', methods=['POST'])
def remove_from_cart():
    """Remove item from cart (validates item exists)"""
    try:
        data = request.json
        item_id = data.get('item_id')

        conn = get_db()
        item = conn.execute(
            "SELECT id, name FROM menu_items WHERE id = ?",
            (item_id,)
        ).fetchone()
        conn.close()

        if not item:
            return jsonify({'success': False, 'error': 'Item not found'}), 404

        return jsonify({
            'success': True,
            'message': f'{item["name"]} removed from cart'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ─── ORDER ENDPOINTS ──────────────────────────────────────────

@app.route('/api/orders', methods=['POST'])
def create_order():
    """Confirm and place an order"""
    try:
        data = request.json
        items = data.get('items', [])
        order_type = data.get('order_type', 'manual')
        delivery_address = data.get('delivery_address', '')

        if not items:
            return jsonify({'success': False, 'error': 'Cart is empty'}), 400

        conn = get_db()
        total = 0

        # Validate all items and calculate total
        validated_items = []
        for cart_item in items:
            item = conn.execute(
                "SELECT * FROM menu_items WHERE id = ?",
                (cart_item['id'],)
            ).fetchone()
            if item:
                subtotal = item['price'] * cart_item['quantity']
                total += subtotal
                validated_items.append({
                    'menu_item_id': item['id'],
                    'quantity': cart_item['quantity'],
                    'item_price': item['price'],
                    'name': item['name']
                })

        # Create order
        cursor = conn.execute(
            "INSERT INTO orders (user_id, total_amount, status, order_type, delivery_address) VALUES (?, ?, ?, ?, ?)",
            (1, total, 'confirmed', order_type, delivery_address)
        )
        order_id = cursor.lastrowid

        # Create order items
        for vi in validated_items:
            conn.execute(
                "INSERT INTO order_items (order_id, menu_item_id, quantity, item_price) VALUES (?, ?, ?, ?)",
                (order_id, vi['menu_item_id'], vi['quantity'], vi['item_price'])
            )

        conn.commit()
        conn.close()

        return jsonify({
            'success': True,
            'data': {
                'order_id': order_id,
                'total_amount': total,
                'status': 'confirmed',
                'order_type': order_type,
                'items': validated_items,
                'created_at': datetime.now().isoformat()
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/api/orders/recent', methods=['GET'])
def get_recent_orders():
    """Get last 3 orders with their items"""
    try:
        conn = get_db()
        orders = conn.execute(
            "SELECT * FROM orders ORDER BY created_at DESC LIMIT 3"
        ).fetchall()

        result = []
        for order in orders:
            order_dict = dict(order)
            # Get order items with menu item details
            items = conn.execute('''
                SELECT oi.*, mi.name, mi.image_url, mi.is_veg
                FROM order_items oi
                JOIN menu_items mi ON oi.menu_item_id = mi.id
                WHERE oi.order_id = ?
            ''', (order['id'],)).fetchall()
            order_dict['items'] = [dict(i) for i in items]
            result.append(order_dict)

        conn.close()

        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ─── CHATBOT ENDPOINT ─────────────────────────────────────────

@app.route('/api/chatbot', methods=['POST'])
def chatbot_message():
    """Process chatbot message and return AI response"""
    try:
        data = request.json
        message = data.get('message', '').strip()

        if not message:
            return jsonify({'success': False, 'error': 'Message is required'}), 400

        bot = get_chatbot()
        result = bot.process_message(message)

        # Log the conversation
        try:
            conn = get_db()
            conn.execute(
                "INSERT INTO chatbot_logs (user_id, user_message, bot_response, intent) VALUES (?, ?, ?, ?)",
                (1, message, result['message'], result['intent'])
            )
            conn.commit()
            conn.close()
        except Exception:
            pass  # Don't fail the response if logging fails

        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


# ─── HEALTH CHECK ─────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Restaurant API is running!'})


if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    print(f"🚀 Starting Restaurant API on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
