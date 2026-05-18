import { Download, FileText } from "lucide-react";
import { Link } from "react-router";

const catalogItems = [
  {
    title: "Katalog Botol Parfum 2025",
    description: "Rangkaian lengkap botol parfum kaca dan kristal beserta dimensinya.",
    pages: "48 halaman",
    updated: "Januari 2025",
  },
  {
    title: "Katalog Botol Semprot & Pompa",
    description: "Dispenser semprot premium, atomizer, dan pompa kabut halus.",
    pages: "32 halaman",
    updated: "Maret 2025",
  },
  {
    title: "Katalog Kemasan Perawatan Kulit",
    description: "Toples, tube, dropper, dan botol serum untuk merek perawatan kulit.",
    pages: "56 halaman",
    updated: "Februari 2025",
  },
  {
    title: "Katalog Kustom OEM/ODM",
    description: "Solusi kemasan kustom penuh dengan layanan branding dan desain.",
    pages: "24 halaman",
    updated: "April 2025",
  },
];

export function Catalog() {
  return (
    <section id="catalog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Product Catalog
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Unduh{" "}
            <span className="text-[#27C7C3]">Katalog Terbaru Kami</span>
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            Telusuri katalog produk kami yang lengkap untuk menemukan kemasan yang sempurna
            bagi merek Anda. Hubungi kami untuk informasi harga dan sampel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catalogItems.map((item, i) => (
            <div
              key={i}
              className="group flex items-center gap-5 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#27C7C3]/30 hover:bg-[#27C7C3]/5 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#27C7C3]/10 flex items-center justify-center shrink-0 group-hover:bg-[#27C7C3]/20 transition-colors">
                <FileText size={24} className="text-[#27C7C3]" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-gray-900 font-semibold text-sm mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-gray-400 text-xs mb-2 line-clamp-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {item.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-400" style={{ fontFamily: "Poppins, sans-serif" }}>
                  <span>{item.pages}</span>
                  <span>•</span>
                  <span>Diperbarui {item.updated}</span>
                </div>
              </div>

              {/* Download button */}
              <a
                href="#contact"
                className="shrink-0 w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-[#27C7C3] hover:border-[#27C7C3] hover:text-white text-gray-500 transition-all duration-200 shadow-sm"
              >
                <Download size={16} />
              </a>
            </div>
          ))}
        </div>

        {/* Banner */}
        <div
          className="mt-10 rounded-3xl p-8 text-center"
          style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111827 60%, #0f2f2e 100%)" }}
        >
          <p
            className="text-white/80 text-sm mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Ready to browse all products?
          </p>
          <h3
            className="text-white text-2xl mb-5"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Jelajahi Katalog Produk Lengkap Kami
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#27C7C3] text-white text-sm font-semibold hover:bg-[#1fb3af] transition-all shadow-lg shadow-[#27C7C3]/30 hover:scale-105"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Browse Full Catalog →
            </Link>
            <a
              href="https://wa.me/6281234567890?text=Hi%20ANTARA%20AROMA%2C%20I%27d%20like%20to%20request%20a%20catalog%20and%20quote."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/20 text-white text-sm font-semibold hover:border-[#27C7C3]/50 hover:bg-[#27C7C3]/10 transition-all"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}