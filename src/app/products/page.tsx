'use client';

import { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { products, categories } from '@/lib/products';

function ProductsContent() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(initCategory);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);

  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'All') result = result.filter(p => p.category === activeCategory);
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [activeCategory, sortBy, priceRange]);

  return (
    <div className="min-h-screen pt-32 pb-24">
      {/* Page header */}
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <span className="text-xs tracking-[0.5em] text-gold uppercase">Handcrafted by Masters</span>
          <h1 className="font-display text-6xl md:text-7xl text-divine mt-4 mb-4">
            Sacred Collection
          </h1>
          <p className="text-muted max-w-xl mx-auto text-sm leading-relaxed">
            Every murti is a universe of devotion — hand-formed over weeks, consecrated with millennia of tradition.
          </p>
          <div className="divine-divider max-w-sm mx-auto mt-8" />
        </motion.div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gold text-black font-medium'
                    : 'border border-gold/20 text-muted hover:border-gold/50 hover:text-gold'
                }`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sort + Filter */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-bg-3 border border-gold/20 text-muted text-xs tracking-wider rounded-full px-4 py-2 cursor-pointer"
            >
              <option value="featured">FEATURED</option>
              <option value="price-asc">PRICE: LOW–HIGH</option>
              <option value="price-desc">PRICE: HIGH–LOW</option>
              <option value="rating">HIGHEST RATED</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider border transition-all duration-300 ${
                showFilters
                  ? 'bg-gold/10 border-gold/40 text-gold'
                  : 'border-gold/20 text-muted hover:text-gold hover:border-gold/40'
              }`}
            >
              {showFilters ? <X size={12} /> : <SlidersHorizontal size={12} />}
              FILTERS
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="glass rounded-2xl p-6 mt-4">
                <h4 className="text-xs tracking-widest text-gold mb-4">PRICE RANGE</h4>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted">₹{priceRange[0].toLocaleString('en-IN')}</span>
                  <input
                    type="range"
                    min={0}
                    max={500000}
                    step={1000}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="flex-1 accent-[#D4AF37]"
                  />
                  <span className="text-sm text-muted">₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Result count */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <span className="text-xs text-muted tracking-widest">
          {filtered.length} {filtered.length === 1 ? 'PIECE' : 'PIECES'} FOUND
        </span>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-muted">No murtis found for this filter.</p>
              <button
                onClick={() => { setActiveCategory('All'); setPriceRange([0, 500000]); }}
                className="mt-4 text-gold text-sm hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeCategory + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
