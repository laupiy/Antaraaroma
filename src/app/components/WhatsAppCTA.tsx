import { MessageCircle, Phone } from "lucide-react";

export function WhatsAppCTA() {
  const waNumber = "6281234567890";
  const waMessage = encodeURIComponent(
    "Halo ANTARA AROMA, saya ingin mengetahui lebih lanjut tentang produk packaging Anda. Bisa minta katalog dan harga terbaru?"
  );
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <section
      className="py-20 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #111827 0%, #0f2f2e 50%, #0a1a1a 100%)",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #27C7C3, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #27C7C3, transparent 70%)" }}
        />
        {/* WhatsApp icon watermark */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-5">
          <MessageCircle size={280} className="text-[#27C7C3]" />
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/30 mb-6"
        >
          <div className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span
            className="text-[#25D366] text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Available on WhatsApp
          </span>
        </div>

        <h2
          className="text-4xl lg:text-5xl text-white mb-4"
          style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, lineHeight: 1.1 }}
        >
          Chat Bersama Kami &{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #27C7C3, #7ee8e6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Get Your Quote
          </span>{" "}
          Today
        </h2>

        <p
          className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
          style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.7, fontWeight: 300 }}
        >
          Konsultan kemasan kami siap membantu Anda memilih produk yang tepat,
          meminta sampel, dan mendapatkan harga kompetitif — semuanya melalui WhatsApp.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 rounded-full text-white text-sm font-bold hover:scale-105 transition-all duration-200 shadow-2xl"
            style={{
              background: "linear-gradient(135deg, #25D366, #128C7E)",
              fontFamily: "Poppins, sans-serif",
              boxShadow: "0 20px 40px rgba(37, 211, 102, 0.3)",
            }}
          >
            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
            Chat on WhatsApp
          </a>
          <a
            href="tel:+6281234567890"
            className="flex items-center gap-3 px-8 py-4 rounded-full border border-white/20 text-white text-sm font-semibold hover:border-[#27C7C3]/50 hover:bg-[#27C7C3]/10 transition-all duration-200"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <Phone size={18} />
            +62 812-3456-7890
          </a>
        </div>

        {/* Info chips */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            "Respons Cepat < 1 Jam",
            "Sampel Gratis Tersedia",
            "Penawaran Kustom Siap",
          ].map((item) => (
            <span
              key={item}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              ✓ {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
