"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Zap,
  Users,
  Globe,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Building2,
  GraduationCap,
  Rocket,
  Linkedin,
  Mail,
  MapPin,
  Calendar,
  Play,
  BookOpen,
  TreePine,
  Handshake,
} from "lucide-react";
import Button from "@/components/ui/Button";
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

const leaders = [
  { name: "Arjun Mehta", title: "Founder & CEO", avatar: "AM", bio: "15+ years in e-commerce and marketplace strategy. Former VP at India's leading B2B platform." },
  { name: "Priya Kapoor", title: "Chief Technology Officer", avatar: "PK", bio: "Ex-Google engineer leading platform architecture, AI/ML, and product innovation." },
  { name: "Rahul Sharma", title: "Chief Operating Officer", avatar: "RS", bio: "Operations veteran who scaled logistics networks across 500+ cities in India." },
  { name: "Ananya Verma", title: "Chief Marketing Officer", avatar: "AV", bio: "Brand strategist with a decade of experience in D2C and B2B marketing at scale." },
];

const milestones = [
  { year: "2024 Q1", title: "Zumbii Founded", description: "The vision was born. A team of 5 founders started building India's next-gen marketplace.", icon: Rocket },
  { year: "2024 Q3", title: "Seed Funding", description: "Raised $2M in seed funding from top-tier investors who believed in the vision.", icon: Sparkles },
  { year: "2025 Q1", title: "Beta Launch", description: "Launched beta with 500+ sellers and 10,000 products across 8 categories.", icon: Play },
  { year: "2025 Q2", title: "Pan-India Expansion", description: "Expanded operations to 200+ cities with 5,000+ sellers and 50,000+ products.", icon: Globe },
  { year: "2025 Q4", title: "Franchise Network Launch", description: "Launched franchise model, onboarding 50+ partners across 20 cities.", icon: Building2 },
  { year: "2026 Q2", title: "1M+ Users Milestone", description: "Crossed 1 million registered users with 10,000+ sellers and pan-India delivery.", icon: Users },
];

const coreValues = [
  { icon: Shield, title: "Trust & Transparency", description: "Every transaction is secured. Every seller is verified. Trust is our currency." },
  { icon: Zap, title: "Innovation First", description: "AI-driven search, smart logistics, and cutting-edge tech power every experience." },
  { icon: Users, title: "Community First", description: "We grow when our community grows. Sellers, buyers, partners — we rise together." },
  { icon: Heart, title: "Customer Obsession", description: "Every feature, every decision starts with what's best for our users." },
  { icon: Globe, title: "Inclusive Growth", description: "Empowering businesses from metro cities to tier-3 towns across India." },
  { icon: Award, title: "Excellence Always", description: "We hold ourselves to the highest standards. Quality is never compromised." },
];

const csrPillars = [
  { icon: GraduationCap, title: "Digital Literacy", description: "Training 10,000+ small business owners in digital commerce skills by 2027.", color: "from-blue-500 to-cyan-400" },
  { icon: TreePine, title: "Sustainable Commerce", description: "Carbon-neutral delivery network and eco-friendly packaging initiatives.", color: "from-emerald-500 to-green-400" },
  { icon: Heart, title: "Women Entrepreneurship", description: "Special programs and grants for women-led businesses to thrive online.", color: "from-rose-500 to-pink-400" },
  { icon: Handshake, title: "Rural Empowerment", description: "Connecting rural artisans and manufacturers to urban markets nationwide.", color: "from-amber-500 to-orange-400" },
];

const stats = [
  { value: "1M+", label: "Registered Users" },
  { value: "10K+", label: "Active Sellers" },
  { value: "500+", label: "Cities Covered" },
  { value: "50K+", label: "Products Listed" },
  { value: "200+", label: "Franchise Partners" },
  { value: "99.9%", label: "Uptime Guarantee" },
];

function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-zumbii-950 via-zumbii-900 to-zumbii-800" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.15),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-96 h-96 bg-zumbii-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-[30rem] h-[30rem] bg-zumbii-300/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-zumbii-500/5 rounded-full blur-3xl" />

      <Container className="relative z-10 pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="new" size="md" className="mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Our Story
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight"
          >
            {"We're"} Building the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zumbii-300 to-white">
              Future of Commerce
            </span>{" "}
            in India
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Empowering Businesses, Connecting Communities, Growing Together — since
            2024, Zumbii has been {"India's"} trusted B2B & B2C marketplace, driving
            inclusive economic growth across the nation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <Button variant="white" size="lg" className="shadow-2xl">
              <Play className="w-5 h-5" />
              Watch Our Story
            </Button>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Mail className="w-5 h-5" />
              Contact Us
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 grid grid-cols-3 sm:grid-cols-6 gap-6"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function StorySection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-zumbii-100/50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-zumbii-50 rounded-full blur-3xl" />
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeInSection>
            <div className="relative">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full gradient-bg flex items-center justify-center">
                  <div className="text-center p-12">
                    <Building2 className="w-20 h-20 text-white/30 mx-auto mb-6" />
                    <p className="text-white/50 text-sm">Zumbii Headquarters</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 shadow-xl border border-white/20 max-w-[200px]">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-zumbii-500" />
                  <span className="text-sm font-semibold text-text-primary">Founded 2024</span>
                </div>
                <p className="text-xs text-text-tertiary">From a small team to a nationwide movement.</p>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection>
            <Badge variant="default" className="mb-4">Our Story</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight leading-tight">
              A Journey Born from a{" "}
              <span className="gradient-text">Simple Idea</span>
            </h2>
            <p className="mt-6 text-text-secondary leading-relaxed text-base sm:text-lg">
              Zumbii was founded in 2024 with a bold vision — to democratize commerce in India.
              We saw a fragmented marketplace where small businesses struggled to reach customers,
              suppliers lacked digital infrastructure, and buyers had limited access to quality products
              at fair prices.
            </p>
            <p className="mt-4 text-text-secondary leading-relaxed text-base sm:text-lg">
              What started as a small team of five passionate founders has grown into a thriving
              platform connecting thousands of businesses across 500+ cities. Today, Zumbii is not
              just a marketplace — {"it's"} an ecosystem built on trust, innovation, and community.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex -space-x-2">
                {["AM", "PK", "RS", "AV"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full gradient-bg border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <span className="text-sm text-text-tertiary self-center">Meet our leadership team</span>
            </div>
          </FadeInSection>
        </div>
      </Container>
    </section>
  );
}

function VisionMissionSection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary">
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Our North Star"
            subtitle="Guided by a clear purpose and a bold vision for India's commerce future"
          />
        </FadeInSection>
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <FadeInSection>
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-zumbii-500 to-zumbii-300 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
              <div className="relative h-full glass rounded-3xl p-8 sm:p-10 border border-white/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-zumbii-500 to-zumbii-700 flex items-center justify-center mb-6 shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">Our Vision</h3>
                <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                  To become {"India's"} most trusted and inclusive commerce ecosystem —
                  empowering every business, regardless of size or location, to thrive in the
                  digital economy. We envision a future where technology bridges the gap
                  between opportunity and access.
                </p>
                <div className="mt-8 flex items-center gap-3 text-sm text-zumbii-600 font-medium">
                  <span>Vision 2030</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </FadeInSection>

          <FadeInSection>
            <div className="relative group h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-3xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity" />
              <div className="relative h-full glass rounded-3xl p-8 sm:p-10 border border-white/20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center mb-6 shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4">Our Mission</h3>
                <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
                  To democratize commerce by building a technology-first platform that connects
                  buyers, sellers, suppliers, and franchise partners seamlessly. We are committed
                  to fostering trust, driving innovation, and creating lasting value for every
                  stakeholder in the Zumbii ecosystem.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    "Connect 10M+ users by 2030",
                    "Enable 100K+ businesses to go digital",
                    "Achieve carbon-neutral operations",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2.5 text-sm text-text-secondary">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </Container>
    </section>
  );
}

function LeadershipSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 bg-zumbii-100/50 rounded-full blur-3xl" />
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Leadership Team"
            subtitle="The people shaping the future of Zumbii"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {leaders.map((leader) => (
            <motion.div key={leader.name} variants={fadeInUp} className="group">
              <Card className="p-6 sm:p-8 text-center h-full">
                <div className="relative mx-auto w-24 h-24 rounded-full gradient-bg flex items-center justify-center shadow-lg mb-5 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{leader.avatar}</span>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary">{leader.name}</h3>
                <p className="text-sm text-zumbii-600 font-medium mt-1">{leader.title}</p>
                <p className="text-xs text-text-tertiary mt-3 leading-relaxed">{leader.bio}</p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-surface-secondary hover:bg-zumbii-50 transition-colors flex items-center justify-center" aria-label={`${leader.name} LinkedIn`}>
                    <Linkedin className="w-4 h-4 text-text-tertiary" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-surface-secondary hover:bg-zumbii-50 transition-colors flex items-center justify-center" aria-label={`${leader.name} Email`}>
                    <Mail className="w-4 h-4 text-text-tertiary" />
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-zumbii-50 rounded-full blur-3xl" />
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Our Journey"
            subtitle="Key milestones on our path to transforming Indian commerce"
          />
        </FadeInSection>
        <div className="mt-12 relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-zumbii-300 via-zumbii-500 to-zumbii-700 -translate-x-1/2 hidden sm:block" />

          <div className="space-y-12 sm:space-y-16">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const Icon = milestone.icon;
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  className={`relative flex flex-col sm:flex-row items-start gap-6 sm:gap-0 ${
                    isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  <div className={`hidden sm:block w-1/2 ${isEven ? "pr-12 text-right" : "pl-12"}`}>
                    <div className={`inline-block ${isEven ? "" : ""}`}>
                      <Badge variant="info" size="sm" className="mb-2">{milestone.year}</Badge>
                      <h3 className="text-xl font-bold text-text-primary">{milestone.title}</h3>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">{milestone.description}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                    <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center shadow-lg border-4 border-white">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div className="sm:hidden pl-14">
                    <Badge variant="info" size="sm" className="mb-2">{milestone.year}</Badge>
                    <h3 className="text-xl font-bold text-text-primary">{milestone.title}</h3>
                    <p className="mt-2 text-sm text-text-secondary leading-relaxed">{milestone.description}</p>
                  </div>

                  <div className={`hidden sm:block w-1/2 ${isEven ? "pl-12" : "pr-12 text-right"}`}>
                    {!isEven && (
                      <div className="inline-block">
                        <Badge variant="info" size="sm" className="mb-2">{milestone.year}</Badge>
                        <h3 className="text-xl font-bold text-text-primary">{milestone.title}</h3>
                        <p className="mt-2 text-sm text-text-secondary leading-relaxed">{milestone.description}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-zumbii-100/50 rounded-full blur-3xl" />
      <Container>
        <FadeInSection>
          <SectionHeader
            title="Core Values"
            subtitle="The principles that guide every decision we make"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {coreValues.map((value) => (
            <motion.div key={value.title} variants={fadeInUp}>
              <Card className="p-6 sm:p-8 h-full group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zumbii-50 to-zumbii-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-7 h-7 text-zumbii-600" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{value.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{value.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function CSR_Activities() {
  return (
    <section className="py-20 lg:py-28 bg-surface-secondary relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-secondary via-zumbii-50/30 to-surface-secondary" />
      <Container className="relative z-10">
        <FadeInSection>
          <SectionHeader
            title="CSR Initiatives"
            subtitle="Building a better India through responsible commerce"
          />
        </FadeInSection>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {csrPillars.map((pillar) => (
            <motion.div key={pillar.title} variants={fadeInUp} className="group">
              <div className="relative h-full">
                <div className={`absolute -inset-1 bg-gradient-to-r ${pillar.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity`} />
                <Card className="relative p-6 sm:p-8 text-center h-full">
                  <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${pillar.color} flex items-center justify-center shadow-lg mb-5`}>
                    <pillar.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-3">{pillar.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{pillar.description}</p>
                </Card>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function CareersSection() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.1),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-zumbii-300/20 rounded-full blur-3xl" />
      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <FadeInSection>
            <Badge variant="new" className="mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Join the Team
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
              {"Let's"} Build the Future Together
            </h2>
            <p className="mt-4 text-lg text-white/70 leading-relaxed">
              {"We're"} looking for passionate people who want to make a real impact on Indian commerce.
              At Zumbii, {"you'll"} work with cutting-edge technology, collaborate with brilliant minds,
              and help millions of businesses grow.
            </p>
          </FadeInSection>
          <FadeInSection className="mt-10">
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Users, label: "50+ Team Members" },
                { icon: MapPin, label: "4 Office Locations" },
                { icon: Globe, label: "Remote-Friendly" },
              ].map((item) => (
                <div key={item.label} className="glass rounded-2xl p-4 border border-white/10">
                  <item.icon className="w-6 h-6 text-zumbii-300 mx-auto mb-2" />
                  <p className="text-sm text-white/80 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
          <FadeInSection className="flex flex-wrap gap-4 justify-center">
            <Link href="/careers">
              <Button variant="white" size="lg" className="shadow-2xl">
                <BookOpen className="w-5 h-5" />
                View Open Positions
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
              <Mail className="w-5 h-5" />
              Get in Touch
            </Button>
          </FadeInSection>
        </div>
      </Container>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <StorySection />
      <VisionMissionSection />
      <LeadershipSection />
      <JourneySection />
      <ValuesSection />
      <CSR_Activities />
      <CareersSection />
    </>
  );
}
