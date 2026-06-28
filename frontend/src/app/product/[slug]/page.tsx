'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  FileText,
  Award,
  Truck,
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
} from 'lucide-react';
import { clsx } from 'clsx';
import Container from '@/components/ui/container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StarRating } from '@/components/ui/StarRating';
import { ProductCard } from '@/components/ui/ProductCard';
import type { Product, Review, Seller } from '@/types';

const placeholderProduct: Product = {
  id: 'prod-001',
  name: 'Industrial Grade Wireless Noise-Cancelling Headphones',
  slug: 'industrial-wireless-headphones-pro-x1',
  description:
    'Engineered for professionals who demand exceptional audio clarity and immersive sound isolation. The Pro X1 features adaptive noise cancellation with 40dB reduction, 60-hour battery life, and memory foam ear cushions wrapped in premium protein leather. Ideal for call centers, studios, and industrial environments.',
  shortDescription:
    'Professional-grade wireless headphones with adaptive ANC, 60h battery, and premium build.',
  price: 12499,
  wholesalePrice: 8999,
  comparePrice: 17999,
  images: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80',
    'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&q=80',
    'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
  ],
  video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  category: {
    id: 'cat-01',
    name: 'Electronics',
    slug: 'electronics',
    description: '',
    image: '',
    icon: 'Smartphone',
    children: [],
    productCount: 1200,
  },
  brand: {
    id: 'br-01',
    name: 'SoundPro Industries',
    slug: 'soundpro',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&q=80',
    description: 'Premium audio solutions since 2010',
    productCount: 45,
  },
  seller: {
    id: 'sel-001',
    businessName: 'TechGadgets India Pvt Ltd',
    businessType: 'Manufacturer & Distributor',
    logo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80',
    rating: 4.7,
    reviewCount: 1234,
    verified: true,
    gstVerified: true,
    panVerified: true,
    location: 'Bengaluru, Karnataka',
    responseTime: 'Within 2 hours',
    followerCount: 5670,
  },
  sku: 'SP-PROX1-BLK-001',
  gstRate: 18,
  moq: 5,
  stock: 247,
  availableQuantity: 5000,
  rating: 4.6,
  reviewCount: 892,
  specifications: [
    { label: 'Driver Size', value: '40mm Neodymium' },
    { label: 'Frequency Response', value: '20Hz - 40kHz' },
    { label: 'Impedance', value: '32Ω' },
    { label: 'Bluetooth Version', value: '5.3' },
    { label: 'Codec Support', value: 'SBC, AAC, LDAC, aptX HD' },
    { label: 'Noise Cancellation', value: 'Adaptive ANC up to 40dB' },
    { label: 'Battery Life', value: '60 hours (ANC on)' },
    { label: 'Charging', value: 'USB-C, Fast Charge (10 min = 5 hrs)' },
    { label: 'Weight', value: '250g' },
    { label: 'Warranty', value: '2 Years' },
  ],
  features: [
    'Adaptive Active Noise Cancellation with 40dB reduction',
    'Hi-Res Audio certified with LDAC support',
    '60-hour battery life with quick charge capability',
    'Premium memory foam ear cushions with protein leather',
    'Foldable design with hard carrying case included',
    'Multipoint connectivity for up to 3 devices',
    'Built-in AI-powered microphone for crystal-clear calls',
    'IPX5 water resistance for workout and outdoor use',
  ],
  downloads: [
    { label: 'User Manual (PDF)', url: '#', size: '2.4 MB' },
    { label: 'Quick Start Guide', url: '#', size: '0.8 MB' },
    { label: 'Product Datasheet', url: '#', size: '1.2 MB' },
    { label: 'Compliance Certificate', url: '#', size: '0.5 MB' },
  ],
  certificates: [
    'BIS Certified (ISI Mark)',
    'RoHS Compliant',
    'CE Marking',
    'FCC Certified',
  ],
  tags: ['headphones', 'wireless', 'anc', 'professional', 'audio'],
  isFeatured: true,
  isNew: true,
  status: 'active',
  createdAt: '2025-12-01T00:00:00Z',
  updatedAt: '2026-03-15T00:00:00Z',
};

const technicalDocuments = [
  { label: 'Technical Specification Sheet', url: '#', size: '1.8 MB', format: 'PDF' },
  { label: 'Circuit Diagram', url: '#', size: '3.2 MB', format: 'DWG' },
  { label: 'Safety Compliance Report', url: '#', size: '0.9 MB', format: 'PDF' },
  { label: 'Test Lab Report', url: '#', size: '4.1 MB', format: 'PDF' },
];

const bulkPricing = [
  { quantity: '5 - 20 units', discount: '5%', pricePerUnit: 8549 },
  { quantity: '21 - 50 units', discount: '10%', pricePerUnit: 8099 },
  { quantity: '51 - 100 units', discount: '15%', pricePerUnit: 7649 },
  { quantity: '100+ units', discount: '20%', pricePerUnit: 7199 },
];

const reviews: Review[] = [
  {
    id: 'rev-001',
    user: { name: 'Rahul Sharma', avatar: 'https://i.pravatar.cc/150?u=rahul' },
    rating: 5,
    title: 'Best investment for my home studio',
    content:
      'Absolutely blown away by the sound quality. The ANC is phenomenal — blocks out all ambient noise. Battery life is insane, I charge once a week. Highly recommend for professionals.',
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80',
    ],
    createdAt: '2026-03-20',
    helpful: 47,
  },
  {
    id: 'rev-002',
    user: { name: 'Priya Patel', avatar: 'https://i.pravatar.cc/150?u=priya' },
    rating: 4,
    title: 'Great for office use',
    content:
      'Excellent noise cancellation for open offices. Comfortable for all-day wear. Only wish the carrying case was a bit more compact.',
    createdAt: '2026-03-15',
    helpful: 32,
  },
  {
    id: 'rev-003',
    user: { name: 'Amit Kumar', avatar: 'https://i.pravatar.cc/150?u=amit' },
    rating: 5,
    title: 'Worth every rupee',
    content:
      'Upgraded from a budget pair and the difference is night and day. Crystal clear highs, punchy bass. Call quality is superb too.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
      'https://images.unsplash.com/photo-1484705969860-25b503a3d7d8?w=400&q=80',
    ],
    createdAt: '2026-03-10',
    helpful: 28,
  },
  {
    id: 'rev-004',
    user: { name: 'Sneha Reddy', avatar: 'https://i.pravatar.cc/150?u=sneha' },
    rating: 3,
    title: 'Good but not perfect',
    content:
      'Sound quality is excellent but the touch controls can be a bit finicky. Also, the ear cushions attract dust easily. Overall a solid product though.',
    createdAt: '2026-02-28',
    helpful: 19,
  },
  {
    id: 'rev-005',
    user: { name: 'Vikram Singh', avatar: 'https://i.pravatar.cc/150?u=vikram' },
    rating: 5,
    title: 'Perfect for travel',
    content:
      'Used these on a 12-hour flight and they were a game changer. ANC made the engine noise disappear. Comfortable for long wear. Battery lasted the entire trip.',
    createdAt: '2026-02-20',
    helpful: 41,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 534, percentage: 60 },
  { stars: 4, count: 214, percentage: 24 },
  { stars: 3, count: 89, percentage: 10 },
  { stars: 2, count: 36, percentage: 4 },
  { stars: 1, count: 19, percentage: 2 },
];

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

const relatedProducts: Product[] = [
  {
    ...placeholderProduct,
    id: 'rel-001',
    name: 'Wireless Earbuds Pro X1 Mini',
    slug: 'wireless-earbuds-pro-x1-mini',
    price: 7999,
    wholesalePrice: 5999,
    comparePrice: 11999,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80',
    ],
    rating: 4.4,
    reviewCount: 567,
    isNew: true,
    isFeatured: false,
    stock: 500,
  },
  {
    ...placeholderProduct,
    id: 'rel-002',
    name: 'Bluetooth Speaker Boom 360',
    slug: 'bluetooth-speaker-boom-360',
    price: 5499,
    wholesalePrice: 3999,
    comparePrice: 7999,
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80',
    ],
    rating: 4.5,
    reviewCount: 342,
    isNew: false,
    isFeatured: false,
    stock: 200,
  },
  {
    ...placeholderProduct,
    id: 'rel-003',
    name: 'Studio Microphone Condenser Pro',
    slug: 'studio-microphone-condenser-pro',
    price: 14999,
    wholesalePrice: 11999,
    comparePrice: 19999,
    images: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80',
    ],
    rating: 4.8,
    reviewCount: 234,
    isNew: false,
    isFeatured: true,
    stock: 80,
  },
  {
    ...placeholderProduct,
    id: 'rel-004',
    name: 'USB Audio Interface Dual Channel',
    slug: 'usb-audio-interface-dual-channel',
    price: 8999,
    wholesalePrice: 6999,
    comparePrice: 12999,
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80',
    ],
    rating: 4.3,
    reviewCount: 189,
    isNew: true,
    isFeatured: false,
    stock: 150,
  },
];

const frequentlyBought = [
  {
    id: 'fbt-001',
    name: 'Hard Carrying Case',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=200&q=80',
  },
  {
    id: 'fbt-002',
    name: 'USB-C to 3.5mm Adapter',
    price: 399,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=200&q=80',
  },
  {
    id: 'fbt-003',
    name: 'Ear Cushion Replacement Set',
    price: 999,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80',
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

function ImageGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLDivElement>(null);

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
        className="relative aspect-square rounded-2xl overflow-hidden bg-surface-tertiary group cursor-crosshair"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <Image
          src={images[selected]}
          alt="Product"
          fill
          className="object-cover transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          style={zoomed ? { transform: 'scale(1.8)', transformOrigin: `${mousePos.x}% ${mousePos.y}%` } : undefined}
        />
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
        {zoomed && (
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
            <ZoomIn className="w-3.5 h-3.5" />
            Zoomed In
          </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={clsx(
              'relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200',
              selected === i
                ? 'border-zumbii-500 ring-2 ring-zumbii-200'
                : 'border-border hover:border-zumbii-300'
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
        className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-white hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
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
        className="w-9 h-9 flex items-center justify-center rounded-lg text-text-secondary hover:bg-white hover:text-text-primary disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

function DeliveryCalculator() {
  const [pincode, setPincode] = useState('');
  const [checked, setChecked] = useState(false);
  const [estimating, setEstimating] = useState(false);

  const handleCheck = () => {
    if (pincode.length !== 6) return;
    setEstimating(true);
    setTimeout(() => {
      setEstimating(false);
      setChecked(true);
    }, 1200);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
        <Truck className="w-4 h-4 text-zumbii-500" />
        Estimated Delivery
      </h4>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={pincode}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(v);
            if (checked) setChecked(false);
          }}
          placeholder="Enter pincode"
          maxLength={6}
          className="flex-1 h-10 px-3 text-sm border border-border rounded-xl bg-surface-secondary text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-zumbii-400 focus:ring-2 focus:ring-zumbii-100 transition-all"
        />
        <Button
          size="sm"
          onClick={handleCheck}
          disabled={pincode.length !== 6 || estimating}
          loading={estimating}
        >
          Check
        </Button>
      </div>
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 rounded-xl bg-emerald-50 border border-emerald-200"
          >
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-800">
                  Delivery by Apr 3 - Apr 7
                </p>
                <p className="text-xs text-emerald-600 mt-0.5">
                  Free shipping on orders above ₹999
                </p>
                <p className="text-xs text-emerald-500 mt-0.5">Ships from Bengaluru</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RatingBreakdown() {
  return (
    <div className="space-y-2.5">
      {ratingBreakdown.map((r) => (
        <div key={r.stars} className="flex items-center gap-3">
          <span className="text-xs font-medium text-text-secondary w-12 flex items-center gap-1">
            {r.stars} <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          </span>
          <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${r.percentage}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 * (5 - r.stars) }}
              className="h-full bg-amber-400 rounded-full"
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

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const product = placeholderProduct;
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const gstAmount = Math.round(product.price * (product.gstRate / 100));
  const totalWithGst = product.price + gstAmount;
  const wholesaleGst = product.wholesalePrice
    ? Math.round(product.wholesalePrice * (product.gstRate / 100))
    : 0;
  const wholesaleTotal = product.wholesalePrice
    ? product.wholesalePrice + wholesaleGst
    : null;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'features', label: 'Features' },
    { id: 'reviews', label: `Reviews (${product.reviewCount})` },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen bg-surface-secondary">
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
          <div className="lg:sticky lg:top-24 lg:self-start">
            <FadeView>
              <ImageGallery images={product.images} />
            </FadeView>
          </div>

          <div className="space-y-6">
            <FadeView>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {product.isNew && <Badge variant="new">New Launch</Badge>}
                  {discount > 0 && <Badge variant="sale">{discount}% OFF</Badge>}
                  {product.wholesalePrice && (
                    <Badge variant="success">
                      <Package className="w-3 h-3" />
                      Wholesale Available
                    </Badge>
                  )}
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
                    SKU: {product.sku}
                  </span>
                </div>
              </div>
            </FadeView>

            <FadeView>
              <Card className="p-5 space-y-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-bold text-text-primary">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.comparePrice && product.comparePrice > product.price && (
                    <>
                      <span className="text-lg text-text-tertiary line-through">
                        ₹{product.comparePrice.toLocaleString('en-IN')}
                      </span>
                      <Badge variant="sale" size="sm">{discount}% off</Badge>
                    </>
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

                {product.wholesalePrice && (
                  <div className="pt-3 border-t border-border">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        Wholesale Price
                      </p>
                      <p className="mt-1 text-xl font-bold text-emerald-800">
                        ₹{product.wholesalePrice.toLocaleString('en-IN')}
                        <span className="text-sm font-normal text-emerald-600"> / unit</span>
                      </p>
                      <p className="text-xs text-emerald-600 mt-0.5">
                        +₹{wholesaleGst.toLocaleString('en-IN')} GST | Total: ₹{wholesaleTotal?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-emerald-500 mt-0.5">
                        MOQ: {product.moq} units | Save up to ₹{(product.price - product.wholesalePrice).toLocaleString('en-IN')} per unit
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-1 text-sm">
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Package className="w-4 h-4 text-text-tertiary" />
                    MOQ: <span className="font-medium text-text-primary">{product.moq} units</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <Ruler className="w-4 h-4 text-text-tertiary" />
                    Available: <span className="font-medium text-text-primary">{product.availableQuantity.toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    <IndianRupee className="w-4 h-4 text-text-tertiary" />
                    GST: <span className="font-medium text-text-primary">{product.gstRate}%</span>
                  </div>
                  {product.stock > 0 && product.stock <= 10 && (
                    <span className="text-amber-600 font-medium text-xs flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Only {product.stock} left in stock
                    </span>
                  )}
                </div>
              </Card>
            </FadeView>

            <FadeView>
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <QuantitySelector value={quantity} onChange={setQuantity} min={product.moq} />
                  <span className="text-xs text-text-tertiary">
                    Total: <strong className="text-text-primary">₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
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
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                  <Button variant="secondary" size="lg" className="flex-1">
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
              <DeliveryCalculator />
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

      <div className="border-b border-border bg-white sticky top-16 z-20">
        <Container>
          <div className="flex overflow-x-auto gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'whitespace-nowrap px-4 py-3 sm:px-5 sm:py-4 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-zumbii-600 text-zumbii-600'
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
                    {product.reviewCount} verified reviews
                  </p>
                </div>
                <RatingBreakdown />
                <div className="pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="w-full">
                    Write a Review
                  </Button>
                </div>
              </Card>
              <div className="lg:col-span-2 space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
                <div className="text-center pt-2">
                  <Button variant="ghost" size="sm">
                    View All Reviews <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
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

      <section className="py-12 lg:py-16 bg-white border-y border-border">
        <Container>
          <FadeView>
            <h3 className="text-xl font-bold text-text-primary mb-6">Bulk Pricing</h3>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-tertiary">
                    <th className="text-left px-4 py-3.5 font-semibold text-text-primary">Quantity</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-text-primary">Discount</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-text-primary">Price per Unit</th>
                    <th className="text-left px-4 py-3.5 font-semibold text-text-primary">Savings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {bulkPricing.map((tier, i) => {
                    const savings = product.price - tier.pricePerUnit;
                    return (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 }}
                        className={clsx(
                          'transition-colors',
                          i === bulkPricing.length - 1 ? 'bg-emerald-50/50' : 'hover:bg-surface-secondary'
                        )}
                      >
                        <td className="px-4 py-3.5 font-medium text-text-primary">{tier.quantity}</td>
                        <td className="px-4 py-3.5">
                          <Badge variant="success" size="sm">{tier.discount}</Badge>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-text-primary">
                          ₹{tier.pricePerUnit.toLocaleString('en-IN')}
                        </td>
                        <td className="px-4 py-3.5 text-emerald-600 font-medium">
                          Save ₹{savings.toLocaleString('en-IN')}
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-text-tertiary">
              * Bulk pricing applies to orders above MOQ. Contact seller for custom quantities.
            </p>
          </FadeView>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container>
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
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

            <FadeView>
              <Card glass className="p-6 space-y-4">
                <h4 className="font-semibold text-text-primary text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zumbii-500" />
                  Technical Documents
                </h4>
                <div className="space-y-2">
                  {technicalDocuments.map((doc, i) => (
                    <a
                      key={i}
                      href={doc.url}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface-secondary/50 border border-border hover:bg-zumbii-50 hover:border-zumbii-200 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-zumbii-500 shrink-0" />
                        <div className="min-w-0">
                          <span className="text-sm text-text-primary truncate block">{doc.label}</span>
                          <span className="text-[10px] text-text-tertiary">{doc.format}</span>
                        </div>
                      </div>
                      <span className="text-xs text-text-tertiary shrink-0">{doc.size}</span>
                    </a>
                  ))}
                </div>
              </Card>
            </FadeView>

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
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16 bg-white border-y border-border">
        <Container>
          <FadeView>
            <h3 className="text-xl font-bold text-text-primary mb-6">Frequently Bought Together</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 flex items-center gap-3 border-2 border-zumbii-200 bg-zumbii-50/30">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-tertiary shrink-0">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="64px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary truncate line-clamp-2">{product.name}</p>
                  <p className="text-sm font-bold text-text-primary mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                </div>
              </Card>
              {frequentlyBought.map((item) => (
                <Card key={item.id} className="p-4 flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-surface-tertiary shrink-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-secondary truncate line-clamp-2">{item.name}</p>
                    <p className="text-sm font-bold text-text-primary mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-surface-secondary border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-sm text-text-secondary">
                  Bundle total: <span className="font-bold text-text-primary">
                    ₹{(product.price + frequentlyBought.reduce((s, i) => s + i.price, 0)).toLocaleString('en-IN')}
                  </span>
                </p>
                <p className="text-xs text-emerald-600 font-medium">Add all 4 items to cart</p>
              </div>
              <Button size="sm">
                <ShoppingCart className="w-4 h-4" />
                Add All to Cart
              </Button>
            </div>
          </FadeView>
        </Container>
      </section>

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
