'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Eye, Package } from 'lucide-react';
import clsx from 'clsx';

import type { Product } from '@/types';
import { Badge } from './Badge';
import { StarRating } from './StarRating';
import { useCartStore } from '@/store/cartStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';

interface ProductCardProps {
  product: Product;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

function ProductCard({ product, className, onAddToCart, onQuickView }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (onAddToCart) {
      onAddToCart(product);
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || '/placeholder.svg',
      price: product.price,
      quantity: product.moq > 1 ? product.moq : 1,
      maxQuantity: Math.max(product.stock, 1),
      seller: product.seller?.businessName || '',
    });
  };

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
      : 0;

  const hasBadge = product.isNew || product.isFeatured || discount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'group relative bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-surface-tertiary">
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-surface-tertiary" />
          )}
          <Image
            src={product.images[0] || '/placeholder.svg'}
            alt={product.name}
            fill
            className={clsx(
              'object-cover transition-transform duration-500 group-hover:scale-110',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />

          {hasBadge && (
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {product.isNew && (
                <Badge variant="new" size="sm">New</Badge>
              )}
              {discount > 0 && (
                <Badge variant="sale" size="sm">{discount}% OFF</Badge>
              )}
              {product.isFeatured && !product.isNew && discount === 0 && (
                <Badge variant="info" size="sm">Trending</Badge>
              )}
            </div>
          )}

          {product.wholesalePrice && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="success" size="sm">
                <Package className="w-2.5 h-2.5" />
                Bulk
              </Badge>
            </div>
          )}

          <div
            className={clsx(
              'absolute inset-x-0 bottom-0 flex items-center gap-2 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            {onQuickView && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-white/90 backdrop-blur-sm text-text-primary text-xs font-medium rounded-lg hover:bg-white transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Quick View
              </button>
            )}
            {product.stock > 0 && (
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 h-11 bg-gold-500 text-zumbii-950 text-xs font-semibold rounded-lg hover:bg-gold-600 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4 space-y-2">
        {product.seller && (
          <p className="text-[11px] text-text-tertiary truncate">
            {product.seller.businessName}
          </p>
        )}

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-medium text-sm text-text-primary leading-snug line-clamp-2 hover:text-zumbii-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-[11px] text-text-tertiary">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-baseline justify-between gap-1.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-text-primary">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-xs text-text-tertiary line-through">
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          {product.shortDescription && (
            <span className="shrink-0 text-[11px] font-medium text-text-tertiary">
              {product.shortDescription}
            </span>
          )}
        </div>

        {product.wholesalePrice && (
          <p className="text-[11px] text-emerald-600 font-medium">
            Wholesale: ₹{product.wholesalePrice.toLocaleString('en-IN')}/unit
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          {product.moq > 0 && (
            <span className="text-[11px] text-text-tertiary flex items-center gap-1">
              <Package className="w-3 h-3" />
              MOQ: {product.moq}
            </span>
          )}
          {product.stock > 0 && product.stock <= 10 && (
            <span className="text-[11px] text-amber-600 font-medium">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-[11px] text-red-500 font-medium">Out of stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export { ProductCard };
export type { ProductCardProps };
