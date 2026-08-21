'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Megaphone, Loader2, Package } from 'lucide-react';

import type { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import Container from '@/components/ui/container';
import { campaignsApi, resolveImageUrl, ApiError, type BackendCampaign } from '@/lib/api';
import { mapBackendProduct } from '@/lib/adapters';
import { trackEvent } from '@/lib/gtag';

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function CampaignLandingPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [campaign, setCampaign] = useState<BackendCampaign | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setLoadError('');

    async function load() {
      try {
        const data = await campaignsApi.getBySlug(slug);
        if (cancelled) return;
        setCampaign(data);
        setProducts((data.products ?? []).map((cp) => mapBackendProduct(cp.product!)));
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setLoadError(err instanceof ApiError ? err.message : 'Could not load this campaign');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!campaign) return;
    trackEvent('view_promotion', {
      promotion_id: campaign.slug,
      promotion_name: campaign.name,
    });
  }, [campaign]);

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zumbii-500" />
      </div>
    );
  }

  if (notFound || loadError || !campaign) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <div className="text-center py-24">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
            <Megaphone className="w-8 h-8 text-text-tertiary" />
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Campaign not found</h1>
          <p className="text-sm text-text-tertiary mt-1">
            {loadError || "This campaign has ended or doesn't exist."}
          </p>
          <Link
            href="/marketplace"
            className="mt-4 inline-block text-sm font-medium text-zumbii-600 hover:text-zumbii-700"
          >
            Browse the marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-16 lg:pt-20">
      <div className="border-b border-border bg-white">
        <Container className="py-3">
          <nav className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link href="/" className="hover:text-zumbii-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary">{campaign.name}</span>
          </nav>
        </Container>
      </div>

      <div className="relative bg-zumbii-950 overflow-hidden">
        {campaign.bannerImageUrl && (
          <Image
            src={resolveImageUrl(campaign.bannerImageUrl)}
            alt={campaign.name}
            fill
            priority
            className="object-cover opacity-60"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zumbii-950 via-zumbii-950/60 to-transparent" />
        <Container className="relative py-14 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 uppercase tracking-wide">
              <Megaphone className="w-3.5 h-3.5" />
              Limited-time campaign
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              {campaign.name}
            </h1>
            {campaign.description && (
              <p className="mt-3 text-white/80 max-w-2xl">{campaign.description}</p>
            )}
            <p className="mt-3 text-sm text-white/60">{products.length} products in this campaign</p>
          </motion.div>
        </Container>
      </div>

      <Container className="py-8 lg:py-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-surface-tertiary flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">No products in this campaign yet</h3>
            <p className="text-sm text-text-tertiary mt-1">Check back soon.</p>
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={fadeIn}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </div>
  );
}
