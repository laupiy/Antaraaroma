import { CheckCircle2 } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const stats = [
  { value: "500+", label: "Varian Produk", desc: "Kemasan parfum & kosmetik" },
  { value: "1.000+", label: "Klien Puas", desc: "Merek di seluruh Indonesia" },
  { value: "10+", label: "Tahun Pengalaman", desc: "Dalam kemasan kosmetik" },
  { value: "24/7", label: "Dukungan", desc: "Tim layanan berdedikasi" },
];

const highlights = [
  "Fasilitas produksi bersertifikat ISO",
  "Tersedia branding kustom & embossing",
  "Minimum pemesanan mulai dari 100 pcs",
  "Pengiriman ke seluruh Indonesia & internasional",
  "Tersedia pilihan kaca, plastik & aluminium",
];

export function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Tentang Kami
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Mitra Kemasan Terpercaya untuk{" "}
            <span className="text-[#27C7C3]">Merek Premium</span>
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            ANTARA AROMA adalah pemasok botol parfum dan solusi kemasan kosmetik terkemuka di Indonesia.
            Kami membantu merek kecantikan dan wewangian dengan kemasan berkualitas tinggi
            dan dapat dikustomisasi yang mencerminkan identitas mereka.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Image */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1758560936904-4eb0049284aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJmdW1lJTIwZ2xhc3MlMjBib3R0bGUlMjBjbGVhciUyMG1pbmltYWxpc3QlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc4NDI1Mzg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Antara Aroma facility"
                className="w-full h-[460px] object-cover"
              />
            </div>

            {/* Floating stat card */}
            <div
              className="absolute -bottom-6 -right-6 px-6 py-5 rounded-2xl shadow-2xl"
              style={{ background: "linear-gradient(135deg, #27C7C3, #1fb3af)" }}
            >
              <div
                className="text-3xl text-white mb-1"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}
              >
                10+
              </div>
              <div
                className="text-white/90 text-sm"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Years of Excellence
              </div>
            </div>
          </div>

          {/* Right — Content */}
          <div className="flex flex-col gap-6">
            <p
              className="text-gray-600"
              style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.9, fontSize: "0.95rem" }}
            >
              Didirikan dengan kecintaan pada kecantikan dan keahlian, ANTARA AROMA telah berkembang menjadi
              salah satu pemasok kemasan kosmetik paling terpercaya di Indonesia. Kami bekerja erat
              bersama para perfumer, merek kosmetik, dan startup kecantikan untuk menghadirkan
              solusi kemasan yang memadukan estetika, fungsi, dan keanggunan.
            </p>

            <div className="flex flex-col gap-3">
              {highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#27C7C3] mt-0.5 shrink-0" />
                  <span
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-[#27C7C3] transition-all duration-300 w-fit"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Talk to Our Team →
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="group p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#27C7C3]/30 hover:bg-[#27C7C3]/5 transition-all duration-300 text-center"
            >
              <div
                className="text-3xl lg:text-4xl text-[#27C7C3] mb-2 group-hover:scale-110 transition-transform duration-300"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}
              >
                {stat.value}
              </div>
              <div
                className="text-gray-900 text-sm font-semibold mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.label}
              </div>
              <div
                className="text-gray-400 text-xs"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
