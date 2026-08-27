import { useAuthStore } from '@/store/authStore';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v\d+\/?$/, '');

export function resolveImageUrl(url?: string | null): string {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_ORIGIN}${url}`;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const isFormData = rest.body instanceof FormData;

  const doFetch = (bearer: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        ...headers,
      },
    });

  let token = auth ? useAuthStore.getState().accessToken : null;
  let res = await doFetch(token);

  if (res.status === 401 && auth && token && path !== '/auth/refresh') {
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const refreshed = await refreshPromise;
    if (refreshed) {
      token = useAuthStore.getState().accessToken;
      res = await doFetch(token);
    }
  }

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    if (res.status === 401 && auth) {
      useAuthStore.getState().logout();
    }
    const message = data?.message || res.statusText || 'Request failed';
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, res.status, data);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export interface BackendCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  icon?: string | null;
  parentId?: string | null;
  parent?: BackendCategory | null;
  isActive: boolean;
  sortOrder?: number;
  _count?: { products: number; children?: number };
}

export interface BackendActiveCampaign {
  campaignId: string;
  campaignName: string;
  campaignSlug: string;
  campaignPrice: number;
  discountPercent: number;
}

export interface BackendVariantOptionValue {
  label: string;
  swatch?: string;
}

export interface BackendVariantOptionType {
  name: string;
  values: BackendVariantOptionValue[];
}

export interface BackendProductVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
  quantity: number;
  images: string[];
  optionValues: Record<string, string>;
  isActive: boolean;
  soldCount: number;
}

export interface BackendProduct {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDesc?: string | null;
  price: number;
  comparePrice?: number | null;
  costPrice?: number | null;
  sku: string;
  barcode?: string | null;
  quantity: number;
  minOrderQty: number;
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category?: BackendCategory;
  brandId?: string | null;
  brand?: { id: string; name: string; slug: string } | null;
  reviews?: BackendReview[];
  activeCampaign?: BackendActiveCampaign | null;
  variantOptions?: BackendVariantOptionType[] | null;
  variants?: BackendProductVariant[];
}

export interface BackendReview {
  id: string;
  rating: number;
  title?: string | null;
  comment?: string | null;
  createdAt: string;
  user?: { firstName?: string | null; lastName?: string | null; avatar?: string | null } | null;
}

export interface ProductListResponse {
  data: BackendProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQuery {
  search?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  isFeatured?: boolean;
  page?: number;
  limit?: number;
}

function toQueryString(query: object = {}): string {
  const params = new URLSearchParams();
  Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export interface AuthUser {
  id: string;
  email: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  role: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  /** Which channel this session's OTP was verified against — 'phone' or 'email'. Only set by OTP login. */
  verifiedVia?: 'phone' | 'email';
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  /** Present on the OTP verify response: false means this is a first-time signup that still needs a name. */
  profileComplete?: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }, { auth: false }),
  register: (payload: RegisterPayload) =>
    api.post<AuthResponse>('/auth/register', payload, { auth: false }),
};

export interface SendOtpResponse {
  message: string;
  expiresInMinutes: number;
  resendCooldownSeconds: number;
  devMode: boolean;
}

/** The OTP send endpoint returns `retryAfterSeconds` on its 429 cooldown response. */
export function otpRetryAfterSeconds(err: unknown): number | undefined {
  if (!(err instanceof ApiError)) return undefined;
  const seconds = (err.data as { retryAfterSeconds?: unknown } | null)?.retryAfterSeconds;
  return typeof seconds === 'number' ? seconds : undefined;
}

export const otpApi = {
  send: (identifier: { phone?: string; email?: string }) =>
    api.post<SendOtpResponse>('/auth/otp/send', identifier, { auth: false }),
  verify: (identifier: { phone?: string; email?: string }, otp: string) =>
    api.post<AuthResponse>('/auth/otp/verify', { ...identifier, otp }, { auth: false }),
};

export interface UserProfileResponse {
  id: string;
  email: string | null;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  profileComplete: boolean;
}

export const usersApi = {
  me: () => api.get<UserProfileResponse>('/users/me'),
  updateMe: (payload: { firstName?: string; lastName?: string }) =>
    api.put<UserProfileResponse>('/users/me', payload),
};

export interface PincodeCheckResponse {
  code: string;
  serviceable: boolean;
  city?: string;
  state?: string;
  codAvailable?: boolean;
  deliveryDays?: number;
  estimatedDeliveryDate?: string;
}

export const deliveryApi = {
  checkPincode: (code: string) =>
    api.get<PincodeCheckResponse>(`/delivery/pincode/${code}`, { auth: false }),
};

export const categoriesApi = {
  list: () => api.get<BackendCategory[]>('/categories', { auth: false }),
  getBySlug: (slug: string) =>
    api.get<BackendCategory>(`/categories/slug/${slug}`, { auth: false }),
};

export const productsApi = {
  list: (query: ProductQuery = {}) =>
    api.get<ProductListResponse>(`/products${toQueryString(query)}`, { auth: false }),
  featured: () => api.get<BackendProduct[]>('/products/featured', { auth: false }),
  getBySlug: (slug: string) =>
    api.get<BackendProduct>(`/products/slug/${slug}`, { auth: false }),
  getRelated: (id: string) =>
    api.get<BackendProduct[]>(`/products/${id}/related`, { auth: false }),
};

export type CampaignType =
  | 'FESTIVE_SALE'
  | 'FLASH_SALE'
  | 'CLEARANCE'
  | 'FRANCHISE_BULK_OFFER'
  | 'NEW_LAUNCH';

export type EffectiveCampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Expired';

export interface BackendCampaignProduct {
  id: string;
  campaignId: string;
  productId: string;
  campaignPrice: number;
  discountPercent: number;
  stockCap?: number | null;
  soldCount: number;
  createdAt: string;
  product?: BackendProduct;
}

export interface BackendCampaign {
  id: string;
  name: string;
  slug: string;
  type: CampaignType;
  description?: string | null;
  bannerImageUrl?: string | null;
  startAt: string;
  endAt: string;
  status: 'DRAFT' | 'ACTIVE' | 'ENDED';
  effectiveStatus: EffectiveCampaignStatus;
  showOnHomepage: boolean;
  createdAt: string;
  updatedAt: string;
  products?: BackendCampaignProduct[];
  _count?: { products: number };
}

export const campaignsApi = {
  getBySlug: (slug: string) =>
    api.get<BackendCampaign>(`/campaigns/slug/${slug}`, { auth: false }),
  homepage: () => api.get<BackendCampaign[]>('/campaigns/homepage', { auth: false }),
};

// ---- Addresses ----

export interface BackendAddress {
  id: string;
  userId: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  lat?: number | null;
  lng?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country?: string;
  isDefault?: boolean;
}

export const addressApi = {
  list: () => api.get<BackendAddress[]>('/users/me/addresses'),
  create: (payload: AddressPayload) => api.post<BackendAddress>('/users/me/addresses', payload),
  update: (id: string, payload: Partial<AddressPayload>) =>
    api.put<BackendAddress>(`/users/me/addresses/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/users/me/addresses/${id}`),
};

// ---- Orders ----

export interface CreateOrderItemPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CreateOrderPayload {
  addressId: string;
  items: CreateOrderItemPayload[];
  shippingMethod?: string;
  couponCode?: string;
  notes?: string;
  giftMessage?: string;
}

export type BackendOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type BackendPaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

// Prisma serializes Decimal fields as numeric strings (e.g. "204.12"), not JSON numbers.
export interface BackendOrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  variantLabel?: string | null;
  name: string;
  sku: string;
  price: string;
  quantity: number;
  total: string;
  image?: string | null;
}

export interface BackendOrder {
  id: string;
  orderNumber: string;
  status: BackendOrderStatus;
  paymentStatus: BackendPaymentStatus;
  subtotal: string;
  shippingMethod: string;
  shippingCost: string;
  taxAmount: string;
  discountAmount: string;
  total: string;
  currency: string;
  notes?: string | null;
  cancelReason?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  address: BackendAddress;
  items: BackendOrderItem[];
}

export const ordersApi = {
  create: (payload: CreateOrderPayload) => api.post<BackendOrder>('/orders', payload),
  myOrders: (query: { page?: number; limit?: number } = {}) =>
    api.get<{ data: BackendOrder[]; total: number; page: number; limit: number; totalPages: number }>(
      `/orders/my${toQueryString(query)}`
    ),
  get: (id: string) => api.get<BackendOrder>(`/orders/${id}`),
};

// ---- Wishlist ----

export interface BackendWishlistItem {
  id: string;
  productId: string;
  addedAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    comparePrice?: string | null;
    images: string[];
    rating: number;
    reviewCount: number;
    inStock: boolean;
    seller: string | null;
  };
}

export const wishlistApi = {
  list: () => api.get<BackendWishlistItem[]>('/wishlist'),
  add: (productId: string) => api.post<{ message: string }>('/wishlist', { productId }),
  remove: (productId: string) => api.delete<{ message: string }>(`/wishlist/${productId}`),
};

// ---- Coupons ----

export interface CouponValidationResult {
  code: string;
  description: string | null;
  discountType: string;
  discountAmount: number;
}

export const couponsApi = {
  validate: (code: string, subtotal: number) =>
    api.post<CouponValidationResult>('/coupons/validate', { code, subtotal }, { auth: false }),
};
