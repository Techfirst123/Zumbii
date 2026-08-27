"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, useReducedMotion, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  Camera,
  ShoppingBag,
  Store,
  Shield,
  Package,
  Truck,
  Star,
  Clock,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Mail,
  Send,
  Quote,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { ProductCard } from "@/components/ui/ProductCard";
import PromoBanner from "@/components/home/PromoBanner";
import CampaignBanners from "@/components/home/CampaignBanners";
import { productsApi, categoriesApi, newsletterApi, resolveImageUrl, ApiError, type BackendCategory } from "@/lib/api";
import { mapBackendProduct } from "@/lib/adapters";
import { categoryVisual } from "@/lib/categoryVisuals";
import type { Product } from "@/types";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const heroTaglines = [
  "Connecting Communities,",
  "Powering Every Business,",
  "Delivering Real Deals,",
];

const trendingSearches = ["Electronics", "Fashion", "Home & Living", "Wireless Earbuds", "Sneakers"];

const HERO_CATEGORY_TILES = 6;

const heroStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const heroItemReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

const testimonials = [
  { name: "Rajesh Mehta", role: "Supplier, Mumbai", avatar: "RM", content: "Zumbii transformed our manufacturing business. We reached buyers across 15 states within the first month. The B2B RFQ system is a game-changer.", rating: 5 },
  { name: "Priya Sharma", role: "Franchise Partner, Delhi", avatar: "PS", content: "The franchise onboarding was seamless. Training, technology, marketing support — everything was world-class. Revenue grew 3x in 6 months.", rating: 5 },
  { name: "Amit Verma", role: "Retailer, Bangalore", avatar: "AV", content: "As a small retailer, getting wholesale prices was always tough. Zumbii made it easy. I save 30% on procurement and delivery is always on time.", rating: 5 },
  { name: "Sunita Patel", role: "Customer, Ahmedabad", avatar: "SP", content: "Love the variety and quality! The AI search helps me find exactly what I need. Returns are hassle-free and customer support is always responsive.", rating: 4 },
  { name: "Vikram Singh", role: "Distributor, Jaipur", avatar: "VS", content: "Zumbii's logistics network is incredible. We now serve 200+ retailers across Rajasthan with next-day delivery. The platform is intuitive and reliable.", rating: 5 },
];

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [heroCategories, setHeroCategories] = useState<BackendCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const itemVariants = shouldReduceMotion ? heroItemReduced : heroItem;

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % heroTaglines.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let cancelled = false;
    categoriesApi
      .list()
      .then((res) => {
        if (!cancelled) setHeroCategories(res.filter((c) => !c.parentId).slice(0, HERO_CATEGORY_TILES));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCategoriesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function goToSearch(term: string) {
    const q = term.trim();
    router.push(q ? `/marketplace?search=${encodeURIComponent(q)}` : "/marketplace");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch(searchQuery);
  }

  return (
    <section
      className="relative flex items-center overflow-hidden"
      style={{ paddingTop: "clamp(96px, 14vw, 132px)", paddingBottom: "clamp(24px, 4vw, 48px)" }}
    >
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(122deg, #0a0e2e 6%, #1c2a63 46%, #26377f 92%)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(227,169,0,0.15),transparent_50%)]" />

      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-brand-red-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-zumbii-500/5 via-gold-500/5 to-zumbii-500/5 rounded-full blur-[150px]" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
        <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
        <div className="absolute bottom-10 right-10 w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={heroStagger} className="lg:flex-1 text-center lg:text-left">
            <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight">
              Empowering Businesses,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-200 inline-block">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={taglineIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block"
                  >
                    {heroTaglines[taglineIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>{" "}
              Growing Together.
            </motion.h1>

            <motion.p variants={itemVariants} className="mt-3 lg:mt-4 text-sm sm:text-base lg:text-lg text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              India&apos;s premier B2B & B2C marketplace. Source products, grow your business, and connect with a thriving community of sellers, suppliers, and buyers.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-4 lg:mt-6 flex flex-wrap gap-3 lg:gap-4 justify-center lg:justify-start">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                className="inline-block"
              >
                <Link href="/marketplace">
                  <Button variant="gold" size="lg" className="shadow-2xl shadow-gold-500/25 hover:shadow-gold-500/40">
                    <ShoppingBag className="w-5 h-5" />
                    Start Shopping
                  </Button>
                </Link>
              </motion.div>
              <Link href="/sell">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/15 hover:text-white hover:border-white/50">
                  <Store className="w-5 h-5" />
                  Become a Seller
                </Button>
              </Link>
            </motion.div>

            <motion.form variants={itemVariants} onSubmit={handleSearchSubmit} className="mt-4 lg:mt-6 max-w-xl mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-zumbii-400 via-gold-400 to-zumbii-400 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white/20 focus-within:border-white/40">
                  <Search className="ml-3 sm:ml-4 w-5 h-5 text-white/50 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, suppliers..."
                    className="min-w-0 flex-1 bg-transparent px-3 sm:px-4 py-4 text-white placeholder:text-white/40 text-sm focus:outline-none"
                  />
                  <div className="flex items-center gap-1 pr-2">
                    <button type="button" className="hidden sm:flex p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Voice search">
                      <Mic className="w-4 h-4 text-white/50" />
                    </button>
                    <button type="button" className="hidden sm:flex p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Image search">
                      <Camera className="w-4 h-4 text-white/50" />
                    </button>
                    <button type="submit" className="ml-1 bg-gold-500 text-zumbii-950 px-3.5 sm:px-5 py-2 rounded-xl text-sm font-semibold hover:bg-gold-600 transition-all shadow-lg shrink-0">
                      Search
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 justify-center lg:justify-start">
                <span className="text-xs text-white/40">Trending:</span>
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => goToSearch(term)}
                    className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/70 hover:bg-white/15 hover:text-white transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.form>

            <motion.div variants={itemVariants} className="mt-4 lg:mt-6 flex flex-wrap items-center gap-2.5 justify-center lg:justify-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/8 border border-white/15">
                <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-white/90 whitespace-nowrap">Verified Sellers</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/8 border border-white/15">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-medium text-white/90 whitespace-nowrap">Pan-India Delivery</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.4 : 0.6, delay: shouldReduceMotion ? 0 : 0.25 }}
            className="hidden lg:flex relative lg:flex-1 items-center justify-center"
          >
            <motion.div
              className="relative w-full max-w-sm"
              animate={shouldReduceMotion ? undefined : { y: [0, -10, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-zumbii-400/30 via-gold-400/30 to-zumbii-400/30 rounded-[32px] blur-2xl" />

              <motion.div
                initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={
                  shouldReduceMotion
                    ? { delay: 0.3, duration: 0.3 }
                    : { delay: 0.7, type: "spring", stiffness: 260, damping: 18 }
                }
                className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full bg-gold-500 text-zumbii-950 shadow-lg shadow-black/40"
              >
                {/* "30-minute" delivery is only real in specific serviceable pincodes today (see backend Pincode/DeliveryService).
                    Swap this copy for that promise once the homepage can check the visitor's pincode/zone. */}
                <span className="relative flex items-center justify-center w-5 h-5 shrink-0">
                  {!shouldReduceMotion && (
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/60"
                      animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <Clock className="relative w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-bold whitespace-nowrap">Quick Delivery in Select Cities</span>
              </motion.div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full bg-zumbii-950/55 border border-white/25 backdrop-blur-md shadow-lg shadow-black/30 mb-3">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                  </span>
                  <span className="text-[11px] font-bold tracking-wide uppercase text-white">Shop by Category</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: HERO_CATEGORY_TILES }).map((_, i) => {
                    const cat = heroCategories[i];

                    if (categoriesLoading) {
                      return (
                        <div
                          key={i}
                          className="aspect-square rounded-2xl bg-white/5 border border-white/10 animate-pulse"
                        />
                      );
                    }

                    if (!cat) {
                      return (
                        <div
                          key={i}
                          className="aspect-square rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center"
                        >
                          <Package className="w-6 h-6 text-white/20" />
                        </div>
                      );
                    }

                    const { icon: IconComponent, gradient } = categoryVisual(cat.name || cat.slug);
                    return (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="group relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-lg shadow-black/30 hover:-translate-y-1 transition-transform duration-300"
                      >
                        {cat.image ? (
                          <Image
                            src={resolveImageUrl(cat.image)}
                            alt={cat.name}
                            fill
                            sizes="110px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-black/85 to-transparent">
                          <p className="text-[10px] text-white font-semibold truncate text-center">{cat.name}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center justify-center gap-1 text-white/65 text-[11px]">
                  <Star className="w-3 h-3 fill-gold-500 text-gold-500" /> 4.8 avg rating across 1,000+ sellers
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      <style jsx>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}

function ProductGridSection({
  title,
  subtitle,
  eyebrow,
  products,
  loading,
  viewAllHref,
  viewAllLabel,
  columns = 3,
  bgClass = "",
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  products: Product[];
  loading: boolean;
  viewAllHref: string;
  viewAllLabel: string;
  columns?: 3 | 4;
  bgClass?: string;
}) {
  if (!loading && products.length === 0) return null;

  return (
    <section className={`py-20 lg:py-28 ${bgClass}`}>
      <Container>
        <FadeInSection>
          <SectionHeader title={title} subtitle={subtitle} eyebrow={eyebrow} />
        </FadeInSection>
        {loading ? (
          <div className="mt-12 flex justify-center py-12 text-text-tertiary">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className={`mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 ${
              columns === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
        <FadeInSection className="text-center mt-10">
          <Link href={viewAllHref}>
            <Button variant="outline" size="lg">
              {viewAllLabel} <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </FadeInSection>
      </Container>
    </section>
  );
}

function CategoriesSection() {
  const [categories, setCategories] = useState<BackendCategory[]>([]);

  useEffect(() => {
    let cancelled = false;
    categoriesApi
      .list()
      .then((res) => {
        if (!cancelled) setCategories(res.filter((c) => !c.parentId));
      })
      .catch((err) => console.error(err instanceof ApiError ? err.message : err));
    return () => {
      cancelled = true;
    };
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-10 lg:py-12 bg-surface-secondary overflow-hidden">
      <Container>
        <FadeInSection>
          <SectionHeader
            eyebrow="Categories"
            title="Shop by Category"
            subtitle="Explore thousands of products across diverse categories"
            className="[&_h2]:text-2xl sm:[&_h2]:text-3xl lg:[&_h2]:text-4xl [&_p:last-child]:mt-1.5 [&_p:last-child]:text-sm sm:[&_p:last-child]:text-base"
          />
        </FadeInSection>
      </Container>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
        className="mt-6 flex items-stretch gap-3 sm:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 sm:px-6 lg:px-8"
      >
        {categories.map((cat) => {
          const { icon: IconComponent, gradient } = categoryVisual(cat.name || cat.slug);
          return (
            <motion.div key={cat.id} variants={fadeInUp} className="shrink-0 snap-start w-28 sm:w-32">
              <Link
                href={`/category/${cat.slug}`}
                className="group block"
              >
                <Card className="p-3 sm:p-4 text-center">
                  {cat.image ? (
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform duration-300">
                      <Image
                        src={resolveImageUrl(cat.image)}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                  ) : (
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <h3 className="mt-2.5 font-semibold text-text-primary text-xs sm:text-sm leading-snug line-clamp-2">{cat.name}</h3>
                  <p className="mt-0.5 text-[11px] text-text-tertiary">
                    {cat._count?.products ?? 0} products
                  </p>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

function BestSellersSection({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <ProductGridSection
      eyebrow="Handpicked For You"
      title="Bestsellers"
      subtitle="Highest-selling products across the marketplace"
      products={products}
      loading={loading}
      viewAllHref="/marketplace"
      viewAllLabel="Explore Best Sellers"
      columns={4}
    />
  );
}

function NewArrivalsSection({ products, loading }: { products: Product[]; loading: boolean }) {
  return (
    <ProductGridSection
      eyebrow="Just In"
      title="New Arrivals"
      subtitle="Freshly added products from our sellers"
      products={products}
      loading={loading}
      viewAllHref="/marketplace"
      viewAllLabel="See What's New"
      columns={4}
      bgClass="bg-surface-secondary"
    />
  );
}

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };
  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5" />
      <Container>
        <FadeInSection>
          <SectionHeader
            eyebrow="Testimonials"
            title="What Our Community Says"
            subtitle="Real stories from real users across India"
          />
        </FadeInSection>
        <div className="mt-12 max-w-4xl mx-auto relative">
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-zumbii-100"
              >
                <Quote className="w-10 h-10 text-gold-300 mb-4" />
                <p className="text-lg sm:text-xl text-text-primary leading-relaxed">
                  &ldquo;{testimonials[current].content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-1">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {testimonials[current].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{testimonials[current].name}</div>
                    <div className="text-sm text-text-tertiary">{testimonials[current].role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-zumbii-200 flex items-center justify-center hover:bg-zumbii-50 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4 text-text-secondary" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-gold-500 w-6" : "bg-zumbii-200"}`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-zumbii-200 flex items-center justify-center hover:bg-zumbii-50 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubscribing(true);
    try {
      await newsletterApi.subscribe(email);
      setEmail("");
      toast.success("Subscribed! Watch your inbox for updates.");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to subscribe. Please try again.");
    } finally {
      setSubscribing(false);
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-lg">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <SectionHeader
              title="Stay Ahead of the Curve"
              subtitle="Get weekly insights on market trends, new suppliers, franchise opportunities, and exclusive B2B deals delivered to your inbox."
            />
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1 relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
              <Button type="submit" variant="gold" size="lg" className="h-12 shrink-0" disabled={subscribing}>
                {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe <Send className="w-4 h-4" /></>}
              </Button>
            </form>
            <p className="mt-4 text-xs text-text-tertiary">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </FadeInSection>
      </Container>
    </section>
  );
}

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [newArrivalsRes, bestSellersRes] = await Promise.all([
          productsApi.list({ sortBy: "createdAt", sortOrder: "desc", limit: 8 }),
          productsApi.list({ sortBy: "soldCount", sortOrder: "desc", limit: 8 }),
        ]);
        if (cancelled) return;

        setNewArrivals(newArrivalsRes.data.map(mapBackendProduct));
        setBestSellers(bestSellersRes.data.map(mapBackendProduct));
      } catch (err) {
        if (!cancelled) console.error(err instanceof ApiError ? err.message : err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <HeroSection />
      <CampaignBanners />
      <CategoriesSection />
      <BestSellersSection products={bestSellers} loading={loading} />
      <PromoBanner />
      <NewArrivalsSection products={newArrivals} loading={loading} />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
