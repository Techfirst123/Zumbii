"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  Check,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/container";
import SectionHeader from "@/components/ui/section-header";
import { blogApi, resolveImageUrl, ApiError, type BackendBlogPost } from "@/lib/api";
import { siteConfig } from "@/lib/constants";

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

function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          toast.success("Link copied!");
          setTimeout(() => setCopied(false), 2000);
        } catch {
          toast.error("Could not copy link");
        }
      }}
      className="w-10 h-10 rounded-xl border border-zumbii-100 flex items-center justify-center text-text-secondary hover:bg-zumbii-50 hover:text-zumbii-600 hover:border-zumbii-200 transition-all"
      aria-label="Copy link"
    >
      {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
    </button>
  );
}

function RelatedPostCard({ post }: { post: BackendBlogPost }) {
  return (
    <Link href={`/blogs/${post.slug}`} className="group block h-full">
      <Card className="h-full flex flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-tertiary">
          <Image
            src={resolveImageUrl(post.coverImage)}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {post.tags[0] && (
            <div className="absolute top-3 left-3">
              <Badge variant="info" className="backdrop-blur-sm bg-white/90 text-[10px] px-2 py-0.5">
                {post.tags[0]}
              </Badge>
            </div>
          )}
        </div>
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-center gap-2 text-[11px] text-text-tertiary mb-2">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{estimateReadTime(post.content)}</span>
          </div>
          <h4 className="font-bold text-text-primary text-sm leading-snug line-clamp-2 group-hover:text-zumbii-600 transition-colors flex-1">
            {post.title}
          </h4>
        </div>
      </Card>
    </Link>
  );
}

export default function BlogPostPageClient() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [post, setPost] = useState<BackendBlogPost | null>(null);
  const [others, setOthers] = useState<BackendBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    blogApi
      .getBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setPost(data);
        return blogApi.list({ limit: 50 }).then((res) => {
          if (!cancelled) setOthers(res.data.filter((p) => p.slug !== slug));
        });
      })
      .catch((err) => {
        if (!cancelled) setNotFound(!(err instanceof ApiError) || err.status === 404);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    const shared = others.filter((p) => p.tags.some((t) => post.tags.includes(t)));
    const pool = shared.length > 0 ? shared : others;
    return pool.slice(0, 3);
  }, [post, others]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zumbii-500" />
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-text-primary">Article not found</h1>
        <p className="text-text-tertiary">This post may have been removed or is no longer available.</p>
        <Link href="/blogs">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    );
  }

  const author = authorName(post);
  const shareUrl = `${siteConfig.url}/blogs/${post.slug}`;
  const paragraphs = post.content.split(/\n{2,}/).filter((p) => p.trim());

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
                {post.tags[0] && <Badge variant="info">{post.tags[0]}</Badge>}
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-text-tertiary">
                  <Clock className="w-3.5 h-3.5" />
                  {estimateReadTime(post.content)}
                </span>
              </div>
            </FadeInSection>

            <FadeInSection>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary leading-[1.15] tracking-tight">
                {post.title}
              </h1>
            </FadeInSection>

            {post.excerpt && (
              <FadeInSection className="mt-6">
                <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">{post.excerpt}</p>
              </FadeInSection>
            )}

            <FadeInSection className="mt-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-zumbii-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                    {authorInitials(author)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{author}</p>
                    <p className="text-xs text-text-tertiary">Zumbii Blog</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    icon={Twitter}
                    label="Share on Twitter"
                  />
                  <ShareButton
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    icon={Facebook}
                    label="Share on Facebook"
                  />
                  <ShareButton
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                    icon={Linkedin}
                    label="Share on LinkedIn"
                  />
                  <CopyLinkButton url={shareUrl} />
                </div>
              </div>
            </FadeInSection>
          </div>
        </Container>

        <Container className="mt-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-9 lg:col-start-2">
              {post.coverImage && (
                <FadeInSection>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-surface-tertiary mb-10">
                    <Image
                      src={resolveImageUrl(post.coverImage)}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      priority
                    />
                  </div>
                </FadeInSection>
              )}

              <FadeInSection>
                <div className="prose prose-zumbii max-w-none">
                  {paragraphs.map((para, i) => (
                    <p key={i} className="text-text-secondary leading-relaxed mb-4 whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </FadeInSection>

              {post.tags.length > 0 && (
                <FadeInSection className="mt-12">
                  <div className="flex flex-wrap items-center gap-2 pt-8 border-t border-zumbii-100">
                    <span className="text-sm font-medium text-text-secondary mr-1">Tags:</span>
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-surface-secondary text-xs font-medium text-text-secondary border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </FadeInSection>
              )}

              <FadeInSection className="mt-10">
                <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-surface-secondary border border-zumbii-100">
                  <div className="flex items-center gap-2 text-sm text-text-tertiary">
                    <Share2 className="w-4 h-4" />
                    Share this article
                  </div>
                  <div className="flex items-center gap-2">
                    <ShareButton
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                      icon={Twitter}
                      label="Share on Twitter"
                    />
                    <ShareButton
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      icon={Facebook}
                      label="Share on Facebook"
                    />
                    <ShareButton
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                      icon={Linkedin}
                      label="Share on LinkedIn"
                    />
                    <CopyLinkButton url={shareUrl} />
                  </div>
                </div>
              </FadeInSection>
            </div>
          </div>
        </Container>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-surface-secondary">
          <Container>
            <FadeInSection>
              <SectionHeader title="Related Articles" subtitle="Continue reading from our blog" />
            </FadeInSection>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {relatedPosts.map((p) => (
                <motion.div key={p.id} variants={fadeInUp}>
                  <RelatedPostCard post={p} />
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
      )}
    </>
  );
}
