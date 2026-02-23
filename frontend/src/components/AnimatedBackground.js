import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../App';

const AnimatedBackground = () => {
  const { darkMode } = useContext(AppContext);

  // Floating food emojis
  const floatingItems = [
    { emoji: '🍕', x: '5%', y: '10%', size: 32, duration: 18, delay: 0 },
    { emoji: '🍔', x: '85%', y: '15%', size: 28, duration: 22, delay: 2 },
    { emoji: '🍜', x: '15%', y: '70%', size: 26, duration: 20, delay: 4 },
    { emoji: '🥤', x: '90%', y: '60%', size: 24, duration: 16, delay: 1 },
    { emoji: '🍰', x: '50%', y: '5%', size: 30, duration: 24, delay: 3 },
    { emoji: '🍗', x: '75%', y: '80%', size: 26, duration: 19, delay: 5 },
    { emoji: '🌮', x: '30%', y: '85%', size: 28, duration: 21, delay: 2 },
    { emoji: '🍩', x: '60%', y: '45%', size: 22, duration: 17, delay: 6 },
    { emoji: '🧁', x: '10%', y: '40%', size: 24, duration: 23, delay: 1 },
    { emoji: '🥗', x: '95%', y: '35%', size: 26, duration: 20, delay: 4 },
  ];

  // Glowing orbs
  const orbs = [
    { color: darkMode ? 'bg-orange-500/8' : 'bg-orange-400/10', w: 300, h: 300, x: '-5%', y: '10%', duration: 25 },
    { color: darkMode ? 'bg-red-500/6' : 'bg-red-400/8', w: 250, h: 250, x: '80%', y: '60%', duration: 30 },
    { color: darkMode ? 'bg-yellow-500/5' : 'bg-yellow-400/8', w: 350, h: 350, x: '40%', y: '70%', duration: 28 },
    { color: darkMode ? 'bg-purple-500/5' : 'bg-purple-400/6', w: 200, h: 200, x: '70%', y: '5%', duration: 22 },
    { color: darkMode ? 'bg-cyan-500/4' : 'bg-cyan-400/6', w: 280, h: 280, x: '20%', y: '30%', duration: 26 },
  ];

  // Sparkle particles
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient mesh background */}
      <div className={`absolute inset-0 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900' 
          : 'bg-gradient-to-br from-orange-50/50 via-white to-red-50/30'
      }`} />

      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: darkMode
            ? [
                'radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.06) 0%, transparent 50%)',
                'radial-gradient(ellipse at 80% 50%, rgba(239,68,68,0.06) 0%, transparent 50%)',
                'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.06) 0%, transparent 50%)',
                'radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.06) 0%, transparent 50%)',
              ]
            : [
                'radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.08) 0%, transparent 50%)',
                'radial-gradient(ellipse at 80% 50%, rgba(239,68,68,0.08) 0%, transparent 50%)',
                'radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.06) 0%, transparent 50%)',
                'radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.08) 0%, transparent 50%)',
              ],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0"
      />

      {/* Floating glowing orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={`orb-${i}`}
          className={`absolute rounded-full ${orb.color} blur-3xl`}
          style={{ width: orb.w, height: orb.h, left: orb.x, top: orb.y }}
          animate={{
            x: [0, 60, -40, 30, 0],
            y: [0, -50, 30, -20, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating food emojis */}
      {floatingItems.map((item, i) => (
        <motion.div
          key={`food-${i}`}
          className="absolute select-none"
          style={{
            left: item.x,
            top: item.y,
            fontSize: item.size,
            opacity: darkMode ? 0.12 : 0.15,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            rotate: [0, 15, -10, 5, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            delay: item.delay,
            ease: 'easeInOut',
          }}
        >
          {item.emoji}
        </motion.div>
      ))}

      {/* Sparkle particles */}
      {sparkles.map((s) => (
        <motion.div
          key={`sparkle-${s.id}`}
          className={`absolute rounded-full ${darkMode ? 'bg-orange-400' : 'bg-orange-300'}`}
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Diagonal lines pattern */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: darkMode ? 0.02 : 0.03 }}>
        <defs>
          <pattern id="diag" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke={darkMode ? '#f97316' : '#ea580c'} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>
    </div>
  );
};

export default AnimatedBackground;
