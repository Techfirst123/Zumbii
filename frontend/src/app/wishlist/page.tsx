'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  Share2,
  Package,
  ArrowLeft,
  X,
  Star,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  seller: string;
  inStock: boolean;
  slug: string;
  addedAt: string;
}

const initialWishlist: WishlistItem[] = [
  {
    id: 'w1',
    name: 'Premium Wireless Headphones Pro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    price: 2499,
    originalPrice: 3999,
    rating: 4.8,
    reviewCount: 234,
    seller: 'TechGadgets India',
    inStock: true,
    slug: 'premium-wireless-headphones',
    addedAt: '2026-06-25',
  },
  {
    id: 'w2',
    name: 'Smart Watch Ultra X2',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    price: 5999,
    originalPrice: 8999,
    rating: 4.6,
    reviewCount: 189,
    seller: 'WearableTech',
    inStock: true,
    slug: 'smart-watch-ultra',
    addedAt: '2026-06-24',
  },
  {
    id: 'w3',
    name: 'Handcrafted Ceramic Dinner Set',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80',
    price: 3499,
    originalPrice: 4999,
    rating: 4.9,
    reviewCount: 178,
    seller: 'ArtisanCraft',
    inStock: true,
    slug: 'ceramic-dinner-set',
    addedAt: '2026-06-23',
  },
  {
    id: 'w4',
    name: '4K Action Camera HDR',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80',
    price: 12999,
    originalPrice: 17999,
    rating: 4.7,
    reviewCount: 145,
    seller: 'GadgetPro',
    inStock: false,
    slug: '4k-action-camera',
    addedAt: '2026-06-22',
  },
  {
    id: 'w5',
    name: 'Ergonomic Office Chair',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
    price: 8999,
    originalPrice: 12999,
    rating: 4.3,
    reviewCount: 89,
    seller: 'FurnitureHub',
    inStock: true,
    slug: 'ergonomic-office-chair',
    addedAt: '2026-06-21',
  },
  {
    id: 'w6',
    name: 'Noise Cancelling Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f11?w=400&q=80',
    price: 4999,
    originalPrice: 7999,
    rating: 4.8,
    reviewCount: 456,
    seller: 'AudioPro',
    inStock: true,
    slug: 'noise-cancelling-earbuds',
    addedAt: '2026-06-20',
  },
  {
    id: 'w7',
    name: 'Leather Laptop Bag Premium',
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80',
    price: 3999,
    originalPrice: 5999,
    rating: 4.5,
    reviewCount: 345,
    seller: 'LeatherCraft',
    inStock: true,
    slug: 'leather-laptop-bag',
    addedAt: '2026-06-19',
  },
  {
    id: 'w8',
    name: 'Running Shoes Ultra Comfort',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    price: 4999,
    originalPrice: 7999,
    rating: 4.7,
    reviewCount: 678,
    seller: 'Sportify',
    inStock: true,
    slug: 'running-shoes-ultra',
    addedAt: '2026-06-18',
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const handleRemove = (id: string, name: string) => {
    setRemovingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      setRemovingIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      toast.success(`${name} removed from wishlist`);
    }, 300);
  };

  const handleMoveToCart = (item: WishlistItem) => {
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
    toast.success(`${item.name} moved to cart`);
  };

  const handleShareWishlist = async () => {
    const url = `${window.location.origin}/wishlist/shared`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Wishlist link copied!');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-gradient-to-b from-zumbii-50 to-surface pt-6 pb-8 lg:pt-10 lg:pb-12">
        <div className="section-padding">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/marketplace"
                className="flex items-center gap-1.5 text-sm text-text-tertiary hover:text-zumbii-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Marketplace
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-zumbii-600" />
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">My Wishlist</h1>
                  <p className="text-sm text-text-tertiary mt-0.5">{wishlist.length} items saved</p>
                </div>
              </div>
              {wishlist.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShareWishlist}>
                    <Share2 className="w-4 h-4" />
                    Share Wishlist
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setWishlist([]);
                      toast.success('Wishlist cleared');
                    }}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-rose-50 flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-rose-300" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Your wishlist is empty</h2>
            <p className="text-text-tertiary mb-8 max-w-md mx-auto">
              Save your favorite items here and come back to them later. Start exploring our collection!
            </p>
            <Link href="/marketplace">
              <Button size="lg">
                <Package className="w-5 h-5" />
                Explore Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-text-tertiary">
                <span className="font-medium text-text-primary">{wishlist.length}</span> items in your wishlist
              </p>
              <div className="flex items-center gap-2 text-sm text-text-tertiary">
                <span>Sort by:</span>
                <select className="text-sm bg-transparent border border-border rounded-lg px-2 py-1 text-text-primary focus:outline-none focus:border-zumbii-400">
                  <option>Recently Added</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating</option>
                </select>
              </div>
            </div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={fadeIn}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className={clsx(
                      'group relative bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                      removingIds.has(item.id) && 'opacity-40 scale-95'
                    )}
                  >
                    <Link href={`/product/${item.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {!item.inStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="danger">Out of Stock</Badge>
                          </div>
                        )}
                        {item.originalPrice && item.originalPrice > item.price && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="sale" size="sm">
                              {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(item.id, item.name);
                        }}
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4 text-text-secondary hover:text-red-500" />
                      </button>
                    </div>

                    <div className="p-4">
                      <p className="text-[11px] text-text-tertiary truncate">{item.seller}</p>
                      <Link href={`/product/${item.slug}`}>
                        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 hover:text-zumbii-600 transition-colors mt-0.5">
                          {item.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-medium text-text-primary">{item.rating}</span>
                        <span className="text-[11px] text-text-tertiary">({item.reviewCount})</span>
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-base font-bold text-text-primary">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-text-tertiary line-through">
                            ₹{item.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.inStock}
                        className={clsx(
                          'w-full mt-3 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                          item.inStock
                            ? 'bg-zumbii-600 text-white hover:bg-zumbii-700 shadow-sm shadow-zumbii-600/20'
                            : 'bg-surface-tertiary text-text-tertiary cursor-not-allowed'
                        )}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}

        {wishlist.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-zumbii-50 to-rose-50 border border-zumbii-100">
            <div className="flex items-center gap-3">
              <Share2 className="w-5 h-5 text-zumbii-600" />
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Share your wishlist</h3>
                <p className="text-xs text-text-tertiary">Let friends and family know what you&apos;re looking for</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-white rounded-lg border border-border text-xs text-text-tertiary">
                <Copy className="w-3 h-3" />
                {typeof window !== 'undefined' ? `${window.location.origin}/wishlist/shared` : ''}
              </div>
              <Button size="sm" onClick={handleShareWishlist}>
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
