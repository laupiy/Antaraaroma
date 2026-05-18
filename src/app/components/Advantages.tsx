import { Shield, Tag, Package, Zap, Star } from "lucide-react";

const advantages = [
  {
    icon: Shield,
    title: "Kualitas Premium",
    description:
      "Semua produk memenuhi standar kualitas internasional dengan proses QC yang ketat. Material bersertifikat ISO untuk setiap pesanan.",
    color: "#27C7C3",
  },
  {
    icon: Tag,
    title: "Harga Kompetitif",
    description:
      "Harga langsung dari pabrik tanpa perantara. Dapatkan tarif terbaik di pasaran tanpa mengorbankan kualitas.",
    color: "#7C3AED",
  },
  {
    icon: Package,
    title: "Kemasan Kustom",
    description:
      "Layanan OEM/ODM lengkap — bentuk, warna, logo, embossing, dan branding kustom untuk identitas unik Anda.",
    color: "#F59E0B",
  },
  {
    icon: Zap,
    title: "Pengiriman Cepat",
    description:
      "Logistik efisien dengan jangkauan ke seluruh Indonesia. Pesanan standar dikirim dalam 3–7 hari kerja.",
    color: "#10B981",
  },
  {
    icon: Star,
    title: "Pemasok Terpercaya",
    description:
      "Lebih dari 10 tahun melayani merek kecantikan dan wewangian terkemuka di Indonesia. Lebih dari 1.000 klien bisnis yang puas.",
    color: "#EF4444",
  },
];

export function Advantages() {
  return (
    <section id="advantages" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Mengapa Memilih Kami
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Keunggulan{" "}
            <span className="text-[#27C7C3]">Utama Kami</span>
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            Kami memadukan keahlian berkualitas, harga kompetitif, dan layanan terbaik
            untuk menjadi mitra kemasan pilihan bagi merek kecantikan.
          </p>
        </div>

        {/* Advantages grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.slice(0, 3).map((adv, i) => (
            <AdvantageCard key={i} adv={adv} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6 max-w-2xl mx-auto lg:max-w-none lg:grid-cols-2 lg:px-32">
          {advantages.slice(3).map((adv, i) => (
            <AdvantageCard key={i} adv={adv} />
          ))}
        </div>

        {/* Bottom highlight bar */}
        <div
          className="mt-16 rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ background: "linear-gradient(135deg, #27C7C3, #1aa8a5)" }}
        >
          <div>
            <h3
              className="text-white text-2xl mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
              Ready to Upgrade Your Packaging?
            </h3>
            <p
              className="text-white/80 text-sm"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Get a free sample kit and consultation with our packaging experts today.
            </p>
          </div>
          <a
            href="#contact"
            className="shrink-0 px-8 py-3.5 rounded-full bg-white text-[#27C7C3] text-sm font-bold hover:bg-gray-50 transition-all shadow-xl hover:scale-105"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Get Free Sample
          </a>
        </div>
      </div>
    </section>
  );
}

function AdvantageCard({ adv }: { adv: typeof advantages[0] }) {
  const Icon = adv.icon;
  return (
    <div className="group p-7 rounded-3xl bg-white border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
        style={{ background: `${adv.color}15` }}
      >
        <Icon size={26} style={{ color: adv.color }} />
      </div>
      <h3
        className="text-gray-900 font-semibold text-lg mb-3"
        style={{ fontFamily: "Montserrat, sans-serif" }}
      >
        {adv.title}
      </h3>
      <p
        className="text-gray-500 text-sm"
        style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.75 }}
      >
        {adv.description}
      </p>
      <div
        className="mt-5 h-0.5 w-0 group-hover:w-12 transition-all duration-300 rounded-full"
        style={{ background: adv.color }}
      />
    </div>
  );
}
