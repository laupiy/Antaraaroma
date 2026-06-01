// src/app/utils/storage.ts
// ─── Auth helpers (token-based, replaces lama yang pakai localStorage "true") ─
// Fungsi localStorage untuk produk & review sudah dipindah ke API.
// File ini hanya menyediakan auth helpers untuk backward-compat dengan komponen
// yang belum direfactor dan re-export tipe Review.

export {
  isAdminLoggedIn,
  getToken,
  setToken,
  removeToken,
} from "./api";

export type { ApiReview as Review } from "./api";

// ─── Legacy stubs – tidak dipakai lagi, hanya agar import lama tidak error ────
// Komponen yang memanggilnya sudah diganti fetch ke API.

export function logoutAdmin(): void {
  import("./api").then(({ removeToken }) => removeToken());
}
