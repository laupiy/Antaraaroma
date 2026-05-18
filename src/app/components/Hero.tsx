import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #111827 40%, #0f2f2e 80%, #0a1a1a 100%)",
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #27C7C3 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, #27C7C3 0%, transparent 70%)" }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(39,199,195,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(39,199,195,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#27C7C3]/10 border border-[#27C7C3]/30 w-fit">
              <Sparkles size={14} className="text-[#27C7C3]" />
              <span
                className="text-[#27C7C3] text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Pemasok Kemasan Kosmetik Premium
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-5xl lg:text-6xl xl:text-7xl text-white"
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              Tingkatkan{" "}
              <span
                className="relative"
                style={{
                  background: "linear-gradient(135deg, #27C7C3, #7ee8e6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Merek
              </span>{" "}
              Parfum Anda
            </h1>

            {/* Subtitle */}
            <p
              className="text-gray-300/80 text-lg max-w-xl"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 300, lineHeight: 1.7 }}
            >
              Mitra terpercaya untuk botol parfum premium dan solusi kemasan kosmetik.
              Dari botol kaca artisanal hingga dispenser semprot mewah — dirancang untuk
              merek yang menuntut keunggulan.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-2">
              <a
                href="#products"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#27C7C3] text-white text-sm font-semibold hover:bg-[#1fb3af] transition-all duration-200 shadow-xl shadow-[#27C7C3]/25 hover:shadow-[#27C7C3]/40 hover:scale-105"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Explore Products
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#catalog"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white text-sm font-semibold hover:border-[#27C7C3]/50 hover:bg-[#27C7C3]/10 transition-all duration-200"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                View Catalog
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-6 mt-4 pt-6 border-t border-white/10">
              {[
                { value: "500+", label: "Produk" },
                { value: "1000+", label: "Klien" },
                { value: "10+", label: "Thn Pengalaman" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div
                    className="text-2xl font-bold text-[#27C7C3]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-xs text-gray-400 mt-0.5"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Product Image */}
          <div className="relative flex justify-center items-center">
            {/* Glow */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-20"
              style={{ background: "radial-gradient(circle, #27C7C3, transparent 70%)" }}
            />
            {/* Floating card */}
            <div className="relative w-full max-w-md">
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                  border: "1px solid rgba(255,255,255,0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1773527142304-58116364b8a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBwZXJmdW1lJTIwYm90dGxlJTIwZ2xhc3MlMjBlbGVnYW50fGVufDF8fHx8MTc3ODQyNTM4MHww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Luxury Perfume Bottle"
                  className="w-full h-[460px] object-cover"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Floating label */}
                <div className="absolute bottom-5 left-5 right-5">
                  <div
                    className="px-4 py-3 rounded-2xl backdrop-blur-md"
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <p
                      className="text-white text-xs font-medium tracking-wider uppercase"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      ✦ Koleksi Premium 2025
                    </p>
                    <p
                      className="text-[#27C7C3] text-sm font-semibold mt-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Luxury Glass Perfume Bottles
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative floating chips */}
              <div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #27C7C3, #1aa8a5)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                Custom Design
              </div>
              <div
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #111827, #1f2937)",
                  border: "1px solid rgba(39,199,195,0.4)",
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                MOQ Flexible
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 30C1200 60 960 75 720 75C480 75 240 60 0 30L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
