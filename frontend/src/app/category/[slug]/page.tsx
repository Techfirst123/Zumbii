import type { Metadata } from 'next';
import { categoriesApi, resolveImageUrl } from '@/lib/api';
import { siteConfig } from '@/lib/constants';
import CategoryPageClient from './CategoryPageClient';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await categoriesApi.getBySlug(slug);
    const title = `Buy ${category.name} Online India | ${siteConfig.name}`;
    const description =
      category.description ||
      `Shop the best ${category.name} products online on ${siteConfig.name}. Great prices, fast delivery across India.`;
    const image = category.image ? resolveImageUrl(category.image) : undefined;

    return {
      title,
      description,
      alternates: { canonical: `/category/${slug}` },
      openGraph: {
        title,
        description,
        url: `${siteConfig.url}/category/${slug}`,
        type: 'website',
        ...(image ? { images: [{ url: image, width: 800, height: 800, alt: category.name }] } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return {
      title: `Category Not Found | ${siteConfig.name}`,
      description: `This category is unavailable or no longer exists on ${siteConfig.name}.`,
      robots: { index: false, follow: true },
    };
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  let jsonLd: Record<string, unknown> | null = null;

  try {
    const category = await categoriesApi.getBySlug(slug);
    const items = [
      { name: 'Home', url: `${siteConfig.url}/` },
      { name: 'Categories', url: `${siteConfig.url}/categories` },
      ...(category.parent ? [{ name: category.parent.name, url: `${siteConfig.url}/category/${category.parent.slug}` }] : []),
      { name: category.name, url: `${siteConfig.url}/category/${slug}` },
    ];

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  } catch {
    jsonLd = null;
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CategoryPageClient />
    </>
  );
}
