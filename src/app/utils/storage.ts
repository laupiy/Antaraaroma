import { DEFAULT_PRODUCTS, type Product } from "../data/products";

const STORAGE_KEYS = {
  PRODUCTS: "antara_aroma_products",
  AUTH: "antara_aroma_auth",
  REVIEWS: "antara_aroma_reviews",
} as const;

export function isAdminLoggedIn(): boolean {
  try { return localStorage.getItem(STORAGE_KEYS.AUTH) === "true"; } catch { return false; }
}
export function loginAdmin(username: string, password: string): boolean {
  if (username === "admin" && password === "admin123") {
    localStorage.setItem(STORAGE_KEYS.AUTH, "true"); return true;
  }
  return false;
}
export function logoutAdmin(): void { localStorage.removeItem(STORAGE_KEYS.AUTH); }
export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PRODUCTS;
  } catch { return DEFAULT_PRODUCTS; }
}
export function saveProducts(products: Product[]): void { localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products)); }
export function addProduct(product: Omit<Product, "id">): Product {
  const products = getProducts();
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  const newProduct: Product = { ...product, id: maxId + 1 };
  saveProducts([...products, newProduct]); return newProduct;
}
export function updateProduct(updated: Product): void { const products = getProducts(); saveProducts(products.map((p) => (p.id === updated.id ? updated : p))); }
export function deleteProduct(id: number): void { const products = getProducts(); saveProducts(products.filter((p) => p.id !== id)); }
export function resetProducts(): void { localStorage.removeItem(STORAGE_KEYS.PRODUCTS); }

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  id: number;
  productId: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved";
  dateAdded: string;
}

/** Simpan semua review ke localStorage dan broadcast event agar komponen ikut refresh. */
export function saveReviews(reviews: Review[]): void {
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  // Broadcast ke seluruh komponen yang mendengarkan (CatalogPage, ProductModal, dsb.)
  window.dispatchEvent(new Event("reviewsUpdated"));
}

export function getReviews(): Review[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

export function addReview(review: Omit<Review, "id">): Review {
  const reviews = getReviews();
  const maxId = reviews.reduce((max, r) => Math.max(max, r.id), 0);
  const newReview: Review = { ...review, id: maxId + 1 };
  saveReviews([...reviews, newReview]);
  return newReview;
}

export function approveReview(id: number): void {
  const reviews = getReviews();
  saveReviews(reviews.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)));
}

export function deleteReview(id: number): void {
  saveReviews(getReviews().filter((r) => r.id !== id));
}

export function getApprovedReviewsByProductId(productId: number): Review[] {
  return getReviews().filter((r) => r.productId === productId && r.status === "approved");
}

/**
 * Hitung rating rata-rata dan jumlah ulasan dari review approved.
 * Jika belum ada review approved, kembalikan { rating: 0, reviewCount: 0 }
 * sehingga komponen bisa menampilkan "Belum ada ulasan" tanpa angka statis.
 */
export function getProductRatingSummary(
  productId: number
): { rating: number; reviewCount: number } {
  const approved = getApprovedReviewsByProductId(productId);
  if (approved.length === 0) return { rating: 0, reviewCount: 0 };
  const avg = approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
  return { rating: Math.round(avg * 10) / 10, reviewCount: approved.length };
}
