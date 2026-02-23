# 🍔 FoodieHub — AI-Powered Restaurant Ordering App

A modern full-stack restaurant ordering web application featuring both **manual ordering** (like Zomato/Swiggy) and an **AI Chatbot** for automated food ordering.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Flask](https://img.shields.io/badge/Flask-3.x-green) ![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan) ![Python](https://img.shields.io/badge/Python-3.10+-yellow)

---

## ✨ Features

### 🛒 Manual Ordering System
- Browse food menu with animated cards
- Filter by category, search, and veg-only toggle
- Add/remove items with quantity controls
- Dynamic cart with slide-in drawer
- Checkout with delivery details
- Order confirmation with confetti animation

### 🤖 AI Chatbot Ordering
- Natural language food ordering
- Understands commands like:
  - `"Order 2 veg burgers and one coke"`
  - `"Add a pizza"`
  - `"Remove coffee"`
  - `"Show menu"`
  - `"Place order"`
- Fuzzy matching for item names
- Quantity extraction (numbers & words)
- Suggested items for unclear queries
- Cart auto-update from chat

### 🎨 UI/UX
- Modern Zomato-like landing page
- Framer Motion animations throughout
- Dark/Light theme toggle
- Mobile responsive
- Loading skeletons
- Smooth page transitions

### 🤖 Selenium Automation
- Automated order placement simulation
- Form filling, clicking, and verification

---

## 📁 Project Structure

```
full stack/
├── frontend/           # React + Tailwind frontend
│   └── src/
│       ├── components/ # Navbar, MenuCard, CartDrawer, Chatbot, SkeletonCard
│       ├── pages/      # Home, Menu, Cart, Checkout, OrderConfirmation, OrderHistory
│       ├── api.js      # Axios API client
│       └── App.js      # Main app with routing & context
├── backend/
│   └── app.py          # Flask REST API server
├── ai_module/
│   └── chatbot.py      # NLP chatbot engine
├── automation/
│   └── order_automation.py  # Selenium automation
├── database/
│   ├── db.py           # SQLite database helper
│   └── schema.sql      # MySQL/PostgreSQL schema (optional)
├── .env                # Environment configuration
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.10+
- **Chrome** (for Selenium automation)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd "full stack"
```

### 2. Backend Setup
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start the Flask API server
python backend/app.py
```
The API runs on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend

# Install npm packages
npm install

# Start the React dev server
npm start
```
The app runs on `http://localhost:3000`

### 4. (Optional) Selenium Automation
```bash
# Make sure Chrome & ChromeDriver are installed
pip install selenium

# Run the automation script
python automation/order_automation.py
```

---

## 🔌 API Endpoints

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| GET    | `/api/menu`          | Get all menu items        |
| GET    | `/api/menu/categories` | Get menu categories     |
| POST   | `/api/cart/add`      | Validate & add to cart    |
| POST   | `/api/cart/remove`   | Validate cart removal     |
| POST   | `/api/orders`        | Place a new order         |
| GET    | `/api/orders/recent` | Get last 3 orders        |
| POST   | `/api/chatbot`       | Send message to AI bot    |
| GET    | `/api/health`        | Health check              |

---

## 🗃️ Database Tables

| Table          | Purpose                    |
|----------------|----------------------------|
| `users`        | User accounts              |
| `menu_items`   | Food items with details    |
| `orders`       | Order records              |
| `order_items`  | Items within each order    |
| `chatbot_logs` | Chat conversation logs     |

The app uses **SQLite** by default (zero config). The `schema.sql` file provides MySQL/PostgreSQL DDL if you want to use an external database.

---

## 🧠 AI Chatbot Commands

| Command Example                          | Action           |
|------------------------------------------|------------------|
| "Order 2 veg burgers and one coke"       | Add items        |
| "Add a margherita pizza"                 | Add item         |
| "Remove coffee"                          | Remove item      |
| "Show my cart"                           | View cart        |
| "Clear cart"                             | Empty cart       |
| "Place order" / "Checkout"               | Initiate order   |
| "Show menu"                              | Display menu     |
| "Help"                                   | Show commands    |

---

## ⚙️ Environment Variables (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=restaurant_app
FLASK_SECRET_KEY=super-secret-key
FLASK_DEBUG=True
FLASK_PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## 📸 Screenshots

| Home Page | Menu Page | AI Chatbot |
|-----------|-----------|------------|
| Modern landing with categories | Animated menu cards with filters | Chat-based food ordering |

---

## 🛠️ Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | React 18, Tailwind CSS 4, Framer Motion, React Router |
| Backend     | Python Flask, Flask-CORS                          |
| Database    | SQLite (default) / MySQL / PostgreSQL             |
| AI/NLP      | Custom NLP chatbot with fuzzy matching            |
| Automation  | Selenium WebDriver                                |

---

## 📜 License

MIT License — Free to use, modify, and distribute.
