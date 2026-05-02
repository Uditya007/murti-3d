'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Search, Heart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Collection' },
    { href: '/products?category=Bronze', label: 'Bronze' },
    { href: '/products?category=Marble', label: 'Marble' },
    { href: '/about', label: 'Our Craft' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 backdrop-blur-xl bg-black/80 border-b border-gold/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)]'
            : 'py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-start group">
            <span className="font-display text-base md:text-lg tracking-[0.2em] md:tracking-[0.3em] text-gold leading-none shimmer whitespace-nowrap">
              JAIPUR MURTI
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.4em] md:tracking-[0.5em] text-muted uppercase mt-0.5 whitespace-nowrap">
              Sacred Murtis
            </span>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="relative text-sm tracking-widest text-divine/70 hover:text-gold transition-colors duration-300 font-light group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold-gradient group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <button className="p-1 md:p-2 text-divine/60 hover:text-gold transition-colors duration-200">
              <Search className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
            <button className="p-1 md:p-2 text-divine/60 hover:text-gold transition-colors duration-200">
              <Heart className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
            <Link href="/auth" className="p-1 md:p-2 text-divine/60 hover:text-gold transition-colors duration-200">
              <User className="w-4 h-4 md:w-[18px] md:h-[18px]" />
            </Link>
            <Link href="/cart" className="relative p-1 md:p-2 text-divine/60 hover:text-gold transition-colors duration-200">
              <ShoppingCart className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 md:w-4 md:h-4 bg-gold text-black text-[8px] md:text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button
              className="md:hidden p-1 text-divine/60 hover:text-gold transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="font-display text-4xl text-divine/80 hover:text-gold transition-colors tracking-widest"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
