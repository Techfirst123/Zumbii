"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Building2,
  Package,
  TrendingUp,
  MapPin,
  CheckCircle,
  ArrowRight,
  FileText,
  MessageCircle,
  BadgePercent,
  ShoppingBag,
  Shield,
  Users,
  BarChart3,
  FileSpreadsheet,
  Star,
  UserCheck,
  Search,
  Sparkles,
  ChevronRight,
  ClipboardList,
  Banknote,
  HeadphonesIcon,
  ShieldCheck,
  Globe,
  Truck,
  Clock,
  Handshake,
  Zap,
  LayoutDashboard,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { Badge } from "@/components/ui/Badge";

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

const stats = [
  { value: "10,000+", label: "Verified Suppliers", icon: Building2 },
  { value: "5,00,000+", label: "Products", icon: Package },
  { value: "₹500Cr+", label: "Monthly Trade", icon: TrendingUp },
  { value: "2,500+", label: "Cities Served", icon: MapPin },
];

const features = [
  { icon: ShoppingBag, title: "Bulk Orders", description: "Order products in bulk at wholesale prices with minimum order quantities clearly listed.", color: "from-blue-500 to-cyan-400" },
  { icon: ClipboardList, title: "RFQ System", description: "Send Request for Quotation to multiple suppliers and get competitive bids instantly.", color: "from-violet-500 to-purple-400" },
  { icon: MessageCircle, title: "Negotiation", description: "Direct chat and negotiation tools to agree on pricing and terms with suppliers.", color: "from-emerald-500 to-green-400" },
  { icon: BadgePercent, title: "Custom Pricing", description: "Get exclusive volume-based pricing tailored to your business needs.", color: "from-amber-500 to-orange-400" },
  { icon: FileText, title: "Purchase Orders", description: "Generate and manage purchase orders with automated approval workflows.", color: "from-rose-500 to-pink-400" },
  { icon: UserCheck, title: "Business Verification", description: "Thorough KYC and business verification for all buyers and suppliers.", color: "from-sky-500 to-blue-400" },
  { icon: ShieldCheck, title: "GST Verification", description: "All suppliers are GST-verified with valid GSTIN for input tax credit.", color: "from-teal-500 to-cyan-400" },
  { icon: Shield, title: "Trade Assurance", description: "Escrow-based payment protection ensuring secure transactions for both parties.", color: "from-indigo-500 to-blue-400" },
  { icon: Banknote, title: "Credit Facility", description: "Access business credit and flexible payment terms for approved buyers.", color: "from-green-500 to-emerald-400" },
  { icon: LayoutDashboard, title: "Business Dashboard", description: "Comprehensive analytics dashboard to track orders, spending, and supplier performance.", color: "from-orange-500 to-amber-400" },
  { icon: FileSpreadsheet, title: "Invoice Management", description: "Automated invoicing with GST compliance and payment reconciliation.", color: "from-red-500 to-rose-400" },
  { icon: BarChart3, title: "Supplier Dashboard", description: "Real-time insights on sales, inquiries, and buyer behavior for suppliers.", color: "from-cyan-500 to-blue-400" },
  { icon: Star, title: "Vendor Rating", description: "Rate and review suppliers based on product quality, delivery, and service.", color: "from-yellow-500 to-amber-400" },
];

const howItWorks = [
  { step: 1, title: "Register", description: "Create your business account with GST and business details.", icon: Building2 },
  { step: 2, title: "Get Verified", description: "Complete KYC verification to unlock B2B features.", icon: UserCheck },
  { step: 3, title: "Browse Products", description: "Explore products from verified suppliers across categories.", icon: Search },
  { step: 4, title: "Send Inquiry", description: "Send RFQ or direct inquiry to shortlisted suppliers.", icon: MessageCircle },
  { step: 5, title: "Negotiate", description: "Discuss pricing, MOQ, timelines, and payment terms.", icon: Handshake },
  { step: 6, title: "Place Order", description: "Confirm the order with secure payment and track delivery.", icon: ShoppingBag },
];

const featuredSuppliers = [
  { name: "Tata Electronics", logo: "TE", category: "Electronics & Components", location: "Mumbai, India", rating: 4.8, products: "2,340", verified: true },
  { name: "Bharat Foods Ltd", logo: "BF", category: "Food Processing & Packaging", location: "Delhi, India", rating: 4.7, products: "1,890", verified: true },
  { name: "EcoTex Industries", logo: "ET", category: "Textiles & Fabrics", location: "Surat, India", rating: 4.9, products: "3,120", verified: true },
  { name: "GreenAuto Parts", logo: "GA", category: "Automotive Components", location: "Chennai, India", rating: 4.6, products: "1,560", verified: true },
  { name: "MediLife Healthcare", logo: "MH", category: "Medical Equipment & Pharma", location: "Hyderabad, India", rating: 4.8, products: "980", verified: true },
  { name: "Rise & Shine Organics", logo: "RO", category: "Organic Farming & Produce", location: "Pune, India", rating: 4.7, products: "670", verified: true },
];

const categories = [
  { name: "Electronics", count: "45,000+", color: "from-blue-500 to-cyan-400" },
  { name: "Industrial", count: "32,000+", color: "from-slate-600 to-slate-500" },
  { name: "Fashion & Textiles", count: "28,000+", color: "from-pink-500 to-rose-400" },
  { name: "Food & Agriculture", count: "22,000+", color: "from-emerald-500 to-green-400" },
  { name: "Chemicals", count: "18,000+", color: "from-amber-500 to-orange-400" },
  { name: "Automotive", count: "15,000+", color: "from-red-500 to-rose-400" },
  { name: "Pharmaceuticals", count: "12,000+", color: "from-violet-500 to-purple-400" },
  { name: "Construction", count: "10,000+", color: "from-stone-500 to-stone-400" },
];

export default function B2BMarketplacePage() {
  const [email, setEmail] = useState("");

  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zumbii-900 via-zumbii-800 to-zumbii-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.25),transparent_50%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl" />

        <Container className="relative z-10 pt-32 pb-16 lg:pt-40 lg:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
                <Building2 className="w-4 h-4 text-zumbii-200" />
                <span className="text-sm font-medium text-white/90">B2B Marketplace</span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Source Products in{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
                  Bulk
                </span>{" "}
                from Verified Suppliers
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
                India&apos;s most trusted B2B marketplace. Connect with verified suppliers, negotiate pricing, and grow your business with seamless procurement.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
                <Link href="/b2b/bulk-order">
                  <Button variant="white" size="lg" className="shadow-2xl">
                    <ShoppingBag className="w-5 h-5" />
                    Start Bulk Ordering
                  </Button>
                </Link>
                <Link href="/b2b/rfq">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                    <FileText className="w-5 h-5" />
                    Send RFQ
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Verified Suppliers</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> GST Verified</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Trade Assurance</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Easy Credit</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative">
                <div className="glass rounded-3xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-zumbii-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">Today&apos;s Trade</div>
                        <div className="text-xs text-white/50">₹12.4 Cr processed</div>
                      </div>
                    </div>
                    <Badge variant="new" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">Live</Badge>
                  </div>
                  <div className="space-y-3">
                    {[
                      { prod: "Industrial LED Panels 100W", qty: "5,000 units", amount: "₹42.5L", status: "Completed" },
                      { prod: "Organic Cotton Fabric Roll", qty: "10,000 mtr", amount: "₹18.2L", status: "In Transit" },
                      { prod: "Pharmaceutical Raw Materials", qty: "2,500 kg", amount: "₹85.0L", status: "Processing" },
                      { prod: "Automotive Spare Parts Kit", qty: "3,000 pcs", amount: "₹24.8L", status: "Dispatched" },
                    ].map((trade, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white truncate">{trade.prod}</div>
                          <div className="text-xs text-white/50 mt-0.5">{trade.qty}</div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-semibold text-white">{trade.amount}</div>
                          <span className="text-[10px] text-emerald-400">{trade.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-zumbii-500/20 to-emerald-500/20 border border-white/5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Your estimated savings</span>
                      <span className="text-white font-bold text-lg">₹2.4L</span>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-zumbii-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="w-7 h-7 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section className="relative -mt-16 z-20">
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
                  <span className="text-3xl sm:text-4xl font-bold text-text-primary">{stat.value}</span>
                  <span className="text-sm text-text-tertiary">{stat.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="Everything You Need to Scale"
              subtitle="Powerful tools and features designed for business procurement and growth"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="p-6 h-full" hover>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-text-primary mb-2">{feature.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-20 lg:py-28 bg-surface-secondary overflow-hidden">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="How It Works"
              subtitle="Simple steps to start sourcing products in bulk"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 relative"
          >
            <div className="hidden lg:block absolute top-24 left-[calc(8.33%+24px)] right-[calc(8.33%+24px)] h-0.5 bg-gradient-to-r from-zumbii-200 via-zumbii-400 to-zumbii-200" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {howItWorks.map((item) => (
                <motion.div key={item.step} variants={fadeInUp} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative z-10 w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-xl mb-4">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute top-0 -right-2 w-6 h-6 rounded-full bg-zumbii-100 border-2 border-white flex items-center justify-center z-20">
                      <span className="text-[10px] font-bold text-zumbii-700">{item.step}</span>
                    </div>
                    <h3 className="text-sm font-bold text-text-primary mb-2">{item.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed max-w-[200px]">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="Shop by Category"
              subtitle="Explore products across diverse industrial categories"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          >
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={fadeInUp}>
                <Link href={`/category/${cat.name.toLowerCase().replace(/\s+/g, "-")}`} className="group block">
                  <Card className="p-6 text-center" hover>
                    <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="mt-4 font-semibold text-text-primary text-sm">{cat.name}</h3>
                    <p className="mt-1 text-xs text-text-tertiary">{cat.count} products</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-20 lg:py-28 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="Featured Suppliers"
              subtitle="Trusted businesses powering India's B2B commerce"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredSuppliers.map((supplier) => (
              <motion.div key={supplier.name} variants={fadeInUp}>
                <Link href="#" className="block">
                  <Card className="p-5 sm:p-6" hover>
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white font-bold text-lg shrink-0">
                        {supplier.logo}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary text-sm sm:text-base truncate">{supplier.name}</h3>
                          {supplier.verified && <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-text-tertiary mt-0.5">{supplier.category}</p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-text-tertiary">
                          <MapPin className="w-3 h-3" />
                          {supplier.location}
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-medium text-text-primary">{supplier.rating}</span>
                          </div>
                          <span className="text-xs text-text-tertiary">{supplier.products} products</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-tertiary shrink-0 mt-1" />
                    </div>
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

      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zumbii-600 via-zumbii-700 to-zumbii-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-zumbii-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl" />

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <Badge variant="new" className="mb-4 bg-white/10 text-white border-white/20">Business Registration</Badge>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
                Register Your Business & Start Sourcing Today
              </h2>
              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Join 10,000+ verified businesses on Zumbii B2B. Get access to exclusive supplier networks, competitive pricing, and trade assurance.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Free business account registration",
                  "Dedicated relationship manager",
                  "Priority support & dispute resolution",
                  "Access to trade financing & credit",
                  "Exclusive B2B deals & bulk discounts",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/sell">
                  <Button variant="white" size="lg">
                    Register as Buyer <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white">
                    Register as Supplier
                  </Button>
                </Link>
              </div>
            </FadeInSection>
            <FadeInSection className="hidden lg:block">
              <div className="relative">
                <div className="glass rounded-3xl p-8 border border-white/10 shadow-2xl">
                  <div className="space-y-4">
                    {[
                      { icon: Building2, title: "Company Verification", desc: "GST, PAN & business verification" },
                      { icon: ShieldCheck, title: "Trade Assurance", desc: "Escrow protection up to ₹50L" },
                      { icon: HeadphonesIcon, title: "Dedicated Support", desc: "24/7 account management" },
                      { icon: Banknote, title: "Credit Facility", desc: "Up to ₹25Cr credit line" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.title}</div>
                          <div className="text-xs text-white/50">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-white/10 rounded-3xl -z-10" />
              </div>
            </FadeInSection>
          </div>
        </Container>
      </section>

      <section className="py-20 lg:py-28 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-6 shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <SectionHeader
                title="Ready to Transform Your Procurement?"
                subtitle="Join India's fastest-growing B2B marketplace and start sourcing smarter."
              />
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/b2b/bulk-order">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Bulk Ordering <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/b2b/rfq">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Submit RFQ <FileText className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </>
  );
}
