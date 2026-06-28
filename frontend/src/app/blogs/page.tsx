"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Mail,
  Send,
  Tag,
  TrendingUp,
  BookOpen,
  Sparkles,
  Eye,
  MessageCircle,
  ArrowUpRight,
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

const categories = [
  "All",
  "Industry Insights",
  "Business Tips",
  "Buying Guides",
  "Seller Success Stories",
  "Market Trends",
  "Technology",
  "Government Schemes",
];

const blogPosts = [
  {
    id: 1,
    title: "The Future of B2B Commerce in India: Trends Shaping 2026",
    excerpt: "Explore how digital transformation, AI-powered sourcing, and government initiatives are reshaping the B2B landscape across India's diverse markets.",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80",
    category: "Industry Insights",
    author: { name: "Arun Sharma", avatar: "AS" },
    date: "Jun 24, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: 2,
    title: "5 Proven Strategies to Boost Your Wholesale Business Online",
    excerpt: "Discover actionable strategies to expand your wholesale reach, optimize listings, and build lasting buyer relationships in the digital marketplace.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: "Business Tips",
    author: { name: "Priya Verma", avatar: "PV" },
    date: "Jun 22, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 3,
    title: "Complete Guide to Sourcing Raw Materials on Zumbii",
    excerpt: "A step-by-step guide for manufacturers to source quality raw materials, compare suppliers, and negotiate the best deals through the platform.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    category: "Buying Guides",
    author: { name: "Vikram Patel", avatar: "VP" },
    date: "Jun 20, 2026",
    readTime: "10 min read",
    featured: false,
  },
  {
    id: 4,
    title: "From Small Shop to Pan-India Brand: The Gupta Electronics Story",
    excerpt: "How a small electronics retailer in Jaipur leveraged Zumbii's B2C platform to become a nationally recognized brand in just 18 months.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
    category: "Seller Success Stories",
    author: { name: "Neha Gupta", avatar: "NG" },
    date: "Jun 18, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 5,
    title: "How AI and Machine Learning Are Transforming E-Commerce Logistics",
    excerpt: "From predictive inventory management to last-mile optimization, AI is revolutionizing how products move across India's supply chain.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    category: "Technology",
    author: { name: "Dr. Rajesh Kumar", avatar: "RK" },
    date: "Jun 15, 2026",
    readTime: "9 min read",
    featured: false,
  },
  {
    id: 6,
    title: "Top 10 Market Trends Every Indian Business Owner Should Know",
    excerpt: "Stay ahead of the curve with our analysis of the most impactful market trends including D2C growth, voice commerce, and sustainable sourcing.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    category: "Market Trends",
    author: { name: "Anjali Singh", avatar: "AS" },
    date: "Jun 12, 2026",
    readTime: "7 min read",
    featured: false,
  },
  {
    id: 7,
    title: "Understanding GST Updates for Small Businesses in 2026",
    excerpt: "A comprehensive breakdown of the latest GST compliance requirements, input tax credit rules, and filing procedures for small and medium enterprises.",
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
    category: "Government Schemes",
    author: { name: "CA Meera Iyer", avatar: "MI" },
    date: "Jun 10, 2026",
    readTime: "12 min read",
    featured: false,
  },
  {
    id: 8,
    title: "Sustainable Sourcing: How to Build an Eco-Friendly Supply Chain",
    excerpt: "Learn how Indian businesses are adopting sustainable procurement practices and why going green is becoming a competitive advantage.",
    image: "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80",
    category: "Industry Insights",
    author: { name: "Rohit Desai", avatar: "RD" },
    date: "Jun 8, 2026",
    readTime: "6 min read",
    featured: false,
  },
  {
    id: 9,
    title: "The Rise of Vernacular Commerce in India's Tier 2 & 3 Cities",
    excerpt: "With internet penetration soaring in smaller cities, vernacular commerce is unlocking new opportunities for businesses ready to connect in local languages.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80",
    category: "Market Trends",
    author: { name: "Priya Verma", avatar: "PV" },
    date: "Jun 5, 2026",
    readTime: "8 min read",
    featured: false,
  },
];

const popularPosts = [
  { id: 3, title: "Complete Guide to Sourcing Raw Materials on Zumbii", views: "12.4K", date: "Jun 20, 2026" },
  { id: 1, title: "The Future of B2B Commerce in India: Trends Shaping 2026", views: "10.2K", date: "Jun 24, 2026" },
  { id: 7, title: "Understanding GST Updates for Small Businesses in 2026", views: "8.7K", date: "Jun 10, 2026" },
  { id: 5, title: "How AI and Machine Learning Are Transforming E-Commerce Logistics", views: "7.9K", date: "Jun 15, 2026" },
  { id: 4, title: "From Small Shop to Pan-India Brand: The Gupta Electronics Story", views: "6.5K", date: "Jun 18, 2026" },
];

const allTags = [
  "B2B Commerce", "E-Commerce Tips", "Supply Chain", "Digital India", "Franchise",
  "Wholesale", "Retail", "AI in Business", "GST", "Sustainability",
  "Startup", "Manufacturing", "Logistics", "D2C Brands", "Government Policy",
];

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

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 gradient-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(12,142,234,0.25),transparent_50%)]" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-zumbii-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-zumbii-300/20 rounded-full blur-3xl" />

      <Container className="relative z-10 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/10 mb-6">
            <BookOpen className="w-4 h-4 text-zumbii-200" />
            <span className="text-sm font-medium text-white/90">Knowledge Hub</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight">
            Zumbii Blog
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-4 text-lg sm:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
            Insights, Stories, and Updates
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 max-w-lg mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white/20 focus-within:border-white/30">
                <Search className="ml-4 w-5 h-5 text-white/50 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, topics, guides..."
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 text-sm focus:outline-none"
                />
                <button className="mr-2 bg-white text-zumbii-700 px-5 py-2 rounded-xl text-sm font-medium hover:bg-zumbii-50 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function CategoryFilters({ active, onSelect }: { active: string; onSelect: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            active === cat
              ? "bg-zumbii-600 text-white shadow-lg shadow-zumbii-600/25"
              : "bg-white text-text-secondary border border-zumbii-100 hover:border-zumbii-300 hover:text-zumbii-600 hover:shadow-sm"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

function PostCard({ post, index }: { post: typeof blogPosts[0]; index: number }) {
  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/blogs/${post.id}`} className="group block h-full">
        <Card className="h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-tertiary">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge variant="info" className="backdrop-blur-sm bg-white/90 text-xs">
                {post.category}
              </Badge>
            </div>
          </div>
          <div className="flex-1 p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 text-xs text-text-tertiary mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            <h3 className="font-bold text-text-primary text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-zumbii-600 transition-colors">
              {post.title}
            </h3>
            <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2 flex-1">
              {post.excerpt}
            </p>
            <div className="mt-4 pt-4 border-t border-zumbii-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-[10px]">
                  {post.author.avatar}
                </div>
                <span className="text-xs font-medium text-text-primary">{post.author.name}</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-zumbii-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Read <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function FeaturedPost({ post }: { post: typeof blogPosts[0] }) {
  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/blogs/${post.id}`} className="group block">
        <Card className="grid md:grid-cols-5 overflow-hidden">
          <div className="relative md:col-span-3 aspect-[4/3] md:aspect-auto min-h-[280px] bg-surface-tertiary">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge variant="info" className="backdrop-blur-sm bg-white/90 text-xs">
                {post.category}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/90 text-white text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            </div>
          </div>
          <div className="md:col-span-2 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 text-xs text-text-tertiary mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {post.readTime}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary leading-tight group-hover:text-zumbii-600 transition-colors">
              {post.title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                {post.author.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{post.author.name}</p>
                <p className="text-xs text-text-tertiary">Author</p>
              </div>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-zumbii-600 group-hover:gap-3 transition-all">
                Read Full Article <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

function NewsletterWidget() {
  const [email, setEmail] = useState("");

  return (
    <Card className="p-6 sm:p-8" hover={false}>
      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-lg">
        <Mail className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">Subscribe to Our Newsletter</h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        Get the latest insights, guides, and market trends delivered to your inbox every week.
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
        className="space-y-3"
      >
        <Input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          size="lg"
          icon={<Mail className="w-4 h-4" />}
        />
        <Button type="submit" className="w-full" size="lg">
          Subscribe <Send className="w-4 h-4" />
        </Button>
      </form>
      <p className="mt-3 text-[10px] text-text-tertiary text-center">
        No spam. Unsubscribe anytime.
      </p>
    </Card>
  );
}

function PopularPostsWidget() {
  return (
    <Card className="p-6 sm:p-8" hover={false}>
      <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-zumbii-500" />
        Popular Posts
      </h3>
      <div className="space-y-4">
        {popularPosts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blogs/${post.id}`}
            className="group flex gap-3 items-start"
          >
            <span className="shrink-0 w-7 h-7 rounded-lg bg-zumbii-50 text-zumbii-600 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-zumbii-600 transition-colors">
                {post.title}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-text-tertiary">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {post.views}
                </span>
                <span>{post.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function TagsCloud() {
  return (
    <Card className="p-6 sm:p-8" hover={false}>
      <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
        <Tag className="w-5 h-5 text-zumbii-500" />
        Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <Link
            key={tag}
            href={`/blogs?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
            className="px-3 py-1.5 rounded-full bg-surface-secondary text-xs font-medium text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600 hover:border-zumbii-200 border border-border transition-all duration-200"
          >
            {tag}
          </Link>
        ))}
      </div>
    </Card>
  );
}

function Pagination({ current, total }: { current: number; total: number }) {
  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        disabled={current === 1}
        className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-200 ${
            page === current
              ? "bg-zumbii-600 text-white shadow-md shadow-zumbii-600/25"
              : "border border-zumbii-100 text-text-secondary hover:bg-zumbii-50"
          }`}
        >
          {page}
        </button>
      ))}
      <button
        disabled={current === total}
        className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default function BlogsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featured = blogPosts.find((p) => p.featured)!;
  const gridPosts = blogPosts.filter((p) => !p.featured);
  const filteredPosts = activeCategory === "All"
    ? gridPosts
    : gridPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      <HeroSection />

      <section className="py-12 lg:py-16 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <CategoryFilters active={activeCategory} onSelect={setActiveCategory} />
          </FadeInSection>
        </Container>
      </section>

      <section className="py-12 lg:py-20">
        <Container>
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
            <div className="lg:col-span-2 space-y-12">
              {activeCategory === "All" && (
                <FadeInSection>
                  <FeaturedPost post={featured} />
                </FadeInSection>
              )}

              <FadeInSection>
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  {activeCategory === "All" ? "Latest Articles" : activeCategory}
                </h2>
              </FadeInSection>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid sm:grid-cols-2 gap-6"
              >
                {filteredPosts.map((post, i) => (
                  <PostCard key={post.id} post={post} index={i} />
                ))}
              </motion.div>

              <FadeInSection>
                <Pagination current={1} total={3} />
              </FadeInSection>
            </div>

            <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
              <FadeInSection>
                <NewsletterWidget />
              </FadeInSection>
              <FadeInSection>
                <PopularPostsWidget />
              </FadeInSection>
              <FadeInSection>
                <TagsCloud />
              </FadeInSection>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
