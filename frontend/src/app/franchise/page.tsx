"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  TrendingUp,
  Shield,
  MapPin,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  BarChart3,
  HeartHandshake,
  HeadphonesIcon,
  Globe,
  Building2,
  Package,
  Truck,
  Award,
  GraduationCap,
  Target,
  Sparkles,
  Store,
  Network,
  Handshake,
  Leaf,
  Factory,
  Warehouse,
  ShoppingBag,
  DollarSign,
  Percent,
  Phone,
  Mail,
  Send,
  User,
  Building,
  MessageSquare,
  FileText,
  Upload,
  ChevronDown,
  Briefcase,
  Rocket,
  Infinity,
  BadgePercent,
  Clock,
  Settings,
  Megaphone,
  PenTool,
  Monitor,
  Smartphone,
  BookOpen,
  Gift,
  ThumbsUp,
} from "lucide-react";

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

const whyPartnerBenefits = [
  { icon: DollarSign, title: "Low Investment", description: "Start your franchise journey with minimal capital. Our models are designed for affordability." },
  { icon: TrendingUp, title: "High Growth", description: "Tap into India's booming digital commerce market with exponential growth potential." },
  { icon: MapPin, title: "Exclusive Territory", description: "Get exclusive operational rights in your chosen city or district." },
  { icon: Award, title: "Brand Recognition", description: "Leverage the trusted Zumbii brand with established market credibility." },
  { icon: Monitor, title: "Technology Support", description: "Access our proprietary platform, AI tools, and real-time analytics dashboard." },
  { icon: Megaphone, title: "Marketing Assistance", description: "National campaigns, local marketing collaterals, and digital ad support." },
  { icon: Network, title: "Vendor Network", description: "Connect with 10,000+ verified suppliers and manufacturers pan-India." },
  { icon: GraduationCap, title: "Training & Onboarding", description: "Comprehensive 2-week training program covering operations, sales, and technology." },
  { icon: Settings, title: "Operations Support", description: "End-to-end operational guidance including SOPs, compliance, and quality control." },
  { icon: User, title: "Dedicated Account Manager", description: "A personal relationship manager to support your business growth journey." },
  { icon: Truck, title: "Logistics Support", description: "Pan-India logistics network covering 29,000+ pin codes with real-time tracking." },
  { icon: Smartphone, title: "Digital Marketing", description: "SEO, social media, and performance marketing support to drive local sales." },
  { icon: Target, title: "Lead Generation", description: "Qualified business leads delivered to your dashboard every week." },
  { icon: Percent, title: "Profit Sharing", description: "Attractive revenue share model with transparent payout structures." },
];

const franchiseModels = [
  {
    title: "City Master Franchise",
    description: "Own and operate Zumbii across an entire city. Build a team, manage sub-franchises, and drive market dominance.",
    icon: Building2,
    investment: "₹5 Lakhs+",
    territories: "Full City Rights",
    highlights: ["Sub-franchise revenue share", "City-level brand ownership", "Team building authority", "Multiple revenue streams"],
    gradient: "from-purple-600 to-purple-800",
    lightBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "District Franchise",
    description: "Operate within a defined district. Ideal for entrepreneurs looking to dominate a focused geographic area.",
    icon: MapPin,
    investment: "₹2 Lakhs+",
    territories: "District-Level Rights",
    highlights: ["Defined territory", "Local market focus", "Lower investment", "High ROI potential"],
    gradient: "from-blue-600 to-blue-800",
    lightBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Retail Partner",
    description: "Set up a Zumbii retail touchpoint. Serve walk-in customers and facilitate online orders for commissions.",
    icon: Store,
    investment: "₹50,000+",
    territories: "Store-Based Territory",
    highlights: ["Storefront setup support", "Walk-in order commissions", "Low overhead costs", "Quick break-even"],
    gradient: "from-emerald-600 to-emerald-800",
    lightBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    title: "Delivery & Fulfilment Partner",
    description: "Own last-mile delivery and fulfilment operations for Zumbii orders in your region.",
    icon: Truck,
    investment: "₹1 Lakh+",
    territories: "Delivery Zone Rights",
    highlights: ["Consistent order volume", "Per-delivery earnings", "Flexible operations", "Scalable model"],
    gradient: "from-orange-600 to-orange-800",
    lightBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Distributor Partner",
    description: "Become an authorized Zumbii distributor. Supply products to retailers and earn bulk margins.",
    icon: Warehouse,
    investment: "₹3 Lakhs+",
    territories: "Distribution Zone",
    highlights: ["Bulk margin earnings", "Established supply chain", "Retail network access", "Volume-based incentives"],
    gradient: "from-rose-600 to-rose-800",
    lightBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
];

const expansionFocus = [
  { icon: Building2, title: "Tier 2 Cities", description: "Cities like Jaipur, Lucknow, Nagpur with growing digital adoption and underserved markets.", color: "from-blue-500 to-cyan-400" },
  { icon: MapPin, title: "Tier 3 Cities", description: "Emerging towns with high potential and low competition. First-mover advantage awaits.", color: "from-emerald-500 to-green-400" },
  { icon: TrendingUp, title: "Emerging Markets", description: "High-growth areas with increasing internet penetration and rising disposable incomes.", color: "from-purple-500 to-pink-400" },
  { icon: Factory, title: "Industrial Clusters", description: "Manufacturing hubs with dense B2B activity. Perfect for distributor and B2B franchise models.", color: "from-amber-500 to-orange-400" },
  { icon: Store, title: "Semi-Urban Markets", description: "Fast-growing peri-urban areas bridging rural and urban commerce with unique opportunities.", color: "from-rose-500 to-red-400" },
  { icon: Leaf, title: "Rural India", description: "Untapped rural markets with vast potential for e-commerce and digital service adoption.", color: "from-teal-500 to-cyan-400" },
];

const investmentPlans = [
  {
    title: "Basic Franchise",
    price: "₹50,000 - ₹1 Lakh",
    description: "Perfect for individuals starting small. Ideal for retail kiosks and micro-franchise outlets.",
    features: ["Single location rights", "Basic tech access", "Standard marketing kit", "Email support", "Self-paced training"],
    popular: false,
    gradient: "from-slate-600 to-slate-800",
  },
  {
    title: "Business Franchise",
    price: "₹1 Lakh - ₹3 Lakhs",
    description: "For growing entrepreneurs. Includes dedicated territory, advanced tools, and priority support.",
    features: ["Territory exclusivity", "Advanced tech platform", "Digital marketing support", "Priority support", "On-site training"],
    popular: true,
    gradient: "from-zumbii-500 to-zumbii-700",
  },
  {
    title: "Master Franchise",
    price: "₹3 Lakhs - ₹10 Lakhs",
    description: "City/regional master rights. Build a team, manage sub-franchisees, and maximize returns.",
    features: ["Full city rights", "Sub-franchise authority", "Complete tech suite", "Dedicated account manager", "National marketing"],
    popular: false,
    gradient: "from-violet-600 to-violet-800",
  },
  {
    title: "Enterprise Partner",
    price: "₹10 Lakhs+",
    description: "For large-scale operators. Multi-city rights, enterprise features, and strategic partnership benefits.",
    features: ["Multi-city rights", "Enterprise dashboard", "API integrations", "Strategic partnership", "Revenue share+equity"],
    popular: false,
    gradient: "from-amber-600 to-amber-800",
  },
];

const franchiseBenefits = [
  { icon: Rocket, title: "Proven Business Model", description: "A battle-tested model that has delivered results across 30+ cities." },
  { icon: Shield, title: "Low Risk, High Reward", description: "Minimal investment with maximum upside through diversified revenue streams." },
  { icon: Globe, title: "Pan-India Presence", description: "Be part of India's fastest-growing digital commerce network spanning 500+ cities." },
  { icon: GraduationCap, title: "Comprehensive Training", description: "World-class training programs covering operations, sales, marketing, and technology." },
  { icon: HeadphonesIcon, title: "24/7 Support System", description: "Round-the-clock support from our dedicated franchise success team." },
  { icon: Monitor, title: "Cutting-Edge Technology", description: "Proprietary platform with AI-powered analytics, inventory management, and CRM tools." },
  { icon: Megaphone, title: "Marketing & Brand Support", description: "Powerful national brand campaigns plus localized marketing assistance." },
  { icon: Users, title: "Dedicated Onboarding Team", description: "End-to-end onboarding support from documentation to launch." },
  { icon: TrendingUp, title: "Data-Driven Insights", description: "Real-time business intelligence to help you make informed decisions." },
  { icon: Handshake, title: "Collaborative Community", description: "Join a thriving community of franchise partners sharing best practices." },
];

const investmentRanges = [
  "₹50,000 - ₹1 Lakh",
  "₹1 Lakh - ₹3 Lakhs",
  "₹3 Lakhs - ₹5 Lakhs",
  "₹5 Lakhs - ₹10 Lakhs",
  "₹10 Lakhs - ₹25 Lakhs",
  "₹25 Lakhs - ₹50 Lakhs",
  "₹50 Lakhs+",
];

const territories = [
  "City Master",
  "District",
  "Retail Partner",
  "Delivery & Fulfilment",
  "Distributor",
  "Not Sure / Discuss",
];

const stateList = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli", "Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const currentBusinessOptions = [
  "Retail Business",
  "Wholesale / Distribution",
  "E-Commerce",
  "Logistics / Transport",
  "Food & Beverages",
  "Manufacturing",
  "Real Estate",
  "Education / Training",
  "Technology / IT Services",
  "Healthcare",
  "Agriculture",
  "Other Business",
  "First-Time Entrepreneur",
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.25),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

      <div
        className="relative z-10 w-full section-padding"
        style={{ paddingBlock: "clamp(56px, 10vw, 128px)" }}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles className="w-4 h-4 text-zumbii-200" />
              <span className="text-sm font-medium text-white/90">Franchise Opportunities</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Become a Zumbii{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
                Franchise Partner
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
              Join India&apos;s Growing Digital Commerce Network. Own a profitable franchise with low investment, complete support, and unlimited growth potential.
            </motion.p>

            <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href="#franchise-form"
                className="inline-flex items-center gap-2 bg-white text-zumbii-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-zumbii-50 transition-all shadow-2xl"
              >
                Apply Now <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#franchise-models"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Explore Models
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-6 text-white/50 text-sm">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 200+ Partners</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> 30+ Cities</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Low Investment</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-green-400" /> Full Support</span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="relative max-w-lg mx-auto">
              <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Starting Investment", value: "₹50K", icon: DollarSign },
                    { label: "Break-even", value: "3-6 Months", icon: Clock },
                    { label: "ROI Potential", value: "2-3x", icon: TrendingUp },
                    { label: "Cities Live", value: "30+", icon: Globe },
                  ].map((stat) => (
                    <div key={stat.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <stat.icon className="w-6 h-6 text-zumbii-300 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-white/50 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Join 200+ Franchise Partners</div>
                      <div className="text-xs text-white/50">Across 30+ cities in India</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-white/10 rounded-3xl -z-10" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WhyPartnerSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <div className="section-padding">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-4">
              <HeartHandshake className="w-4 h-4 text-zumbii-600" />
              <span className="text-sm font-medium text-zumbii-700">Why Partner With Us</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Why Partner With <span className="gradient-text">Zumbii</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              We provide everything you need to build a successful franchise business in India&apos;s growing digital commerce ecosystem.
            </p>
          </div>
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {whyPartnerBenefits.map((benefit) => (
            <motion.div key={benefit.title} variants={fadeInUp}>
              <div className="group bg-white rounded-2xl p-6 border border-border hover:border-zumbii-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full">
                <div className="w-12 h-12 rounded-xl bg-zumbii-50 flex items-center justify-center mb-4 group-hover:bg-zumbii-100 transition-colors">
                  <benefit.icon className="w-6 h-6 text-zumbii-600" />
                </div>
                <h3 className="font-semibold text-text-primary text-base mb-2">{benefit.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FranchiseModelsSection() {
  return (
    <section id="franchise-models" className="py-20 lg:py-28">
      <div className="section-padding">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-4">
              <Network className="w-4 h-4 text-zumbii-600" />
              <span className="text-sm font-medium text-zumbii-700">Choose Your Path</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Franchise <span className="gradient-text">Models</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Select the franchise model that aligns with your investment capacity, experience, and growth goals.
            </p>
          </div>
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {franchiseModels.map((model) => (
            <motion.div key={model.title} variants={fadeInUp}>
              <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                <div className={`bg-gradient-to-br ${model.gradient} p-6 sm:p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm border border-white/10 mb-4">
                      <model.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{model.title}</h3>
                    <p className="text-white/70 text-sm">{model.description}</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs text-text-tertiary uppercase tracking-wider font-medium">Investment</div>
                    <div className="text-xs text-text-tertiary uppercase tracking-wider font-medium">Territory</div>
                  </div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-lg font-bold text-text-primary">{model.investment}</div>
                    <div className="text-sm font-medium text-zumbii-600">{model.territories}</div>
                  </div>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {model.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#franchise-form"
                    className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border-2 border-zumbii-200 text-zumbii-600 hover:bg-zumbii-600 hover:text-white hover:border-zumbii-600 transition-all"
                  >
                    Apply Now <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ExpansionSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(12,142,234,0.03),transparent_50%)]" />
      <div className="section-padding relative z-10">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-4">
              <Target className="w-4 h-4 text-zumbii-600" />
              <span className="text-sm font-medium text-zumbii-700">Our Focus</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Expansion <span className="gradient-text">Focus</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              We are aggressively expanding into high-potential markets across India. These are our priority regions.
            </p>
          </div>
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {expansionFocus.map((area) => (
            <motion.div key={area.title} variants={fadeInUp}>
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border hover:shadow-lg transition-all duration-300 group h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${area.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <area.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{area.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{area.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function InvestmentPlansSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="section-padding">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-4">
              <Briefcase className="w-4 h-4 text-zumbii-600" />
              <span className="text-sm font-medium text-zumbii-700">Investment Plans</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Choose Your <span className="gradient-text">Investment Plan</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              Flexible franchise options designed for every budget. Contact us for detailed pricing and customized plans.
            </p>
          </div>
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {investmentPlans.map((plan) => (
            <motion.div key={plan.title} variants={fadeInUp} className="relative">
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-zumbii-600 text-white text-xs font-semibold shadow-lg">
                    <Star className="w-3 h-3" /> Most Popular
                  </span>
                </div>
              )}
              <div className={`bg-white rounded-2xl border ${plan.popular ? "border-zumbii-300 shadow-xl" : "border-border shadow-sm"} overflow-hidden transition-all duration-300 hover:shadow-xl h-full flex flex-col ${plan.popular ? "scale-[1.02]" : ""}`}>
                <div className={`bg-gradient-to-br ${plan.gradient} p-6 relative`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8" />
                  <h3 className="text-xl font-bold text-white relative z-10">{plan.title}</h3>
                  <div className="mt-3 relative z-10">
                    <div className="text-2xl font-bold text-white">{plan.price}</div>
                    <div className="text-xs text-white/60 mt-1">Contact for exact pricing</div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-text-secondary mb-5">{plan.description}</p>
                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-text-secondary">
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#franchise-form"
                    className={`inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                      plan.popular
                        ? "bg-zumbii-600 text-white hover:bg-zumbii-700 shadow-md"
                        : "border-2 border-zumbii-200 text-zumbii-600 hover:bg-zumbii-600 hover:text-white hover:border-zumbii-600"
                    }`}
                  >
                    Contact for Pricing <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FranchiseBenefitsSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-5" />
      <div className="section-padding relative z-10">
        <FadeInSection>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-4">
              <Gift className="w-4 h-4 text-zumbii-600" />
              <span className="text-sm font-medium text-zumbii-700">Franchise Benefits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight">
              Everything You <span className="gradient-text">Get</span>
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              As a Zumbii franchise partner, you gain access to a comprehensive support system designed for your success.
            </p>
          </div>
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5"
        >
          {franchiseBenefits.map((benefit) => (
            <motion.div key={benefit.title} variants={fadeInUp}>
              <div className="bg-white rounded-2xl p-6 border border-border hover:border-zumbii-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center h-full">
                <div className="w-14 h-14 mx-auto rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-md">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-text-primary text-sm mb-2">{benefit.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FranchiseFormSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    preferredTerritory: "",
    businessExperience: "",
    investmentCapacity: "",
    currentBusiness: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Application submitted successfully! Our team will contact you within 24 hours.", {
      duration: 5000,
      position: "top-center",
      style: {
        background: "#0f172a",
        color: "#fff",
        borderRadius: "12px",
        padding: "16px 24px",
        fontSize: "14px",
      },
      icon: "🎉",
    });

    setFormData({
      fullName: "",
      companyName: "",
      phone: "",
      whatsapp: "",
      email: "",
      city: "",
      state: "",
      preferredTerritory: "",
      businessExperience: "",
      investmentCapacity: "",
      currentBusiness: "",
      message: "",
    });
    setFile(null);
    setIsSubmitting(false);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary text-sm placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-zumbii-400 focus:border-zumbii-400 transition-all";
  const labelClass = "block text-sm font-medium text-text-primary mb-1.5";
  const selectClass = "w-full px-4 py-3 rounded-xl border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-zumbii-400 focus:border-zumbii-400 transition-all appearance-none";

  return (
    <section id="franchise-form" className="py-20 lg:py-28 bg-surface-secondary">
      <div className="section-padding">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <FadeInSection className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zumbii-50 border border-zumbii-100 mb-4">
                <FileText className="w-4 h-4 text-zumbii-600" />
                <span className="text-sm font-medium text-zumbii-700">Get Started</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                Apply for a <span className="gradient-text">Franchise</span>
              </h2>
              <p className="mt-4 text-base text-text-secondary leading-relaxed">
                Fill out the form and our franchise team will get back to you within 24 hours with personalized guidance.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: Phone, label: "Call / WhatsApp", value: "+91 7050193876" },
                  { icon: Mail, label: "Email Us", value: "info@zumbii.com" },
                  { icon: MapPin, label: "Office", value: "DPT 322/3 Dlf Prime Tower, Okhla Phase-1, New Delhi - 110020" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-zumbii-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-zumbii-600" />
                    </div>
                    <div>
                      <div className="text-xs text-text-tertiary">{item.label}</div>
                      <div className="text-sm font-medium text-text-primary">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-zumbii-50 to-white border border-zumbii-100">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-zumbii-600" />
                  <span className="font-semibold text-text-primary text-sm">100% Confidential</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your information is secure and will only be used for franchise application processing.
                </p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-border">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Rajesh Kumar" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="companyName" className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="text" id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required placeholder="Your Business Name" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className={labelClass}>Phone <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="whatsapp" className={labelClass}>WhatsApp</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="+91 98765 43210" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="email" className={labelClass}>Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="city" className={labelClass}>City <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Your City" className={`${inputClass} pl-10`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="state" className={labelClass}>State <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <select id="state" name="state" value={formData.state} onChange={handleChange} required className={`${selectClass} pl-10`}>
                      <option value="">Select State</option>
                      {stateList.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="preferredTerritory" className={labelClass}>Preferred Territory <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <select id="preferredTerritory" name="preferredTerritory" value={formData.preferredTerritory} onChange={handleChange} required className={`${selectClass} pl-10`}>
                      <option value="">Select Territory Type</option>
                      {territories.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="businessExperience" className={labelClass}>Business Experience <span className="text-red-500">*</span></label>
                  <textarea
                    id="businessExperience"
                    name="businessExperience"
                    value={formData.businessExperience}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Tell us about your business background, years of experience, and any relevant industry exposure..."
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="investmentCapacity" className={labelClass}>Investment Capacity <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <select id="investmentCapacity" name="investmentCapacity" value={formData.investmentCapacity} onChange={handleChange} required className={`${selectClass} pl-10`}>
                      <option value="">Select Range</option>
                      {investmentRanges.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="currentBusiness" className={labelClass}>Current Business</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                    <select id="currentBusiness" name="currentBusiness" value={formData.currentBusiness} onChange={handleChange} className={`${selectClass} pl-10`}>
                      <option value="">Select Current Business</option>
                      {currentBusinessOptions.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Any additional information, questions, or specific requirements..."
                    className={inputClass}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="businessProfile" className={labelClass}>Upload Business Profile</label>
                  <div className="relative">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl bg-surface-secondary hover:bg-surface-tertiary hover:border-zumbii-300 cursor-pointer transition-all">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-6 h-6 text-text-tertiary mb-2" />
                          <p className="text-sm text-text-tertiary"><span className="font-medium text-zumbii-600">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-text-tertiary mt-1">PDF, DOC, or Image (max 10MB)</p>
                        </div>
                        <input id="businessProfile" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                      </label>
                    </div>
                    {file && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        {file.name}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-zumbii-600 to-zumbii-700 text-white px-8 py-4 rounded-xl font-semibold text-base hover:from-zumbii-700 hover:to-zumbii-800 transition-all shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-xs text-text-tertiary text-center mt-3">
                  By submitting, you agree to our Privacy Policy and Terms of Service.
                </p>
              </div>
            </form>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zumbii-600 via-zumbii-700 to-zumbii-900" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-zumbii-300/20 rounded-full blur-3xl" />

      <div className="section-padding relative z-10">
        <FadeInSection>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Ready to Build Your Future with Zumbii?
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Take the first step toward owning a profitable franchise in India&apos;s fastest-growing digital commerce network.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <a
                href="#franchise-form"
                className="inline-flex items-center gap-2 bg-white text-zumbii-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-zumbii-50 transition-all shadow-2xl"
              >
                Apply Today <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="tel:+911800XXX"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all"
              >
                <Phone className="w-5 h-5" /> Call Us
              </a>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [counted, setCounted] = useState(false);

  useEffect(() => {
    if (isInView && !counted) setCounted(true);
  }, [isInView, counted]);

  const stats = [
    { value: "200+", label: "Franchise Partners", icon: Users },
    { value: "30+", label: "Cities Covered", icon: MapPin },
    { value: "₹50K", label: "Starting Investment", icon: DollarSign },
    { value: "2-3x", label: "Avg. ROI", icon: TrendingUp },
  ];

  return (
    <section ref={ref} className="relative -mt-8 lg:-mt-16 z-20">
      <div className="section-padding">
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
      </div>
    </section>
  );
}

export default function FranchisePage() {
  return (
    <>
      <Toaster />
      <HeroSection />
      <StatsSection />
      <WhyPartnerSection />
      <FranchiseModelsSection />
      <ExpansionSection />
      <InvestmentPlansSection />
      <FranchiseBenefitsSection />
      <FranchiseFormSection />
      <CTASection />
    </>
  );
}
