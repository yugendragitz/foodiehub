import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiMapPin, FiUser, FiPhone, FiCreditCard } from 'react-icons/fi';
import { AppContext } from '../App';
import { createOrder } from '../api';

const Checkout = () => {
  const { cart, cartTotal, darkMode, clearCart, setLastOrder } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'cod'
  });

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderItems = cart.map(i => ({ id: i.id, quantity: i.quantity }));
      const res = await createOrder(orderItems, 'manual', form.address);

      if (res.data.success) {
        setLastOrder({
          ...res.data.data,
          customer: form,
          cartItems: cart
        });
        clearCart();
        navigate('/confirmation');
      }
    } catch (err) {
      console.error('Order failed:', err);
      alert('Failed to place order. Make sure the backend server is running.');
    }

    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold mb-3">Cart is empty</h2>
        <Link to="/menu" className="text-orange-500 font-semibold hover:underline">Go to Menu</Link>
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
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart">
          <motion.button whileTap={{ scale: 0.9 }} className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <FiArrowLeft size={20} />
          </motion.button>
        </Link>
        <h1 className="text-3xl font-bold">
          <span className="text-orange-500">Checkout</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}>
            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>

            <div className="space-y-4">
              <div>
                <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FiUser className="inline mr-1" /> Full Name
                </label>
                <input
                  data-testid="checkout-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                    darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-100 border border-gray-200'
                  } focus:border-orange-500`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FiPhone className="inline mr-1" /> Phone Number
                </label>
                <input
                  data-testid="checkout-phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  type="tel"
                  placeholder="Enter phone number"
                  className={`w-full px-4 py-3 rounded-xl outline-none text-sm ${
                    darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-100 border border-gray-200'
                  } focus:border-orange-500`}
                />
              </div>

              <div>
                <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FiMapPin className="inline mr-1" /> Delivery Address
                </label>
                <textarea
                  data-testid="checkout-address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Enter full delivery address"
                  className={`w-full px-4 py-3 rounded-xl outline-none text-sm resize-none ${
                    darkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-100 border border-gray-200'
                  } focus:border-orange-500`}
                />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}>
            <h3 className="font-bold text-lg mb-4">
              <FiCreditCard className="inline mr-2" />Payment Method
            </h3>
            <div className="space-y-3">
              {[
                { value: 'cod', label: '💵 Cash on Delivery', desc: 'Pay when you receive' },
                { value: 'upi', label: '📱 UPI Payment', desc: 'Google Pay, PhonePe, etc.' },
                { value: 'card', label: '💳 Credit/Debit Card', desc: 'Visa, Mastercard, etc.' }
              ].map(method => (
                <label
                  key={method.value}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                    form.payment === method.value
                      ? 'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-500'
                      : darkMode ? 'bg-gray-700/50 border-2 border-transparent' : 'bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={form.payment === method.value}
                    onChange={handleChange}
                    className="accent-orange-500"
                  />
                  <div>
                    <div className="font-medium text-sm">{method.label}</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{method.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <motion.button
            data-testid="place-order-btn"
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-orange-500/30 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Placing Order...
              </span>
            ) : (
              `Place Order — ₹${(cartTotal * 1.05).toFixed(2)}`
            )}
          </motion.button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className={`p-6 rounded-2xl sticky top-24 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-lg'}`}>
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>x{item.quantity}</p>
                  </div>
                  <span className="font-bold text-sm text-orange-500">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className={`border-t mt-4 pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between text-sm mb-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Subtotal</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Tax (5%)</span>
                <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span className="text-orange-500">₹{(cartTotal * 1.05).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
