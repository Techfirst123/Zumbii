"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowRight, SlidersHorizontal, X, Package, Loader2 } from "lucide-react";
import Container from "@/components/ui/container";
import { categoriesApi, ApiError, type BackendCategory } from "@/lib/api";
import { categoryVisual } from "@/lib/categoryVisuals";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BackendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    categoriesApi
      .list()
      .then((res) => {
        if (!cancelled) setCategories(res.filter((c) => !c.parentId));
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load categories");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () =>
      categories.filter((cat) =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [categories, searchQuery]
  );

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-b from-zumbii-50/50 to-transparent" />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-zumbii-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-zumbii-50 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <Container className="relative z-10 pt-24 pb-16 sm:pt-32 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-6"
            >
              <Package className="w-4 h-4 text-zumbii-500" />
              <span className="text-sm font-medium text-zumbii-700">
                {categories.length} Categories
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight"
            >
              Shop by{" "}
              <span className="bg-gradient-to-r from-zumbii-600 to-zumbii-400 bg-clip-text text-transparent">
                Category
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="mt-4 text-lg text-text-secondary max-w-xl mx-auto"
            >
              Explore thousands of products across every category imaginable
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 max-w-xl mx-auto relative"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-zumbii-100/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center bg-white border border-border rounded-2xl overflow-hidden shadow-sm shadow-zumbii-100/50 transition-all duration-300 focus-within:shadow-md focus-within:border-zumbii-300">
                  <Search className="ml-4 w-5 h-5 text-text-tertiary shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search categories..."
                    className="flex-1 bg-transparent px-4 py-3.5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mr-2 p-1.5 rounded-lg hover:bg-surface-tertiary transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-text-tertiary" />
                    </button>
                  )}
                  <div className="pr-2 flex items-center gap-1 border-l border-border pl-3">
                    <SlidersHorizontal className="w-4 h-4 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary font-medium pr-2">Filter</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="pb-24 sm:pb-32">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-24 text-text-tertiary text-sm">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading categories...
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-tertiary flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-text-tertiary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No categories found
              </h3>
              <p className="text-text-secondary text-sm max-w-xs mx-auto">
                {searchQuery
                  ? `No results match “${searchQuery}”. Try a different search term.`
                  : "Check back soon — categories are being added."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
            >
              {filtered.map((cat) => {
                const { icon: Icon, gradient } = categoryVisual(cat.name || cat.slug);
                return (
                  <motion.div key={cat.id} variants={cardVariants}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="group block h-full"
                    >
                      <div className="relative h-full rounded-2xl border border-border bg-white p-5 sm:p-6 transition-all duration-300 hover:shadow-lg hover:shadow-zumbii-100/50 hover:-translate-y-1 hover:border-zumbii-200">
                        <div
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="mt-4 font-semibold text-text-primary text-sm leading-snug group-hover:text-zumbii-600 transition-colors">
                          {cat.name}
                        </h3>

                        <p className="mt-1 text-xs text-text-tertiary leading-relaxed line-clamp-2">
                          {cat.description || `${cat._count?.products ?? 0} products`}
                        </p>

                        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-zumbii-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                          Explore
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 text-center"
            >
              <p className="text-sm text-text-tertiary">
                Showing {filtered.length} of {categories.length} categories
              </p>
            </motion.div>
          )}
        </Container>
      </section>
    </>
  );
}
