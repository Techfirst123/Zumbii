"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Mail,
  Send,
  Tag,
  Clock3,
  BookOpen,
  Sparkles,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import toast from "react-hot-toast";
import { blogApi, newsletterApi, resolveImageUrl, ApiError, type BackendBlogPost } from "@/lib/api";

const PAGE_SIZE = 8;

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function authorName(post: BackendBlogPost): string {
  const name = [post.author?.firstName, post.author?.lastName].filter(Boolean).join(" ").trim();
  return name || "Zumbii Team";
}

function authorInitials(name: string): string {
  return name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

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

function HeroSection({ searchQuery, onSearch }: { searchQuery: string; onSearch: (v: string) => void }) {
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
            Guides, insights, and updates
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 max-w-lg mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 focus-within:bg-white/20 focus-within:border-white/30">
                <Search className="ml-4 w-5 h-5 text-white/50 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearch(e.target.value)}
                  placeholder="Search articles, topics, guides..."
                  className="flex-1 bg-transparent px-4 py-4 text-white placeholder:text-white/40 text-sm focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function TagFilters({ tags, active, onSelect }: { tags: string[]; active: string; onSelect: (t: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {["All", ...tags].map((tag) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            active === tag
              ? "bg-zumbii-600 text-white shadow-lg shadow-zumbii-600/25"
              : "bg-white text-text-secondary border border-zumbii-100 hover:border-zumbii-300 hover:text-zumbii-600 hover:shadow-sm"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

function PostCard({ post }: { post: BackendBlogPost }) {
  const author = authorName(post);
  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/blogs/${post.slug}`} className="group block h-full">
        <Card className="h-full flex flex-col">
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-tertiary">
            <Image
              src={resolveImageUrl(post.coverImage)}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {post.tags[0] && (
              <div className="absolute top-4 left-4">
                <Badge variant="info" className="backdrop-blur-sm bg-white/90 text-xs">
                  {post.tags[0]}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex-1 p-5 sm:p-6 flex flex-col">
            <div className="flex items-center gap-3 text-xs text-text-tertiary mb-3">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {estimateReadTime(post.content)}
              </span>
            </div>
            <h3 className="font-bold text-text-primary text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-zumbii-600 transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>
            )}
            <div className="mt-4 pt-4 border-t border-zumbii-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-[10px]">
                  {authorInitials(author)}
                </div>
                <span className="text-xs font-medium text-text-primary">{author}</span>
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

function FeaturedPost({ post }: { post: BackendBlogPost }) {
  const author = authorName(post);
  return (
    <motion.div variants={fadeInUp}>
      <Link href={`/blogs/${post.slug}`} className="group block">
        <Card className="grid md:grid-cols-5 overflow-hidden">
          <div className="relative md:col-span-3 aspect-[4/3] md:aspect-auto min-h-[280px] bg-surface-tertiary">
            <Image
              src={resolveImageUrl(post.coverImage)}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {post.tags[0] && (
              <div className="absolute top-4 left-4">
                <Badge variant="info" className="backdrop-blur-sm bg-white/90 text-xs">
                  {post.tags[0]}
                </Badge>
              </div>
            )}
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
                {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {estimateReadTime(post.content)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary leading-tight group-hover:text-zumbii-600 transition-colors">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 text-sm sm:text-base text-text-secondary leading-relaxed line-clamp-3">
                {post.excerpt}
              </p>
            )}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                {authorInitials(author)}
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">{author}</p>
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
    <Card className="p-6 sm:p-8" hover={false}>
      <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center mb-4 shadow-lg">
        <Mail className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-bold text-text-primary mb-2">Subscribe to Our Newsletter</h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">
        Get the latest insights, guides, and market trends delivered to your inbox every week.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          size="lg"
          icon={<Mail className="w-4 h-4" />}
        />
        <Button type="submit" className="w-full" size="lg" disabled={subscribing}>
          {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Subscribe <Send className="w-4 h-4" /></>}
        </Button>
      </form>
      <p className="mt-3 text-[10px] text-text-tertiary text-center">
        No spam. Unsubscribe anytime.
      </p>
    </Card>
  );
}

function RecentPostsWidget({ posts }: { posts: BackendBlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <Card className="p-6 sm:p-8" hover={false}>
      <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
        <Clock3 className="w-5 h-5 text-zumbii-500" />
        Recent Posts
      </h3>
      <div className="space-y-4">
        {posts.map((post, i) => (
          <Link
            key={post.id}
            href={`/blogs/${post.slug}`}
            className="group flex gap-3 items-start"
          >
            <span className="shrink-0 w-7 h-7 rounded-lg bg-zumbii-50 text-zumbii-600 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-zumbii-600 transition-colors">
                {post.title}
              </p>
              <p className="text-[11px] text-text-tertiary mt-1">{formatDate(post.publishedAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function TagsCloud({ tags, onSelect }: { tags: string[]; onSelect: (t: string) => void }) {
  if (tags.length === 0) return null;
  return (
    <Card className="p-6 sm:p-8" hover={false}>
      <h3 className="text-lg font-bold text-text-primary mb-5 flex items-center gap-2">
        <Tag className="w-5 h-5 text-zumbii-500" />
        Topics
      </h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelect(tag)}
            className="px-3 py-1.5 rounded-full bg-surface-secondary text-xs font-medium text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600 hover:border-zumbii-200 border border-border transition-all duration-200"
          >
            {tag}
          </button>
        ))}
      </div>
    </Card>
  );
}

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
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
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default function BlogsPageClient() {
  const [allPosts, setAllPosts] = useState<BackendBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    blogApi
      .list({ limit: 100 })
      .then((res) => {
        if (!cancelled) setAllPosts(res.data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Failed to load posts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeTag, searchQuery]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    allPosts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [allPosts]);

  const recentPosts = useMemo(() => allPosts.slice(0, 5), [allPosts]);

  const q = searchQuery.trim().toLowerCase();
  const filtered = allPosts.filter((post) => {
    if (activeTag !== "All" && !post.tags.includes(activeTag)) return false;
    if (q && !post.title.toLowerCase().includes(q) && !(post.excerpt || "").toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  const showFeatured = activeTag === "All" && !q && page === 1;
  const featured = showFeatured ? filtered[0] : null;
  const gridPosts = showFeatured ? filtered.slice(1) : filtered;
  const totalPages = Math.max(1, Math.ceil(gridPosts.length / PAGE_SIZE));
  const pagePosts = gridPosts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <HeroSection searchQuery={searchQuery} onSearch={setSearchQuery} />

      <section className="py-12 lg:py-16 bg-surface-secondary">
        <Container>
          <FadeInSection>
            <TagFilters tags={allTags} active={activeTag} onSelect={setActiveTag} />
          </FadeInSection>
        </Container>
      </section>

      <section className="py-12 lg:py-20">
        <Container>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-text-tertiary">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : error ? (
            <p className="text-center text-text-tertiary py-20">{error}</p>
          ) : allPosts.length === 0 ? (
            <p className="text-center text-text-tertiary py-20">No posts published yet — check back soon.</p>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10 lg:gap-12">
              <div className="lg:col-span-2 space-y-12">
                {featured && (
                  <FadeInSection>
                    <FeaturedPost post={featured} />
                  </FadeInSection>
                )}

                <FadeInSection>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">
                    {activeTag === "All" ? "Latest Articles" : activeTag}
                  </h2>
                </FadeInSection>

                {pagePosts.length === 0 ? (
                  <p className="text-text-tertiary">No articles match this filter.</p>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="grid sm:grid-cols-2 gap-6"
                  >
                    {pagePosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </motion.div>
                )}

                <FadeInSection>
                  <Pagination current={page} total={totalPages} onChange={setPage} />
                </FadeInSection>
              </div>

              <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
                <FadeInSection>
                  <NewsletterWidget />
                </FadeInSection>
                <FadeInSection>
                  <RecentPostsWidget posts={recentPosts} />
                </FadeInSection>
                <FadeInSection>
                  <TagsCloud tags={allTags} onSelect={setActiveTag} />
                </FadeInSection>
              </aside>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
