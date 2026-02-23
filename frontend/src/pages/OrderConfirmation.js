import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCheck, FiClock, FiPackage } from 'react-icons/fi';
import { AppContext } from '../App';

const OrderConfirmation = () => {
  const { lastOrder, darkMode } = useContext(AppContext);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!lastOrder) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">📦</p>
        <h2 className="text-2xl font-bold mb-3">No recent order</h2>
        <Link to="/menu" className="text-orange-500 font-semibold hover:underline">Go to Menu</Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 sm:px-6 py-12"
    >
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array(30).fill(0).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                y: -20,
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1
              }}
              animate={{
                y: window.innerHeight + 20,
                rotate: Math.random() * 720,
                opacity: 0
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut'
              }}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                backgroundColor: ['#f97316', '#ef4444', '#eab308', '#22c55e', '#3b82f6', '#a855f7'][i % 6]
              }}
            />
          ))}
        </div>
      )}

      {/* Success Animation */}
      <div className="text-center mb-8" data-testid="order-success">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <FiCheck size={48} className="text-green-500" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold mb-2"
        >
          Order Placed! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className={darkMode ? 'text-gray-400' : 'text-gray-500'}
        >
          Your delicious food is on its way!
        </motion.p>
      </div>

      {/* Order Details */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`p-6 rounded-2xl mb-6 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Order #{lastOrder.order_id}</h3>
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-sm font-medium">
            {lastOrder.status}
          </span>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-4 mb-6 py-4">
          {[
            { icon: <FiCheck />, label: 'Confirmed', active: true },
            { icon: <FiPackage />, label: 'Preparing', active: true },
            { icon: <FiClock />, label: 'On the way', active: false },
            { icon: <FiCheck />, label: 'Delivered', active: false }
          ].map((step, i) => (
            <React.Fragment key={step.label}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.active
                    ? 'bg-green-500 text-white'
                    : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.icon}
                </div>
                <span className={`text-xs mt-1 ${step.active ? 'text-green-500 font-medium' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
              {i < 3 && (
                <div className={`flex-1 h-0.5 ${
                  step.active ? 'bg-green-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Items */}
        <div className="space-y-3">
          {lastOrder.cartItems?.map(item => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Qty: {item.quantity}</p>
              </div>
              <span className="font-bold text-sm text-orange-500">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className={`border-t mt-4 pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span className="text-orange-500">₹{lastOrder.total_amount?.toFixed(2)}</span>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="flex gap-4"
      >
        <Link to="/menu" className="flex-1">
          <button className={`w-full py-3 rounded-xl font-semibold border-2 ${
            darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'
          }`}>
            Order More
          </button>
        </Link>
        <Link to="/orders" className="flex-1">
          <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold">
            View Orders
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default OrderConfirmation;
