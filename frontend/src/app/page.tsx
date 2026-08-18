"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Mail,
  Send,
  Quote,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { ProductCard } from "@/components/ui/ProductCard";
import PromoBanner from "@/components/home/PromoBanner";
import { productsApi, categoriesApi, ApiError, type BackendCategory } from "@/lib/api";
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

const heroCardPositions = [
  { classes: "top-[6%] left-[12%]", rotate: -4, z: 3 },
  { classes: "top-[30%] right-[2%]", rotate: 3, z: 2 },
  { classes: "bottom-[5%] left-[26%]", rotate: -2, z: 1 },
];

const testimonials = [
  { name: "Rajesh Mehta", role: "Supplier, Mumbai", avatar: "RM", content: "Zumbii transformed our manufacturing business. We reached buyers across 15 states within the first month. The B2B RFQ system is a game-changer.", rating: 5 },
  { name: "Priya Sharma", role: "Franchise Partner, Delhi", avatar: "PS", content: "The franchise onboarding was seamless. Training, technology, marketing support — everything was world-class. Revenue grew 3x in 6 months.", rating: 5 },
  { name: "Amit Verma", role: "Retailer, Bangalore", avatar: "AV", content: "As a small retailer, getting wholesale prices was always tough. Zumbii made it easy. I save 30% on procurement and delivery is always on time.", rating: 5 },
  { name: "Sunita Patel", role: "Customer, Ahmedabad", avatar: "SP", content: "Love the variety and quality! The AI search helps me find exactly what I need. Returns are hassle-free and customer support is always responsive.", rating: 4 },
  { name: "Vikram Singh", role: "Distributor, Jaipur", avatar: "VS", content: "Zumbii's logistics network is incredible. We now serve 200+ retailers across Rajasthan with next-day delivery. The platform is intuitive and reliable.", rating: 5 },
];

function HeroSection({ featuredProducts, loading }: { featuredProducts: Product[]; loading: boolean }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [taglineIndex, setTaglineIndex] = useState(0);
  const router = useRouter();
  const showcaseProducts = featuredProducts.slice(0, 4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % heroTaglines.length);
    }, 2800);
    return () => clearInterval(interval);
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
      style={{ paddingBlock: "clamp(48px, 8vw, 96px)" }}
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
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="lg:flex-1 text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1 sm:px-5 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-4 lg:mb-6 shadow-lg shadow-white/5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sm font-medium text-white/90">India&apos;s Trusted Business Marketplace</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.15] tracking-tight">
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

            <motion.p variants={fadeInUp} className="mt-4 lg:mt-6 text-base sm:text-lg lg:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              India&apos;s premier B2B & B2C marketplace. Source products, grow your business, and connect with a thriving community of sellers, suppliers, and buyers.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-5 lg:mt-8 flex flex-wrap gap-3 lg:gap-4 justify-center lg:justify-start">
              <Link href="/marketplace">
                <Button variant="gold" size="lg" className="shadow-2xl shadow-gold-500/25 hover:shadow-gold-500/40">
                  <ShoppingBag className="w-5 h-5" />
                  Start Shopping
                </Button>
              </Link>
              <Link href="/sell">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/15 hover:text-white hover:border-white/50">
                  <Store className="w-5 h-5" />
                  Become a Seller
                </Button>
              </Link>
            </motion.div>

            <motion.form variants={fadeInUp} onSubmit={handleSearchSubmit} className="mt-6 lg:mt-10 max-w-xl mx-auto lg:mx-0">
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

            <motion.div variants={fadeInUp} className="mt-5 lg:mt-8 flex flex-wrap items-center gap-2.5 justify-center lg:justify-start">
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
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex relative lg:flex-1 items-center justify-center"
          >
            <div
              className="relative aspect-square mx-auto"
              style={{ height: "clamp(280px, 34vw, 440px)" }}
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-zumbii-400/30 via-gold-400/30 to-zumbii-400/30 rounded-[40px] blur-2xl" />

              <div className="absolute top-[6%] left-[2%] z-20 inline-flex items-center gap-2 pl-2.5 pr-3.5 py-1.5 rounded-full bg-zumbii-950/55 border border-white/25 backdrop-blur-md shadow-lg shadow-black/30">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                <span className="text-[11px] font-bold tracking-wide uppercase text-white">Live Deal</span>
              </div>

              {Array.from({ length: 3 }).map((_, i) => {
                const position = heroCardPositions[i];
                const product = !loading ? showcaseProducts[i] : undefined;
                if (loading || !product) {
                  return (
                    <div
                      key={i}
                      className={`absolute ${position.classes} rounded-[26px_12px_26px_26px] overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center animate-pulse`}
                      style={{ width: "38%", aspectRatio: "1 / 1.08", transform: `rotate(${position.rotate}deg)`, zIndex: position.z }}
                    >
                      <Package className="w-8 h-8 text-white/20" />
                    </div>
                  );
                }
                const item = product as Product;
                const discount =
                  item.comparePrice && item.comparePrice > item.price
                    ? Math.round(((item.comparePrice - item.price) / item.comparePrice) * 100)
                    : 0;
                return (
                  <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className={`group absolute ${position.classes} rounded-[26px_12px_26px_26px] overflow-hidden shadow-2xl shadow-black/40 hover:-translate-y-1 transition-transform duration-300`}
                    style={{ width: "38%", aspectRatio: "1 / 1.08", transform: `rotate(${position.rotate}deg)`, zIndex: position.z }}
                  >
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      sizes="220px"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {discount > 0 && (
                      <span className="absolute -top-2 -right-2 rotate-[8deg] px-2.5 py-1.5 rounded-[4px_12px_12px_4px] bg-brand-red-600 text-white text-xs font-extrabold shadow-lg shadow-brand-red-600/40 leading-none">
                        {discount}%<br />OFF
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 to-transparent">
                      <p className="text-[11px] text-white font-medium truncate">{item.name}</p>
                      <p className="text-[11px] text-white/80 font-semibold">₹{item.price.toLocaleString("en-IN")}</p>
                    </div>
                  </Link>
                );
              })}

              <div className="absolute bottom-[2%] right-[4%] z-20 flex items-center gap-1 text-white/65 text-[11px]">
                <Star className="w-3 h-3 fill-gold-500 text-gold-500" /> 4.8 avg rating
              </div>
            </div>
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
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <SectionHeader
            eyebrow="Categories"
            title="Shop by Category"
            subtitle="Explore thousands of products across diverse categories"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {categories.map((cat, i) => {
            const { icon: IconComponent, gradient } = categoryVisual(i);
            return (
              <motion.div key={cat.id} variants={fadeInUp}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group block"
                >
                  <Card className="p-6 sm:p-8 text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-text-primary text-sm sm:text-base">{cat.name}</h3>
                    <p className="mt-1 text-xs text-text-tertiary">
                      {cat._count?.products ?? 0} products
                    </p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
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
              onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
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
              <Button type="submit" variant="gold" size="lg" className="h-12 shrink-0">
                Subscribe <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="mt-4 text-xs text-text-tertiary">
              No spam, ever. Unsubscribe anytime. Read our{" "}
              <Link href="/privacy" className="text-zumbii-600 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </FadeInSection>
      </Container>
    </section>
  );
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [featuredRes, newArrivalsRes, bestSellersRes] = await Promise.all([
          productsApi.featured(),
          productsApi.list({ sortBy: "createdAt", sortOrder: "desc", limit: 8 }),
          productsApi.list({ sortBy: "soldCount", sortOrder: "desc", limit: 8 }),
        ]);
        if (cancelled) return;

        setFeatured(featuredRes.map(mapBackendProduct));
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
      <HeroSection featuredProducts={featured} loading={loading} />
      <CategoriesSection />
      <BestSellersSection products={bestSellers} loading={loading} />
      <PromoBanner />
      <NewArrivalsSection products={newArrivals} loading={loading} />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
