'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  Image as ImageIcon,
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
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Only the homepage has a dark hero for the nav to float over transparently —
  // every other page shows the solid nav immediately, or white text/icons end up
  // rendering on a light background and become unreadable.
  const isHome = pathname === '/';
  const scrolled = isScrolled || !isHome;

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

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const cartCount = useCartStore((s) => s.totalItems());
  const displayedCartCount = mounted ? cartCount : 0;

  const authUser = useAuthStore((s) => s.user);
  const isLoggedIn = mounted && !!authUser;
  const accountHref = isLoggedIn ? '/account' : '/login';
  const displayName = [authUser?.firstName, authUser?.lastName].filter(Boolean).join(' ').trim();
  const initial = (displayName || authUser?.phone || authUser?.email || '')[0]?.toUpperCase();

  return (
    <div className="fixed inset-x-0 top-0 z-40">
      <div className="bg-zumbii-950 py-1.5 text-center text-[11px] font-medium text-gold-400 sm:text-xs">
        Become a Zumbii Partner —{' '}
        <Link href="/franchise" className="underline underline-offset-2 hover:text-white">
          Explore Franchise →
        </Link>
      </div>
      <header
        className={clsx(
          'transition-all duration-500',
          scrolled
            ? 'bg-white/80 shadow-sm shadow-black/5 backdrop-blur-xl'
            : 'bg-white/0'
        )}
      >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-2 lg:h-20 lg:gap-3">
          {/* Mobile menu button — 44x44px minimum tap target (WCAG/touch guidance),
              decoupled from the icon's own visual size via an explicit h-11 w-11 box. */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={clsx(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors lg:hidden',
              scrolled
                ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                : 'text-white/75 hover:bg-white/10 hover:text-white'
            )}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo — always on a light pill: the mark itself is dark (navy/black), so it
              needs a light backdrop whether the nav is floating over the hero or scrolled solid.
              Slightly narrower on the smallest phones to leave room for the collapsed header's icons. */}
          <Link
            href="/"
            className="flex h-10 shrink-0 items-center rounded-xl bg-white/90 px-2 shadow-sm shadow-black/10 backdrop-blur-sm transition-shadow hover:shadow-md lg:h-12"
            aria-label={`${siteConfig.name} home`}
          >
            <NextImage
              src="/images/zumbii-logo-header-wide.png"
              alt={`${siteConfig.name} logo`}
              width={846}
              height={212}
              priority
              className="h-7 w-[118px] object-contain sm:h-8 sm:w-[136px] lg:h-9 lg:w-[154px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <div key={link.href} className="relative">
                {'hasMegaMenu' in link && link.hasMegaMenu ? (
                  <div className="group">
                    <Link
                      href={link.href}
                      className={clsx(
                        'flex items-center gap-1 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                        scrolled
                          ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                          : 'text-white/75 hover:bg-white/10 hover:text-white'
                      )}
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
                    className={clsx(
                      'rounded-xl px-2.5 py-2 text-sm font-medium transition-colors',
                      scrolled
                        ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1 lg:gap-2">
            {/* Desktop search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={clsx(
                'hidden items-center gap-2 rounded-xl border px-4 py-2 text-sm transition-all xl:flex xl:w-56',
                scrolled
                  ? 'border-border bg-surface-secondary text-text-tertiary hover:border-zumbii-200 hover:text-text-secondary'
                  : 'border-white/20 bg-white/10 text-white/60 hover:border-white/40 hover:text-white'
              )}
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search products...</span>
              <kbd className={clsx(
                'hidden rounded-md border px-1.5 py-0.5 text-[10px] font-medium xl:inline',
                scrolled
                  ? 'border-border bg-white text-text-tertiary'
                  : 'border-white/20 bg-white/10 text-white/50'
              )}>
                Ctrl+K
              </kbd>
            </button>

            {/* Quick action icons */}
            <Link
              href="/sell"
              className={clsx(
                'hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors xl:flex',
                scrolled
                  ? 'text-zumbii-600 hover:bg-zumbii-50'
                  : 'text-zumbii-300 hover:bg-white/10 hover:text-zumbii-200'
              )}
            >
              <Store className="h-4 w-4" />
              <span>Sell</span>
            </Link>

            <Link
              href="/franchise"
              className={clsx(
                'hidden items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors xl:flex',
                scrolled
                  ? 'text-zumbii-600 hover:bg-zumbii-50'
                  : 'text-zumbii-300 hover:bg-white/10 hover:text-zumbii-200'
              )}
            >
              <Briefcase className="h-4 w-4" />
              <span>Franchise</span>
            </Link>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={clsx(
                'flex h-11 w-11 items-center justify-center rounded-xl transition-colors xl:hidden',
                scrolled
                  ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              )}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className={clsx(
                'relative hidden items-center justify-center rounded-xl p-2 transition-colors lg:flex',
                scrolled
                  ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              )}
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/cart"
              className={clsx(
                'relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                scrolled
                  ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              )}
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {displayedCartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand-red-600 px-1 text-[10px] font-bold leading-none text-white">
                  {displayedCartCount}
                </span>
              )}
            </Link>

            {/* Compact account icon — visible in the collapsed (mobile/tablet, <1024px) header
                as a direct link, since the full dropdown menu below is desktop-only. */}
            <Link
              href={accountHref}
              className={clsx(
                'flex h-11 w-11 items-center justify-center rounded-xl transition-colors lg:hidden',
                scrolled
                  ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              )}
              aria-label="Account"
            >
              {isLoggedIn ? (
                <span
                  className={clsx(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                    scrolled ? 'bg-zumbii-100 text-zumbii-700' : 'bg-white/20 text-white'
                  )}
                >
                  {initial}
                </span>
              ) : (
                <User className="h-5 w-5" />
              )}
            </Link>

            {/* User dropdown */}
            <div ref={userMenuRef} className="relative hidden lg:block">
              {isLoggedIn ? (
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={clsx(
                    'flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors',
                    scrolled
                      ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  )}
                  aria-label="User menu"
                >
                  <div className={clsx(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold',
                    scrolled ? 'bg-zumbii-100 text-zumbii-700' : 'bg-white/20 text-white'
                  )}>
                    {initial}
                  </div>
                  {displayName && (
                    <span className="min-w-0 max-w-[7rem] truncate text-sm font-medium">{displayName}</span>
                  )}
                  <ChevronDown
                    className={clsx(
                      'hidden h-3.5 w-3.5 shrink-0 transition-transform duration-200 lg:block',
                      userMenuOpen && 'rotate-180'
                    )}
                  />
                </button>
              ) : (
                <Link
                  href="/login"
                  className={clsx(
                    'flex items-center gap-2 rounded-xl p-1.5 pr-3 transition-colors',
                    scrolled
                      ? 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                      : 'text-white/75 hover:bg-white/10 hover:text-white'
                  )}
                  aria-label="Sign in"
                >
                  <div className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full',
                    scrolled ? 'bg-zumbii-100 text-zumbii-700' : 'bg-white/20 text-white'
                  )}>
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium">Sign in</span>
                </Link>
              )}

              <AnimatePresence>
                {isLoggedIn && userMenuOpen && (
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
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                          router.push('/login');
                        }}
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
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-zumbii-600"
                    aria-label="Voice search"
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                  <button
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-zumbii-600"
                    aria-label="Image search"
                  >
                    <ImageIcon className="h-4 w-4" />
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
                <Link
                  href="/"
                  className="flex h-10 items-center rounded-xl bg-white px-2 shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={`${siteConfig.name} home`}
                >
                  <NextImage
                    src="/images/zumbii-logo-header-wide.png"
                    alt={`${siteConfig.name} logo`}
                    width={256}
                    height={66}
                    className="h-8 w-[136px] object-contain"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-text-secondary transition-colors hover:bg-surface-tertiary"
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
                    {displayedCartCount > 0 && (
                      <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-brand-red-600 px-1.5 text-[10px] font-bold text-white">
                        {displayedCartCount}
                      </span>
                    )}
                  </Link>
                </div>

                <hr className="my-4 border-border" />

                <div className="space-y-1">
                  <Link
                    href={accountHref}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-zumbii-50 hover:text-zumbii-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {isLoggedIn ? (displayName || 'My Account') : 'Sign In / Register'}
                    </span>
                  </Link>
                  {isLoggedIn && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                        router.push('/');
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </div>
  );
}
