// src/app/components/Products.tsx
// Mengambil produk dari GET /api/products dan kategori dari GET /api/categories

import { Link } from "react-router";
import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";
import { apiGetProducts, apiGetCategories, type ApiProduct } from "../utils/api";

const badgeColors: Record<string, string> = {
  "Terlaris": "bg-[#27C7C3] text-white",
  "Baru": "bg-emerald-500 text-white",
  "Populer": "bg-violet-500 text-white",
  "Kompak": "bg-amber-500 text-white",
  "Kustom": "bg-rose-500 text-white",
  "Elegan": "bg-gray-800 text-white",
  "Best Seller": "bg-yellow-500 text-white",
};

export function Products() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<string[]>(["Semua"]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([apiGetProducts(), apiGetCategories()])
      .then(([prods, cats]) => {
        setProducts(prods);
        // Build unique category list from products + API categories
        const catNames = cats.map((c) => c.name);
        const fromProducts = [...new Set(prods.map((p) => p.category))];
        const merged = ["Semua", ...new Set([...catNames, ...fromProducts])];
        setCategories(merged);
      })
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === "Semua"
    ? products.slice(0, 6)
    : products.filter((p) => p.category === activeCategory).slice(0, 6);

  return (
    <section id="products" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Produk Kami
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Koleksi Kemasan{" "}
            <span className="text-[#27C7C3]">Premium</span>
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            Dari botol parfum hingga lini kemasan kosmetik lengkap — kami menawarkan
            solusi komprehensif untuk setiap merek kecantikan.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-[#27C7C3] text-white shadow-md shadow-[#27C7C3]/30"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#27C7C3]/30 hover:text-[#27C7C3]"
              }`}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                <div className="h-60 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-3 bg-gray-100 rounded w-1/4" />
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-[#27C7C3]/20 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative overflow-hidden h-60">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {/* Badge */}
                  {product.badge && (
                    <span
                      className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[product.badge] ?? "bg-gray-800 text-white"}`}
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {product.badge}
                    </span>
                  )}
                  {/* Hover CTA */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <button
                      className="w-full py-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-semibold hover:bg-[#27C7C3] hover:text-white transition-colors"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Request Sample
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <span
                    className="text-[#27C7C3] text-xs font-semibold uppercase tracking-wider"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {product.category}
                  </span>
                  <h3
                    className="text-gray-900 text-base font-semibold mt-1 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-gray-500 text-sm mb-4"
                    style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.6 }}
                  >
                    {product.description}
                  </p>

                  {/* Sizes */}
                  <div className="flex flex-wrap gap-2">
                    {product.capacity.slice(0, 4).map((size) => (
                      <span
                        key={size}
                        className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-[#27C7C3] transition-all duration-300 shadow-lg hover:shadow-[#27C7C3]/30"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Lihat Katalog Lengkap
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
