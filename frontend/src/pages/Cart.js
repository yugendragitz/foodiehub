import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPlus, FiMinus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { AppContext } from '../App';

const Cart = () => {
  const { cart, cartTotal, darkMode, updateQuantity, removeFromCart, clearCart } = useContext(AppContext);

  if (cart.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto px-4 py-20 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <FiShoppingBag size={80} className="mx-auto mb-6 text-gray-300" />
        </motion.div>
        <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
        <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Looks like you haven't added anything yet.
        </p>
        <Link to="/menu">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold"
          >
            Browse Menu
          </motion.button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 py-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/menu">
            <motion.button whileTap={{ scale: 0.9 }} className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <FiArrowLeft size={20} />
            </motion.button>
          </Link>
          <h1 className="text-3xl font-bold">Your <span className="text-orange-500">Cart</span></h1>
        </div>
        <button
          onClick={clearCart}
          className="text-red-500 text-sm font-medium hover:text-red-600"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {cart.map(item => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50, height: 0 }}
              className={`flex items-center gap-4 p-4 rounded-2xl ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
              }`}
            >
              <img
                src={item.image_url}
                alt={item.name}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <span className={`text-sm ${item.is_veg ? 'text-green-500' : 'text-red-500'}`}>
                      {item.is_veg ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}
                    >
                      <FiMinus size={14} />
                    </motion.button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="font-bold text-lg w-8 text-center"
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500 text-white"
                    >
                      <FiPlus size={14} />
                    </motion.button>
                  </div>
                  <span className="text-xl font-bold text-orange-500">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bill Summary */}
      <motion.div
        layout
        className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}
      >
        <h3 className="font-bold text-lg mb-4">Bill Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Item Total</span>
            <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Delivery Fee</span>
            <span className="font-medium text-green-500">FREE</span>
          </div>
          <div className="flex justify-between">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Taxes & Charges</span>
            <span className="font-medium">₹{(cartTotal * 0.05).toFixed(2)}</span>
          </div>
          <div className={`border-t pt-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex justify-between">
              <span className="font-bold text-lg">To Pay</span>
              <span className="font-bold text-2xl text-orange-500">
                ₹{(cartTotal * 1.05).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Link to="/checkout">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30"
          >
            Proceed to Checkout →
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Cart;
