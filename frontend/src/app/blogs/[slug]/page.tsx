import type { Metadata } from 'next';
import { blogApi, resolveImageUrl } from '@/lib/api';
import { siteConfig } from '@/lib/constants';
import BlogPostPageClient from './BlogPostPageClient';

type Props = { params: Promise<{ slug: string }> };

function buildDescription(excerpt?: string | null, content?: string): string {
  const raw = excerpt || content || '';
  const clean = raw.replace(/\s+/g, ' ').trim();
  return clean.length > 160 ? `${clean.slice(0, 157)}...` : clean;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await blogApi.getBySlug(slug);
    const title = `${post.title} | ${siteConfig.name} Blog`;
    const description = buildDescription(post.excerpt, post.content);
    const image = resolveImageUrl(post.coverImage);

    return {
      title,
      description,
      alternates: { canonical: `/blogs/${slug}` },
      openGraph: {
        title: post.title,
        description,
        url: `${siteConfig.url}/blogs/${slug}`,
        type: 'article',
        images: [{ url: image, width: 1200, height: 630, alt: post.title }],
        ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description,
        images: [image],
      },
    };
  } catch {
    return {
      title: `Article Not Found | ${siteConfig.name}`,
      description: `This article is unavailable or no longer exists on ${siteConfig.name}.`,
      robots: { index: false, follow: true },
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let jsonLd: Record<string, unknown> | null = null;

  try {
    const post = await blogApi.getBySlug(slug);
    const authorName = [post.author?.firstName, post.author?.lastName].filter(Boolean).join(' ').trim() || 'Zumbii Team';

    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: buildDescription(post.excerpt, post.content),
      image: [resolveImageUrl(post.coverImage)],
      datePublished: post.publishedAt || post.createdAt,
      dateModified: post.updatedAt,
      author: { '@type': 'Person', name: authorName },
      publisher: {
        '@type': 'Organization',
        name: siteConfig.name,
        logo: { '@type': 'ImageObject', url: `${siteConfig.url}/images/zumbii-logo-header-wide.png` },
      },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteConfig.url}/blogs/${slug}` },
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
      <BlogPostPageClient />
    </>
  );
}
