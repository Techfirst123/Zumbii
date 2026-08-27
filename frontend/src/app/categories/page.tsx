import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import CategoriesPageClient from './CategoriesPageClient';

const title = `Shop by Category | ${siteConfig.name}`;
const description =
  'Browse all product categories on Zumbii — electronics, fashion, home & kitchen, beauty, industrial supplies, and more.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/categories' },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/categories`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
