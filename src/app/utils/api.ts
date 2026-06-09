// src/app/utils/api.ts
// ─── Centralized API client untuk Antara Aroma Frontend ──────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

// ─── Token helpers ─────────────────────────────────────────────────────────────
const TOKEN_KEY = "antara_aroma_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return !!getToken();
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
interface RequestOptions extends RequestInit {
  auth?: boolean; // tambahkan Authorization header otomatis
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers = {}, ...rest } = options;

  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: mergedHeaders,
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message ?? message;
    } catch {
      /* ignore parse error */
    }
    throw new Error(message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

// ─── Auth ──────────────────────────────────────────────────────────────────────
export async function apiLogin(email: string, password: string): Promise<{ token: string }> {
  return request<{ token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ─── Products ──────────────────────────────────────────────────────────────────
export interface ApiProduct {
  id: number;
  name: string;
  category: string;
  sku: string;
  material: string;
  capacity: string[];
  finish: string;
  moq: string;
  badge?: string;
  badgeColor?: string;
  isNew?: boolean;
  isPopular?: boolean;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  tags: string[];
  dateAdded: string;
}

export async function apiGetProducts(): Promise<ApiProduct[]> {
  return request<ApiProduct[]>("/api/products");
}

export async function apiGetProduct(id: number): Promise<ApiProduct> {
  return request<ApiProduct>(`/api/products/${id}`);
}

export async function apiCreateProduct(data: Omit<ApiProduct, "id">): Promise<ApiProduct> {
  return request<ApiProduct>("/api/products", {
    method: "POST",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function apiUpdateProduct(id: number, data: Partial<ApiProduct>): Promise<ApiProduct> {
  return request<ApiProduct>(`/api/products/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}

export async function apiDeleteProduct(id: number): Promise<void> {
  return request<void>(`/api/products/${id}`, {
    method: "DELETE",
    auth: true,
  });
}

// ─── Upload Gambar ke Cloudinary ──────────────────────────────────────────────
export async function apiUploadImage(file: File): Promise<{ image_url: string }> {
  const token = getToken();
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${BASE_URL}/api/upload`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Gagal upload gambar." }));
    throw new Error(err.message || "Gagal upload gambar.");
  }
  return res.json();
}



// ─── Categories ────────────────────────────────────────────────────────────────
export interface ApiCategory {
  id: number;
  name: string;
  slug?: string;
}

export async function apiGetCategories(): Promise<ApiCategory[]> {
  return request<ApiCategory[]>("/api/categories");
}

// ─── Reviews ───────────────────────────────────────────────────────────────────
export interface ApiReview {
  id: number;
  product_id: number | null;
  productId: number | null;
  product_name: string | null;
  productName: string | null;
  customer_name: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  dateAdded: string;
}

export async function apiGetReviews(productId?: number): Promise<ApiReview[]> {
  const qs = productId ? `?product_id=${productId}` : "";
  return request<ApiReview[]>(`/api/reviews${qs}`);
}

export async function apiGetReviewsAdmin(params?: { status?: string; product_id?: number }): Promise<ApiReview[]> {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.product_id) qs.set("product_id", String(params.product_id));
  const qstr = qs.toString() ? `?${qs.toString()}` : "";
  return request<ApiReview[]>(`/api/reviews/admin${qstr}`, { auth: true });
}

export async function apiCreateReview(data: {
  product_id?: number | null;
  customer_name: string;
  rating: number;
  comment: string;
}): Promise<{ message: string; id: number }> {
  return request<{ message: string; id: number }>("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function apiApproveReview(id: number): Promise<void> {
  return request<void>(`/api/reviews/${id}/approve`, { method: "PATCH", auth: true });
}

export async function apiRejectReview(id: number): Promise<void> {
  return request<void>(`/api/reviews/${id}/reject`, { method: "PATCH", auth: true });
}

export async function apiDeleteReview(id: number): Promise<void> {
  return request<void>(`/api/reviews/${id}`, { method: "DELETE", auth: true });
}

// ─── Distribution ──────────────────────────────────────────────────────────────
export interface ApiDistribution {
  id: number;
  city: string;
  province: string;
  categories: string[];
  status: string;
  totalOrders: string;
  total_orders?: string;
  lat: number;
  lng: number;
}

export async function apiGetDistribution(): Promise<ApiDistribution[]> {
  return request<ApiDistribution[]>("/api/distribution");
}

// ─── Home Content ──────────────────────────────────────────────────────────────
export interface ApiHomeContent {
  [sectionKey: string]: {
    id: number;
    content: unknown;
    content_json: string;
    updated_at: string;
  };
}

export async function apiGetHomeContent(): Promise<ApiHomeContent> {
  return request<ApiHomeContent>("/api/home-content");
}

// ─── Catalog Filters ───────────────────────────────────────────────────────────
export interface ApiCatalogFilters {
  materials: { id: number; value: string; sort_order: number }[];
  minimum_orders: { id: number; value: string; sort_order: number }[];
}

export async function apiGetCatalogFilters(): Promise<ApiCatalogFilters> {
  return request<ApiCatalogFilters>("/api/catalog-filters");
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export async function apiCreateContact(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message: string;
}): Promise<{ message: string; id: number }> {
  return request<{ message: string; id: number }>("/api/contacts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
