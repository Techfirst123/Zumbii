import { resolveImageUrl, type BackendProduct, type BackendCategory, type BackendReview } from './api';
import type { Product, Category, Review } from '@/types';

export function mapBackendReviews(reviews?: BackendReview[]): Review[] {
  if (!reviews) return [];
  return reviews.map((r) => ({
    id: r.id,
    user: {
      name: [r.user?.firstName, r.user?.lastName].filter(Boolean).join(' ') || 'Verified Buyer',
      avatar: r.user?.avatar ?? undefined,
    },
    rating: r.rating,
    title: r.title ?? '',
    content: r.comment ?? '',
    createdAt: new Date(r.createdAt).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    helpful: 0,
  }));
}

export function mapBackendCategory(cat?: BackendCategory | null): Category {
  return {
    id: cat?.id ?? 'uncategorized',
    name: cat?.name ?? 'Uncategorized',
    slug: cat?.slug ?? 'uncategorized',
    description: cat?.description ?? '',
    image: cat?.image ?? '',
    icon: cat?.icon ?? '',
    children: [],
    productCount: 0,
  };
}

export function mapBackendProduct(p: BackendProduct): Product {
  const createdAt = p.createdAt ?? new Date().toISOString();
  const isNew =
    Date.now() - new Date(createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? '',
    shortDescription: p.shortDesc ?? p.description ?? '',
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    images:
      p.images && p.images.length > 0
        ? p.images.map((img) => resolveImageUrl(img))
        : ['/placeholder.svg'],
    category: mapBackendCategory(p.category),
    brand: {
      id: p.brand?.id ?? 'zumbii',
      name: p.brand?.name ?? 'Zumbii Marketplace',
      slug: p.brand?.slug ?? 'zumbii',
      logo: '',
      description: '',
      productCount: 0,
    },
    seller: {
      id: 'zumbii-store',
      businessName: 'Zumbii Verified Seller',
      businessType: 'Retailer',
      logo: '',
      rating: p.rating || 4.5,
      reviewCount: p.reviewCount || 0,
      verified: true,
      gstVerified: true,
      panVerified: true,
      location: 'India',
      responseTime: 'Within 24 hours',
      followerCount: 0,
    },
    sku: p.sku,
    gstRate: 18,
    moq: p.minOrderQty || 1,
    stock: p.quantity,
    availableQuantity: p.quantity,
    rating: p.rating || 0,
    reviewCount: p.reviewCount || 0,
    specifications: [],
    features: [],
    downloads: [],
    certificates: [],
    tags: p.tags ?? [],
    isFeatured: p.isFeatured,
    isNew,
    status: p.isActive ? 'active' : 'inactive',
    createdAt,
    updatedAt: p.updatedAt ?? createdAt,
    variantOptions: p.variantOptions ?? undefined,
    variants: p.variants?.map((v) => ({
      id: v.id,
      sku: v.sku,
      price: Number(v.price),
      comparePrice: v.comparePrice ? Number(v.comparePrice) : undefined,
      quantity: v.quantity,
      images: v.images.map((img) => resolveImageUrl(img)),
      optionValues: v.optionValues,
      isActive: v.isActive,
    })),
    activeCampaign: p.activeCampaign ?? null,
  };
}
