import { DEFAULT_PRODUCTS, type Product } from "../data/products";

const STORAGE_KEYS = {
  PRODUCTS: "antara_aroma_products",
  AUTH: "antara_aroma_auth",
} as const;

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function isAdminLoggedIn(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.AUTH) === "true";
  } catch {
    return false;
  }
}

export function loginAdmin(username: string, password: string): boolean {
  if (username === "admin" && password === "admin123") {
    localStorage.setItem(STORAGE_KEYS.AUTH, "true");
    return true;
  }
  return false;
}

export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) return DEFAULT_PRODUCTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0
      ? parsed
      : DEFAULT_PRODUCTS;
  } catch {
    return DEFAULT_PRODUCTS;
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, "id">): Product {
  const products = getProducts();
  const maxId = products.reduce((max, p) => Math.max(max, p.id), 0);
  const newProduct: Product = { ...product, id: maxId + 1 };
  saveProducts([...products, newProduct]);
  return newProduct;
}

export function updateProduct(updated: Product): void {
  const products = getProducts();
  saveProducts(products.map((p) => (p.id === updated.id ? updated : p)));
}

export function deleteProduct(id: number): void {
  const products = getProducts();
  saveProducts(products.filter((p) => p.id !== id));
}

export function resetProducts(): void {
  localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
}
