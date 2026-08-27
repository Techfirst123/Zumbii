import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

const API_BASE = `${siteConfig.url}/api/v1`;

interface SitemapProduct {
  slug: string;
  updatedAt?: string;
}

interface SitemapCategory {
  slug: string;
}

interface SitemapBlogPost {
  slug: string;
  publishedAt?: string | null;
  updatedAt?: string;
}

async function fetchProducts(): Promise<SitemapProduct[]> {
  try {
    const res = await fetch(`${API_BASE}/products?limit=1000`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

async function fetchCategories(): Promise<SitemapCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function fetchBlogPosts(): Promise<SitemapBlogPost[]> {
  try {
    const res = await fetch(`${API_BASE}/blog?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/marketplace`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/categories`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/franchise`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/b2b`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/blogs`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteConfig.url}/sell`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/verticals`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const [products, categories, blogPosts] = await Promise.all([
    fetchProducts(),
    fetchCategories(),
    fetchBlogPosts(),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/product/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
    ...(product.updatedAt ? { lastModified: new Date(product.updatedAt) } : {}),
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blogs/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
    lastModified: new Date(post.updatedAt || post.publishedAt || Date.now()),
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...blogRoutes];
}
