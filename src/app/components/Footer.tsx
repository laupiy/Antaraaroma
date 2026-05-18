import { MessageCircle, Mail, Phone, MapPin, Instagram, ExternalLink } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();

  const products = [
    "Botol Parfum",
    "Botol Semprot",
    "Toples Perawatan Kulit",
    "Botol Roll-On",
    "Kemasan Kosmetik",
    "Kustom OEM/ODM",
  ];

  const quickLinks = [
    { label: "Beranda", href: "#home" },
    { label: "Tentang Kami", href: "#about" },
    { label: "Produk", href: "#products" },
    { label: "Katalog", href: "#catalog" },
    { label: "Keunggulan", href: "#advantages" },
    { label: "Kontak", href: "#contact" },
  ];

  return (
    <footer
      id="footer"
      style={{
        background: "linear-gradient(180deg, #0a0a0a 0%, #111827 100%)",
      }}
    >
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#27C7C3] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 2C7.5 2 5 5 5 8.5C5 13 11 20 11 20C11 20 17 13 17 8.5C17 5 14.5 2 11 2Z" fill="white" fillOpacity="0.9"/>
                  <circle cx="11" cy="8.5" r="2.5" fill="white" fillOpacity="0.6"/>
                </svg>
              </div>
              <div>
                <span
                  className="block text-lg text-white"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
                >
                  ANTARA
                </span>
                <span
                  className="block text-xs tracking-[0.2em] text-[#27C7C3] -mt-1"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
                >
                  AROMA
                </span>
              </div>
            </div>

            <p
              className="text-gray-400 text-sm mb-5"
              style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
            >
              Pemasok terpercaya botol parfum premium dan kemasan kosmetik di Indonesia.
              Mendukung merek kecantikan sejak 2014.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#27C7C3] hover:border-[#27C7C3] hover:text-white transition-all"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#25D366] hover:border-[#25D366] hover:text-white transition-all"
              >
                <MessageCircle size={15} />
              </a>
              <a
                href="mailto:info@antaraaroma.com"
                className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-[#27C7C3] hover:border-[#27C7C3] hover:text-white transition-all"
              >
                <Mail size={15} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-white text-sm font-semibold mb-5 uppercase tracking-wider"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Tautan Cepat
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-[#27C7C3] transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4
              className="text-white text-sm font-semibold mb-5 uppercase tracking-wider"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Produk
            </h4>
            <ul className="flex flex-col gap-3">
              {products.map((p) => (
                <li key={p}>
                  <a
                    href="#products"
                    className="text-gray-400 text-sm hover:text-[#27C7C3] transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="text-white text-sm font-semibold mb-5 uppercase tracking-wider"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Informasi Kontak
            </h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-[#27C7C3] mt-0.5 shrink-0" />
                <span
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.6 }}
                >
                  Jl. Industri Raya No. 45, Tangerang, Banten 15820, Indonesia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-[#27C7C3] shrink-0" />
                <span
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  +62 812-3456-7890
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-[#27C7C3] shrink-0" />
                <span
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  info@antaraaroma.com
                </span>
              </div>
            </div>

            {/* NIB */}
            <div className="mt-5 p-3 rounded-xl bg-white/5 border border-white/10">
              <p
                className="text-gray-500 text-xs mb-1"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                NIB (Business Registration)
              </p>
              <p
                className="text-gray-300 text-sm font-semibold tracking-wider"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                1107250074094
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-gray-500 text-xs text-center sm:text-left"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            © {year} ANTARA AROMA. Seluruh hak dilindungi. Pemasok Kemasan Kosmetik Premium.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-500 text-xs hover:text-[#27C7C3] transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-500 text-xs hover:text-[#27C7C3] transition-colors"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
