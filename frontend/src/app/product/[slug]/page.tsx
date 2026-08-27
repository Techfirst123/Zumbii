import type { Metadata } from 'next';
import { productsApi, resolveImageUrl } from '@/lib/api';
import { siteConfig } from '@/lib/constants';
import ProductPageClient from './ProductPageClient';

type Props = { params: Promise<{ slug: string }> };

function buildDescription(shortDesc?: string | null, description?: string | null, name?: string): string {
  const raw = shortDesc || description || `Shop ${name} online at the best price with fast delivery across India.`;
  return raw.length > 160 ? `${raw.slice(0, 157)}...` : raw;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const product = await productsApi.getBySlug(slug);
    const title = `Buy ${product.name} Online India | ${siteConfig.name}`;
    const description = buildDescription(product.shortDesc, product.description, product.name);
    const image = resolveImageUrl(product.images?.[0]);

    return {
      title,
      description,
      alternates: { canonical: `/product/${slug}` },
      openGraph: {
        title,
        description,
        url: `${siteConfig.url}/product/${slug}`,
        type: 'website',
        images: [{ url: image, width: 800, height: 800, alt: product.name }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: `Product Not Found | ${siteConfig.name}`,
      description: `This product is unavailable or no longer exists on ${siteConfig.name}.`,
      robots: { index: false, follow: true },
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let jsonLd: Record<string, unknown> | null = null;

  try {
    const product = await productsApi.getBySlug(slug);
    const price = Number(product.price);

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      image: (product.images || []).map((img) => resolveImageUrl(img)),
      description: buildDescription(product.shortDesc, product.description, product.name),
      sku: product.sku,
      ...(product.brand ? { brand: { '@type': 'Brand', name: product.brand.name } } : {}),
      offers: {
        '@type': 'Offer',
        url: `${siteConfig.url}/product/${slug}`,
        priceCurrency: 'INR',
        price: price.toFixed(2),
        availability:
          product.quantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      },
      ...(product.reviewCount > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: product.rating,
              reviewCount: product.reviewCount,
            },
          }
        : {}),
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
      <ProductPageClient />
    </>
  );
}
