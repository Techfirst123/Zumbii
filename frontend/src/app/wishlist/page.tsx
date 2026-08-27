'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package, ArrowLeft, X, Star, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuthGuard } from '@/hooks/useRequireAuth';
import { useCartStore } from '@/store/cartStore';
import { wishlistApi, resolveImageUrl, ApiError, type BackendWishlistItem } from '@/lib/api';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function WishlistPage() {
  const { ready: authReady, authenticated } = useAuthGuard();
  const addItem = useCartStore((s) => s.addItem);

  const [items, setItems] = useState<BackendWishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    setLoading(true);
    wishlistApi
      .list()
      .then((res) => {
        if (!cancelled) setItems(res);
      })
      .catch((err) => {
        if (!cancelled) toast.error(err instanceof ApiError ? err.message : 'Failed to load wishlist');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  function withBusy(productId: string, busy: boolean) {
    setBusyIds((prev) => {
      const next = new Set(prev);
      if (busy) next.add(productId);
      else next.delete(productId);
      return next;
    });
  }

  async function handleRemove(item: BackendWishlistItem) {
    withBusy(item.productId, true);
    try {
      await wishlistApi.remove(item.productId);
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
      toast.success(`${item.product.name} removed from wishlist`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to remove item');
    } finally {
      withBusy(item.productId, false);
    }
  }

  async function handleMoveToCart(item: BackendWishlistItem) {
    withBusy(item.productId, true);
    try {
      await wishlistApi.remove(item.productId);
      addItem({
        productId: item.productId,
        slug: item.product.slug,
        name: item.product.name,
        image: resolveImageUrl(item.product.images[0]),
        price: Number(item.product.price),
        gstRate: item.product.gstRate,
        quantity: 1,
        maxQuantity: 99,
        seller: item.product.seller || '',
      });
      setItems((prev) => prev.filter((i) => i.productId !== item.productId));
      toast.success(`${item.product.name} moved to cart`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to move item to cart');
    } finally {
      withBusy(item.productId, false);
    }
  }

  async function handleClearAll() {
    setClearing(true);
    const results = await Promise.allSettled(items.map((item) => wishlistApi.remove(item.productId)));
    const failed = results.filter((r) => r.status === 'rejected').length;
    setItems((prev) => prev.filter((_, idx) => results[idx]?.status !== 'fulfilled'));
    setClearing(false);
    if (failed > 0) {
      toast.error(`Removed some items, but ${failed} failed`);
    } else {
      toast.success('Wishlist cleared');
    }
  }

  if (!authReady || !authenticated) {
    return <div className="min-h-screen bg-surface" />;
  }

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
                  <p className="text-sm text-text-tertiary mt-0.5">{items.length} items saved</p>
                </div>
              </div>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAll}
                  loading={clearing}
                  disabled={clearing}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-text-tertiary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
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
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => {
                const price = Number(item.product.price);
                const comparePrice = item.product.comparePrice ? Number(item.product.comparePrice) : null;
                const busy = busyIds.has(item.productId);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    variants={fadeIn}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className={clsx(
                      'group relative bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                      busy && 'opacity-40 pointer-events-none'
                    )}
                  >
                    <Link href={`/product/${item.product.slug}`}>
                      <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
                        <Image
                          src={resolveImageUrl(item.product.images[0])}
                          alt={item.product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                        {!item.product.inStock && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Badge variant="danger">Out of Stock</Badge>
                          </div>
                        )}
                        {comparePrice && comparePrice > price && (
                          <div className="absolute top-3 left-3">
                            <Badge variant="sale" size="sm">
                              {Math.round(((comparePrice - price) / comparePrice) * 100)}% OFF
                            </Badge>
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(item);
                        }}
                        disabled={busy}
                        className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <X className="w-4 h-4 text-text-secondary hover:text-red-500" />
                      </button>
                    </div>

                    <div className="p-4">
                      {item.product.seller && (
                        <p className="text-[11px] text-text-tertiary truncate">{item.product.seller}</p>
                      )}
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="text-sm font-semibold text-text-primary leading-snug line-clamp-2 hover:text-zumbii-600 transition-colors mt-0.5">
                          {item.product.name}
                        </h3>
                      </Link>
                      {item.product.reviewCount > 0 && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-medium text-text-primary">{item.product.rating}</span>
                          <span className="text-[11px] text-text-tertiary">({item.product.reviewCount})</span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-base font-bold text-text-primary">
                          ₹{price.toLocaleString('en-IN')}
                        </span>
                        {comparePrice && comparePrice > price && (
                          <span className="text-xs text-text-tertiary line-through">
                            ₹{comparePrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={!item.product.inStock || busy}
                        className={clsx(
                          'w-full mt-3 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all',
                          item.product.inStock
                            ? 'bg-zumbii-600 text-white hover:bg-zumbii-700 shadow-sm shadow-zumbii-600/20'
                            : 'bg-surface-tertiary text-text-tertiary cursor-not-allowed'
                        )}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {item.product.inStock ? 'Move to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default WishlistPage;
