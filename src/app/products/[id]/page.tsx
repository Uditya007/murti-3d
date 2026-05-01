'use client';

import { useState, useRef } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  ShoppingCart, Heart, Star, ChevronRight,
  Check, Shield, Truck, Award, RotateCcw, Minus, Plus, ArrowLeft, ZoomIn
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ui/ProductCard';

const ProductDetailScene = dynamic(
  () => import('@/components/three/Scenes').then(m => ({ default: m.ProductDetailScene })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    ),
  }
);

interface Props {
  params: { id: string };
}

export default function ProductDetailPage({ params }: Props) {
  const product = products.find(p => p.id === params.id);
  if (!product) notFound();

  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<'description' | 'features' | 'care'>('description');
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [view, setView] = useState<'photo' | '3d'>('photo');
  const [zoomed, setZoomed] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const related = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const hasImage = product.images?.length > 0 && product.images[0] && !imgError;

  return (
    <div className="min-h-screen pt-24 pb-24">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-2 text-xs text-muted tracking-wider">
          <Link href="/" className="hover:text-gold transition-colors">HOME</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-gold transition-colors">COLLECTION</Link>
          <ChevronRight size={10} />
          <span className="text-gold">{product.name.toUpperCase()}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT: Image / 3D Viewer ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* View toggle */}
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => setView('photo')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
                  view === 'photo'
                    ? 'bg-gold text-black font-medium'
                    : 'border border-gold/20 text-muted hover:text-gold'
                }`}
              >
                <ZoomIn size={12} /> PHOTO
              </button>
              <button
                onClick={() => setView('3d')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-widest transition-all duration-300 ${
                  view === '3d'
                    ? 'bg-gold text-black font-medium'
                    : 'border border-gold/20 text-muted hover:text-gold'
                }`}
              >
                <RotateCcw size={12} /> 3D VIEW
              </button>
            </div>

            {/* Main viewer */}
            <AnimatePresence mode="wait">
              {view === 'photo' ? (
                <motion.div
                  key="photo"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-3xl overflow-hidden divine-border cursor-zoom-in h-[400px] lg:h-[560px]"
                  style={{
                    background: 'radial-gradient(ellipse at center, #1a1008 0%, #050505 80%)',
                  }}
                  onClick={() => setZoomed(!zoomed)}
                >
                  {hasImage ? (
                    <>
                      <motion.div
                        animate={zoomed ? { scale: 1.5 } : { scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={product.images[activeImg] || product.images[0]}
                          alt={product.name}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-contain p-4"
                          priority
                          onError={() => setImgError(true)}
                        />
                      </motion.div>

                      {/* Gradient footer for text */}
                      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 to-transparent z-10" />

                      {/* Divine glow overlay */}
                      <div
                        className="absolute inset-0 z-10 pointer-events-none"
                        style={{
                          boxShadow: 'inset 0 0 60px rgba(212,175,55,0.08)',
                          background: 'radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.04) 0%, transparent 70%)',
                        }}
                      />
                    </>
                  ) : (
                    /* Placeholder */
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-9xl" style={{ filter: 'drop-shadow(0 0 30px rgba(212,175,55,0.5))' }}>🕉️</div>
                      <div className="absolute inset-0 bg-divine-radial opacity-30" />
                    </div>
                  )}

                  {/* Deity label */}
                  <div className="absolute bottom-0 left-0 right-0 px-6 py-5 z-20">
                    <p className="font-serif text-xl italic text-divine/80">{product.deity}</p>
                    <p className="text-xs tracking-[0.4em] text-gold/60 mt-1">{product.origin}</p>
                  </div>

                  {/* Zoom hint */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="text-[9px] tracking-widest text-white/40 backdrop-blur-sm bg-black/30 px-2 py-1 rounded-full">
                      {zoomed ? 'CLICK TO ZOOM OUT' : 'CLICK TO ZOOM'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-3xl overflow-hidden divine-border h-[400px] lg:h-[560px]"
                  style={{
                    background: 'radial-gradient(ellipse at center, #1a1008 0%, #050505 80%)',
                  }}
                >
                  <ProductDetailScene />

                  <div className="absolute top-5 left-5 flex items-center gap-2 glass rounded-full px-4 py-2 z-10">
                    <RotateCcw size={13} className="text-gold animate-spin-slow" />
                    <span className="text-xs tracking-widest text-gold">360° VIEW</span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 px-6 py-5 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="font-serif text-xl italic text-divine/80">{product.deity}</p>
                    <p className="text-xs tracking-[0.4em] text-gold/60 mt-1">{product.origin}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Thumbnail strip (if multiple images) */}
            {product.images.length > 1 && !imgError && (
              <div className="flex gap-3 mt-4">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImg(i); setView('photo'); setZoomed(false); }}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImg === i && view === 'photo'
                        ? 'border-gold shadow-gold'
                        : 'border-gold/10 hover:border-gold/40'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-contain"
                      sizes="80px"
                      onError={() => setImgError(true)}
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Spec chips */}
            <div className="flex gap-3 mt-4">
              {[
                { label: product.material, icon: '🪙' },
                { label: product.height, icon: '📏' },
                { label: product.weight, icon: '⚖️' },
                { label: product.finish, icon: '✨' },
              ].map((info) => (
                <div key={info.label} className="flex-1 glass rounded-xl px-3 py-3 text-center">
                  <div className="text-lg mb-1">{info.icon}</div>
                  <div className="text-[9px] tracking-wider text-muted leading-tight">{info.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:sticky lg:top-28"
          >
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.badge && (
                <span className={`text-[10px] tracking-widest px-3 py-1 rounded-full ${
                  product.badge === 'Bestseller' ? 'bg-gold text-black' :
                  product.badge === 'Limited Edition' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                  product.badge === 'Customer Favourite' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="text-[10px] tracking-widest px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  {discount}% OFF
                </span>
              )}
              {product.inStock ? (
                <span className="text-[10px] tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <Check size={9} /> IN STOCK
                </span>
              ) : (
                <span className="text-[10px] tracking-widest px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                  SOLD OUT
                </span>
              )}
            </div>

            <h1 className="font-display text-5xl text-divine mb-1">{product.name}</h1>
            <p className="font-serif text-lg italic text-gold/60 mb-6">{product.deity}</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-muted/30'} />
                ))}
              </div>
              <span className="text-sm text-gold font-medium">{product.rating}</span>
              <span className="text-sm text-muted">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 mb-8">
              <span className="font-display text-4xl text-gold">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-muted line-through mb-1">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="divine-divider mb-8" />

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-8">
              <span className="text-xs tracking-widest text-muted">QUANTITY</span>
              <div className="flex items-center gap-0 glass rounded-full overflow-hidden">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2.5 text-muted hover:text-gold transition-colors">
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center text-divine font-medium">{quantity}</span>
                <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2.5 text-muted hover:text-gold transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full text-sm tracking-widest font-medium transition-all duration-300 ${
                  !product.inStock
                    ? 'bg-white/5 text-muted cursor-not-allowed'
                    : added
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-gold text-black hover:bg-gold-light shadow-gold hover:shadow-gold-strong'
                }`}
              >
                <ShoppingCart size={16} />
                {!product.inStock ? 'SOLD OUT' : added ? 'ADDED TO CART ✓' : 'ADD TO CART'}
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border ${
                  wishlisted
                    ? 'bg-gold/10 border-gold/50 text-gold'
                    : 'glass border-gold/20 text-muted hover:text-gold hover:border-gold/40'
                }`}
              >
                <Heart size={18} className={wishlisted ? 'fill-gold' : ''} />
              </button>
            </div>

            {/* Trust Features */}
            <div className="space-y-4 mb-10">
              {[
                { 
                  icon: RotateCcw, 
                  title: 'Easy Returns', 
                  desc: 'Return within 7 days of order delivery. See T&Cs' 
                },
                { 
                  icon: Shield, 
                  title: 'Fully Insured', 
                  desc: 'All orders are fully insured to ensure peace of mind.' 
                },
                { 
                  icon: Award, 
                  title: '100% Handmade', 
                  desc: 'All products are MADE IN INDIA.' 
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4 p-4 glass rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-divine">{title}</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex border-b border-gold/10 mb-6">
                {(['description', 'features', 'care'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-4 py-3 text-xs tracking-widest capitalize transition-all duration-300 border-b-2 -mb-px ${
                      tab === t ? 'border-gold text-gold' : 'border-transparent text-muted hover:text-divine'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  {tab === 'description' && (
                    <p className="text-sm text-muted leading-relaxed">{product.longDescription}</p>
                  )}
                  {tab === 'features' && (
                    <ul className="space-y-3">
                      {product.features.map(f => (
                        <li key={f} className="flex items-start gap-3 text-sm text-muted">
                          <Check size={14} className="text-gold mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  {tab === 'care' && (
                    <div className="space-y-4 text-sm text-muted leading-relaxed">
                      <p>• Dust gently with a dry, soft cloth. Avoid synthetic fabrics.</p>
                      <p>• For bronze: use a drop of mustard oil on a cotton cloth monthly.</p>
                      <p>• For marble: avoid acids or harsh chemicals. Use plain water only.</p>
                      <p>• Store in a cool, dry place when not on display.</p>
                      <p>• During daily puja, avoid direct water spray on the murti's face.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-32">
            <div className="text-center mb-12">
              <span className="text-xs tracking-[0.5em] text-gold uppercase">You May Also Love</span>
              <h2 className="font-display text-4xl text-divine mt-3">Related Murtis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
