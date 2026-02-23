"""
AI NLP Chatbot Module for Restaurant Ordering
Parses natural language food ordering commands and extracts intents, items, and quantities.
"""
import re
from difflib import get_close_matches


class FoodChatbot:
    """NLP-based chatbot that understands food ordering commands"""

    def __init__(self, menu_items):
        """
        Initialize chatbot with menu items.
        menu_items: list of dicts with 'id', 'name', 'price', 'category' keys
        """
        self.menu_items = menu_items
        self.menu_names = {item['name'].lower(): item for item in menu_items}
        self.menu_keywords = self._build_keyword_index()

        # Intent patterns — order matters! Specific intents must come before broad ones like 'add'
        self.intent_patterns = {
            'place_order': [
                r'\b(place order|confirm order|checkout|check out|place my order|finalize|done ordering|that\'s all|submit order|complete order|place)\b'
            ],
            'view_cart': [
                r'\b(view cart|show cart|what\'s in my cart|my cart|cart items|show my order|what did i order)\b'
            ],
            'clear_cart': [
                r'\b(clear cart|empty cart|reset cart|start over|remove all|clear all)\b'
            ],
            'show_menu': [
                r'\b(show menu|see menu|what do you have|list items|food list|available items|what\'s available)\b'
            ],
            'greeting': [
                r'\b(hi|hello|hey|good morning|good evening|howdy|greetings)\b'
            ],
            'help': [
                r'\b(help|what can you do|commands|how to order)\b'
            ],
            'remove': [
                r'\b(remove|delete|cancel|drop|no more|take out|take off|don\'t want)\b'
            ],
            'add': [
                r'\b(add|order|want|give|get|i\'ll have|i\'d like|bring|include)\b',
                r'\b(can i get|can i have|i need|please add|put)\b'
            ]
        }

        # Number words mapping
        self.number_words = {
            'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
            'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
            'a': 1, 'an': 1, 'single': 1, 'couple': 2, 'few': 3,
            'dozen': 12, 'half dozen': 6
        }

    def _build_keyword_index(self):
        """Build a keyword index from menu item names for fuzzy matching"""
        index = {}
        for item in self.menu_items:
            words = item['name'].lower().split()
            for word in words:
                if len(word) > 2:
                    if word not in index:
                        index[word] = []
                    index[word].append(item)
        return index

    def detect_intent(self, message):
        """Detect the primary intent from user message"""
        msg = message.lower().strip()

        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, msg):
                    return intent

        # Default: if message contains food items, assume 'add'
        items = self.extract_items(msg)
        if items:
            return 'add'

        return 'unknown'

    def extract_quantity(self, text_before_item):
        """Extract quantity from text immediately preceding an item name"""
        text = text_before_item.strip().lower()

        # Only look at the last segment (after 'and', comma, etc.)
        segments = re.split(r'\band\b|,|\bwith\b|\balso\b|\bplus\b', text)
        text = segments[-1].strip() if segments else text

        # Check for digit quantities
        numbers = re.findall(r'\b(\d+)\b', text)
        if numbers:
            return int(numbers[-1])

        # Check for word quantities
        for word, num in sorted(self.number_words.items(), key=lambda x: -len(x[0])):
            if word in text.split():
                return num

        return 1  # Default quantity

    def find_menu_item(self, query):
        """Find a menu item by name using fuzzy matching"""
        query = query.lower().strip()

        # Exact match
        if query in self.menu_names:
            return self.menu_names[query]

        # Partial match
        for name, item in self.menu_names.items():
            if query in name or name in query:
                return item

        # Fuzzy match using difflib
        matches = get_close_matches(query, self.menu_names.keys(), n=1, cutoff=0.5)
        if matches:
            return self.menu_names[matches[0]]

        # Keyword-based matching
        query_words = query.split()
        best_match = None
        best_score = 0

        for item in self.menu_items:
            item_words = item['name'].lower().split()
            score = sum(1 for w in query_words if any(
                w in iw or iw in w for iw in item_words
            ))
            if score > best_score:
                best_score = score
                best_match = item

        if best_score > 0:
            return best_match

        return None

    def extract_items(self, message):
        """Extract food items and quantities from a message"""
        msg = message.lower().strip()

        # Remove intent words to focus on items
        intent_words = r'\b(add|order|want|give|get|remove|delete|cancel|please|can|i|you|me|my|some|the|and|with|also|too)\b'
        cleaned = re.sub(intent_words, ' ', msg)
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()

        extracted = []

        # Strategy 1: Try to match known menu items directly in the message
        remaining = msg
        for name, item in sorted(self.menu_names.items(), key=lambda x: -len(x[0])):
            pattern = re.compile(re.escape(name), re.IGNORECASE)
            match = pattern.search(remaining)
            if match:
                # Get text before the match for quantity
                start = match.start()
                text_before = remaining[:start]
                qty = self.extract_quantity(text_before)
                extracted.append({'item': item, 'quantity': qty})
                remaining = remaining[:start] + remaining[match.end():]

        if extracted:
            return extracted

        # Strategy 2: Split by 'and', commas, 'with' and try to match each part
        parts = re.split(r'\band\b|,|\bwith\b|\balso\b|\bplus\b', cleaned)

        for part in parts:
            part = part.strip()
            if not part:
                continue

            # Extract quantity
            qty_match = re.match(r'^(\d+)\s+(.+)', part)
            if qty_match:
                qty = int(qty_match.group(1))
                item_text = qty_match.group(2)
            else:
                qty = 1
                item_text = part
                for word, num in self.number_words.items():
                    if item_text.startswith(word + ' '):
                        qty = num
                        item_text = item_text[len(word):].strip()
                        break

            item = self.find_menu_item(item_text)
            if item:
                extracted.append({'item': item, 'quantity': qty})

        return extracted

    def get_suggestions(self, query):
        """Get menu item suggestions for unclear queries"""
        suggestions = []
        query_lower = query.lower()

        for item in self.menu_items:
            name_lower = item['name'].lower()
            if any(w in name_lower for w in query_lower.split() if len(w) > 2):
                suggestions.append(item)

        return suggestions[:5]

    def process_message(self, message):
        """
        Main entry point: process a user message and return a response.
        Returns dict with: intent, response, items, action
        """
        intent = self.detect_intent(message)
        response = {
            'intent': intent,
            'message': '',
            'items': [],
            'action': None,
            'suggestions': []
        }

        if intent == 'greeting':
            response['message'] = (
                "Hello! 👋 Welcome to FoodieBot! I can help you order food.\n"
                "Try saying things like:\n"
                "• \"Order 2 veg burgers and one coke\"\n"
                "• \"Add one pizza\"\n"
                "• \"Remove coffee\"\n"
                "• \"Place order\"\n"
                "• \"Show menu\""
            )
            response['action'] = 'greeting'

        elif intent == 'help':
            response['message'] = (
                "Here's what I can do:\n"
                "🍔 **Add items**: \"Order 2 burgers and a coke\"\n"
                "❌ **Remove items**: \"Remove coffee\"\n"
                "🛒 **View cart**: \"Show my cart\"\n"
                "🗑️ **Clear cart**: \"Clear cart\"\n"
                "✅ **Place order**: \"Place my order\"\n"
                "📋 **See menu**: \"Show menu\"\n\n"
                "Just type naturally, I'll understand! 😊"
            )
            response['action'] = 'help'

        elif intent == 'show_menu':
            categories = {}
            for item in self.menu_items:
                cat = item['category']
                if cat not in categories:
                    categories[cat] = []
                categories[cat].append(item)

            menu_text = "📋 Here's our menu:\n\n"
            for cat, items in categories.items():
                menu_text += f"**{cat}:**\n"
                for it in items:
                    veg_icon = "🟢" if it.get('is_veg') else "🔴"
                    menu_text += f"  {veg_icon} {it['name']} - ₹{it['price']}\n"
                menu_text += "\n"

            response['message'] = menu_text
            response['action'] = 'show_menu'

        elif intent == 'add':
            items = self.extract_items(message)
            if items:
                response['items'] = [
                    {'id': i['item']['id'], 'name': i['item']['name'],
                     'price': i['item']['price'], 'quantity': i['quantity']}
                    for i in items
                ]
                item_list = ', '.join(
                    f"{i['quantity']}x {i['item']['name']}" for i in items
                )
                response['message'] = f"✅ Added to cart: {item_list}\n\nAnything else you'd like to add? Say \"place order\" when ready!"
                response['action'] = 'add_to_cart'
            else:
                suggestions = self.get_suggestions(message)
                if suggestions:
                    response['suggestions'] = [
                        {'id': s['id'], 'name': s['name'], 'price': s['price']}
                        for s in suggestions
                    ]
                    response['message'] = (
                        "🤔 I couldn't find that exact item. Did you mean one of these?\n" +
                        '\n'.join(f"• {s['name']} (₹{s['price']})" for s in suggestions)
                    )
                else:
                    response['message'] = "Sorry, I couldn't find that item on our menu. Try saying \"show menu\" to see available items."
                response['action'] = 'not_found'

        elif intent == 'remove':
            items = self.extract_items(message)
            if items:
                response['items'] = [
                    {'id': i['item']['id'], 'name': i['item']['name'],
                     'price': i['item']['price'], 'quantity': i['quantity']}
                    for i in items
                ]
                item_list = ', '.join(i['item']['name'] for i in items)
                response['message'] = f"🗑️ Removed from cart: {item_list}"
                response['action'] = 'remove_from_cart'
            else:
                response['message'] = "Which item would you like to remove? Please specify the item name."
                response['action'] = 'clarify'

        elif intent == 'view_cart':
            response['message'] = "🛒 Here's your current cart:"
            response['action'] = 'view_cart'

        elif intent == 'clear_cart':
            response['message'] = "🗑️ Cart cleared! Start fresh by ordering something."
            response['action'] = 'clear_cart'

        elif intent == 'place_order':
            response['message'] = "🎉 Great! Let me confirm your order. Please review your cart and confirm to place the order."
            response['action'] = 'place_order'

        else:
            suggestions = self.get_suggestions(message)
            if suggestions:
                response['suggestions'] = [
                    {'id': s['id'], 'name': s['name'], 'price': s['price']}
                    for s in suggestions
                ]
                response['message'] = (
                    "I'm not sure what you mean. Here are some items you might be looking for:\n" +
                    '\n'.join(f"• {s['name']} (₹{s['price']})" for s in suggestions) +
                    "\n\nTry: \"Order [item name]\" or say \"help\" for commands."
                )
            else:
                response['message'] = (
                    "I didn't quite understand that. 🤔\n"
                    "Try commands like:\n"
                    "• \"Order 2 burgers\"\n"
                    "• \"Show menu\"\n"
                    "• \"Help\""
                )
            response['action'] = 'unknown'

        return response
