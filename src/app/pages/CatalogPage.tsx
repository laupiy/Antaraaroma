import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router";
import {
  Search, SlidersHorizontal, Grid3x3, LayoutList, Star, ChevronDown,
  X, ArrowUpDown, Package, MessageCircle,
} from "lucide-react";
import { type Category, type Product } from "../data/products";
import { getProducts, getReviews, type Review } from "../utils/storage";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ProductModal } from "../components/ProductModal";
import { Footer } from "../components/Footer";

const CATEGORIES: Category[] = ["All","Perfume Bottles","Spray Bottles","Skincare Jars","Roll-On Bottles","Cosmetic Packaging"];
const CATEGORY_ICONS: Record<string, string> = { All:"✦","Perfume Bottles":"🫙","Spray Bottles":"💨","Skincare Jars":"🧴","Roll-On Bottles":"💧","Cosmetic Packaging":"📦" };
type SortKey = "newest"|"popular"|"rating"|"name-asc"|"name-desc";
const SORT_OPTIONS: {value:SortKey;label:string}[] = [
  {value:"newest",label:"Terbaru"},{value:"popular",label:"Paling Populer"},
  {value:"rating",label:"Rating Tertinggi"},{value:"name-asc",label:"Nama A–Z"},{value:"name-desc",label:"Nama Z–A"},
];

// ── Compute rating map dari review approved saja (tidak pakai data statis produk) ──
function buildRatingMap(products: Product[], reviews: Review[]): Record<number,{rating:number;reviewCount:number}> {
  const map: Record<number,{rating:number;reviewCount:number}> = {};
  const approved = reviews.filter((r) => r.status === "approved");
  products.forEach((p) => {
    const pReviews = approved.filter((r) => r.productId === p.id);
    if (pReviews.length === 0) {
      // Tidak ada review approved → tampilkan fallback 0 agar komponen bisa render "Belum ada ulasan"
      map[p.id] = { rating: 0, reviewCount: 0 };
    } else {
      const avg = pReviews.reduce((s, r) => s + r.rating, 0) / pReviews.length;
      map[p.id] = { rating: Math.round(avg * 10) / 10, reviewCount: pReviews.length };
    }
  });
  return map;
}

export function CatalogPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  useEffect(() => {
    setAllProducts(getProducts());
    setAllReviews(getReviews());

    // Refresh otomatis saat review ditambah, disetujui, atau dihapus
    function onReviewsUpdated() {
      setAllProducts(getProducts());
      setAllReviews(getReviews());
    }
    window.addEventListener("reviewsUpdated", onReviewsUpdated);
    return () => window.removeEventListener("reviewsUpdated", onReviewsUpdated);
  }, []);

  // Computed rating map (rating otomatis dari review approved)
  const ratingMap = useMemo(() => buildRatingMap(allProducts, allReviews), [allProducts, allReviews]);

  const categoryCounts = useMemo<Record<string,number>>(() => {
    return allProducts.reduce((acc,p) => {
      acc[p.category] = (acc[p.category]||0)+1;
      acc["All"] = (acc["All"]||0)+1;
      return acc;
    },{} as Record<string,number>);
  }, [allProducts]);

  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid"|"list">("grid");
  const [selectedProduct, setSelectedProduct] = useState<Product|null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = [...allProducts];
    if (activeCategory !== "All") list = list.filter((p) => p.category === activeCategory);
    const q = search.toLowerCase().trim();
    if (q) list = list.filter((p) =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q))
    );
    switch (sortKey) {
      case "newest": list.sort((a,b) => new Date(b.dateAdded).getTime()-new Date(a.dateAdded).getTime()); break;
      case "popular": list.sort((a,b) => (ratingMap[b.id]?.reviewCount??0)-(ratingMap[a.id]?.reviewCount??0)); break;
      case "rating": list.sort((a,b) => (ratingMap[b.id]?.rating??0)-(ratingMap[a.id]?.rating??0)); break;
      case "name-asc": list.sort((a,b) => a.name.localeCompare(b.name)); break;
      case "name-desc": list.sort((a,b) => b.name.localeCompare(a.name)); break;
    }
    return list;
  }, [allProducts, activeCategory, search, sortKey, ratingMap]);

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label;

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily:"Poppins, sans-serif" }}>
      <CatalogNavbar />

      {/* Hero */}
      <section className="pt-20 relative overflow-hidden" style={{ background:"linear-gradient(135deg,#0a0a0a 0%,#111827 45%,#0f2f2e 80%,#0a1a1a 100%)" }}>
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage:`linear-gradient(rgba(39,199,195,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(39,199,195,0.4) 1px,transparent 1px)`, backgroundSize:"60px 60px" }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10 pointer-events-none" style={{ background:"radial-gradient(circle,#27C7C3,transparent 70%)" }} />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16 text-center">
          <div className="flex items-center justify-center gap-2 text-xs mb-5">
            <Link to="/" className="text-gray-400 hover:text-[#27C7C3] transition-colors">Home</Link>
            <span className="text-gray-600">/</span>
            <span className="text-[#27C7C3]">Product Catalog</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#27C7C3]/15 border border-[#27C7C3]/30 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27C7C3] animate-pulse" />
            <span className="text-[#27C7C3] text-xs font-semibold tracking-widest uppercase">{allProducts.length} Produk Tersedia</span>
          </div>
          <h1 className="text-5xl lg:text-6xl text-white mb-4" style={{ fontFamily:"Montserrat, sans-serif", fontWeight:800, lineHeight:1.05 }}>
            Product{" "}
            <span style={{ background:"linear-gradient(135deg,#27C7C3,#7ee8e6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Catalog</span>
          </h1>
          <p className="text-gray-400 text-base max-w-xl mx-auto" style={{ lineHeight:1.8, fontWeight:300 }}>
            Temukan rangkaian lengkap botol parfum premium, dispenser semprot, toples perawatan kulit, roll-on, dan kemasan kosmetik — semua tersedia untuk branding kustom dan pemesanan massal.
          </p>
          <div className="mt-8 max-w-lg mx-auto">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Cari produk, kategori, material…" value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/10 border border-white/15 text-white placeholder-gray-500 text-sm outline-none focus:border-[#27C7C3]/60 focus:bg-white/15 transition-all backdrop-blur-sm" />
              {search && <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"><X size={16} /></button>}
            </div>
          </div>
        </div>
        <div className="relative -mb-px">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
            <path d="M0 60L1440 60L1440 20C1200 50 960 60 720 60C480 60 240 50 0 20L0 60Z" fill="#F9FAFB" />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className={`lg:block lg:static lg:w-64 lg:shrink-0 fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl lg:shadow-none transform transition-transform duration-300 overflow-y-auto ${filterOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="p-6 lg:p-0">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <span className="text-gray-900 font-semibold" style={{ fontFamily:"Montserrat, sans-serif" }}>Filters</span>
                <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={14} /></button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <h3 className="text-gray-900 font-semibold text-sm mb-4" style={{ fontFamily:"Montserrat, sans-serif" }}>Categories</h3>
                <div className="flex flex-col gap-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => { setActiveCategory(cat); setFilterOpen(false); }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all duration-200 text-left ${activeCategory===cat?"bg-[#27C7C3] text-white shadow-md shadow-[#27C7C3]/20":"text-gray-600 hover:bg-gray-50 hover:text-[#27C7C3]"}`}
                      style={{ fontFamily:"Poppins, sans-serif" }}>
                      <span className="flex items-center gap-2.5"><span className="text-base leading-none">{CATEGORY_ICONS[cat]}</span><span>{cat}</span></span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activeCategory===cat?"bg-white/25 text-white":"bg-gray-100 text-gray-400"}`}>{categoryCounts[cat]||0}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
                <h3 className="text-gray-900 font-semibold text-sm mb-4" style={{ fontFamily:"Montserrat, sans-serif" }}>Material Type</h3>
                <div className="flex flex-col gap-2">
                  {["Glass","Acrylic","Aluminum","Mixed"].map((m) => (
                    <label key={m} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border-2 border-gray-200 group-hover:border-[#27C7C3] transition-colors flex-shrink-0" />
                      <span className="text-gray-600 text-sm group-hover:text-[#27C7C3] transition-colors" style={{ fontFamily:"Poppins, sans-serif" }}>{m}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-gray-900 font-semibold text-sm mb-4" style={{ fontFamily:"Montserrat, sans-serif" }}>Min. Order Qty</h3>
                <div className="flex flex-col gap-2">
                  {["100 pcs","300 pcs","500 pcs","1000+ pcs"].map((moq) => (
                    <label key={moq} className="flex items-center gap-3 cursor-pointer group">
                      <div className="w-4 h-4 rounded border-2 border-gray-200 group-hover:border-[#27C7C3] transition-colors flex-shrink-0" />
                      <span className="text-gray-600 text-sm group-hover:text-[#27C7C3] transition-colors" style={{ fontFamily:"Poppins, sans-serif" }}>{moq}</span>
                    </label>
                  ))}
                </div>
              </div>
              <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer"
                className="mt-4 block p-5 rounded-2xl text-white hover:scale-[1.02] transition-transform"
                style={{ background:"linear-gradient(135deg,#25D366,#128C7E)" }}>
                <MessageCircle size={20} className="mb-2 opacity-80" />
                <p className="text-sm font-semibold mb-1" style={{ fontFamily:"Poppins, sans-serif" }}>Butuh Penawaran Kustom?</p>
                <p className="text-white/70 text-xs" style={{ fontFamily:"Poppins, sans-serif" }}>Chat with us on WhatsApp for bulk pricing and samples.</p>
              </a>
            </div>
          </aside>

          {filterOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setFilterOpen(false)} />}

          {/* Main grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <button onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#27C7C3]/30 hover:text-[#27C7C3] transition-all shadow-sm" style={{ fontFamily:"Poppins, sans-serif" }}>
                  <SlidersHorizontal size={15} /> Filters
                </button>
                <span className="text-gray-400 text-sm" style={{ fontFamily:"Poppins, sans-serif" }}>
                  <span className="text-gray-800 font-semibold">{filtered.length}</span> produk
                  {search && <span className="ml-1">untuk "<span className="text-[#27C7C3]">{search}</span>"</span>}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm hover:border-[#27C7C3]/30 hover:text-[#27C7C3] transition-all shadow-sm" style={{ fontFamily:"Poppins, sans-serif" }}>
                    <ArrowUpDown size={14} /> {currentSortLabel}
                    <ChevronDown size={14} className={`transition-transform ${sortOpen?"rotate-180":""}`} />
                  </button>
                  {sortOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-xl z-20 py-1 overflow-hidden">
                      {SORT_OPTIONS.map((opt) => (
                        <button key={opt.value} onClick={() => { setSortKey(opt.value); setSortOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${sortKey===opt.value?"bg-[#27C7C3]/10 text-[#27C7C3] font-medium":"text-gray-600 hover:bg-gray-50"}`}
                          style={{ fontFamily:"Poppins, sans-serif" }}>
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                  <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode==="grid"?"bg-[#27C7C3] text-white":"text-gray-400 hover:text-[#27C7C3]"}`}><Grid3x3 size={16} /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode==="list"?"bg-[#27C7C3] text-white":"text-gray-400 hover:text-[#27C7C3]"}`}><LayoutList size={16} /></button>
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(activeCategory !== "All" || search) && (
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-gray-400 text-xs" style={{ fontFamily:"Poppins, sans-serif" }}>Filter aktif:</span>
                {activeCategory !== "All" && <FilterChip label={activeCategory} onRemove={() => setActiveCategory("All")} />}
                {search && <FilterChip label={`"${search}"`} onRemove={() => setSearch("")} />}
                <button onClick={() => { setActiveCategory("All"); setSearch(""); }} className="text-xs text-[#27C7C3] hover:underline" style={{ fontFamily:"Poppins, sans-serif" }}>Hapus semua</button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Package size={48} className="text-gray-200 mb-4" />
                <h3 className="text-gray-700 font-semibold text-lg mb-2" style={{ fontFamily:"Montserrat, sans-serif" }}>Produk tidak ditemukan</h3>
                <p className="text-gray-400 text-sm mb-5" style={{ fontFamily:"Poppins, sans-serif" }}>Coba sesuaikan pencarian atau kriteria filter Anda.</p>
                <button onClick={() => { setSearch(""); setActiveCategory("All"); }} className="px-5 py-2.5 rounded-full bg-[#27C7C3] text-white text-sm font-medium" style={{ fontFamily:"Poppins, sans-serif" }}>Reset Filter</button>
              </div>
            )}

            {viewMode === "grid" && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product}
                    ratingSummary={ratingMap[product.id]}
                    onSelect={() => setSelectedProduct(product)} />
                ))}
              </div>
            )}
            {viewMode === "list" && filtered.length > 0 && (
              <div className="flex flex-col gap-4">
                {filtered.map((product) => (
                  <ProductListCard key={product.id} product={product}
                    ratingSummary={ratingMap[product.id]}
                    onSelect={() => setSelectedProduct(product)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CatalogNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const links = [
    {label:"Beranda",href:"/"},{label:"Tentang Kami",href:"/#about"},
    {label:"Produk",href:"/#products"},{label:"Katalog",href:"/catalog"},
    {label:"Keunggulan",href:"/#advantages"},{label:"Kontak",href:"/#contact"},
  ];
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/96 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#27C7C3] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2C7.5 2 5 5 5 8.5C5 13 11 20 11 20C11 20 17 13 17 8.5C17 5 14.5 2 11 2Z" fill="white" fillOpacity="0.9"/>
                <circle cx="11" cy="8.5" r="2.5" fill="white" fillOpacity="0.6"/>
              </svg>
            </div>
            <div>
              <span className="block text-lg text-gray-900" style={{ fontFamily:"Montserrat, sans-serif", fontWeight:700 }}>ANTARA</span>
              <span className="block text-xs tracking-[0.2em] text-[#27C7C3] -mt-1" style={{ fontFamily:"Poppins, sans-serif", fontWeight:500 }}>AROMA</span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {links.map((link) => (
              <Link key={link.href} to={link.href}
                className={`text-sm font-medium transition-colors hover:text-[#27C7C3] ${link.href==="/catalog"?"text-[#27C7C3]":"text-gray-600"}`}
                style={{ fontFamily:"Poppins, sans-serif" }}>
                {link.label}
                {link.href==="/catalog" && <span className="ml-1.5 inline-block w-1.5 h-1.5 rounded-full bg-[#27C7C3] align-middle"/>}
              </Link>
            ))}
            <a href="/#contact" className="px-5 py-2.5 rounded-full bg-[#27C7C3] text-white text-sm font-semibold hover:bg-[#1fb3af] transition-all shadow-md hover:shadow-lg hover:scale-105" style={{ fontFamily:"Poppins, sans-serif" }}>Minta Penawaran</a>
          </div>
          <button className="lg:hidden p-2 rounded-lg text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24}/> : <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.href} to={link.href}
                className={`py-3 px-3 rounded-lg text-sm font-medium transition-colors ${link.href==="/catalog"?"text-[#27C7C3] bg-[#27C7C3]/5":"text-gray-700 hover:text-[#27C7C3] hover:bg-[#27C7C3]/5"}`}
                style={{ fontFamily:"Poppins, sans-serif" }} onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            ))}
            <a href="/#contact" className="mt-2 py-3 px-5 rounded-full bg-[#27C7C3] text-white text-sm font-semibold text-center" style={{ fontFamily:"Poppins, sans-serif" }} onClick={() => setMobileOpen(false)}>Minta Penawaran</a>
          </div>
        </div>
      )}
    </nav>
  );
}

function StarRow({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({length:5}).map((_,i) => (
        <Star key={i} size={size} className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
      ))}
    </div>
  );
}

function ProductCard({ product, ratingSummary, onSelect }: {
  product: Product;
  ratingSummary?: {rating:number;reviewCount:number};
  onSelect: () => void;
}) {
  const rating = ratingSummary?.rating ?? 0;
  const reviewCount = ratingSummary?.reviewCount ?? 0;

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-[#27C7C3]/25 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col" onClick={onSelect}>
      <div className="relative overflow-hidden h-56 bg-gray-50">
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.badge && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow" style={{ background:product.badgeColor||"#27C7C3" }}>{product.badge}</span>}
        {!product.badge && product.isNew && <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500 shadow">New</span>}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button className="w-full py-2.5 rounded-xl bg-white/95 backdrop-blur-sm text-gray-900 text-xs font-semibold hover:bg-[#27C7C3] hover:text-white transition-colors shadow-sm" style={{ fontFamily:"Poppins, sans-serif" }}>Lihat Detail →</button>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <span className="text-[#27C7C3] text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ fontFamily:"Poppins, sans-serif" }}>{product.category}</span>
        <h3 className="text-gray-900 text-sm font-semibold mb-2 group-hover:text-[#27C7C3] transition-colors line-clamp-2" style={{ fontFamily:"Montserrat, sans-serif" }}>{product.name}</h3>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <SpecPill label={product.material.split(" ")[0]} />
          <SpecPill label={product.capacity[0]??"—"} />
          <SpecPill label={`MOQ: ${product.moq}`} />
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <StarRow rating={rating} />
            {reviewCount > 0 ? (
              <span className="text-gray-500 text-xs">({reviewCount})</span>
            ) : (
              <span className="text-gray-300 text-xs">Belum ada ulasan</span>
            )}
          </div>
          <span className="text-gray-300 text-xs" style={{ fontFamily:"Poppins, sans-serif" }}>{product.sku}</span>
        </div>
      </div>
    </div>
  );
}

function ProductListCard({ product, ratingSummary, onSelect }: {
  product: Product;
  ratingSummary?: {rating:number;reviewCount:number};
  onSelect: () => void;
}) {
  const rating = ratingSummary?.rating ?? 0;
  const reviewCount = ratingSummary?.reviewCount ?? 0;

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-[#27C7C3]/25 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex gap-5 p-4 hover:-translate-y-0.5" onClick={onSelect}>
      <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
        <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[#27C7C3] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily:"Poppins, sans-serif" }}>{product.category}</span>
            <h3 className="text-gray-900 font-semibold mt-0.5 mb-2 group-hover:text-[#27C7C3] transition-colors" style={{ fontFamily:"Montserrat, sans-serif" }}>{product.name}</h3>
            <p className="text-gray-400 text-sm line-clamp-2" style={{ fontFamily:"Poppins, sans-serif", lineHeight:1.6 }}>{product.description}</p>
          </div>
          <button className="shrink-0 px-4 py-2 rounded-xl bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold hover:bg-[#27C7C3] hover:text-white transition-all hidden sm:block" style={{ fontFamily:"Poppins, sans-serif" }}>Lihat Detail</button>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <StarRow rating={rating} />
          {reviewCount > 0 ? (
            <span className="text-gray-400 text-xs">({reviewCount})</span>
          ) : (
            <span className="text-gray-300 text-xs">Belum ada ulasan</span>
          )}
          <span className="text-gray-200">•</span>
          <SpecPill label={product.material.split(" ")[0]} />
          <SpecPill label={product.capacity[0]??"—"} />
          <SpecPill label={`MOQ: ${product.moq}`} />
        </div>
      </div>
    </div>
  );
}

function SpecPill({label}:{label:string}) {
  return <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs" style={{ fontFamily:"Poppins, sans-serif" }}>{label}</span>;
}

function FilterChip({label,onRemove}:{label:string;onRemove:()=>void}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-medium" style={{ fontFamily:"Poppins, sans-serif" }}>
      {label}<button onClick={onRemove} className="hover:text-[#1aa8a5]"><X size={12}/></button>
    </span>
  );
}
