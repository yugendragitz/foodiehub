import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCpu, FiShoppingBag, FiClock, FiStar } from 'react-icons/fi';
import { AppContext } from '../App';

const Home = () => {
  const { darkMode, setChatbotOpen } = useContext(AppContext);
  const navigate = useNavigate();

  const features = [
    { icon: <FiShoppingBag size={28} />, title: 'Easy Ordering', desc: 'Browse our menu and add items to cart with a single click' },
    { icon: <FiCpu size={28} />, title: 'AI Chatbot', desc: 'Just tell our AI what you want — it handles the rest!' },
    { icon: <FiClock size={28} />, title: 'Fast Delivery', desc: 'Lightning-fast delivery right to your doorstep' },
    { icon: <FiStar size={28} />, title: 'Top Rated', desc: 'Curated menu with highest-rated dishes only' }
  ];

  const categories = [
    { name: 'Pizza', emoji: '🍕', color: 'from-red-400 to-orange-400' },
    { name: 'Burgers', emoji: '🍔', color: 'from-yellow-400 to-orange-500' },
    { name: 'Beverages', emoji: '🥤', color: 'from-blue-400 to-cyan-400' },
    { name: 'Desserts', emoji: '🍰', color: 'from-pink-400 to-purple-400' },
    { name: 'Starters', emoji: '🍗', color: 'from-orange-400 to-red-500' },
    { name: 'Main Course', emoji: '🍛', color: 'from-green-400 to-emerald-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ x: -60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 rounded-full text-sm font-semibold mb-6"
              >
                🔥 #1 Food Ordering Platform
              </motion.span>

              <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                Delicious Food,{' '}
                <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Delivered Fast
                </span>
              </h1>

              <p className={`text-lg mb-8 max-w-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Order your favorite meals manually or let our AI chatbot handle it for you.
                Just say what you want — we'll take care of the rest! 🤖
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/menu')}
                  className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-orange-500/30 flex items-center gap-2 cursor-pointer"
                >
                  Order Now <FiArrowRight />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-8 py-4 rounded-2xl font-semibold text-lg border-2 flex items-center gap-2 cursor-pointer ${
                    darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setChatbotOpen(true)}
                >
                  <FiCpu /> Try AI Order
                </motion.button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 mt-12">
                {[
                  { num: '500+', label: 'Happy Customers' },
                  { num: '50+', label: 'Menu Items' },
                  { num: '4.8', label: 'App Rating' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="text-2xl font-bold text-orange-500">{stat.num}</div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full h-[500px]">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute inset-0"
                >
                  <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
                    alt="Delicious Food"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                </motion.div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl opacity-20" />
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Explore by <span className="text-orange-500">Category</span>
        </motion.h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.05 }}
            >
              <Link
                to={`/menu?category=${cat.name}`}
                className={`block p-6 rounded-2xl text-center transition-shadow hover:shadow-lg ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-3xl`}>
                  {cat.emoji}
                </div>
                <span className="font-semibold text-sm">{cat.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800/50' : 'bg-orange-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Why Choose <span className="text-orange-500">FoodieHub?</span>
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-6 rounded-2xl text-center ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
                }`}
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-2xl flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-center text-white"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 left-8 text-6xl">🍕</div>
            <div className="absolute bottom-4 right-8 text-6xl">🍔</div>
            <div className="absolute top-8 right-20 text-4xl">🥤</div>
            <div className="absolute bottom-8 left-20 text-4xl">🍰</div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-md mx-auto">
            Start ordering now and get your food delivered in minutes!
          </p>
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/menu')}
              className="px-8 py-4 bg-white text-orange-600 rounded-2xl font-bold text-lg shadow-lg cursor-pointer"
            >
              Browse Menu 🍽️
            </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className={`py-8 text-center text-sm ${darkMode ? 'text-gray-500 border-t border-gray-700' : 'text-gray-400 border-t'}`}>
        <p>© 2026 FoodieHub — AI-Powered Restaurant Ordering App</p>
      </footer>
    </motion.div>
  );
};

export default Home;
