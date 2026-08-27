import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import BlogsPageClient from './BlogsPageClient';

const title = `Blog | Guides, Insights & Updates | ${siteConfig.name}`;
const description =
  'Guides, product insights, and market trends from Zumbii — India\'s trusted online marketplace.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/blogs' },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/blogs`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function BlogsPage() {
  return <BlogsPageClient />;
}
