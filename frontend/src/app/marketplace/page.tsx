'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Mic,
  Camera,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Package,
  Star,
  Clock,
  Eye,
  TrendingUp,
  Check,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import clsx from 'clsx';

import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'electronics', label: 'Electronics', icon: Package },
  { id: 'fashion', label: 'Fashion', icon: Sparkles },
  { id: 'home-kitchen', label: 'Home & Kitchen', icon: Package },
  { id: 'beauty', label: 'Beauty & Health', icon: Sparkles },
  { id: 'sports', label: 'Sports & Outdoors', icon: Package },
  { id: 'automotive', label: 'Automotive', icon: Package },
  { id: 'books', label: 'Books & Stationery', icon: Package },
  { id: 'industrial', label: 'Industrial & Tools', icon: Package },
  { id: 'food', label: 'Food & Beverages', icon: Package },
];

const sortOptions = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const brands = [
  'Apple', 'Samsung', 'Sony', 'LG', 'Nike', 'Adidas', 'Puma', 'Bose',
  'Dell', 'HP', 'Lenovo', 'OnePlus', 'Realme', 'Xiaomi', 'Boat', 'Noise',
];

const ratings = [5, 4, 3, 2, 1];

const placeholderProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
  id: `prod-${i + 1}`,
  name: [
    'Premium Wireless Headphones Pro',
    'Smart Watch Ultra X2',
    'Organic Cotton T-Shirt Pack',
    'Industrial LED Panel 60W',
    'Handcrafted Ceramic Dinner Set',
    'Portable Bluetooth Speaker',
    'Ergonomic Office Chair',
    '4K Action Camera HDR',
    'Bamboo Cutting Board Set',
    'Stainless Steel Water Bottle',
    'Wireless Charging Pad Fast',
    'Leather Laptop Bag Premium',
    'Noise Cancelling Earbuds',
    'Smart Home Security Camera',
    'Yoga Mat Premium Non-Slip',
    'Electric Kettle 1.5L',
    'Minimalist Desk Lamp LED',
    'Running Shoes Ultra Comfort',
    'Sunglasses Polarized UV400',
    'Backpack Laptop 40L',
    'Mechanical Keyboard RGB',
    'Gaming Mouse Wireless Pro',
    'Protein Powder Whey Isolate',
    'Vitamin C Serum 20%',
  ][i],
  slug: `product-${i + 1}`,
  description: 'Premium quality product designed for modern lifestyle. Features cutting-edge technology and superior craftsmanship.',
  shortDescription: 'Premium quality product.',
  price: [2499, 5999, 1299, 849, 3499, 1799, 8999, 12999, 999, 799, 1499, 3999, 4999, 3499, 1599, 1299, 2199, 4999, 1999, 2999, 5499, 3499, 2499, 899][i],
  wholesalePrice: [1899, 4599, 899, 599, 2499, 1299, 6999, 9999, 699, 549, 999, 2999, 3799, 2499, 1099, 899, 1599, 3799, 1399, 2199, 3999, 2499, 1799, 599][i],
  comparePrice: [3999, 8999, 1999, 1299, 4999, 2999, 12999, 17999, 1499, 1299, 2499, 5999, 7999, 4999, 2499, 1999, 3499, 7999, 3499, 4999, 8999, 5499, 3999, 1499][i],
  images: [
    `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80`,
    `https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80`,
  ],
  category: { id: 'cat-1', name: 'Electronics', slug: 'electronics', description: '', image: '', icon: '', children: [], productCount: 0 },
  brand: { id: 'brand-1', name: brands[i % brands.length], slug: brands[i % brands.length].toLowerCase(), logo: '', description: '', productCount: 0 },
  seller: {
    id: 'seller-1', businessName: 'TechGadgets India', businessType: 'retailer', logo: '',
    rating: 4.5, reviewCount: 234, verified: true, gstVerified: true, panVerified: true,
    location: 'Mumbai, India', responseTime: '< 2 hrs', followerCount: 1200,
  },
  sku: `ZUM-${String(i + 1).padStart(4, '0')}`,
  gstRate: 18,
  moq: [1, 10, 5, 50, 1, 10, 1, 5, 10, 20, 1, 5, 10, 1, 1, 10, 5, 1, 1, 5, 1, 1, 10, 5][i],
  stock: [45, 12, 200, 500, 30, 150, 8, 25, 180, 300, 90, 40, 60, 75, 120, 250, 85, 55, 160, 100, 70, 95, 200, 140][i],
  availableQuantity: 1000,
  rating: [4.8, 4.6, 4.7, 4.5, 4.9, 4.4, 4.3, 4.7, 4.2, 4.1, 4.6, 4.5, 4.8, 4.3, 4.4, 4.0, 4.5, 4.7, 4.2, 4.6, 4.8, 4.4, 4.5, 4.3][i],
  reviewCount: [234, 189, 456, 312, 178, 567, 89, 145, 67, 234, 345, 123, 456, 78, 234, 189, 345, 678, 123, 234, 456, 345, 234, 123][i],
  specifications: [],
  features: [],
  downloads: [],
  certificates: [],
  tags: [],
  isFeatured: i < 6,
  isNew: i < 4,
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const recentlyViewed = placeholderProducts.slice(0, 6);

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const listVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
};

function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [wholesaleOnly, setWholesaleOnly] = useState(false);
  const [moqFilter, setMoqFilter] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const productsPerPage = viewMode === 'list' ? 12 : 8;
  const totalPages = Math.ceil(placeholderProducts.length / productsPerPage);

  const filteredProducts = placeholderProducts.filter((p) => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all') return false;
    if (wholesaleOnly && !p.wholesalePrice) return false;
    if (moqFilter > 0 && p.moq < moqFilter) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand.name)) return false;
    if (selectedRatings.length > 0 && !selectedRatings.some((r) => Math.floor(p.rating) >= r)) return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'newest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return b.rating - a.rating;
    }
  });

  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollCategory = (dir: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: dir === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedBrands([]);
    setSelectedRatings([]);
    setWholesaleOnly(false);
    setMoqFilter(0);
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedRatings.length > 0 ||
    wholesaleOnly ||
    moqFilter > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 50000;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider">Filters</h3>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-zumbii-600 hover:text-zumbii-700 font-medium">
            Clear all
          </button>
        )}
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Price Range</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-[11px] text-text-tertiary mb-1 block">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">₹</span>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full h-9 pl-7 pr-3 text-xs bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100"
                />
              </div>
            </div>
            <span className="text-text-tertiary text-xs mt-5">—</span>
            <div className="flex-1">
              <label className="text-[11px] text-text-tertiary mb-1 block">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary">₹</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full h-9 pl-7 pr-3 text-xs bg-surface border border-border rounded-xl text-text-primary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100"
                />
              </div>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={50000}
            step={500}
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full h-1.5 bg-surface-tertiary rounded-full appearance-none cursor-pointer accent-zumbii-600"
          />
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Brand</h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
            >
              <div
                className={clsx(
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                  selectedBrands.includes(brand)
                    ? 'bg-zumbii-600 border-zumbii-600'
                    : 'border-border group-hover:border-zumbii-300'
                )}
              >
                {selectedBrands.includes(brand) && <Check className="w-3 h-3 text-white" />}
              </div>
              <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">Rating</h4>
        <div className="space-y-1.5">
          {ratings.map((r) => (
            <label
              key={r}
              className="flex items-center gap-2.5 py-1.5 cursor-pointer group"
            >
              <div
                className={clsx(
                  'w-4 h-4 rounded border-2 flex items-center justify-center transition-all',
                  selectedRatings.includes(r)
                    ? 'bg-zumbii-600 border-zumbii-600'
                    : 'border-border group-hover:border-zumbii-300'
                )}
              >
                {selectedRatings.includes(r) && <Check className="w-3 h-3 text-white" />}
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={clsx(
                      'w-3.5 h-3.5',
                      i < r ? 'fill-amber-400 text-amber-400' : 'text-border'
                    )}
                  />
                ))}
                <span className="text-sm text-text-tertiary ml-1">& up</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-text-primary">Wholesale Only</span>
          <button
            type="button"
            onClick={() => setWholesaleOnly(!wholesaleOnly)}
            className={clsx(
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors',
              wholesaleOnly ? 'bg-zumbii-600' : 'bg-surface-tertiary'
            )}
          >
            <span
              className={clsx(
                'inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform',
                wholesaleOnly ? 'translate-x-[18px]' : 'translate-x-[3px]'
              )}
            />
          </button>
        </label>
        <p className="text-[11px] text-text-tertiary mt-1">Show products with bulk pricing</p>
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-4">
          Minimum Order Qty
        </h4>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMoqFilter(Math.max(0, moqFilter - 10))}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors"
          >
            <Minus className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <span className="text-sm font-semibold text-text-primary min-w-[3ch] text-center">
            {moqFilter}
          </span>
          <button
            type="button"
            onClick={() => setMoqFilter(moqFilter + 10)}
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-text-secondary" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-surface">
        <div className="relative bg-gradient-to-b from-zumbii-50 to-surface pt-6 pb-8 lg:pt-10 lg:pb-12">
          <div className="section-padding">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-zumbii-400 to-zumbii-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center bg-white border border-border rounded-2xl shadow-lg shadow-zumbii-600/5 overflow-hidden transition-all duration-300 focus-within:shadow-xl focus-within:shadow-zumbii-600/10 focus-within:border-zumbii-300">
                  <Search className="ml-4 w-5 h-5 text-text-tertiary shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, suppliers..."
                    className="flex-1 bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  />
                  <div className="flex items-center gap-1 pr-2">
                    <button
                      className="p-2 hover:bg-surface-tertiary rounded-lg transition-colors"
                      aria-label="Voice search"
                    >
                      <Mic className="w-4 h-4 text-text-tertiary" />
                    </button>
                    <button
                      className="p-2 hover:bg-surface-tertiary rounded-lg transition-colors"
                      aria-label="Image search"
                    >
                      <Camera className="w-4 h-4 text-text-tertiary" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-border">
          <div className="section-padding">
            <div className="flex items-center gap-3 py-3">
              <div className="relative flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => scrollCategory('left')}
                    className="hidden lg:flex w-8 h-8 shrink-0 rounded-full border border-border items-center justify-center hover:bg-surface-tertiary transition-colors"
                    aria-label="Scroll categories left"
                  >
                    <ChevronLeft className="w-4 h-4 text-text-secondary" />
                  </button>
                  <div
                    ref={categoryScrollRef}
                    className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5"
                  >
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={clsx(
                            'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200',
                            selectedCategory === cat.id
                              ? 'bg-zumbii-600 text-white shadow-md shadow-zumbii-600/20'
                              : 'bg-surface-tertiary text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600'
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {cat.label}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => scrollCategory('right')}
                    className="hidden lg:flex w-8 h-8 shrink-0 rounded-full border border-border items-center justify-center hover:bg-surface-tertiary transition-colors"
                    aria-label="Scroll categories right"
                  >
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-2 shrink-0">
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-text-secondary hover:bg-surface-tertiary transition-colors"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5" />
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {showSortDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-border rounded-2xl shadow-xl shadow-black/5 z-50 overflow-hidden"
                      >
                        {sortOptions.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setShowSortDropdown(false); }}
                            className={clsx(
                              'w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors',
                              sortBy === opt.value
                                ? 'text-zumbii-600 bg-zumbii-50 font-medium'
                                : 'text-text-secondary hover:bg-surface-tertiary'
                            )}
                          >
                            {sortBy === opt.value && <Check className="w-3.5 h-3.5" />}
                            <span className={sortBy === opt.value ? '' : 'ml-6'}>{opt.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={clsx(
                      'p-2 transition-colors',
                      viewMode === 'grid'
                        ? 'bg-zumbii-600 text-white'
                        : 'text-text-tertiary hover:bg-surface-tertiary'
                    )}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={clsx(
                      'p-2 transition-colors',
                      viewMode === 'list'
                        ? 'bg-zumbii-600 text-white'
                        : 'text-text-tertiary hover:bg-surface-tertiary'
                    )}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-text-secondary hover:bg-surface-tertiary transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-zumbii-600" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="section-padding py-6 lg:py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-32">
                <FilterSidebar />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h1 className="text-xl font-bold text-text-primary">Marketplace</h1>
                  <p className="text-sm text-text-tertiary mt-0.5">
                    {filteredProducts.length} products found
                  </p>
                </div>
                <div className="flex lg:hidden items-center gap-2">
                  <div className="relative" ref={sortRef}>
                    <button
                      onClick={() => setShowSortDropdown(!showSortDropdown)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-text-secondary"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      {sortOptions.find((o) => o.value === sortBy)?.label}
                    </button>
                  </div>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={clsx('p-2', viewMode === 'grid' ? 'bg-zumbii-600 text-white' : 'text-text-tertiary')}
                      aria-label="Grid view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={clsx('p-2', viewMode === 'list' ? 'bg-zumbii-600 text-white' : 'text-text-tertiary')}
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {selectedBrands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => toggleBrand(brand)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zumbii-50 text-zumbii-700 text-xs font-medium rounded-full hover:bg-zumbii-100 transition-colors"
                    >
                      {brand}
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {selectedRatings.map((r) => (
                    <button
                      key={r}
                      onClick={() => toggleRating(r)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zumbii-50 text-zumbii-700 text-xs font-medium rounded-full hover:bg-zumbii-100 transition-colors"
                    >
                      {r}★ & up
                      <X className="w-3 h-3" />
                    </button>
                  ))}
                  {wholesaleOnly && (
                    <button
                      onClick={() => setWholesaleOnly(false)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zumbii-50 text-zumbii-700 text-xs font-medium rounded-full hover:bg-zumbii-100 transition-colors"
                    >
                      Wholesale
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  {moqFilter > 0 && (
                    <button
                      onClick={() => setMoqFilter(0)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zumbii-50 text-zumbii-700 text-xs font-medium rounded-full hover:bg-zumbii-100 transition-colors"
                    >
                      MOQ: {moqFilter}
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              <AnimatePresence mode="wait">
                {paginatedProducts.length > 0 ? (
                  <motion.div
                    key={viewMode + currentPage}
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                        : 'space-y-4'
                    }
                  >
                    {paginatedProducts.map((product) =>
                      viewMode === 'grid' ? (
                        <motion.div key={product.id} variants={fadeIn}>
                          <ProductCard product={product} />
                        </motion.div>
                      ) : (
                        <motion.div key={product.id} variants={listVariants}>
                          <ProductCard product={product} className="flex-row! [&>a]:flex! [&>a]:flex-row! [&_.aspect-square]:w-48! [&_.aspect-square]:h-48!" />
                        </motion.div>
                      )
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
                      <Package className="w-8 h-8 text-text-tertiary" />
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">No products found</h3>
                    <p className="text-sm text-text-tertiary mt-1">Try adjusting your filters</p>
                    <button
                      onClick={clearFilters}
                      className="mt-4 text-sm font-medium text-zumbii-600 hover:text-zumbii-700"
                    >
                      Clear all filters
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4 text-text-secondary" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={clsx(
                        'min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-200',
                        page === currentPage
                          ? 'bg-zumbii-600 text-white shadow-md shadow-zumbii-600/20'
                          : 'border border-border text-text-secondary hover:bg-surface-tertiary'
                      )}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>

        <section className="border-t border-border py-8 lg:py-10">
          <div className="section-padding">
            <div className="flex items-center gap-2 mb-5">
              <Clock className="w-4 h-4 text-text-tertiary" />
              <h2 className="text-sm font-semibold text-text-primary">Recently Viewed</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {recentlyViewed.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group flex-shrink-0 w-36"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-surface-tertiary mb-2">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={144}
                      height={144}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-xs text-text-primary font-medium line-clamp-1 group-hover:text-zumbii-600 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-xs font-bold text-text-primary mt-0.5">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-text-primary" />
                  <h2 className="text-sm font-semibold text-text-primary">Filters</h2>
                </div>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-surface-tertiary transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </button>
              </div>
              <div className="p-5 overflow-y-auto h-[calc(100%-64px)]">
                <FilterSidebar />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 border-t border-border bg-white">
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MarketplacePage;
