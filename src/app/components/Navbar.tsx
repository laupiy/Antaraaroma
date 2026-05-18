import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsScrolled(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const links = [
    { label: "Beranda", href: isHome ? "#home" : "/" },
    { label: "Tentang Kami", href: isHome ? "#about" : "/#about" },
    { label: "Produk", href: isHome ? "#products" : "/#products" },
    { label: "Katalog", href: "/catalog" },
    { label: "Keunggulan", href: isHome ? "#advantages" : "/#advantages" },
    { label: "Distribusi", href: isHome ? "#distribusi" : "/#distribusi" }, // ← BARU
    { label: "Kontak", href: isHome ? "#contact" : "/#contact" },
  ];

  const solidNav = !isHome || isScrolled;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidNav
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#27C7C3] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 2C7.5 2 5 5 5 8.5C5 13 11 20 11 20C11 20 17 13 17 8.5C17 5 14.5 2 11 2Z" fill="white" fillOpacity="0.9" />
                <circle cx="11" cy="8.5" r="2.5" fill="white" fillOpacity="0.6" />
              </svg>
            </div>
            <div>
              <span className={`block text-lg font-bold tracking-wide transition-colors ${ solidNav ? "text-gray-900" : "text-white" }`} style={{ fontFamily: "Montserrat, sans-serif" }}>ANTARA</span>
              <span className="block text-xs font-medium tracking-[0.2em] -mt-1 text-[#27C7C3]" style={{ fontFamily: "Poppins, sans-serif" }}>AROMA</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-7">
            {links.map((link) => {
              const isCatalog = link.href === "/catalog";
              const isActive = location.pathname === link.href;
              return link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link key={link.href} to={link.href} className={`text-sm font-medium transition-colors hover:text-[#27C7C3] relative ${ solidNav ? "text-gray-700" : "text-white/90" } ${isActive ? "text-[#27C7C3]" : ""}`} style={{ fontFamily: "Poppins, sans-serif" }}>
                  {link.label}
                  {isCatalog && (<span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#27C7C3] align-middle" />)}
                </Link>
              ) : (
                <a key={link.href} href={link.href} className={`text-sm font-medium transition-colors hover:text-[#27C7C3] ${ solidNav ? "text-gray-700" : "text-white/90" }`} style={{ fontFamily: "Poppins, sans-serif" }}>{link.label}</a>
              );
            })}
            <a href={isHome ? "#contact" : "/#contact"} className="px-5 py-2.5 rounded-full bg-[#27C7C3] text-white text-sm font-semibold hover:bg-[#1fb3af] transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105" style={{ fontFamily: "Poppins, sans-serif" }}>
              Minta Penawaran
            </a>
          </div>

          <button className={`lg:hidden p-2 rounded-lg transition-colors ${ solidNav ? "text-gray-800" : "text-white" }`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white/98 backdrop-blur-md border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.href;
              return link.href.startsWith("/") && !link.href.includes("#") ? (
                <Link key={link.href} to={link.href} className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${ isActive ? "text-[#27C7C3] bg-[#27C7C3]/5" : "text-gray-700 hover:text-[#27C7C3] hover:bg-[#27C7C3]/5" }`} style={{ fontFamily: "Poppins, sans-serif" }} onClick={() => setMobileOpen(false)}>{link.label}</Link>
              ) : (
                <a key={link.href} href={link.href} className="py-3 px-3 rounded-lg text-sm font-medium text-gray-700 hover:text-[#27C7C3] hover:bg-[#27C7C3]/5 transition-colors" style={{ fontFamily: "Poppins, sans-serif" }} onClick={() => setMobileOpen(false)}>{link.label}</a>
              );
            })}
            <a href={isHome ? "#contact" : "/#contact"} className="mt-2 py-3 px-5 rounded-full bg-[#27C7C3] text-white text-sm font-semibold text-center hover:bg-[#1fb3af] transition-colors" style={{ fontFamily: "Poppins, sans-serif" }} onClick={() => setMobileOpen(false)}>
              Minta Penawaran
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
