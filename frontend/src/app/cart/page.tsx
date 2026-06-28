'use client';

import { useState } from 'react';
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
import { Badge } from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  maxQuantity: number;
  seller: string;
  inStock: boolean;
  slug: string;
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones Pro',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    price: 2499,
    originalPrice: 3999,
    quantity: 1,
    maxQuantity: 10,
    seller: 'TechGadgets India',
    inStock: true,
    slug: 'premium-wireless-headphones',
  },
  {
    id: '2',
    name: 'Smart Watch Ultra X2',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
    price: 5999,
    originalPrice: 8999,
    quantity: 2,
    maxQuantity: 5,
    seller: 'WearableTech',
    inStock: true,
    slug: 'smart-watch-ultra',
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt Pack',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    price: 1299,
    originalPrice: 1999,
    quantity: 1,
    maxQuantity: 20,
    seller: 'EcoFashion Hub',
    inStock: true,
    slug: 'organic-cotton-tshirt',
  },
];

const suggestedProducts = [
  {
    id: 's1',
    name: 'Portable Bluetooth Speaker',
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&q=80',
    price: 1799,
    slug: 'portable-bluetooth-speaker',
  },
  {
    id: 's2',
    name: 'Wireless Charging Pad',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80',
    price: 1499,
    slug: 'wireless-charging-pad',
  },
  {
    id: 's3',
    name: 'Noise Cancelling Earbuds',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f11?w=400&q=80',
    price: 4999,
    slug: 'noise-cancelling-earbuds',
  },
  {
    id: 's4',
    name: 'Ergonomic Office Chair',
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&q=80',
    price: 8999,
    slug: 'ergonomic-office-chair',
  },
];

function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const shipping = cartItems.length > 0 ? 99 : 0;
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.12);
  const discount = Math.round(subtotal * (couponDiscount / 100));
  const total = subtotal + shipping + tax - discount;

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newQty = item.quantity + delta;
        if (newQty < 1 || newQty > item.maxQuantity) return item;
        return { ...item, quantity: newQty };
      })
    );
  };

  const handleRemoveItem = (id: string, name: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success(`${name} removed from cart`);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    setCouponLoading(true);
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'ZUMBII20') {
        setCouponDiscount(20);
        setAppliedCoupon(couponCode.toUpperCase());
        toast.success('Coupon applied! 20% discount');
      } else if (couponCode.toUpperCase() === 'WELCOME10') {
        setCouponDiscount(10);
        setAppliedCoupon(couponCode.toUpperCase());
        toast.success('Coupon applied! 10% discount');
      } else {
        toast.error('Invalid coupon code');
      }
      setCouponLoading(false);
    }, 800);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleMoveToWishlist = (item: CartItem) => {
    handleRemoveItem(item.id, item.name);
    toast.success(`${item.name} moved to wishlist`);
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
                    key={item.id}
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
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
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
                              <p className="text-xs text-text-tertiary mt-0.5">{item.seller}</p>
                              {!item.inStock && (
                                <Badge variant="danger" size="sm" className="mt-1">Out of Stock</Badge>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-base sm:text-lg font-bold text-text-primary">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                              {item.originalPrice && (
                                <p className="text-xs text-text-tertiary line-through">
                                  ₹{(item.originalPrice * item.quantity).toLocaleString('en-IN')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 sm:mt-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                                <button
                                  onClick={() => handleQuantityChange(item.id, -1)}
                                  disabled={item.quantity <= 1}
                                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3.5 h-3.5 text-text-secondary" />
                                </button>
                                <span className="w-10 sm:w-12 text-center text-sm font-medium text-text-primary border-x border-border">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, 1)}
                                  disabled={item.quantity >= item.maxQuantity}
                                  className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
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
                                className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-rose-500"
                                aria-label="Move to wishlist"
                              >
                                <Heart className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRemoveItem(item.id, item.name)}
                                className="p-2 rounded-lg hover:bg-surface-tertiary transition-colors text-text-tertiary hover:text-red-500"
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
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-emerald-700">{appliedCoupon}</span>
                      <span className="text-xs text-emerald-600">({couponDiscount}% off)</span>
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
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
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
                <p className="text-[11px] text-text-tertiary mt-2">Try ZUMBII20 or WELCOME10</p>
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
                          <span className="text-emerald-600">Free</span>
                        ) : (
                          `₹${shipping.toLocaleString('en-IN')}`
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">Tax (GST 12%)</span>
                      <span className="text-text-primary font-medium">₹{tax.toLocaleString('en-IN')}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Percent className="w-3.5 h-3.5" />
                          Discount ({couponDiscount}%)
                        </div>
                        <span className="text-emerald-600 font-medium">-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <hr className="border-border" />
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-text-primary">Total</span>
                      <span className="text-lg font-bold text-zumbii-600">₹{total.toLocaleString('en-IN')}</span>
                    </div>
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

      <section className="border-t border-border py-10 lg:py-12">
        <div className="section-padding">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-zumbii-600" />
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
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
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
    </div>
  );
}

export default CartPage;
