export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  verified: boolean;
  createdAt: string;
}

export type UserRole = 'customer' | 'business' | 'manufacturer' | 'supplier' | 'distributor' | 'retailer' | 'wholesaler' | 'franchise' | 'delivery' | 'warehouse' | 'admin';

export interface VariantOptionValue {
  label: string;
  swatch?: string;
}

export interface VariantOptionType {
  name: string;
  values: VariantOptionValue[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  quantity: number;
  images: string[];
  optionValues: Record<string, string>;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  wholesalePrice?: number;
  comparePrice?: number;
  images: string[];
  video?: string;
  category: Category;
  brand: Brand;
  seller: Seller;
  sku: string;
  gstRate: number;
  moq: number;
  stock: number;
  availableQuantity: number;
  rating: number;
  reviewCount: number;
  specifications: Specification[];
  features: string[];
  downloads: Download[];
  certificates: string[];
  tags: string[];
  isFeatured: boolean;
  isNew: boolean;
  status: 'active' | 'inactive' | 'draft';
  createdAt: string;
  updatedAt: string;
  variantOptions?: VariantOptionType[];
  variants?: ProductVariant[];
  activeCampaign?: {
    campaignId: string;
    campaignName: string;
    campaignSlug: string;
    campaignPrice: number;
    discountPercent: number;
  } | null;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Download {
  label: string;
  url: string;
  size: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentId?: string;
  children: Category[];
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  productCount: number;
}

export interface Seller {
  id: string;
  businessName: string;
  businessType: string;
  logo: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  gstVerified: boolean;
  panVerified: boolean;
  location: string;
  responseTime: string;
  followerCount: number;
}

export interface Review {
  id: string;
  user: { name: string; avatar?: string };
  rating: number;
  title: string;
  content: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  variantLabel?: string;
  sku?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  seller: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  coupon?: string;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: Address;
  billingAddress: Address;
  estimatedDelivery: string;
  tracking?: TrackingInfo[];
  createdAt: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface TrackingInfo {
  status: string;
  location: string;
  timestamp: string;
  description: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type: 'home' | 'work' | 'other';
}

export interface FranchiseApplication {
  id: string;
  fullName: string;
  companyName: string;
  phone: string;
  whatsapp: string;
  email: string;
  city: string;
  state: string;
  territory: string;
  experience: string;
  investmentCapacity: string;
  currentBusiness: string;
  message: string;
  businessProfile?: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: { name: string; avatar?: string };
  category: string;
  tags: string[];
  readTime: number;
  publishedAt: string;
  featured: boolean;
}

export interface RFQ {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
  budget: number;
  description: string;
  status: 'open' | 'quoted' | 'closed';
  responses: RFQResponse[];
  createdAt: string;
}

export interface RFQResponse {
  sellerId: string;
  sellerName: string;
  price: number;
  message: string;
  deliveryDays: number;
  createdAt: string;
}
