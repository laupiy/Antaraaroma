import { Link } from "react-router";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight } from "lucide-react";

const categories = ["Semua", "Parfum", "Semprot", "Perawatan Kulit", "Roll-on", "Kosmetik"];

const products = [
  {
    id: 1,
    name: "Botol Parfum Kaca Mewah",
    category: "Parfum",
    description: "Kaca bening berkualitas premium dengan tutup dan ukiran yang dapat dikustomisasi.",
    sizes: ["30ml", "50ml", "100ml"],
    image: "https://images.unsplash.com/photo-1773527142304-58116364b8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZ2xhc3MlMjBlbGVnYW50fGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Terlaris",
  },
  {
    id: 2,
    name: "Botol Semprot Presisi",
    category: "Semprot",
    description: "Atomizer semprot halus dengan finishing emas/perak dan desain pompa elegan.",
    sizes: ["50ml", "100ml", "200ml"],
    image: "https://images.unsplash.com/photo-1770301410072-f6ef6dad65b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcHJheSUyMHBlcmZ1bWUlMjBib3R0bGUlMjBnb2xkJTIwbHV4dXJ5fGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Baru",
  },
  {
    id: 3,
    name: "Toples Krim Perawatan Kulit",
    category: "Perawatan Kulit",
    description: "Toples kaca buram dan akrilik, ideal untuk serum, krim, dan balsem.",
    sizes: ["15g", "30g", "50g", "100g"],
    image: "https://images.unsplash.com/photo-1763503839418-2b45c3d7a3c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHBhY2thZ2luZyUyMHNraW5jYXJlJTIwamFyJTIwd2hpdGV8ZW58MXx8fHwxNzc4NDI1MzgwfDA&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Populer",
  },
  {
    id: 4,
    name: "Botol Parfum Roll-On",
    category: "Roll-on",
    description: "Roll-on kaca kompak dengan aplikator bola stainless steel.",
    sizes: ["5ml", "10ml", "20ml"],
    image: "https://images.unsplash.com/photo-1647507653704-bde7f2d6dbf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2xsLW9uJTIwcGVyZnVtZSUyMGJvdHRsZSUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc4NDI1MzgwfDA&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Kompak",
  },
  {
    id: 5,
    name: "Set Kemasan Kosmetik Mewah",
    category: "Kosmetik",
    description: "Set kemasan lengkap untuk merek kosmetik — kotak, botol & aplikator.",
    sizes: ["Kustom"],
    image: "https://images.unsplash.com/photo-1739980296455-3f8d6051ca20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3NtZXRpYyUyMHBhY2thZ2luZyUyMGx1eHVyeSUyMGJlYXV0eSUyMHByb2R1Y3RzfGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Kustom",
  },
  {
    id: 6,
    name: "Parfum Minimalis Bening",
    category: "Parfum",
    description: "Botol kaca borosilikat ultra-bening dengan siluet minimalis.",
    sizes: ["30ml", "50ml", "75ml"],
    image: "https://images.unsplash.com/photo-1758560936904-4eb0049284aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwZ2xhc3MlMjBib3R0bGUlMjBjbGVhciUyMG1pbmltYWxpc3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc4NDI1Mzg2fDA&ixlib=rb-4.1.0&q=80&w=400",
    badge: "Elegan",
  },
];

const badgeColors: Record<string, string> = {
  "Terlaris": "bg-[#27C7C3] text-white",
  "Baru": "bg-emerald-500 text-white",
  "Populer": "bg-violet-500 text-white",
  "Kompak": "bg-amber-500 text-white",
  "Kustom": "bg-rose-500 text-white",
  "Elegan": "bg-gray-800 text-white",
};

export function Products() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

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
                <span
                  className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold ${badgeColors[product.badge] || "bg-gray-800 text-white"}`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {product.badge}
                </span>
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
                  {product.sizes.map((size) => (
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