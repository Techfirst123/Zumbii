'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Play,
  RotateCw,
  Star,
  Check,
  Download,
  Award,
  Shield,
  Store,
  Clock,
  BadgeCheck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Heart,
  Share2,
  MapPin,
  Package,
  IndianRupee,
  FileDown,
  HelpCircle,
  ChevronDown,
  Building2,
  Verified,
  Ruler,
  CheckCircle2,
  X,
  AlertCircle,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { clsx } from 'clsx';
import Container from '@/components/ui/container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { ProductCard } from '@/components/ui/ProductCard';
import { PincodeChecker } from '@/components/ui/PincodeChecker';
import { Modal } from '@/components/ui/Modal';
import { VariantSelector } from '@/components/product/VariantSelector';
import { ProductImagePlaceholder, PLACEHOLDER_IMAGE_SENTINEL } from '@/components/product/ProductImagePlaceholder';
import type { Product, ProductVariant, Review, Seller } from '@/types';
import { productsApi, ApiError } from '@/lib/api';
import { mapBackendProduct, mapBackendReviews } from '@/lib/adapters';
import { useCartStore } from '@/store/cartStore';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { trackEvent } from '@/lib/gtag';

const faqs = [
  {
    question: 'What is the battery life with ANC turned on?',
    answer: 'The Pro X1 delivers up to 60 hours of playback with Active Noise Cancellation enabled. With ANC off, you can get up to 80 hours. A 10-minute quick charge provides 5 hours of playback.',
  },
  {
    question: 'Is this product GST billed?',
    answer: 'Yes, all products on Zumbii come with a valid GST invoice. The GST rate for this product is 18%. You can use the GST input tax credit for business purchases.',
  },
  {
    question: 'What is the minimum order quantity for wholesale?',
    answer: 'The minimum order quantity (MOQ) is 5 units for wholesale pricing. For bulk orders above 100 units, additional discounts apply. Contact the seller for custom bulk requirements.',
  },
  {
    question: 'Do you provide installation or setup support?',
    answer: 'The product comes with a detailed user manual and quick start guide. For enterprise orders (50+ units), the seller provides free virtual setup assistance. Premium on-site support can be arranged.',
  },
  {
    question: 'What is the return and replacement policy?',
    answer: 'We offer a 7-day replacement policy for manufacturing defects. For bulk B2B orders, a replacement or repair warranty of up to 2 years is applicable. Please refer to the detailed return policy section.',
  },
  {
    question: 'Can I get a sample before placing a bulk order?',
    answer: 'Yes, sample units are available at 50% of the MRP. The sample cost is adjustable against the first bulk order. Contact the seller directly to arrange a sample.',
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

function FadeView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function ImageGallery({ images, categoryName }: { images: string[]; categoryName?: string }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const isPlaceholder = images[selected] === PLACEHOLDER_IMAGE_SENTINEL;

  useEffect(() => {
    setSelected(0);
  }, [images]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  }, []);

  return (
    <div className="space-y-4">
      <div
        ref={imageRef}
        className={clsx(
          'relative aspect-square rounded-2xl overflow-hidden bg-surface-tertiary group',
          !isPlaceholder && 'cursor-zoom-in'
        )}
        onMouseEnter={() => !isPlaceholder && setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={!isPlaceholder ? handleMouseMove : undefined}
        onClick={() => !isPlaceholder && setLightboxOpen(true)}
      >
        {isPlaceholder ? (
          <ProductImagePlaceholder categoryName={categoryName} />
        ) : (
          <Image
            src={images[selected]}
            alt="Product"
            fill
            className="object-cover transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            style={zoomed ? { transform: 'scale(1.8)', transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : undefined}
          />
        )}
        <div className="absolute top-3 left-3 flex gap-2 z-10">
          <Badge variant="new" size="sm">New</Badge>
          <Badge variant="sale" size="sm">31% OFF</Badge>
        </div>
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <button className="w-9 h-9 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm" aria-label="360 view">
            <RotateCw className="w-4 h-4 text-text-secondary" />
          </button>
          <button className="w-9 h-9 rounded-xl bg-white/70 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm" aria-label="Play video">
            <Play className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
        {zoomed && !isPlaceholder && (
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            <ZoomIn className="w-3.5 h-3.5" />
            Click to view full screen
          </div>
        )}
      </div>

      {!isPlaceholder && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={clsx(
                'relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200',
                selected === i
                  ? 'border-gold-500 ring-2 ring-gold-200'
                  : 'border-border hover:border-gold-300'
              )}
            >
              <Image
                src={img}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
          <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-0.5 shrink-0 hover:border-zumbii-300 hover:bg-zumbii-50 transition-colors">
            <RotateCw className="w-4 h-4 text-text-tertiary" />
            <span className="text-[10px] text-text-tertiary font-medium">360°</span>
          </button>
          <button className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-0.5 shrink-0 hover:border-zumbii-300 hover:bg-zumbii-50 transition-colors">
            <Play className="w-4 h-4 text-text-tertiary" />
            <span className="text-[10px] text-text-tertiary font-medium">Video</span>
          </button>
        </div>
      )}

      {!isPlaceholder && (
        <Modal open={lightboxOpen} onClose={() => setLightboxOpen(false)} size="full">
          <div className="relative w-full h-[80vh]">
            <Image
              src={images[selected]}
              alt="Product full view"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 9999,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-0.5 bg-surface-secondary rounded-xl border border-border p-0.5">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-11 h-11 flex items-center justify-center rounded-lg text-text-secondary hover:bg-white hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min;
          onChange(Math.max(min, Math.min(max, v)));
        }}
        className="w-14 text-center text-sm font-medium text-text-primary bg-transparent border-none focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
      />
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-11 h-11 flex items-center justify-center rounded-lg text-text-secondary hover:bg-white hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function RatingBreakdown({ breakdown }: { breakdown: { stars: number; count: number; percentage: number }[] }) {
  return (
    <div className="space-y-2.5">
      {breakdown.map((r) => (
        <div key={r.stars} className="flex items-center gap-3">
          <span className="text-xs font-medium text-text-secondary w-12 flex items-center gap-1">
            {r.stars} <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
          </span>
          <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${r.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * (5 - r.stars) }}
              className="h-full bg-gold-500 rounded-full"
            />
          </div>
          <span className="text-xs text-text-tertiary w-10 text-right">{r.count}</span>
        </div>
      ))}
    </div>
  );
}

function Accordion({ items }: { items: { question: string; answer: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div
          key={i}
          className="rounded-xl border border-border overflow-hidden transition-all duration-200"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-surface-secondary transition-colors"
          >
            <span className="text-sm font-medium text-text-primary">{item.question}</span>
            <ChevronDown
              className={clsx(
                'w-4 h-4 text-text-tertiary shrink-0 transition-transform duration-200',
                open === i && 'rotate-180'
              )}
            />
          </button>
          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function Carousel({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        onScroll={updateScroll}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory -mx-1 px-1 pb-2"
      >
        {children}
      </div>
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronLeft className="w-4 h-4 text-text-secondary" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <ChevronRight className="w-4 h-4 text-text-secondary" />
        </button>
      )}
    </div>
  );
}

function SellerCard({ seller }: { seller: Seller }) {
  return (
    <Card glass className="p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-zumbii-50 shrink-0">
          <Image src={seller.logo} alt={seller.businessName} fill className="object-cover" sizes="48px" />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-text-primary truncate flex items-center gap-1.5">
            {seller.businessName}
            {seller.verified && (
              <BadgeCheck className="w-4 h-4 text-zumbii-500 shrink-0" />
            )}
          </h4>
          <p className="text-xs text-text-tertiary">{seller.businessType}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <StarRating rating={seller.rating} size="sm" />
        <span className="text-xs text-text-secondary font-medium">{seller.rating}</span>
        <span className="text-xs text-text-tertiary">({seller.reviewCount})</span>
        <span className="text-xs text-text-tertiary mx-1">•</span>
        <span className="text-xs text-text-tertiary">{seller.followerCount} followers</span>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
        {seller.location}
      </div>

      <div className="flex items-center gap-2 text-xs text-text-secondary">
        <Clock className="w-3.5 h-3.5 text-text-tertiary" />
        Response: <span className="font-medium text-emerald-600">{seller.responseTime}</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {seller.verified && (
          <Badge variant="success" size="sm">
            <Verified className="w-2.5 h-2.5" />
            Verified Seller
          </Badge>
        )}
        {seller.gstVerified && (
          <Badge variant="info" size="sm">
            GST Registered
          </Badge>
        )}
        {seller.panVerified && (
          <Badge variant="info" size="sm">
            PAN Verified
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" className="flex-1">
          <Store className="w-3.5 h-3.5" />
          Visit Store
        </Button>
        <Button variant="ghost" size="sm" className="flex-1">
          <MessageCircle className="w-3.5 h-3.5" />
          Chat
        </Button>
      </div>
    </Card>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [helpful, setHelpful] = useState(review.helpful);
  const [voted, setVoted] = useState(false);

  return (
    <div className="p-4 sm:p-5 rounded-xl border border-border bg-surface-secondary/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-zumbii-100 flex items-center justify-center text-sm font-semibold text-zumbii-700 shrink-0">
            {review.user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">{review.user.name}</p>
            <p className="text-xs text-text-tertiary">{review.createdAt}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <h5 className="mt-3 text-sm font-semibold text-text-primary">{review.title}</h5>
      <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">{review.content}</p>
      {review.images && review.images.length > 0 && (
        <div className="mt-3 flex gap-2">
          {review.images.map((img, i) => (
            <div key={i} className="w-16 h-16 rounded-lg overflow-hidden bg-surface-tertiary">
              <Image src={img} alt="Review image" width={64} height={64} className="object-cover w-full h-full" />
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 flex items-center gap-3 text-xs text-text-tertiary">
        <button
          onClick={() => {
            if (!voted) {
              setHelpful((p) => p + 1);
              setVoted(true);
            }
          }}
          className={clsx(
            'flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors',
            voted
              ? 'bg-zumbii-50 border-zumbii-200 text-zumbii-600'
              : 'border-border hover:bg-surface-tertiary'
          )}
        >
          <Check className="w-3 h-3" />
          Helpful ({helpful})
        </button>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const requireAuth = useRequireAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  useEffect(() => {
    const slug = params?.slug;
    if (!slug) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const raw = await productsApi.getBySlug(slug);
        if (cancelled) return;
        const mapped = mapBackendProduct(raw);
        setProduct(mapped);
        setReviews(mapBackendReviews(raw.reviews));
        setQuantity(raw.minOrderQty > 1 ? raw.minOrderQty : 1);
        if (mapped.variants?.length) {
          const initialVariant = mapped.variants.find((v) => v.quantity > 0) ?? mapped.variants[0];
          setSelectedOptions(initialVariant.optionValues);
        } else {
          setSelectedOptions({});
        }
        productsApi
          .getRelated(raw.id)
          .then((related) => {
            if (!cancelled) setRelatedProducts(related.map(mapBackendProduct));
          })
          .catch(() => {});
      } catch (err) {
        if (!cancelled) setNotFound(!(err instanceof ApiError) || err.status === 404);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [params?.slug]);

  useEffect(() => {
    if (!product?.activeCampaign) return;
    trackEvent('view_promotion', {
      promotion_id: product.activeCampaign.campaignSlug,
      promotion_name: product.activeCampaign.campaignName,
      item_id: product.sku,
      item_name: product.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.activeCampaign?.campaignId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-zumbii-500" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-2xl font-bold text-text-primary">Product not found</h1>
        <p className="text-text-tertiary">This product may have been removed or is no longer available.</p>
        <Link href="/marketplace">
          <Button>Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const selectedVariant: ProductVariant | undefined = product.variants?.length
    ? product.variants.find((v) =>
        Object.entries(selectedOptions).every(([key, val]) => v.optionValues[key] === val)
      )
    : undefined;

  const effectivePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectiveComparePrice = selectedVariant ? selectedVariant.comparePrice : product.comparePrice;
  const effectiveStock = selectedVariant ? selectedVariant.quantity : product.stock;
  const effectiveImages = selectedVariant?.images.length ? selectedVariant.images : product.images;
  const effectiveSku = selectedVariant?.sku ?? product.sku;

  function isOptionValueAvailable(optionName: string, value: string): boolean {
    if (!product?.variants?.length) return true;
    return product.variants.some(
      (v) => v.optionValues[optionName] === value && v.isActive && v.quantity > 0
    );
  }

  const campaign = product.activeCampaign;
  const displayPrice = campaign ? campaign.campaignPrice : effectivePrice;
  const strikePrice = campaign ? effectivePrice : effectiveComparePrice;

  const discount = strikePrice
    ? Math.round(((strikePrice - displayPrice) / strikePrice) * 100)
    : 0;

  const gstAmount = Math.round(displayPrice * (product.gstRate / 100));
  const totalWithGst = displayPrice + gstAmount;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      percentage: reviews.length ? Math.round((count / reviews.length) * 100) : 0,
    };
  });

  const handleAddToCart = (): boolean => {
    if (!requireAuth()) return false;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      variantLabel: selectedVariant
        ? Object.values(selectedVariant.optionValues).join(' / ')
        : undefined,
      sku: effectiveSku,
      slug: product.slug,
      name: product.name,
      image: effectiveImages[0] ?? product.images[0],
      price: displayPrice,
      quantity,
      maxQuantity: Math.max(effectiveStock, 1),
      seller: product.seller.businessName,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    return true;
  };

  const handleBuyNow = () => {
    if (!handleAddToCart()) return;
    router.push('/checkout');
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    ...(product.specifications.length ? [{ id: 'specifications', label: 'Specifications' }] : []),
    ...(product.features.length ? [{ id: 'features', label: 'Features' }] : []),
    { id: 'reviews', label: `Reviews (${reviews.length})` },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary pt-16 lg:pt-20">
      <div className="border-b border-border bg-white">
        <Container className="py-3">
          <nav className="flex items-center gap-2 text-xs text-text-tertiary">
            <Link href="/" className="hover:text-zumbii-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/marketplace" className="hover:text-zumbii-600 transition-colors">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-zumbii-600 transition-colors">
              {product.category.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary truncate max-w-[200px]">{product.name}</span>
          </nav>
        </Container>
      </div>

      <Container className="py-6 lg:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <FadeView>
              <ImageGallery images={effectiveImages} categoryName={product.category?.name} />
            </FadeView>
          </div>

          <div className="min-w-0 space-y-6">
            <FadeView>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {campaign && <Badge variant="campaign">{campaign.campaignName}</Badge>}
                  {product.isNew && <Badge variant="new">New Launch</Badge>}
                  {!campaign && discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-tight tracking-tight">
                  {product.name}
                </h1>

                <Link
                  href={`/brand/${product.brand.slug}`}
                  className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-zumbii-600 transition-colors"
                >
                  <Building2 className="w-4 h-4" />
                  <span>by <strong>{product.brand.name}</strong></span>
                </Link>

                <div className="flex items-center gap-3">
                  <StarRating rating={product.rating} size="md" showValue />
                  <span className="text-sm text-text-tertiary">
                    ({product.reviewCount} reviews)
                  </span>
                  <span className="text-xs text-text-tertiary">|</span>
                  <span className="text-sm text-text-tertiary">
                    SKU: {effectiveSku}
                  </span>
                </div>
              </div>
            </FadeView>

            <FadeView>
              <Card className="p-5 space-y-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold text-text-primary">
                    ₹{displayPrice.toLocaleString('en-IN')}
                  </span>
                  {strikePrice && strikePrice > displayPrice && (
                    <>
                      <span className="text-lg text-text-tertiary line-through">
                        ₹{strikePrice.toLocaleString('en-IN')}
                      </span>
                      <Badge variant={campaign ? 'campaign' : 'sale'} size="sm">{discount}% off</Badge>
                    </>
                  )}
                  {product.shortDescription && (
                    <span className="text-sm font-medium text-text-tertiary">
                      / {product.shortDescription}
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-tertiary">
                  +₹{gstAmount.toLocaleString('en-IN')} GST ({product.gstRate}%)
                </p>
                <p className="text-sm">
                  <span className="text-text-secondary">Total incl. GST: </span>
                  <span className="font-semibold text-text-primary">
                    ₹{totalWithGst.toLocaleString('en-IN')}
                  </span>
                </p>

                <div className="flex flex-wrap gap-4 pt-1 text-sm">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Package className="w-4 h-4 text-text-tertiary" />
                    MOQ: <span className="font-medium text-text-primary">{product.moq} units</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Ruler className="w-4 h-4 text-text-tertiary" />
                    Available: <span className="font-medium text-text-primary">{effectiveStock.toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <IndianRupee className="w-4 h-4 text-text-tertiary" />
                    GST: <span className="font-medium text-text-primary">{product.gstRate}%</span>
                  </div>
                  {effectiveStock > 0 && effectiveStock <= 10 && (
                    <span className="text-amber-600 font-medium text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Only {effectiveStock} left in stock
                    </span>
                  )}
                </div>
              </Card>
            </FadeView>

            {product.variantOptions && product.variantOptions.length > 0 && (
              <FadeView>
                <Card className="p-5">
                  <VariantSelector
                    variantOptions={product.variantOptions}
                    selected={selectedOptions}
                    onSelect={(name, value) => setSelectedOptions((prev) => ({ ...prev, [name]: value }))}
                    isValueAvailable={isOptionValueAvailable}
                  />
                </Card>
              </FadeView>
            )}

            <FadeView>
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <QuantitySelector value={quantity} onChange={setQuantity} min={product.moq} />
                  <span className="text-xs text-text-tertiary">
                    Total: <strong className="text-text-primary">₹{(displayPrice * quantity).toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    disabled={effectiveStock === 0}
                    className={clsx(
                      'flex-1 transition-all',
                      addedToCart && 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                    )}
                    onClick={handleAddToCart}
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Added to Cart
                      </>
                    ) : effectiveStock === 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    disabled={effectiveStock === 0}
                    onClick={handleBuyNow}
                  >
                    <Zap className="w-5 h-5" />
                    Buy Now
                  </Button>
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    className={clsx(
                      'w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all shrink-0',
                      wishlisted
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : 'border-border text-text-tertiary hover:border-red-200 hover:text-red-400 hover:bg-red-50'
                    )}
                  >
                    <Heart className={clsx('w-5 h-5', wishlisted && 'fill-current')} />
                  </button>
                  <button className="w-12 h-12 flex items-center justify-center rounded-xl border-2 border-border text-text-tertiary hover:border-zumbii-200 hover:text-zumbii-500 hover:bg-zumbii-50 transition-all shrink-0">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </Card>
            </FadeView>

            <FadeView>
              <PincodeChecker />
            </FadeView>

            <FadeView>
              <Card className="p-5 space-y-3">
                <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-zumbii-500" />
                  Return Policy
                </h4>
                <div className="space-y-2.5 text-sm text-text-secondary">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>7-day replacement for manufacturing defects</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>2-year warranty on B2B bulk orders (100+ units)</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>Free pick-up for defective returns within Bengaluru</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <X className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <span>Custom/bulk orders cannot be cancelled after dispatch</span>
                  </div>
                </div>
                <Link href="/returns" className="text-xs text-zumbii-600 hover:underline inline-block">
                  View full return policy →
                </Link>
              </Card>
            </FadeView>

            <FadeView>
              <SellerCard seller={product.seller} />
            </FadeView>
          </div>
        </div>
      </Container>

      <div className="border-b border-border bg-white sticky top-16 lg:top-20 z-20">
        <Container>
          <div className="flex overflow-x-auto gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-gold-500 text-zumbii-950'
                    : 'border-transparent text-text-tertiary hover:text-text-secondary hover:border-border'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Container>
      </div>

      <Container className="py-8 lg:py-12">
        {activeTab === 'description' && (
          <FadeView>
            <Card glass className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-text-primary mb-4">Description</h3>
              <p className={clsx(
                'text-text-secondary leading-relaxed',
                !showFullDesc && 'line-clamp-4'
              )}>
                {product.description}
              </p>
              {product.description.length > 300 && (
                <button
                  onClick={() => setShowFullDesc(!showFullDesc)}
                  className="mt-3 text-sm text-zumbii-600 hover:text-zumbii-700 font-medium"
                >
                  {showFullDesc ? 'Show less' : 'Read more'}
                </button>
              )}
            </Card>
          </FadeView>
        )}

        {activeTab === 'specifications' && (
          <FadeView>
            <Card glass className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-text-primary mb-4">Specifications</h3>
              <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                {product.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-2 gap-4 px-4 py-3.5 sm:px-6 even:bg-surface-secondary/50"
                  >
                    <span className="text-sm text-text-secondary font-medium">{spec.label}</span>
                    <span className="text-sm text-text-primary">{spec.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </FadeView>
        )}

        {activeTab === 'features' && (
          <FadeView>
            <Card glass className="p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-bold text-text-primary">Features & Highlights</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {product.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary/50 border border-border"
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm text-text-primary">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </FadeView>
        )}

        {activeTab === 'reviews' && (
          <FadeView>
            <div className="grid lg:grid-cols-3 gap-8">
              <Card glass className="p-6 sm:p-8 lg:col-span-1 space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-text-primary">
                    {product.rating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mt-2">
                    <StarRating rating={product.rating} size="md" />
                  </div>
                  <p className="mt-1.5 text-sm text-text-tertiary">
                    {reviews.length} verified reviews
                  </p>
                </div>
                <RatingBreakdown breakdown={ratingBreakdown} />
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="w-full">
                    Write a Review
                  </Button>
                </div>
              </Card>
              <div className="lg:col-span-2 space-y-4">
                {reviews.length > 0 ? (
                  reviews.map((review) => <ReviewCard key={review.id} review={review} />)
                ) : (
                  <div className="text-center py-12 text-text-tertiary text-sm">
                    No reviews yet — be the first to review this product.
                  </div>
                )}
              </div>
            </div>
          </FadeView>
        )}

        {activeTab === 'faq' && (
          <FadeView>
            <Card glass className="p-6 sm:p-8">
              <h3 className="text-lg font-bold text-text-primary mb-4">Frequently Asked Questions</h3>
              <Accordion items={faqs} />
            </Card>
          </FadeView>
        )}
      </Container>

      {(product.downloads.length > 0 || product.certificates.length > 0) && (
      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {product.downloads.length > 0 && (
            <FadeView>
              <Card glass className="p-6 space-y-4">
                <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-zumbii-500" />
                  Downloads
                </h4>
                <div className="space-y-2">
                  {product.downloads.map((d, i) => (
                    <a
                      key={i}
                      href={d.url}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-secondary/50 border border-border hover:bg-zumbii-50 hover:border-zumbii-200 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Download className="w-4 h-4 text-zumbii-500 shrink-0" />
                        <span className="text-sm text-text-primary truncate">{d.label}</span>
                      </div>
                      <span className="text-xs text-text-tertiary shrink-0">{d.size}</span>
                    </a>
                  ))}
                </div>
              </Card>
            </FadeView>
            )}

            {product.certificates.length > 0 && (
            <FadeView>
              <Card glass className="p-6 space-y-4">
                <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <Award className="w-4 h-4 text-zumbii-500" />
                  Certifications
                </h4>
                <div className="space-y-2">
                  {product.certificates.map((cert, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-secondary/50 border border-border"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-sm text-text-primary">{cert}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </FadeView>
            )}
          </div>
        </Container>
      </section>
      )}

      {relatedProducts.length > 0 && (
      <section className="py-12 lg:py-16">
        <Container>
          <FadeView>
            <h3 className="text-xl font-bold text-text-primary mb-6">Related Products</h3>
          </FadeView>
          <Carousel>
            {relatedProducts.map((p) => (
              <div key={p.id} className="min-w-[260px] sm:min-w-[280px] snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </Carousel>
        </Container>
      </section>
      )}

      <section className="py-8 border-t border-border bg-white">
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-text-tertiary">
              <strong className="text-text-primary">Disclaimer:</strong> Prices and availability are subject to change. All transactions are subject to Zumbii&apos;s terms and conditions.
            </p>
            <Link href="/help">
              <Button variant="ghost" size="sm">
                <HelpCircle className="w-4 h-4" />
                Need Help?
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
