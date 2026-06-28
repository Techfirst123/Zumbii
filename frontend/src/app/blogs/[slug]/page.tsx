"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Check,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Reply,
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

const relatedPosts = [
  {
    id: 2,
    title: "5 Proven Strategies to Boost Your Wholesale Business Online",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category: "Business Tips",
    date: "Jun 22, 2026",
    readTime: "6 min read",
    author: { name: "Priya Verma", avatar: "PV" },
  },
  {
    id: 5,
    title: "How AI and Machine Learning Are Transforming E-Commerce Logistics",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    category: "Technology",
    date: "Jun 15, 2026",
    readTime: "9 min read",
    author: { name: "Dr. Rajesh Kumar", avatar: "RK" },
  },
  {
    id: 6,
    title: "Top 10 Market Trends Every Indian Business Owner Should Know",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
    category: "Market Trends",
    date: "Jun 12, 2026",
    readTime: "7 min read",
    author: { name: "Anjali Singh", avatar: "AS" },
  },
];

const comments = [
  {
    id: 1,
    name: "Rahul Mehta",
    avatar: "RM",
    date: "Jun 25, 2026 at 10:30 AM",
    content: "Excellent article! The insights on AI-driven sourcing are particularly valuable for small manufacturers like us. We've already started implementing some of these strategies on Zumbii and seeing great results.",
    likes: 24,
    replies: [
      { id: 2, name: "Arun Sharma", avatar: "AS", date: "Jun 25, 2026 at 2:15 PM", content: "Thank you, Rahul! Glad to hear the article was helpful. Would love to hear more about your implementation experience — it could make for a great follow-up story!" },
    ],
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    avatar: "SK",
    date: "Jun 24, 2026 at 4:45 PM",
    content: "This is exactly what I needed. As someone new to B2B e-commerce, having a clear picture of where the market is heading helps me plan my business strategy. Well researched and well written!",
    likes: 18,
    replies: [],
  },
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

function ShareButton({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600 hover:border-zumbii-200 transition-all"
      aria-label={label}
    >
      <Icon className="w-4 h-4" />
    </a>
  );
}

function TableOfContents() {
  const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "digital-transformation", label: "Digital Transformation in B2B" },
    { id: "ai-sourcing", label: "AI-Powered Sourcing" },
    { id: "government-initiatives", label: "Government Initiatives" },
    { id: "future-outlook", label: "The Future Outlook" },
  ];

  return (
    <Card className="p-5 sm:p-6" hover={false}>
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">On This Page</h3>
      <nav className="space-y-2">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-zumbii-600 transition-colors group"
          >
            <ChevronRight className="w-3 h-3 text-zumbii-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="group-hover:translate-x-0.5 transition-transform">{section.label}</span>
          </a>
        ))}
      </nav>
    </Card>
  );
}

function RelatedPostCard({ post }: { post: typeof relatedPosts[0] }) {
  return (
    <Link href={`/blogs/${post.id}`} className="group block h-full">
      <Card className="h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-tertiary">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3">
            <Badge variant="info" className="backdrop-blur-sm bg-white/90 text-[10px] px-2 py-0.5">
              {post.category}
            </Badge>
          </div>
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-center gap-2 text-[11px] text-text-tertiary mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
          </div>
          <h4 className="font-bold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-zumbii-600 transition-colors flex-1">
            {post.title}
          </h4>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-[8px]">
              {post.author.avatar}
            </div>
            <span className="text-[11px] text-text-secondary">{post.author.name}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function BlogDetailPage() {
  return (
    <>
      <article className="pt-24 pb-16 lg:pt-32 lg:pb-24">
        <Container>
          <div className="max-w-3xl mx-auto">
            <FadeInSection>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-zumbii-600 transition-colors mb-8 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Blog
              </Link>
            </FadeInSection>

            <FadeInSection>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="info">Industry Insights</Badge>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Calendar className="w-3.5 h-3.5" />
                  Jun 24, 2026
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Clock className="w-3.5 h-3.5" />
                  8 min read
                </span>
              </div>
            </FadeInSection>

            <FadeInSection>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-[1.15] tracking-tight">
                The Future of B2B Commerce in India: Trends Shaping 2026
              </h1>
            </FadeInSection>

            <FadeInSection className="mt-6">
              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
                {"Explore how digital transformation, AI-powered sourcing, and government initiatives are reshaping the B2B landscape across India's diverse markets."}
              </p>
            </FadeInSection>

            <FadeInSection className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-zumbii-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    AS
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Arun Sharma</p>
                    <p className="text-xs text-text-tertiary">Senior Industry Analyst, Zumbii Insights</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton href="#" icon={Twitter} label="Share on Twitter" />
                  <ShareButton href="#" icon={Facebook} label="Share on Facebook" />
                  <ShareButton href="#" icon={Linkedin} label="Share on LinkedIn" />
                  <ShareButton href="#" icon={LinkIcon} label="Copy link" />
                  <button className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 hover:text-red-500 hover:border-red-200 transition-all" aria-label="Save article">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </FadeInSection>
          </div>
        </Container>

        <Container className="mt-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            <aside className="hidden lg:block lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-6">
                <FadeInSection>
                  <TableOfContents />
                </FadeInSection>

                <FadeInSection>
                  <Card className="p-5 sm:p-6" hover={false}>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Share</h3>
                    <div className="flex flex-wrap gap-2">
                      <ShareButton href="#" icon={Twitter} label="Share on Twitter" />
                      <ShareButton href="#" icon={Facebook} label="Share on Facebook" />
                      <ShareButton href="#" icon={Linkedin} label="Share on LinkedIn" />
                      <ShareButton href="#" icon={LinkIcon} label="Copy link" />
                    </div>
                  </Card>
                </FadeInSection>
              </div>
            </aside>

            <div className="lg:col-span-6">
              <FadeInSection>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-tertiary mb-10">
                  <Image
                    src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&q=80"
                    alt="The Future of B2B Commerce in India"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </FadeInSection>

              <FadeInSection>
                <div className="prose prose-zumbii max-w-none">
                  <section id="introduction">
                    <p className="text-lg text-text-secondary leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:text-zumbii-600 first-letter:mr-2 first-letter:float-left">
                      {"India's B2B commerce landscape is undergoing a profound transformation. With over 63 million micro, small, and medium enterprises (MSMEs) forming the backbone of the economy, the shift from traditional trade to digital platforms is no longer a choice — it's an imperative. As we move through 2026, several key trends are converging to create unprecedented opportunities for businesses willing to embrace change."}
                    </p>
                  </section>

                  <section id="digital-transformation" className="mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-12 mb-4">Digital Transformation in B2B</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      The B2B sector in India has traditionally been relationship-driven, with transactions relying heavily on personal connections and trust built over years. However, the digital wave is changing this dynamic rapidly. Platforms like Zumbii are creating transparent ecosystems where verified buyers and sellers can connect, transact, and build trust through data-driven reputations rather than personal introductions alone.
                    </p>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {"According to recent industry reports, India's B2B e-commerce market is projected to reach $100 billion by 2027, growing at a CAGR of over 25%."} This growth is fueled by increasing internet penetration in tier 2 and tier 3 cities, affordable smartphones, and the rising comfort level with digital payments among small business owners.
                    </p>
                    <div className="my-8 p-6 rounded-2xl bg-gradient-to-br from-zumbii-50 to-blue-50 border border-zumbii-100">
                      <p className="text-sm text-zumbii-800 font-medium italic">
                        {"\"Digital transformation in B2B isn't just about taking transactions online — it's about reimagining the entire value chain, from sourcing and procurement to logistics and after-sales support.\""}
                      </p>
                      <p className="text-xs text-zumbii-600 mt-2 font-medium">— NITI Aayog, Digital Commerce Report 2025</p>
                    </div>
                  </section>

                  <section id="ai-sourcing" className="mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-12 mb-4">AI-Powered Sourcing</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      Artificial intelligence is revolutionizing how businesses source products and materials. AI-powered recommendation engines, predictive analytics for demand forecasting, and intelligent supplier matching are becoming standard features of modern B2B platforms. These tools help buyers find the right suppliers faster and help sellers reach the most relevant buyers.
                    </p>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {"Zumbii's"} AI engine, for instance, analyzes over 200 data points — including purchase history, search behavior, seasonal trends, and regional demand patterns — to deliver hyper-personalized product and supplier recommendations. This not only improves the buying experience but also increases conversion rates for sellers by up to 40%.
                    </p>
                  </section>

                  <section id="government-initiatives" className="mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-12 mb-4">Government Initiatives Driving Growth</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      {"Several government initiatives are accelerating the digital transformation of India's B2B sector. The Open Network for Digital Commerce (ONDC) is creating a more level playing field"} by unbundling the e-commerce value chain. Meanwhile, {"the government's"} push for digital payments through UPI and the introduction of e-invoicing under GST are making digital transactions more transparent and efficient.
                    </p>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      The Production Linked Incentive (PLI) scheme across 14 key sectors is also driving manufacturing growth, which in turn creates more B2B trade opportunities. For MSMEs registered on platforms like Zumbii, these government initiatives translate into tangible benefits — easier compliance, access to credit, and a broader customer base.
                    </p>
                  </section>

                  <section id="future-outlook" className="mt-12">
                    <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mt-12 mb-4">The Future Outlook</h2>
                    <p className="text-text-secondary leading-relaxed mb-4">
                      As we look ahead, the convergence of AI, digital public infrastructure, and a thriving startup ecosystem positions India as a global leader in B2B commerce innovation. The businesses that will thrive are those that embrace digital platforms, invest in data-driven decision-making, and prioritize building trust through transparency and quality.
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                      {"At Zumbii, we're committed to powering this transformation. Whether you're a manufacturer in Gujarat looking for raw materials, a retailer in Bihar sourcing inventory, or a supplier in Tamil Nadu reaching new markets — the future of B2B commerce is here, and it's digital."}
                    </p>
                  </section>
                </div>
              </FadeInSection>

              <FadeInSection className="mt-12">
                <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-zumbii-100">
                  <span className="text-sm font-medium text-text-secondary mr-1">Tags:</span>
                  {["B2B Commerce", "Digital India", "AI in Business", "Supply Chain", "E-Commerce Trends"].map((tag) => (
                    <Link
                      key={tag}
                      href={`/blogs?tag=${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      className="px-3 py-1 rounded-full bg-surface-secondary text-xs font-medium text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600 border border-border transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </FadeInSection>

              <FadeInSection className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-surface-secondary border border-zumbii-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-base">
                      AS
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">Arun Sharma</h3>
                      <p className="text-sm text-text-secondary">Senior Industry Analyst, Zumbii Insights</p>
                      <p className="text-xs text-text-tertiary mt-1">
                        Arun has over 12 years of experience analyzing {"India's"} e-commerce and supply chain sectors. He writes about technology, market trends, and business strategy.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ShareButton href="#" icon={Twitter} label="Follow on Twitter" />
                    <ShareButton href="#" icon={Linkedin} label="Follow on LinkedIn" />
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection className="mt-12">
                <div className="flex items-center justify-between pb-6 border-b border-zumbii-100">
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zumbii-50 text-zumbii-600 hover:bg-zumbii-100 transition-colors text-sm font-medium">
                      <Heart className="w-4 h-4" />
                      128
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-secondary text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600 transition-colors text-sm font-medium">
                      <MessageCircle className="w-4 h-4" />
                      24
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-tertiary">Share this article</span>
                    <ShareButton href="#" icon={Twitter} label="Share on Twitter" />
                    <ShareButton href="#" icon={Facebook} label="Share on Facebook" />
                    <ShareButton href="#" icon={Linkedin} label="Share on LinkedIn" />
                  </div>
                </div>
              </FadeInSection>

              <FadeInSection className="mt-10">
                <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-zumbii-500" />
                  Comments ({comments.length + comments.reduce((acc, c) => acc + c.replies.length, 0)})
                </h3>
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-5 rounded-2xl bg-surface-secondary border border-zumbii-100">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shrink-0">
                          {comment.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-text-primary">{comment.name}</h4>
                            <span className="text-[11px] text-text-tertiary shrink-0">{comment.date}</span>
                          </div>
                          <p className="mt-2 text-sm text-text-secondary leading-relaxed">{comment.content}</p>
                          <div className="mt-3 flex items-center gap-4">
                            <button className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-zumbii-600 transition-colors">
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {comment.likes}
                            </button>
                            <button className="inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-zumbii-600 transition-colors">
                              <Reply className="w-3.5 h-3.5" />
                              Reply
                            </button>
                          </div>
                          {comment.replies.length > 0 && (
                            <div className="mt-4 pl-4 border-l-2 border-zumbii-200 space-y-4">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-[9px] shrink-0">
                                    {reply.avatar}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <h4 className="text-sm font-semibold text-text-primary">{reply.name}</h4>
                                      <span className="text-[11px] text-text-tertiary shrink-0">{reply.date}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-text-secondary leading-relaxed">{reply.content}</p>
                                    <button className="mt-2 inline-flex items-center gap-1.5 text-xs text-text-tertiary hover:text-zumbii-600 transition-colors">
                                      <ThumbsUp className="w-3.5 h-3.5" />
                                      Reply
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-6 rounded-2xl bg-white border border-zumbii-100">
                  <h4 className="text-base font-bold text-text-primary mb-1">Leave a Comment</h4>
                  <p className="text-sm text-text-secondary mb-4">Your email address will not be published. Required fields are marked *</p>
                  <form className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Name *</label>
                        <input
                          type="text"
                          placeholder="Your name"
                          className="w-full h-11 px-4 rounded-xl border border-zumbii-100 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-1.5">Email *</label>
                        <input
                          type="email"
                          placeholder="you@email.com"
                          className="w-full h-11 px-4 rounded-xl border border-zumbii-100 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-1.5">Comment *</label>
                      <textarea
                        rows={5}
                        placeholder="Share your thoughts..."
                        className="w-full px-4 py-3 rounded-xl border border-zumbii-100 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all resize-none"
                      />
                    </div>
                    <Button type="submit" size="lg">
                      Post Comment <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </FadeInSection>
            </div>

            <aside className="hidden lg:block lg:col-span-3">
              <div className="lg:sticky lg:top-24 space-y-6">
                <FadeInSection>
                  <Card className="p-5 sm:p-6" hover={false}>
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Related</h3>
                    <div className="space-y-4">
                      {relatedPosts.slice(0, 2).map((post) => (
                        <Link key={post.id} href={`/blogs/${post.id}`} className="group flex gap-3">
                          <div className="relative w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-surface-tertiary">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="64px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs text-text-tertiary mb-0.5">{post.category}</p>
                            <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-zumbii-600 transition-colors leading-snug">
                              {post.title}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>
                </FadeInSection>
              </div>
            </aside>
          </div>
        </Container>
      </article>

      <section className="py-16 lg:py-24 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <SectionHeader
              title="Related Articles"
              subtitle="Continue reading from our blog"
            />
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {relatedPosts.map((post) => (
              <motion.div key={post.id} variants={fadeInUp}>
                <RelatedPostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
          <FadeInSection className="text-center mt-10">
            <Link href="/blogs">
              <Button variant="outline" size="lg">
                View All Articles <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </FadeInSection>
        </Container>
      </section>
    </>
  );
}
