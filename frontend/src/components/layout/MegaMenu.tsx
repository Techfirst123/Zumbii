'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Trophy,
  Car,
  BookOpen,
  Wrench,
  ChevronRight,
} from 'lucide-react';
import { categories } from '@/lib/constants';
import clsx from 'clsx';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Trophy,
  Car,
  BookOpen,
  Wrench,
};

const containerVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' as const, staggerChildren: 0.03 },
  },
  exit: {
    opacity: 0,
    y: 8,
    transition: { duration: 0.15, ease: 'easeIn' as const },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
};

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = (slug: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveCategory(slug);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveCategory(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const activeData = categories.find((c) => c.slug === activeCategory);

  return (
    <div
      ref={menuRef}
      className="relative"
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setIsOpen(true);
      }}
      onMouseLeave={handleMouseLeave}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={clsx(
              'fixed left-1/2 top-full z-50 w-[calc(100vw-2rem)] max-w-5xl -translate-x-1/2',
              'rounded-2xl border border-white/20 bg-white/80 p-6 shadow-2xl shadow-black/10 backdrop-blur-xl',
              'max-h-[70vh] overflow-hidden'
            )}
          >
            <div className="flex gap-6">
              <div className="w-64 shrink-0 space-y-1">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon] || Smartphone;
                  return (
                    <button
                      key={cat.slug}
                      onMouseEnter={() => handleMouseEnter(cat.slug)}
                      onClick={() => {
                        setActiveCategory(cat.slug);
                      }}
                      className={clsx(
                        'flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all',
                        activeCategory === cat.slug
                          ? 'bg-zumbii-50 text-zumbii-700 shadow-sm'
                          : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{cat.name}</span>
                      <ChevronRight
                        className={clsx(
                          'h-3.5 w-3.5 transition-transform',
                          activeCategory === cat.slug && 'translate-x-0.5 text-zumbii-500'
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="relative flex-1 overflow-hidden rounded-xl bg-white/50 p-5">
                <AnimatePresence mode="wait">
                  {activeData ? (
                    <motion.div
                      key={activeData.slug}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary">
                            {activeData.name}
                          </h3>
                          <p className="text-sm text-text-tertiary">
                            {activeData.description}
                          </p>
                        </div>
                        <Link
                          href={`/category/${activeData.slug}`}
                          className="flex items-center gap-1 rounded-lg bg-zumbii-50 px-4 py-2 text-sm font-medium text-zumbii-700 transition-colors hover:bg-zumbii-100"
                        >
                          View All
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                        {activeData.items.map((item) => (
                          <Link
                            key={item}
                            href={`/category/${activeData.slug}?sub=${encodeURIComponent(item.toLowerCase().replace(/\s+/g, '-'))}`}
                            className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-white hover:text-zumbii-600"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-zumbii-300 transition-colors group-hover:bg-zumbii-500" />
                            {item}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex h-full items-center justify-center"
                    >
                      <p className="text-sm text-text-tertiary">
                        Hover a category to explore
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
