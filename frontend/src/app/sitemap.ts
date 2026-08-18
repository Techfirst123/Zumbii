import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants";

const API_BASE = `${siteConfig.url}/api/v1`;

interface SitemapProduct {
  slug: string;
}

interface SitemapCategory {
  slug: string;
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
    { url: `${siteConfig.url}/login`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const [products, categories] = await Promise.all([fetchProducts(), fetchCategories()]);

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/product/${product.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/category/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
