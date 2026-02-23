import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { AppContext } from '../App';
import { getMenu, getCategories } from '../api';
import MenuCard from '../components/MenuCard';
import SkeletonCard from '../components/SkeletonCard';

const Menu = () => {
  const { darkMode } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategoriesList] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [vegOnly, setVegOnly] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.data.success) setCategoriesList(res.data.data);
      } catch {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await getMenu(activeCategory === 'All' ? null : activeCategory);
        if (res.data.success) setItems(res.data.data);
      } catch (err) {
        console.error('Error fetching menu:', err);
      }
      setLoading(false);
    };
    fetchMenu();
  }, [activeCategory]);

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                          item.description.toLowerCase().includes(search.toLowerCase());
    const matchesVeg = vegOnly ? item.is_veg : true;
    return matchesSearch && matchesVeg;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Our <span className="text-orange-500">Menu</span>
        </h1>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Explore our delicious collection of dishes
        </p>
      </motion.div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-8"
      >
        <div className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl ${
          darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-md'
        }`}>
          <FiSearch className="text-gray-400" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for dishes..."
            className={`flex-1 outline-none text-sm bg-transparent ${
              darkMode ? 'text-white placeholder-gray-500' : 'placeholder-gray-400'
            }`}
          />
        </div>

        <button
          onClick={() => setVegOnly(!vegOnly)}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-colors ${
            vegOnly
              ? 'bg-green-500 text-white'
              : darkMode ? 'bg-gray-800 text-gray-300 border border-gray-700' : 'bg-white text-gray-600 shadow-md'
          }`}
        >
          <FiFilter size={16} />
          {vegOnly ? '🟢 Veg Only' : 'Veg Filter'}
        </button>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide"
      >
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                  : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-5xl mb-4">🍽️</p>
            <p className="text-lg font-semibold">No dishes found</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Try a different search or category
            </p>
          </div>
        ) : (
          filtered.map(item => <MenuCard key={item.id} item={item} />)
        )}
      </div>
    </motion.div>
  );
};

export default Menu;
