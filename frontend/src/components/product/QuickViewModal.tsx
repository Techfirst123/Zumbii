'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { StarRating } from '@/components/ui/StarRating';
import { VariantSelector } from './VariantSelector';
import { ProductImagePlaceholder, PLACEHOLDER_IMAGE_SENTINEL } from './ProductImagePlaceholder';
import { useCartStore } from '@/store/cartStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import type { Product } from '@/types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product?.variants?.length) {
      const initial = product.variants.find((v) => v.quantity > 0) ?? product.variants[0];
      setSelectedOptions(initial.optionValues);
    } else {
      setSelectedOptions({});
    }
    setAdded(false);
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return null;

  const selectedVariant = product.variants?.length
    ? product.variants.find((v) =>
        Object.entries(selectedOptions).every(([key, val]) => v.optionValues[key] === val)
      )
    : undefined;

  const campaign = product.activeCampaign;
  const effectivePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectiveComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const effectiveStock = selectedVariant ? selectedVariant.quantity : product.stock;
  const effectiveImages = selectedVariant?.images.length ? selectedVariant.images : product.images;
  const mainImage = effectiveImages[0] ?? PLACEHOLDER_IMAGE_SENTINEL;

  const displayPrice = campaign ? campaign.campaignPrice : effectivePrice;
  const strikePrice = campaign ? effectivePrice : effectiveComparePrice;

  function isOptionValueAvailable(optionName: string, value: string): boolean {
    if (!product?.variants?.length) return true;
    return product.variants.some(
      (v) => v.optionValues[optionName] === value && v.isActive && v.quantity > 0
    );
  }

  function handleAddToCart() {
    if (!product) return;
    if (!requireAuth()) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant
        ? Object.values(selectedVariant.optionValues).join(' / ')
        : undefined,
      sku: selectedVariant?.sku ?? product.sku,
      slug: product.slug,
      name: product.name,
      image: mainImage,
      price: displayPrice,
      gstRate: product.gstRate,
      quantity: product.moq > 1 ? product.moq : 1,
      maxQuantity: Math.max(effectiveStock, 1),
      seller: product.seller?.businessName || '',
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <Modal open={!!product} onClose={onClose} size="xl">
      <div className="p-5 sm:p-6 grid sm:grid-cols-2 gap-6 max-h-[85vh] overflow-y-auto">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-tertiary">
          {mainImage === PLACEHOLDER_IMAGE_SENTINEL ? (
            <ProductImagePlaceholder categoryName={product.category?.name} />
          ) : (
            <Image src={mainImage} alt={product.name} fill className="object-cover" sizes="400px" />
          )}
        </div>

        <div className="space-y-4 min-w-0">
          <div>
            <h2 className="text-lg font-bold text-text-primary leading-snug">{product.name}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <StarRating rating={product.rating} size="sm" />
              <span className="text-xs text-text-tertiary">({product.reviewCount} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-text-primary">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {strikePrice && strikePrice > displayPrice && (
              <span className="text-sm text-text-tertiary line-through">
                ₹{strikePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {product.variantOptions && product.variantOptions.length > 0 && (
            <VariantSelector
              variantOptions={product.variantOptions}
              selected={selectedOptions}
              onSelect={(name, value) => setSelectedOptions((prev) => ({ ...prev, [name]: value }))}
              isValueAvailable={isOptionValueAvailable}
            />
          )}

          {(product.shortDescription || product.description) && (
            <p className="text-sm text-text-secondary line-clamp-3">
              {product.shortDescription || product.description}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button className="flex-1" disabled={effectiveStock === 0} onClick={handleAddToCart}>
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Added to Cart
                </>
              ) : effectiveStock === 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </Button>
            <Link href={`/product/${product.slug}`} onClick={onClose} className="flex-1">
              <Button variant="outline" className="w-full">
                <ExternalLink className="w-4 h-4" />
                View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
