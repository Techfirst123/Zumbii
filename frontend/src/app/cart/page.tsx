'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowLeft,
  ArrowRight,
  Tag,
  Percent,
  Shield,
  Truck,
  Package,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { PincodeChecker } from '@/components/ui/PincodeChecker';
import { useCartStore } from '@/store/cartStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { productsApi, wishlistApi, couponsApi, ApiError } from '@/lib/api';
import { mapBackendProduct } from '@/lib/adapters';
import { ProductImagePlaceholder, PLACEHOLDER_IMAGE_SENTINEL } from '@/components/product/ProductImagePlaceholder';
import type { Product } from '@/types';

function CartPage() {
  const cartItems = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const savedCouponCode = useCartStore((s) => s.couponCode);
  const setSavedCoupon = useCartStore((s) => s.setCoupon);
  const requireAuth = useRequireAuth();
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    productsApi
      .list({ limit: 4 })
      .then((res) => {
        if (!cancelled) setSuggestedProducts(res.data.map(mapBackendProduct));
      })
      .catch((err) => console.error(err instanceof ApiError ? err.message : err));
    return () => {
      cancelled = true;
    };
  }, []);

  const shipping = cartItems.length > 0 ? 99 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = couponDiscount;
  const total = subtotal + shipping - discount;

  // Re-validate a coupon carried over from a previous visit (subtotal may have
  // changed since — e.g. items removed — so the discount can't just be trusted).
  useEffect(() => {
    if (!savedCouponCode || subtotal <= 0) return;
    let cancelled = false;
    couponsApi
      .validate(savedCouponCode, subtotal)
      .then((res) => {
        if (cancelled) return;
        setAppliedCoupon(res.code);
        setCouponDiscount(res.discountAmount);
      })
      .catch(() => {
        if (!cancelled) setSavedCoupon(null);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedCouponCode, subtotal]);

  const handleQuantityChange = (productId: string, variantId: string | undefined, delta: number) => {
    const item = cartItems.find((i) => i.productId === productId && i.variantId === variantId);
    if (!item) return;
    updateQuantity(productId, item.quantity + delta, variantId);
  };

  const handleRemoveItem = (productId: string, variantId: string | undefined, name: string) => {
    removeItem(productId, variantId);
    toast.success(`${name} removed from cart`);
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setCouponLoading(true);
    try {
      const res = await couponsApi.validate(couponInput, subtotal);
      setAppliedCoupon(res.code);
      setCouponDiscount(res.discountAmount);
      setSavedCoupon(res.code);
      setCouponInput('');
      toast.success(`Coupon applied! ₹${res.discountAmount.toLocaleString('en-IN')} off`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponInput('');
    setSavedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleMoveToWishlist = async (item: { productId: string; variantId?: string; name: string }) => {
    if (!requireAuth()) return;
    try {
      await wishlistApi.add(item.productId);
      removeItem(item.productId, item.variantId);
      toast.success(`${item.name} moved to wishlist`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Failed to move item to wishlist');
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
                Continue Shopping
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-zumbii-600" />
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">Shopping Cart</h1>
              <span className="text-sm text-text-tertiary mt-1">({cartItems.length} items)</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="section-padding py-6 lg:py-8">
        {cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto rounded-3xl bg-surface-tertiary flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-text-tertiary" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Your cart is empty</h2>
            <p className="text-text-tertiary mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added anything yet. Explore our marketplace and find something you love!
            </p>
            <Link href="/marketplace">
              <Button size="lg">
                <Package className="w-5 h-5" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.productId}-${item.variantId ?? ''}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 sm:p-5" hover={false}>
                      <div className="flex gap-4 sm:gap-5">
                        <Link href={`/product/${item.slug}`} className="shrink-0">
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-surface-tertiary">
                            {item.image === PLACEHOLDER_IMAGE_SENTINEL ? (
                              <ProductImagePlaceholder />
                            ) : (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            )}
                          </div>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${item.slug}`}
                                className="text-sm sm:text-base font-semibold text-text-primary hover:text-zumbii-600 transition-colors line-clamp-1"
                              >
                                {item.name}
                              </Link>
                              {item.variantLabel && (
                                <p className="text-xs text-text-secondary mt-0.5">{item.variantLabel}</p>
                              )}
                              <p className="text-xs text-text-tertiary mt-0.5">{item.seller}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-base sm:text-lg font-bold text-text-primary">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 sm:mt-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.variantId, -1)}
                                  disabled={item.quantity <= 1}
                                  className="w-11 h-11 flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5 text-text-secondary" />
                                </button>
                                <span className="w-10 sm:w-12 text-center text-sm font-medium text-text-primary border-x border-border">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.productId, item.variantId, 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="w-11 h-11 flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3.5 h-3.5 text-text-secondary" />
                                </button>
                              </div>
                              <span className="text-[11px] text-text-tertiary">
                                ₹{item.price.toLocaleString('en-IN')} each
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleMoveToWishlist(item)}
                                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-rose-500"
                                aria-label="Move to wishlist"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.productId, item.variantId, item.name)}
                                className="flex h-11 w-11 items-center justify-center rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-red-500"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="glass rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-zumbii-600" />
                  <h3 className="text-sm font-semibold text-text-primary">Apply Coupon</h3>
                </div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-leaf-50 border border-leaf-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-leaf-600" />
                      <span className="text-sm font-medium text-leaf-700">{appliedCoupon}</span>
                      <span className="text-xs text-leaf-600">(₹{couponDiscount.toLocaleString('en-IN')} off)</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-medium text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 h-10 px-4 text-sm bg-surface border border-border rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100"
                    />
                    <Button
                      variant="outline"
                      size="md"
                      onClick={handleApplyCoupon}
                      loading={couponLoading}
                    >
                      Apply
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <Card className="p-5 sm:p-6" hover={false}>
                  <h2 className="text-base font-bold text-text-primary mb-4">Order Summary</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Subtotal</span>
                      <span className="text-text-primary font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Truck className="w-3.5 h-3.5" />
                        Shipping
                      </div>
                      <span className="text-text-primary font-medium">
                        {shipping === 0 ? (
                          <span className="text-leaf-600">Free</span>
                        ) : (
                          `₹${shipping.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-leaf-600">
                          <Percent className="w-3.5 h-3.5" />
                          Discount {appliedCoupon ? `(${appliedCoupon})` : ''}
                        </div>
                        <span className="text-leaf-600 font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <hr className="border-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-text-primary">Total</span>
                      <span className="text-lg font-bold text-zumbii-600">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-text-tertiary text-right">Inclusive of all taxes</p>
                  </div>
                  <Link href="/checkout">
                    <Button size="lg" className="w-full mt-5">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-text-tertiary">
                    <Shield className="w-3.5 h-3.5" />
                    Secure checkout with SSL encryption
                  </div>
                </Card>

                <Card className="p-5 sm:p-6 mt-4" hover={false}>
                  <PincodeChecker />
                </Card>

                <div className="mt-4 p-4 rounded-2xl bg-zumbii-50 border border-zumbii-100">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-zumbii-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary">Buyer Protection</h4>
                      <p className="text-xs text-text-tertiary mt-1">
                        Get full refund if the product is not as described or not delivered.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {suggestedProducts.length > 0 && (
      <section className="border-t border-border py-10 lg:py-12">
        <div className="section-padding">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <h2 className="text-lg font-bold text-text-primary">You May Also Like</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {suggestedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="group"
              >
                <Card className="p-0 overflow-hidden">
                  <div className="aspect-square relative overflow-hidden bg-surface-tertiary">
                    {product.images[0] === PLACEHOLDER_IMAGE_SENTINEL ? (
                      <ProductImagePlaceholder categoryName={product.category?.name} />
                    ) : (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-zumbii-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-base font-bold text-text-primary mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}
    </div>
  );
}

export default CartPage;
