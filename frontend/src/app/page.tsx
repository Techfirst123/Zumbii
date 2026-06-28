"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Search,
  Mic,
  Camera,
  ShoppingBag,
  Store,
  TrendingUp,
  Shield,
  Package,
  Truck,
  HeadphonesIcon,
  BadgePercent,
  Globe,
  Building2,
  Users,
  Star,
  Heart,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Clock,
  MapPin,
  CheckCircle,
  Leaf,
  Zap,
  BarChart3,
  HeartHandshake,
  MessageCircle,
  Download,
  Apple,
  Smartphone,
  Mail,
  Send,
  Quote,
  ChevronUp,
  Award,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
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

const featuredProducts = [
  { id: 1, name: "Premium Wireless Headphones", price: 2499, originalPrice: 3999, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80", rating: 4.8, reviews: 234, badge: "Best Seller", seller: "TechGadgets India" },
  { id: 2, name: "Smart Watch Pro X2", price: 5999, originalPrice: 8999, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", rating: 4.6, reviews: 189, badge: "New", seller: "WearableTech" },
  { id: 3, name: "Organic Cotton T-Shirt Pack", price: 1299, originalPrice: 1999, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", rating: 4.7, reviews: 456, badge: "Trending", seller: "EcoFashion Hub" },
  { id: 4, name: "Industrial LED Panel 60W", price: 849, originalPrice: 1299, image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=400&q=80", rating: 4.5, reviews: 312, badge: "B2B Deal", seller: "Lighting Solutions" },
  { id: 5, name: "Handcrafted Ceramic Dinner Set", price: 3499, originalPrice: 4999, image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80", rating: 4.9, reviews: 178, badge: "Premium", seller: "ArtisanCraft" },
  { id: 6, name: "Portable Bluetooth Speaker", price: 1799, originalPrice: 2999, image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=400&q=80", rating: 4.4, reviews: 567, badge: "Sale", seller: "AudioPro" },
];

const categories = [
  { name: "Electronics", icon: Zap, count: "12,450+", color: "from-blue-500 to-cyan-400" },
  { name: "Fashion", icon: Sparkles, count: "8,230+", color: "from-pink-500 to-rose-400" },
  { name: "Home & Living", icon: Package, count: "6,780+", color: "from-amber-500 to-orange-400" },
  { name: "Industrial", icon: Building2, count: "4,560+", color: "from-slate-600 to-slate-500" },
  { name: "Food & Beverages", icon: Leaf, count: "3,890+", color: "from-emerald-500 to-green-400" },
  { name: "Health & Beauty", icon: HeartHandshake, count: "5,120+", color: "from-violet-500 to-purple-400" },
  { name: "Automotive", icon: Truck, count: "2,340+", color: "from-red-500 to-rose-400" },
  { name: "Sports & Fitness", icon: TrendingUp, count: "3,670+", color: "from-teal-500 to-cyan-400" },
];

const businessSolutions = [
  {
    type: "B2B Marketplace",
    title: "Source & Supply at Scale",
    description: "Connect with verified manufacturers, suppliers, and distributors. Bulk orders, RFQ system, and competitive pricing.",
    icon: Building2,
    features: ["Verified Suppliers", "RFQ System", "Bulk Pricing", "Secure Payments"],
    color: "from-blue-600 to-blue-800",
    lightColor: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    type: "B2C Retail",
    title: "Direct-to-Consumer Growth",
    description: "Reach millions of customers across India with your products. Smart logistics, easy returns, and real-time analytics.",
    icon: Store,
    features: ["Pan-India Reach", "Smart Logistics", "Analytics Dashboard", "Customer Insights"],
    color: "from-zumbii-500 to-zumbii-700",
    lightColor: "bg-zumbii-50",
    iconColor: "text-zumbii-600",
  },
  {
    type: "Franchise Network",
    title: "Expand with Franchise",
    description: "Scale your business through our franchise network. Complete operational support, training, and technology stack included.",
    icon: Globe,
    features: ["Proven Model", "Training Support", "Tech Stack", "Marketing Aid"],
    color: "from-emerald-500 to-emerald-700",
    lightColor: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
];

const testimonials = [
  { name: "Rajesh Mehta", role: "Supplier, Mumbai", avatar: "RM", content: "Zumbii transformed our manufacturing business. We reached buyers across 15 states within the first month. The B2B RFQ system is a game-changer.", rating: 5 },
  { name: "Priya Sharma", role: "Franchise Partner, Delhi", avatar: "PS", content: "The franchise onboarding was seamless. Training, technology, marketing support — everything was world-class. Revenue grew 3x in 6 months.", rating: 5 },
  { name: "Amit Verma", role: "Retailer, Bangalore", avatar: "AV", content: "As a small retailer, getting wholesale prices was always tough. Zumbii made it easy. I save 30% on procurement and delivery is always on time.", rating: 5 },
  { name: "Sunita Patel", role: "Customer, Ahmedabad", avatar: "SP", content: "Love the variety and quality! The AI search helps me find exactly what I need. Returns are hassle-free and customer support is always responsive.", rating: 4 },
  { name: "Vikram Singh", role: "Distributor, Jaipur", avatar: "VS", content: "Zumbii's logistics network is incredible. We now serve 200+ retailers across Rajasthan with next-day delivery. The platform is intuitive and reliable.", rating: 5 },
];

const suppliers = [
  { name: "Tata Electronics", logo: "TE", category: "Electronics", location: "Mumbai, India" },
  { name: "Bharat Foods Ltd", logo: "BF", category: "Food & Beverages", location: "Delhi, India" },
  { name: "EcoTex Industries", logo: "ET", category: "Textiles", location: "Surat, India" },
  { name: "GreenAuto Parts", logo: "GA", category: "Automotive", location: "Chennai, India" },
  { name: "MediLife Healthcare", logo: "MH", category: "Healthcare", location: "Hyderabad, India" },
  { name: "Rise & Shine Organics", logo: "RO", category: "Organic Foods", location: "Pune, India" },
];

const brands = [
  { name: "Apple", logo: "A" }, { name: "Samsung", logo: "S" }, { name: "Nike", logo: "N" },
  { name: "Adidas", logo: "Ad" }, { name: "Sony", logo: "So" }, { name: "LG", logo: "LG" },
  { name: "Puma", logo: "P" }, { name: "Bose", logo: "B" },
];

const whyChooseZumbii = [
  { icon: Shield, title: "Secure Transactions", description: "100% secure payments with buyer protection and escrow services for peace of mind." },
  { icon: Truck, title: "Pan-India Delivery", description: "Fast, reliable logistics covering 29,000+ pin codes across India with real-time tracking." },
  { icon: BadgePercent, title: "Best Prices", description: "Competitive pricing with bulk discounts, price matching, and exclusive B2B deals." },
  { icon: Users, title: "Verified Community", description: "All sellers are thoroughly verified. Trust ratings, reviews, and transparent business profiles." },
  { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated account managers for businesses. AI-powered chat and phone support round the clock." },
  { icon: BarChart3, title: "Smart Analytics", description: "Real-time sales data, customer insights, and inventory analytics to grow your business." },
  { icon: CheckCircle, title: "Quality Guarantee", description: "Strict quality checks, easy returns, and replacement guarantee on all products." },
  { icon: MessageCircle, title: "Direct Communication", description: "Built-in chat with buyers and sellers. Negotiate, share samples, and build relationships." },
];

const stats = [
  { value: "50K+", label: "Products", icon: Package },
  { value: "10K+", label: "Sellers", icon: Store },
  { value: "500+", label: "Cities", icon: MapPin },
  { value: "2M+", label: "Users", icon: Users },
];

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.3),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center lg:text-left">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-zumbii-200" />
              <span className="text-sm font-medium text-white/90">India&apos;s Trusted Business Marketplace</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Empowering Businesses,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
                Connecting Communities,
              </span>{" "}
              Growing Together.
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              India&apos;s premier B2B & B2C marketplace. Source products, grow your business, and connect with a thriving community of sellers, suppliers, and buyers.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button variant="white" size="lg" className="shadow-2xl">
                <ShoppingBag className="w-5 h-5" />
                Start Shopping
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                <Store className="w-5 h-5" />
                Become a Seller
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 max-w-xl mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white/20 focus-within:border-white/30">
                  <Search className="ml-4 w-5 h-5 text-white/50 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, suppliers..."
                    className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 text-sm focus:outline-none"
                  />
                  <div className="flex items-center gap-1 pr-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Voice search">
                      <Mic className="w-4 h-4 text-white/50" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Image search">
                      <Camera className="w-4 h-4 text-white/50" />
                    </button>
                    <button className="ml-1 bg-white text-zumbii-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-zumbii-50 transition-colors">
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start text-white/50 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 50K+ Products</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 10K+ Sellers</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 500+ Cities</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 2M+ Users</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-zumbii-400/20 to-transparent rounded-3xl" />
              <div className="relative glass rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                      <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 animate-pulse flex items-center justify-center">
                        <Package className="w-8 h-8 text-white/20" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-3 w-32 bg-white/10 rounded-full" />
                      <div className="h-4 w-24 bg-white/10 rounded-full mt-2" />
                    </div>
                    <div className="h-8 w-20 bg-white/10 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl">
                <BadgePercent className="w-8 h-8 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function StatsCounter() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    if (isInView && !counted) setCounted(true);
  }, [isInView, counted]);

  return (
    <section ref={ref} className="relative -mt-16 z-20">
      <Container>
        <div className="glass rounded-3xl shadow-xl border border-white/20 py-8 px-6 sm:py-10 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center gap-2"
              >
                <stat.icon className="w-6 h-6 text-zumbii-500" />
                <span className="text-3xl sm:text-4xl font-bold text-text-primary">
                  {stat.value}
                </span>
                <span className="text-sm text-text-tertiary">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeaturedProductsSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Featured Products"
            subtitle="Handpicked premium products from our verified sellers"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={fadeInUp}>
              <Card className="group h-full flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-surface-tertiary">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <Badge variant={product.badge === "New" ? "new" : "default"}>{product.badge}</Badge>
                  </div>
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-text-secondary" />
                  </button>
                </div>
                <div className="flex-1 p-4 sm:p-5 flex flex-col">
                  <p className="text-xs text-text-tertiary mb-1">{product.seller}</p>
                  <h3 className="font-semibold text-text-primary text-sm sm:text-base leading-snug line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-text-primary">{product.rating}</span>
                    <span className="text-xs text-text-tertiary">({product.reviews})</span>
                  </div>
                  <div className="mt-auto pt-3 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-zumbii-600">₹{product.price.toLocaleString()}</span>
                      <span className="ml-2 text-xs text-text-tertiary line-through">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <button className="w-9 h-9 rounded-full bg-zumbii-50 text-zumbii-600 hover:bg-zumbii-600 hover:text-white transition-colors flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <FadeInSection className="text-center mt-10">
          <Link href="/shop">
            <Button variant="outline" size="lg">
              View All Products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </FadeInSection>
      </Container>
    </section>
  );
}

function CategoriesSection() {
  const iconMap: Record<string, React.ElementType> = {
    Zap, Sparkles, Package, Building2, Leaf, HeartHandshake, Truck, TrendingUp,
  };

  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <SectionHeader
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
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon.name] || Package;
            return (
              <motion.div key={cat.name} variants={fadeInUp}>
                <Link
                  href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group block"
                >
                  <Card className="p-6 sm:p-8 text-center">
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-text-primary text-sm sm:text-base">{cat.name}</h3>
                    <p className="mt-1 text-xs text-text-tertiary">{cat.count} products</p>
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

function BusinessSolutionsSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Business Solutions"
            subtitle="Tailored platforms for every business need — from sourcing to selling to franchising"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {businessSolutions.map((solution) => (
            <motion.div key={solution.type} variants={fadeInUp}>
              <Card className="h-full flex flex-col p-6 sm:p-8" hover>
                <div className={`w-14 h-14 rounded-2xl ${solution.lightColor} flex items-center justify-center mb-5`}>
                  <solution.icon className={`w-7 h-7 ${solution.iconColor}`} />
                </div>
                <Badge variant="default" className="mb-3 w-fit">{solution.type}</Badge>
                <h3 className="text-xl font-bold text-text-primary mb-3">{solution.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed mb-6">{solution.description}</p>
                <ul className="mt-auto space-y-2.5">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${solution.type.toLowerCase().replace(/\s+/g, "-")}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-zumbii-600 hover:text-zumbii-700 group"
                >
                  Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function FranchiseBanner() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeInSection>
            <Badge variant="new" className="mb-4">Franchise Opportunity</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Own a Zumbii Franchise in Your City
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Join India&apos;s fastest-growing business ecosystem. Low investment, high returns, complete operational support, and a proven business model.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                { value: "₹50K", label: "Starting Investment" },
                { value: "3-6", label: "Months Break-even" },
                { value: "200+", label: "Franchise Partners" },
                { value: "30+", label: "Cities Covered" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-white">{item.value}</div>
                  <div className="text-sm text-white/60 mt-1">{item.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="white" size="lg">
                Apply Now <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                Learn More
              </Button>
            </div>
          </FadeInSection>
          <FadeInSection className="hidden lg:block">
            <div className="relative">
              <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Complete Training Program</div>
                      <div className="text-xs text-white/50">2 weeks comprehensive training</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Technology Stack Included</div>
                      <div className="text-xs text-white/50">Proprietary platform & tools</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Marketing Support</div>
                      <div className="text-xs text-white/50">Local & national campaigns</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <HeadphonesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">24/7 Operations Support</div>
                      <div className="text-xs text-white/50">Dedicated relationship manager</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-white/10 rounded-3xl -z-10" />
            </div>
          </FadeInSection>
        </div>
      </Container>
    </section>
  );
}

function TrendingProductsSection() {
  const trending = featuredProducts.slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Trending Now"
            subtitle="Most viewed and fastest-selling products this week"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trending.map((product) => (
            <motion.div key={product.id} variants={scaleIn}>
              <Card className="group">
                <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-xs font-medium">
                      <TrendingUp className="w-3 h-3 text-red-500" />
                      Hot
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-text-tertiary mb-1">{product.seller}</p>
                  <h3 className="font-semibold text-text-primary text-sm line-clamp-2">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs text-text-primary">{product.rating}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-zumbii-600">₹{product.price.toLocaleString()}</span>
                      <span className="ml-1.5 text-xs text-text-tertiary line-through">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <span className="text-xs text-green-600 font-medium">{Math.round((1 - product.price / product.originalPrice) * 100)}% off</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <FadeInSection className="text-center mt-10">
          <Link href="/trending">
            <Button variant="outline" size="lg">
              Explore Trending <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </FadeInSection>
      </Container>
    </section>
  );
}

function SuppliersSection() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Featured Suppliers"
            subtitle="Trusted businesses powering India's commerce"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {suppliers.map((supplier) => (
            <motion.div key={supplier.name} variants={fadeInUp}>
              <Link href="#" className="block">
                <Card className="p-5 sm:p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {supplier.logo}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-text-primary text-sm sm:text-base truncate">{supplier.name}</h3>
                    <p className="text-xs text-text-tertiary mt-0.5">{supplier.category}</p>
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-text-tertiary">
                      <MapPin className="w-3 h-3" />
                      {supplier.location}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0 ml-auto" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        <FadeInSection className="text-center mt-10">
          <Link href="/suppliers">
            <Button variant="outline" size="lg">
              View All Suppliers <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </FadeInSection>
      </Container>
    </section>
  );
}

function BrandsStrip() {
  return (
    <section className="py-16 bg-white border-y border-zumbii-100">
      <Container>
        <FadeInSection>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-text-tertiary mb-8">
            Trusted by leading brands
          </p>
        </FadeInSection>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {brands.map((brand) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface-secondary flex items-center justify-center group-hover:bg-zumbii-50 transition-colors border border-zumbii-100">
                <span className="text-lg sm:text-xl font-bold text-text-tertiary group-hover:text-zumbii-600 transition-colors">
                  {brand.logo}
                </span>
              </div>
              <p className="text-center text-xs text-text-tertiary mt-2 group-hover:text-zumbii-500 transition-colors">{brand.name}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function WhyChooseZumbiiSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Why Choose Zumbii?"
            subtitle="Built for businesses, designed for growth"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {whyChooseZumbii.map((item) => (
            <motion.div key={item.title} variants={fadeInUp}>
              <Card className="p-6 text-center h-full">
                <div className="w-12 h-12 mx-auto rounded-xl bg-zumbii-50 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-zumbii-600" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm sm:text-base mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
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
                <Quote className="w-10 h-10 text-zumbii-200 mb-4" />
                <p className="text-lg sm:text-xl text-text-primary leading-relaxed">
                  &ldquo;{testimonials[current].content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-1">
                  {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-zumbii-600 w-6" : "bg-zumbii-200"}`}
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

function DownloadAppSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zumbii-600 via-zumbii-700 to-zumbii-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),transparent_50%)]" />
      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeInSection>
            <Badge variant="new" className="mb-4">Mobile App</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Your Business in Your Pocket
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Manage orders, chat with suppliers, track deliveries, and grow your business on the go with the Zumbii mobile app.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Real-time order tracking & notifications",
                "Instant chat with buyers & sellers",
                "AI-powered product recommendations",
                "Barcode scanning & quick reorder",
                "Offline catalog browsing",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <button className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-black/80 transition-colors shadow-xl">
                <Apple className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-[10px] text-white/60">Download on the</div>
                  <div className="text-sm font-semibold -mt-0.5">App Store</div>
                </div>
              </button>
              <button className="inline-flex items-center gap-3 bg-black text-white px-6 py-3 rounded-2xl hover:bg-black/80 transition-colors shadow-xl">
                <Smartphone className="w-7 h-7" />
                <div className="text-left">
                  <div className="text-[10px] text-white/60">Get it on</div>
                  <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                </div>
              </button>
            </div>
          </FadeInSection>
          <FadeInSection className="hidden lg:flex justify-center">
            <div className="relative">
              <div className="w-64 h-[28rem] bg-white/5 rounded-[2.5rem] border-4 border-white/10 shadow-2xl overflow-hidden">
                <div className="h-6 bg-white/10 flex items-center justify-center">
                  <div className="w-20 h-1.5 rounded-full bg-white/20" />
                </div>
                <div className="p-4 space-y-3">
                  <div className="h-4 w-3/4 bg-white/10 rounded-lg" />
                  <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white/10" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-full bg-white/10 rounded" />
                        <div className="h-3 w-2/3 bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-white/10 rounded-[2.5rem] -z-10" />
              <div className="absolute -top-2 -right-2 w-12 h-12 rounded-full bg-zumbii-400 flex items-center justify-center shadow-lg">
                <Download className="w-6 h-6 text-white" />
              </div>
            </div>
          </FadeInSection>
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
              <Button type="submit" size="lg" className="h-12 shrink-0">
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
  return (
    <>
      <HeroSection />
      <StatsCounter />
      <FeaturedProductsSection />
      <CategoriesSection />
      <BusinessSolutionsSection />
      <FranchiseBanner />
      <TrendingProductsSection />
      <SuppliersSection />
      <BrandsStrip />
      <WhyChooseZumbiiSection />
      <TestimonialsSection />
      <DownloadAppSection />
      <NewsletterSection />
    </>
  );
}
