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
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const token = auth ? useAuthStore.getState().accessToken : null;
  const isFormData = rest.body instanceof FormData;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    const message = data?.message || res.statusText || 'Request failed';
    throw new ApiError(Array.isArray(message) ? message.join(', ') : message, res.status);
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
  isActive: boolean;
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
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
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
  create: (payload: Record<string, unknown>) =>
    api.post<BackendProduct>('/products', payload),
  update: (id: string, payload: Record<string, unknown>) =>
    api.put<BackendProduct>(`/products/${id}`, payload),
  remove: (id: string) => api.delete<{ message: string }>(`/products/${id}`),
};

export const uploadApi = {
  images: async (files: File[]): Promise<string[]> => {
    const form = new FormData();
    files.forEach((file) => form.append('files', file));
    const res = await api.post<{ urls: string[] }>('/upload/images', form);
    return res.urls;
  },
};
