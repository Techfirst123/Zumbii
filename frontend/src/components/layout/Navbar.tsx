'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  Image,
  Heart,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  Package,
  Settings,
  LogOut,
  Store,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import clsx from 'clsx';
import MegaMenu from './MegaMenu';
import { siteConfig, navLinks } from '@/lib/constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const cartCount = 3;

  return (
    <header
      className={clsx(
        'fixed inset-x-0 top-0 z-40 transition-all duration-500',
        scrolled
          ? 'bg-white/80 shadow-sm shadow-black/5 backdrop-blur-xl'
          : 'bg-white/0'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zumbii-600 text-sm font-bold text-white lg:h-9 lg:w-9 lg:text-base">
              Z
            </div>
            <span className="text-lg font-bold tracking-tight text-text-primary lg:text-xl">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {'hasMegaMenu' in link && link.hasMegaMenu ? (
                  <div className="group">
                    <Link
                      href={link.href}
                      className="flex items-center gap-1 rounded-xl px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
                    >
                      {link.label}
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                    </Link>
                    <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                      <MegaMenu />
                    </div>
                  </div>
                ) : (
                  <Link
                    href={link.href}
                    className="rounded-xl px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Desktop search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hidden items-center gap-2 rounded-xl border border-border bg-surface-secondary px-4 py-2 text-sm text-text-tertiary transition-all hover:border-zumbii-200 hover:text-text-secondary lg:flex lg:w-56 xl:w-72"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search products...</span>
              <kbd className="hidden rounded-md border border-border bg-white px-1.5 py-0.5 text-[10px] font-medium text-text-tertiary xl:inline">
                Ctrl+K
              </kbd>
            </button>

            {/* Quick action icons */}
            <Link
              href="/sell"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-zumbii-600 transition-colors hover:bg-zumbii-50 lg:flex"
            >
              <Store className="h-4 w-4" />
              <span>Sell</span>
            </Link>

            <Link
              href="/franchise"
              className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-zumbii-600 transition-colors hover:bg-zumbii-50 lg:flex"
            >
              <Briefcase className="h-4 w-4" />
              <span>Franchise</span>
            </Link>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center justify-center rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary lg:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative flex items-center justify-center rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center justify-center rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-zumbii-600 px-1 text-[10px] font-bold leading-none text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User dropdown */}
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl p-1.5 pr-3 text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
                aria-label="User menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zumbii-100 text-sm font-semibold text-zumbii-700">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown
                  className={clsx(
                    'hidden h-3.5 w-3.5 transition-transform duration-200 lg:block',
                    userMenuOpen && 'rotate-180'
                  )}
                />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className={clsx(
                      'absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl',
                      'border border-white/20 bg-white/90 shadow-xl shadow-black/5 backdrop-blur-xl'
                    )}
                  >
                    <div className="p-2">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        My Account
                      </Link>
                      <Link
                        href="/orders"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        My Orders
                      </Link>
                      <Link
                        href="/sell"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Store className="h-4 w-4" />
                        Seller Dashboard
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                      <hr className="my-1 border-border" />
                      <button
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Search bar (expandable) */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-border/50 bg-white/50 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-4 w-4 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, brands, categories..."
                  className="h-12 w-full rounded-2xl border border-border bg-surface-secondary pl-11 pr-24 text-sm text-text-primary placeholder:text-text-tertiary focus:border-zumbii-300 focus:outline-none focus:ring-2 focus:ring-zumbii-100"
                  autoFocus
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-zumbii-600"
                    aria-label="Voice search"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-zumbii-600"
                    aria-label="Image search"
                  >
                    <Image className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-80 max-w-[85vw] flex-col bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zumbii-600 text-sm font-bold text-white">
                    Z
                  </div>
                  <span className="text-lg font-bold text-text-primary">
                    {siteConfig.name}
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl p-2 text-text-secondary transition-colors hover:bg-surface-tertiary"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {/* Mobile search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="h-11 w-full rounded-xl border border-border bg-surface-secondary pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-zumbii-300 focus:outline-none focus:ring-2 focus:ring-zumbii-100"
                  />
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  ))}
                </nav>

                <hr className="my-4 border-border" />

                <div className="space-y-2">
                  <p className="px-1 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
                    Quick Actions
                  </p>
                  <Link
                    href="/sell"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Store className="h-4 w-4" />
                    Become a Seller
                  </Link>
                  <Link
                    href="/franchise"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Briefcase className="h-4 w-4" />
                    Franchise Opportunities
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" />
                    Wishlist
                  </Link>
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                    {cartCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-zumbii-600 px-1.5 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </div>

                <hr className="my-4 border-border" />

                <div className="space-y-1">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Sign In / Register
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
