'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ArrowUpDown,
  Package,
  Loader2,
  Check,
} from 'lucide-react';
import clsx from 'clsx';

import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import Container from '@/components/ui/container';
import { categoriesApi, productsApi, ApiError, type BackendCategory } from '@/lib/api';
import { mapBackendProduct } from '@/lib/adapters';

const sortOptions = [
  { value: 'popular', label: 'Popular', sortBy: 'soldCount', sortOrder: 'desc' as const },
  { value: 'newest', label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' as const },
  { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortOrder: 'asc' as const },
  { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortOrder: 'desc' as const },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const PAGE_SIZE = 12;

export default function CategoryDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [category, setCategory] = useState<BackendCategory | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setCategory(null);
    setNotFound(false);
    setPage(1);

    async function loadCategory() {
      try {
        const cat = await categoriesApi.getBySlug(slug);
        if (!cancelled) setCategory(cat);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setLoadError(err instanceof ApiError ? err.message : 'Could not load category');
        }
      }
    }

    loadCategory();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;
    setLoading(true);
    setLoadError('');

    async function loadProducts() {
      try {
        const opt = sortOptions.find((o) => o.value === sortBy) || sortOptions[0];
        const res = await productsApi.list({
          categoryId: category!.id,
          page,
          limit: PAGE_SIZE,
          sortBy: opt.sortBy,
          sortOrder: opt.sortOrder,
        });
        if (cancelled) return;
        setProducts(res.data.map(mapBackendProduct));
        setTotal(res.total);
        setTotalPages(res.totalPages || 1);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof ApiError ? err.message : 'Could not load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, [category, page, sortBy]);

  const activeSortLabel = useMemo(
    () => sortOptions.find((o) => o.value === sortBy)?.label,
    [sortBy]
  );

  if (notFound) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-text-tertiary" />
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Category not found</h1>
          <p className="text-sm text-text-tertiary mt-1">
            We couldn&apos;t find a category with that name.
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-block text-sm font-medium text-zumbii-600 hover:text-zumbii-700"
          >
            Browse all categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-16 lg:pt-20">
      <div className="border-b border-border bg-white">
        <Container className="py-3">
          <nav className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link href="/" className="hover:text-zumbii-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/categories" className="hover:text-zumbii-600 transition-colors">Categories</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary">{category?.name || '...'}</span>
          </nav>
        </Container>
      </div>

      <div className="bg-gradient-to-b from-zumbii-50 to-surface py-8 lg:py-12">
        <Container>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
              {category?.name || 'Loading...'}
            </h1>
            {category?.description && (
              <p className="mt-2 text-text-secondary max-w-2xl">{category.description}</p>
            )}
            {!loading && category && (
              <p className="mt-2 text-sm text-text-tertiary">{total} products found</p>
            )}
          </motion.div>
        </Container>
      </div>

      <Container className="py-6 lg:py-8">
        <div className="flex items-center justify-end mb-5">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-medium text-text-secondary hover:bg-surface-tertiary transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {activeSortLabel}
              <ChevronDown className="w-3 h-3" />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-border rounded-2xl shadow-xl shadow-black/5 z-30 overflow-hidden"
                >
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setPage(1); setShowSortDropdown(false); }}
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-text-tertiary text-sm">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading products...
          </div>
        ) : loadError ? (
          <div className="text-center py-20">
            <p className="text-sm text-red-600">{loadError}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">No products yet</h3>
            <p className="text-sm text-text-tertiary mt-1">
              There are no products in {category?.name} right now. Check back soon.
            </p>
            <Link
              href="/marketplace"
              className="mt-4 inline-block text-sm font-medium text-zumbii-600 hover:text-zumbii-700"
            >
              Browse the marketplace
            </Link>
          </div>
        ) : (
          <motion.div
            key={page + sortBy}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeIn}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={clsx(
                  'min-w-[40px] h-10 rounded-xl text-sm font-medium transition-all duration-200',
                  p === page
                    ? 'bg-zumbii-600 text-white shadow-md shadow-zumbii-600/20'
                    : 'border border-border text-text-secondary hover:bg-surface-tertiary'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl border border-border flex items-center justify-center hover:bg-surface-tertiary transition-colors disabled:opacity-40 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        )}
      </Container>
    </div>
  );
}
