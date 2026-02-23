import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiPackage, FiCalendar, FiClock } from 'react-icons/fi';
import { AppContext } from '../App';
import { getRecentOrders } from '../api';

const OrderHistory = () => {
  const { darkMode } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getRecentOrders();
        if (res.data.success) setOrders(res.data.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
              <div className="skeleton h-5 w-40 mb-4" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-8"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-8"
      >
        Order <span className="text-orange-500">History</span>
      </motion.h1>

      {orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <FiPackage size={64} className="mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-bold mb-2">No orders yet</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Start ordering to see your history here
          </p>
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-3 bg-orange-500 text-white rounded-xl font-semibold"
            >
              Browse Menu
            </motion.button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.id}</h3>
                  <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock size={14} />
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'confirmed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    via {order.order_type}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.items?.map(item => (
                  <div key={item.id} className={`flex items-center gap-3 p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                  }`}>
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-orange-500">
                      ₹{(item.item_price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className={`flex justify-between items-center pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <span className="font-medium">Total</span>
                <span className="text-xl font-bold text-orange-500">
                  ₹{order.total_amount?.toFixed(2)}
                </span>
              </div>
            </motion.div>
          ))}

          <p className={`text-center text-sm py-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Showing last 3 orders
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default OrderHistory;
