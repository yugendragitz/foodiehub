import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiMinus, FiStar } from 'react-icons/fi';
import { AppContext } from '../App';

const MenuCard = ({ item }) => {
  const { cart, addToCart, updateQuantity, darkMode } = useContext(AppContext);
  const cartItem = cart.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl overflow-hidden shadow-lg ${
        darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
            item.is_veg
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-400 text-gray-900 px-2 py-1 rounded-full text-xs font-bold">
          <FiStar size={12} /> {item.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
        <p className={`text-sm mb-3 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-500">
            ₹{item.price}
          </span>

          {quantity === 0 ? (
            <motion.button
              whileTap={{ scale: 0.9 }}
              data-testid="add-to-cart-btn"
              onClick={() => addToCart(item)}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1"
            >
              <FiPlus size={16} /> ADD
            </motion.button>
          ) : (
            <div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/30 rounded-xl px-2 py-1">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => updateQuantity(item.id, quantity - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                <FiMinus size={14} />
              </motion.button>
              <motion.span
                key={quantity}
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="font-bold text-orange-600 dark:text-orange-400 min-w-[20px] text-center"
              >
                {quantity}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => updateQuantity(item.id, quantity + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 text-white hover:bg-orange-600"
              >
                <FiPlus size={14} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
