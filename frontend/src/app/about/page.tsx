import type { Metadata } from 'next';
import { siteConfig } from '@/lib/constants';
import AboutPageClient from './AboutPageClient';

const title = `About Us | ${siteConfig.name}`;
const description = siteConfig.description;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/about' },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/about`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
