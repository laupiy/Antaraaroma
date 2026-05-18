import { Star, Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const testimonials = [
  {
    name: "Siti Rahayu",
    role: "Pendiri, Eira Parfum",
    image: "https://images.unsplash.com/photo-1774897778836-3b13763e71b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJlYXV0eSUyMGluZHVzdHJ5JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc4NDI1Mzg2fDA&ixlib=rb-4.1.0&q=80&w=200",
    rating: 5,
    text: "ANTARA AROMA mengubah merek kami dengan botol kaca premium mereka. Kualitasnya luar biasa dan ukiran kustom terlihat sangat memukau. Pelanggan kami selalu memuji kemasannya!",
    product: "Botol Parfum Kaca Kustom",
  },
  {
    name: "Budi Santoso",
    role: "CEO, Lumière Beauty",
    image: "https://images.unsplash.com/photo-1738566061505-556830f8b8f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBidXNpbmVzcyUyMHBvcnRyYWl0JTIwYXNpYW58ZW58MXx8fHwxNzc4NDI1Mzg2fDA&ixlib=rb-4.1.0&q=80&w=200",
    rating: 5,
    text: "Sudah 3 tahun bekerja sama dengan ANTARA AROMA. Harga kompetitif dan kualitas konsisten mereka membantu kami mengembangkan bisnis. Tim sangat responsif dan pengiriman selalu tepat waktu.",
    product: "Koleksi Botol Semprot",
  },
  {
    name: "Dewi Kusuma",
    role: "Manajer Merek, Velour Skin",
    image: "https://images.unsplash.com/photo-1774897778836-3b13763e71b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGJlYXV0eSUyMGluZHVzdHJ5JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzc4NDI1Mzg2fDA&ixlib=rb-4.1.0&q=80&w=200",
    rating: 5,
    text: "Koleksi toples perawatan kulit sangat cocok untuk lini serum kami. Kaca buram terlihat sangat premium di rak. ANTARA AROMA benar-benar mitra kemasan berkelas dunia.",
    product: "Toples Perawatan Kulit Buram",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Testimoni
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Apa Kata{" "}
            <span className="text-[#27C7C3]">Klien Kami</span>
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            Lebih dari 1.000 merek mempercayai ANTARA AROMA untuk kebutuhan kemasan mereka.
            Inilah yang mereka katakan tentang kami.
          </p>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="relative group p-7 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:border-[#27C7C3]/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Quote icon */}
              <div className="absolute top-6 right-6 text-[#27C7C3]/20 group-hover:text-[#27C7C3]/30 transition-colors">
                <Quote size={36} />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p
                className="text-gray-600 text-sm flex-1 mb-6"
                style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
              >
                "{t.text}"
              </p>

              {/* Product tag */}
              <div
                className="inline-block px-3 py-1 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-medium mb-5 w-fit"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t.product}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-5">
                <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-[#27C7C3]/20">
                  <ImageWithFallback
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div
                    className="text-gray-900 text-sm font-semibold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t.name}
                  </div>
                  <div
                    className="text-gray-400 text-xs"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-14 flex flex-wrap justify-center items-center gap-8">
          {["500+ Produk", "1000+ Klien", "Bersertifikat ISO", "10+ Tahun", "Pengiriman Nasional"].map(
            (badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 text-gray-400 text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#27C7C3]" />
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
