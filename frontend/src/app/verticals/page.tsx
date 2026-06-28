"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Pill,
  Sun,
  Sprout,
  Factory,
  HeartPulse,
  Warehouse,
  Truck,
  Globe,
  ArrowLeftRight,
  Wallet,
  Monitor,
  Megaphone,
  GraduationCap,
  Network,
  Store,
  Clock,
  Rocket,
  Users,
  Building2,
} from "lucide-react";
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

interface Vertical {
  icon: React.ElementType;
  title: string;
  description: string;
  badge: "coming" | "launching";
  launchDate: string;
  gradient: string;
}

const verticals: Vertical[] = [
  {
    icon: ShoppingBag,
    title: "Zumbii Fresh",
    description: "Farm-fresh fruits, vegetables, dairy, and organic produce delivered directly from local farmers to your doorstep.",
    badge: "launching",
    launchDate: "Launching Q3 2025",
    gradient: "from-emerald-500 to-green-400",
  },
  {
    icon: Sparkles,
    title: "Zumbii Fashion",
    description: "Trendy apparel, footwear, and accessories for men, women, and kids from top brands and emerging designers.",
    badge: "launching",
    launchDate: "Launching Q3 2025",
    gradient: "from-pink-500 to-rose-400",
  },
  {
    icon: Pill,
    title: "Zumbii Pharma",
    description: "Genuine medicines, healthcare products, and wellness supplements with verified pharmacy partners across India.",
    badge: "coming",
    launchDate: "Coming Q4 2025",
    gradient: "from-red-500 to-rose-400",
  },
  {
    icon: Sun,
    title: "Zumbii Solar",
    description: "Solar panels, inverters, batteries, and renewable energy solutions for homes and businesses at competitive prices.",
    badge: "coming",
    launchDate: "Coming Q4 2025",
    gradient: "from-amber-500 to-yellow-400",
  },
  {
    icon: Sprout,
    title: "Zumbii Agri",
    description: "Agricultural inputs, seeds, fertilizers, equipment, and farm machinery for the modern Indian farmer.",
    badge: "coming",
    launchDate: "Coming Q1 2026",
    gradient: "from-lime-500 to-green-400",
  },
  {
    icon: Factory,
    title: "Zumbii Industrial",
    description: "Industrial raw materials, machinery, tools, and safety equipment for manufacturing and construction sectors.",
    badge: "coming",
    launchDate: "Coming Q1 2026",
    gradient: "from-slate-600 to-slate-500",
  },
  {
    icon: HeartPulse,
    title: "Zumbii Healthcare",
    description: "Medical equipment, hospital supplies, diagnostic tools, and healthcare services for clinics and hospitals.",
    badge: "coming",
    launchDate: "Coming Q1 2026",
    gradient: "from-violet-500 to-purple-400",
  },
  {
    icon: Warehouse,
    title: "Zumbii Wholesale",
    description: "Bulk products at wholesale prices for retailers, distributors, and businesses across all categories.",
    badge: "coming",
    launchDate: "Coming Q2 2026",
    gradient: "from-cyan-500 to-blue-400",
  },
  {
    icon: Truck,
    title: "Zumbii Logistics",
    description: "End-to-end logistics and supply chain solutions including warehousing, shipping, and last-mile delivery.",
    badge: "coming",
    launchDate: "Coming Q2 2026",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    icon: Globe,
    title: "Zumbii Export",
    description: "Export Indian products to global markets. Connect with international buyers and streamline cross-border trade.",
    badge: "coming",
    launchDate: "Coming Q2 2026",
    gradient: "from-blue-600 to-indigo-400",
  },
  {
    icon: ArrowLeftRight,
    title: "Zumbii Import",
    description: "Source quality products from international suppliers. Manage customs, duties, and import documentation seamlessly.",
    badge: "coming",
    launchDate: "Coming Q2 2026",
    gradient: "from-teal-500 to-cyan-400",
  },
  {
    icon: Wallet,
    title: "Zumbii Finance",
    description: "Business loans, invoice financing, working capital, and insurance products tailored for sellers and SMEs.",
    badge: "coming",
    launchDate: "Coming Q3 2026",
    gradient: "from-emerald-600 to-teal-400",
  },
  {
    icon: Monitor,
    title: "Zumbii Digital",
    description: "Digital services including website development, digital marketing, cloud solutions, and SaaS tools for businesses.",
    badge: "coming",
    launchDate: "Coming Q3 2026",
    gradient: "from-indigo-500 to-violet-400",
  },
  {
    icon: Megaphone,
    title: "Zumbii Marketplace Ads",
    description: "Promote your products with targeted advertising. Sponsored listings, display ads, and performance marketing.",
    badge: "coming",
    launchDate: "Coming Q3 2026",
    gradient: "from-fuchsia-500 to-pink-400",
  },
  {
    icon: GraduationCap,
    title: "Zumbii Academy",
    description: "Learn selling skills, digital marketing, financial literacy, and business management through expert-led courses.",
    badge: "coming",
    launchDate: "Coming Q4 2026",
    gradient: "from-sky-500 to-blue-400",
  },
  {
    icon: Network,
    title: "Zumbii Franchise Network",
    description: "Own a Zumbii franchise in your city. Complete operational support, training, and technology stack included.",
    badge: "coming",
    launchDate: "Coming Q4 2026",
    gradient: "from-rose-600 to-pink-400",
  },
  {
    icon: Store,
    title: "Zumbii Warehousing",
    description: "Smart warehousing solutions with inventory management, pick-and-pack services, and PAN-India distribution.",
    badge: "coming",
    launchDate: "Coming Q4 2026",
    gradient: "from-amber-600 to-orange-400",
  },
];

const badgeVariants: Record<string, "new" | "default" | "warning"> = {
  coming: "default",
  launching: "new",
};

const stats = [
  { icon: Building2, value: "17", label: "Verticals" },
  { icon: Users, value: "10K+", label: "Active Sellers" },
  { icon: Globe, value: "500+", label: "Cities" },
  { icon: Rocket, value: "2M+", label: "Users" },
];

function HeroSection() {
  return (
    <section className="relative min-h-[65vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.3),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-6">
            <Building2 className="w-4 h-4 text-zumbii-200" />
            <span className="text-sm font-medium text-white/90">Expanding Across Industries</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Zumbii Business{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-200 to-white">
              Verticals
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            From fresh produce to industrial machinery, from healthcare to renewable energy — Zumbii is building India&apos;s most comprehensive business ecosystem across 17 industry verticals.
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="relative -mt-16 z-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl shadow-xl border border-white/20 py-8 px-6 sm:py-10 sm:px-8"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center gap-2">
                <stat.icon className="w-6 h-6 text-zumbii-500" />
                <span className="text-3xl sm:text-4xl font-bold text-text-primary">{stat.value}</span>
                <span className="text-sm text-text-tertiary">{stat.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function VerticalsGrid() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Explore All Verticals"
            subtitle="Each vertical is built with industry-specific tools, logistics, and expert support"
          />
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6"
        >
          {verticals.map((vertical) => (
            <motion.div
              key={vertical.title}
              variants={fadeInUp}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="bg-white rounded-2xl border border-zumbii-100 shadow-sm hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${vertical.gradient} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <vertical.icon className="w-7 h-7 text-white" />
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-text-primary">{vertical.title}</h3>
                  <Badge variant={badgeVariants[vertical.badge]} size="sm">
                    {vertical.badge === "coming" ? "Coming Soon" : "Launching Soon"}
                  </Badge>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed flex-1">{vertical.description}</p>

                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <span className="text-xs text-text-tertiary font-medium">{vertical.launchDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function TimelineSection() {
  const phases = [
    {
      phase: "Phase 1",
      period: "Q3 2025",
      verticals: ["Zumbii Fresh", "Zumbii Fashion"],
      color: "from-emerald-500 to-green-400",
      active: true,
    },
    {
      phase: "Phase 2",
      period: "Q4 2025 - Q1 2026",
      verticals: ["Zumbii Pharma", "Zumbii Solar", "Zumbii Agri", "Zumbii Industrial", "Zumbii Healthcare"],
      color: "from-blue-500 to-cyan-400",
      active: false,
    },
    {
      phase: "Phase 3",
      period: "Q2 - Q3 2026",
      verticals: ["Zumbii Wholesale", "Zumbii Logistics", "Zumbii Export", "Zumbii Import", "Zumbii Finance", "Zumbii Digital", "Zumbii Marketplace Ads"],
      color: "from-violet-500 to-purple-400",
      active: false,
    },
    {
      phase: "Phase 4",
      period: "Q4 2026",
      verticals: ["Zumbii Academy", "Zumbii Franchise Network", "Zumbii Warehousing"],
      color: "from-amber-500 to-orange-400",
      active: false,
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-surface-secondary relative overflow-hidden">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Launch Timeline"
            subtitle="Our phased rollout plan for all business verticals"
          />
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 relative"
        >
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-zumbii-200 -translate-x-1/2" />

          {phases.map((phase, index) => (
            <motion.div
              key={phase.phase}
              variants={fadeInUp}
              className={`relative flex items-start gap-6 lg:gap-0 mb-10 lg:mb-0 lg:pb-16 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
            >
              <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 z-10">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg border-4 border-white`}>
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <div className={`lg:w-[calc(50%-2rem)] ${index % 2 === 0 ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}>
                <div className="bg-white rounded-2xl border border-zumbii-100 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${phase.color}`}>
                      {phase.phase}
                    </span>
                    <span className="text-sm font-medium text-zumbii-600">{phase.period}</span>
                    {phase.active && (
                      <Badge variant="success" size="sm">Live Now</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {phase.verticals.map((v) => (
                      <span key={v} className="inline-flex px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-sm text-text-primary">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
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

      <Container className="relative z-10 text-center">
        <FadeInSection>
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              Want Early Access?
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              Be the first to know when we launch new verticals. Get exclusive early-bird benefits, beta access, and special pricing.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:info@zumbii.com"
                className="inline-flex items-center gap-2 bg-white text-zumbii-700 px-8 py-3.5 rounded-xl font-medium hover:bg-zumbii-50 transition-all duration-300 shadow-xl text-base"
              >
                Get Early Access
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/10 transition-all duration-300 text-base"
              >
                Partner with Us
              </a>
            </div>
            <p className="mt-6 text-sm text-white/50">
              For partnership inquiries, reach out to <span className="text-white/80">info@zumbii.com</span>
            </p>
          </div>
        </FadeInSection>
      </Container>
    </section>
  );
}

export default function VerticalsPage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <VerticalsGrid />
      <TimelineSection />
      <CTASection />
    </>
  );
}
