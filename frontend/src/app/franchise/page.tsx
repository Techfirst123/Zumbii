import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import FranchisePageClient from './FranchisePageClient';

const title = `Zumbii Franchise Opportunities in India | Start Your Own Business`;
const description =
  'Own a Zumbii franchise and start a profitable business with low investment, full training, and ongoing support. Explore master, area, and unit franchise models across India.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/franchise' },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/franchise`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function FranchisePage() {
  return <FranchisePageClient />;
}
