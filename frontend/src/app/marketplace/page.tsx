import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import MarketplacePageClient from './MarketplacePageClient';

const title = `Shop Online in India | Electronics, Fashion, Home & More | ${siteConfig.name}`;
const description =
  'Browse thousands of products across electronics, fashion, home & kitchen, beauty, and more on Zumbii — India\'s trusted online marketplace with fast delivery.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/marketplace' },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/marketplace`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function MarketplacePage() {
  return <MarketplacePageClient />;
}
