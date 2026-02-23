import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiCpu } from 'react-icons/fi';
import { AppContext } from '../App';
import { sendChatMessage, createOrder } from '../api';

const Chatbot = () => {
  const { addToCart, removeFromCart, clearCart, cart, darkMode, chatbotOpen, setChatbotOpen, setLastOrder } = useContext(AppContext);
  const navigate = useNavigate();
  const isOpen = chatbotOpen;
  const setIsOpen = setChatbotOpen;
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hello! 👋 I'm FoodieBot! I can help you order food.\n\nTry saying:\n• \"Order 2 veg burgers and one coke\"\n• \"Show menu\"\n• \"Place order\"",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Checkout flow state
  const [checkoutFlow, setCheckoutFlow] = useState(null);
  // checkoutFlow = { step: 'name' | 'phone' | 'address' | 'payment' | 'confirm', data: {} }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addBotMsg = (text, delay = 600) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { sender: 'bot', text, time: now() }]);
        resolve();
      }, delay);
    });
  };

  const startCheckoutFlow = () => {
    setCheckoutFlow({ step: 'name', data: {} });
    setIsTyping(true);
    const cartSummary = cart.map(i => `  • ${i.quantity}x ${i.name} — ₹${(i.price * i.quantity).toFixed(0)}`).join('\n');
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    addBotMsg(
      `🛒 Your order summary:\n\n${cartSummary}\n\n💰 Total: ₹${total.toFixed(2)}\n\nLet's get your details to place the order!\n\n👤 What's your name?`
    );
  };

  const handleCheckoutStep = async (msg) => {
    const { step, data } = checkoutFlow;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: msg, time: now() }]);
    setInput('');
    setIsTyping(true);

    if (step === 'name') {
      const name = msg.trim();
      if (name.length < 2) {
        await addBotMsg("Please enter a valid name (at least 2 characters).\n\n👤 What's your name?");
        return;
      }
      setCheckoutFlow({ step: 'phone', data: { ...data, name } });
      await addBotMsg(`Nice to meet you, ${name}! 😊\n\n📱 What's your phone number?`);

    } else if (step === 'phone') {
      const phone = msg.replace(/\s/g, '');
      if (!/^\d{10,}$/.test(phone)) {
        await addBotMsg("Please enter a valid 10-digit phone number.\n\n📱 Your phone number?");
        return;
      }
      setCheckoutFlow({ step: 'address', data: { ...data, phone } });
      await addBotMsg("📍 What's your delivery address?");

    } else if (step === 'address') {
      const address = msg.trim();
      if (address.length < 5) {
        await addBotMsg("Please enter a complete delivery address.\n\n📍 Your delivery address?");
        return;
      }
      setCheckoutFlow({ step: 'payment', data: { ...data, address } });
      await addBotMsg(
        "💳 Choose payment method:\n\n" +
        "1️⃣ Cash on Delivery\n" +
        "2️⃣ UPI / GPay\n" +
        "3️⃣ Credit/Debit Card\n\n" +
        "Just type 1, 2, or 3"
      );

    } else if (step === 'payment') {
      const paymentMap = {
        '1': 'Cash on Delivery', 'cod': 'Cash on Delivery', 'cash': 'Cash on Delivery',
        '2': 'UPI / GPay', 'upi': 'UPI / GPay', 'gpay': 'UPI / GPay',
        '3': 'Credit/Debit Card', 'card': 'Credit/Debit Card', 'credit': 'Credit/Debit Card', 'debit': 'Credit/Debit Card'
      };
      const payment = paymentMap[msg.trim().toLowerCase()];
      if (!payment) {
        await addBotMsg("Please type 1, 2, or 3 to choose a payment method.\n\n1️⃣ Cash on Delivery\n2️⃣ UPI / GPay\n3️⃣ Credit/Debit Card");
        return;
      }
      const fullData = { ...data, payment };
      setCheckoutFlow({ step: 'confirm', data: fullData });
      const cartSummary = cart.map(i => `  • ${i.quantity}x ${i.name} — ₹${(i.price * i.quantity).toFixed(0)}`).join('\n');
      const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
      await addBotMsg(
        `📋 Order Confirmation:\n\n` +
        `${cartSummary}\n\n` +
        `💰 Total: ₹${total.toFixed(2)}\n\n` +
        `👤 Name: ${fullData.name}\n` +
        `📱 Phone: ${fullData.phone}\n` +
        `📍 Address: ${fullData.address}\n` +
        `💳 Payment: ${fullData.payment}\n\n` +
        `Type "yes" to confirm or "no" to cancel`
      );

    } else if (step === 'confirm') {
      const answer = msg.trim().toLowerCase();
      if (answer === 'yes' || answer === 'y' || answer === 'confirm') {
        try {
          const orderItems = cart.map(i => ({ id: i.id, quantity: i.quantity }));
          const res = await createOrder(orderItems, 'ai_chatbot', data.address);
          const orderData = res.data.data;

          setLastOrder({
            id: orderData.order_id,
            items: cart,
            total: orderData.total_amount,
            customerName: data.name,
            phone: data.phone,
            address: data.address,
            payment: data.payment,
            createdAt: orderData.created_at
          });

          clearCart();
          setCheckoutFlow(null);
          await addBotMsg(
            `🎉 Order Placed Successfully!\n\n` +
            `📦 Order #${orderData.order_id}\n` +
            `💰 Total: ₹${orderData.total_amount.toFixed(2)}\n` +
            `📍 Delivering to: ${data.address}\n` +
            `💳 Payment: ${data.payment}\n\n` +
            `⏱️ Estimated delivery: 25-35 mins\n\n` +
            `Thank you, ${data.name}! Enjoy your meal! 🍽️`
          );

          // Navigate to confirmation page after a short delay
          setTimeout(() => {
            navigate('/confirmation');
          }, 2000);

        } catch (err) {
          setCheckoutFlow(null);
          await addBotMsg("❌ Oops! Something went wrong placing your order. Please try again.");
        }
      } else if (answer === 'no' || answer === 'n' || answer === 'cancel') {
        setCheckoutFlow(null);
        await addBotMsg("❌ Order cancelled. Your items are still in your cart.\n\nSay \"place order\" when you're ready!");
      } else {
        await addBotMsg("Please type \"yes\" to confirm or \"no\" to cancel.");
      }
    }
  };

  const handleSend = async () => {
    const msg = input.trim();
    if (!msg) return;

    // If we're in checkout flow, handle that instead
    if (checkoutFlow) {
      handleCheckoutStep(msg);
      return;
    }

    // Add user message
    const userMsg = {
      sender: 'user',
      text: msg,
      time: now()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendChatMessage(msg);
      const data = response.data.data;

      // Process actions
      if (data.action === 'add_to_cart' && data.items) {
        data.items.forEach(item => {
          addToCart({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: '',
            is_veg: true
          });
        });
      } else if (data.action === 'remove_from_cart' && data.items) {
        data.items.forEach(item => removeFromCart(item.id));
      } else if (data.action === 'clear_cart') {
        clearCart();
      } else if (data.action === 'view_cart') {
        if (cart.length > 0) {
          const cartSummary = cart.map(i => `• ${i.quantity}x ${i.name} - ₹${i.price * i.quantity}`).join('\n');
          data.message += `\n\n${cartSummary}\n\nTotal: ₹${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}`;
        } else {
          data.message += "\n\nYour cart is empty. Start ordering!";
        }
      } else if (data.action === 'place_order') {
        if (cart.length > 0) {
          // Start the automated checkout flow
          await addBotMsg(data.message, 400);
          startCheckoutFlow();
          return;
        } else {
          data.message = "🛒 Your cart is empty! Add some items first.\n\nTry: \"Order 2 burgers and a coke\"";
        }
      }

      setTimeout(() => {
        setIsTyping(false);
        const botMsg = {
          sender: 'bot',
          text: data.message,
          time: now(),
          suggestions: data.suggestions
        };
        setMessages(prev => [...prev, botMsg]);
      }, 800);

    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Oops! Something went wrong. Please make sure the server is running and try again.",
        time: now()
      }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestionClick = (item) => {
    setInput(`Order 1 ${item.name}`);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center z-40"
          >
            <FiMessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: 'spring', damping: 25 }}
            className={`fixed bottom-6 right-6 w-[380px] h-[550px] rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden ${
              darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FiCpu size={20} />
                </div>
                <div>
                  <h3 className="font-bold">FoodieBot</h3>
                  <p className="text-xs text-orange-100">AI Ordering Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-lg">
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.sender === 'user' ? 'order-1' : 'order-2'}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-orange-500 text-white rounded-br-md'
                          : darkMode
                            ? 'bg-gray-700 text-gray-100 rounded-bl-md'
                            : 'bg-white text-gray-800 shadow-sm rounded-bl-md'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {/* Suggestions */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestionClick(s)}
                            className="text-xs px-3 py-1 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <span className={`text-[10px] mt-1 block ${
                      msg.sender === 'user' ? 'text-right' : 'text-left'
                    } ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className={`px-4 py-3 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-white shadow-sm'}`}>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-3 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your order..."
                  className={`flex-1 px-4 py-3 rounded-xl text-sm outline-none ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <FiSend size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
