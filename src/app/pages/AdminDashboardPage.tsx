import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard,
  PackageSearch,
  Plus,
  Pencil,
  Trash2,
  X,
  LogOut,
  Save,
  ChevronDown,
  Star,
  RotateCcw,
  Search,
  ImageOff,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";
import {
  isAdminLoggedIn,
  logoutAdmin,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  resetProducts,
} from "../utils/storage";
import type { Product, Category } from "../data/products";

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES: Exclude<Category, "All">[] = [
  "Perfume Bottles",
  "Spray Bottles",
  "Skincare Jars",
  "Roll-On Bottles",
  "Cosmetic Packaging",
];

const BADGE_PRESETS = [
  { label: "Terlaris", color: "#27C7C3" },
  { label: "Baru", color: "#10B981" },
  { label: "Populer", color: "#8B5CF6" },
  { label: "Elegan", color: "#6366F1" },
  { label: "Kustom", color: "#EF4444" },
  { label: "Best Seller", color: "#F59E0B" },
];

type FormData = Omit<Product, "id" | "capacity" | "tags"> & {
  capacityStr: string;
  tagsStr: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  category: "Perfume Bottles",
  sku: "",
  material: "",
  capacityStr: "",
  finish: "",
  moq: "",
  badge: "",
  badgeColor: "#27C7C3",
  isNew: false,
  isPopular: false,
  rating: 4.5,
  reviewCount: 0,
  image: "",
  description: "",
  tagsStr: "",
  dateAdded: new Date().toISOString().split("T")[0],
};

// ─── Toast ────────────────────────────────────────────────────────────────────

interface ToastMsg {
  id: number;
  type: "success" | "error";
  text: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeMenu, setActiveMenu] = useState<"katalog">("katalog");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [imgError, setImgError] = useState(false);
  const toastId = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);

  // ─── Auth guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isAdminLoggedIn()) navigate("/admin/login", { replace: true });
    else setProducts(getProducts());
  }, [navigate]);

  // ─── Toast helpers ───────────────────────────────────────────────────────
  function toast(type: "success" | "error", text: string) {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }

  // ─── Refresh products from storage ──────────────────────────────────────
  function refreshProducts() {
    setProducts(getProducts());
  }

  // ─── Logout ──────────────────────────────────────────────────────────────
  function handleLogout() {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }

  // ─── Open form ───────────────────────────────────────────────────────────
  function openAdd() {
    setEditingProduct(null);
    setForm({ ...EMPTY_FORM, dateAdded: new Date().toISOString().split("T")[0] });
    setImgError(false);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      sku: product.sku,
      material: product.material,
      capacityStr: product.capacity.join(", "),
      finish: product.finish,
      moq: product.moq,
      badge: product.badge ?? "",
      badgeColor: product.badgeColor ?? "#27C7C3",
      isNew: product.isNew ?? false,
      isPopular: product.isPopular ?? false,
      rating: product.rating,
      reviewCount: product.reviewCount,
      image: product.image,
      description: product.description,
      tagsStr: product.tags.join(", "),
      dateAdded: product.dateAdded,
    });
    setImgError(false);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function closeForm() {
    setShowForm(false);
    setEditingProduct(null);
  }

  // ─── Save ─────────────────────────────────────────────────────────────────
  function handleSave() {
    if (!form.name.trim()) { toast("error", "Nama produk tidak boleh kosong."); return; }
    if (!form.sku.trim()) { toast("error", "Kode produk (SKU) tidak boleh kosong."); return; }

    const productData: Omit<Product, "id"> = {
      name: form.name.trim(),
      category: form.category as Exclude<Category, "All">,
      sku: form.sku.trim(),
      material: form.material.trim(),
      capacity: form.capacityStr.split(",").map((s) => s.trim()).filter(Boolean),
      finish: form.finish.trim(),
      moq: form.moq.trim(),
      badge: form.badge.trim() || undefined,
      badgeColor: form.badge.trim() ? form.badgeColor : undefined,
      isNew: form.isNew,
      isPopular: form.isPopular,
      rating: Math.min(5, Math.max(0, Number(form.rating))),
      reviewCount: Math.max(0, Number(form.reviewCount)),
      image: form.image.trim(),
      description: form.description.trim(),
      tags: form.tagsStr.split(",").map((s) => s.trim()).filter(Boolean),
      dateAdded: form.dateAdded,
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
      toast("success", "Produk berhasil diperbarui.");
    } else {
      addProduct(productData);
      toast("success", "Produk baru berhasil ditambahkan.");
    }

    refreshProducts();
    closeForm();
  }

  // ─── Delete ───────────────────────────────────────────────────────────────
  function handleDelete(id: number) {
    deleteProduct(id);
    refreshProducts();
    setDeleteConfirm(null);
    toast("success", "Produk berhasil dihapus.");
  }

  // ─── Reset ────────────────────────────────────────────────────────────────
  function handleReset() {
    resetProducts();
    refreshProducts();
    setResetConfirm(false);
    toast("success", "Katalog telah direset ke data default.");
  }

  // ─── Filtered list ────────────────────────────────────────────────────────
  const filtered = products.filter((p) =>
    [p.name, p.sku, p.category, p.material].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  // ─── Color ────────────────────────────────────────────────────────────────
  const C = {
    bg: "#0c0c18",
    sidebar: "#0f0f1e",
    card: "#13131f",
    cardBorder: "rgba(255,255,255,0.07)",
    teal: "#27C7C3",
    text: "#e8e8f0",
    muted: "#7777a0",
    danger: "#d4183d",
  } as const;

  return (
    <div
      className="min-h-screen flex"
      style={{ background: C.bg, fontFamily: "Poppins, sans-serif", color: C.text }}
    >
      {/* ─── Toasts ──────────────────────────────────────────────────────── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl pointer-events-auto"
            style={{
              background: t.type === "success" ? "rgba(39,199,195,0.15)" : "rgba(212,24,61,0.15)",
              border: `1px solid ${t.type === "success" ? "rgba(39,199,195,0.4)" : "rgba(212,24,61,0.4)"}`,
              color: t.type === "success" ? C.teal : "#ff6b8a",
              backdropFilter: "blur(12px)",
            }}
          >
            {t.type === "success" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
            {t.text}
          </div>
        ))}
      </div>

      {/* ─── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{
          background: C.sidebar,
          borderRight: `1px solid ${C.cardBorder}`,
          minHeight: "100vh",
        }}
      >
        {/* Logo */}
        <div className="px-6 py-6 border-b" style={{ borderColor: C.cardBorder }}>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(39,199,195,0.15)", border: "1px solid rgba(39,199,195,0.3)" }}
            >
              <Package size={16} color={C.teal} />
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest" style={{ color: C.teal }}>
                ANTARA AROMA
              </div>
              <div className="text-xs" style={{ color: C.muted }}>Panel Admin</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeMenu === "katalog" ? "rgba(39,199,195,0.12)" : "transparent",
              color: activeMenu === "katalog" ? C.teal : C.muted,
              border: activeMenu === "katalog" ? "1px solid rgba(39,199,195,0.2)" : "1px solid transparent",
            }}
            onClick={() => setActiveMenu("katalog")}
          >
            <PackageSearch size={16} />
            Kelola Katalog Produk
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ color: C.muted }}
          >
            <LayoutDashboard size={16} />
            Lihat Halaman Utama ↗
          </a>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <div className="border-t mb-4" style={{ borderColor: C.cardBorder }} />
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "rgba(212,24,61,0.1)",
              border: "1px solid rgba(212,24,61,0.2)",
              color: "#ff6b8a",
            }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>

      {/* ─── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div
          className="px-8 py-5 border-b flex items-center justify-between sticky top-0 z-20"
          style={{ background: C.bg, borderColor: C.cardBorder, backdropFilter: "blur(12px)" }}
        >
          <div>
            <h1 className="text-lg font-semibold" style={{ color: C.text }}>Kelola Katalog Produk</h1>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>{products.length} produk tersimpan</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${C.cardBorder}`,
                color: C.muted,
              }}
              onClick={() => setResetConfirm(true)}
            >
              <RotateCcw size={13} />
              Reset Default
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #27C7C3, #1fa8a5)",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(39,199,195,0.3)",
              }}
              onClick={openAdd}
            >
              <Plus size={14} />
              Tambah Produk
            </button>
          </div>
        </div>

        <div className="px-8 py-6 space-y-6">
          {/* ─── Form ────────────────────────────────────────────────────── */}
          {showForm && (
            <div
              ref={formRef}
              className="rounded-2xl overflow-hidden"
              style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
            >
              {/* Form header */}
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: C.cardBorder }}
              >
                <h2 className="text-sm font-semibold" style={{ color: C.text }}>
                  {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                </h2>
                <button onClick={closeForm} className="opacity-50 hover:opacity-100 transition-opacity">
                  <X size={18} color={C.text} />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Produk */}
                <Field label="Nama Produk *" span={2}>
                  <Input
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    placeholder="cth: Botol Kaca Kotak Mewah"
                  />
                </Field>

                {/* Kategori */}
                <Field label="Kategori">
                  <Select
                    value={form.category}
                    onChange={(v) => setForm({ ...form, category: v as Exclude<Category, "All"> })}
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                  />
                </Field>

                {/* Kode Produk */}
                <Field label="Kode Produk (SKU) *">
                  <Input
                    value={form.sku}
                    onChange={(v) => setForm({ ...form, sku: v })}
                    placeholder="cth: PB-SQ-001"
                  />
                </Field>

                {/* Material */}
                <Field label="Material">
                  <Input
                    value={form.material}
                    onChange={(v) => setForm({ ...form, material: v })}
                    placeholder="cth: Borosilicate Glass"
                  />
                </Field>

                {/* Kapasitas */}
                <Field label="Ukuran/Kapasitas (pisahkan koma)">
                  <Input
                    value={form.capacityStr}
                    onChange={(v) => setForm({ ...form, capacityStr: v })}
                    placeholder="cth: 30ml, 50ml, 100ml"
                  />
                </Field>

                {/* Finish */}
                <Field label="Finish / Tampilan">
                  <Input
                    value={form.finish}
                    onChange={(v) => setForm({ ...form, finish: v })}
                    placeholder="cth: Bening / Buram"
                  />
                </Field>

                {/* MOQ */}
                <Field label="Minimum Order (MOQ)">
                  <Input
                    value={form.moq}
                    onChange={(v) => setForm({ ...form, moq: v })}
                    placeholder="cth: 500 pcs"
                  />
                </Field>

                {/* Rating */}
                <Field label="Rating (0–5)">
                  <Input
                    type="number"
                    value={String(form.rating)}
                    onChange={(v) => setForm({ ...form, rating: parseFloat(v) || 0 })}
                    placeholder="cth: 4.8"
                  />
                </Field>

                {/* Jumlah Review */}
                <Field label="Jumlah Review">
                  <Input
                    type="number"
                    value={String(form.reviewCount)}
                    onChange={(v) => setForm({ ...form, reviewCount: parseInt(v) || 0 })}
                    placeholder="cth: 128"
                  />
                </Field>

                {/* Badge */}
                <Field label="Badge / Status">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input
                        value={form.badge}
                        onChange={(v) => setForm({ ...form, badge: v })}
                        placeholder="cth: Terlaris"
                      />
                    </div>
                    <input
                      type="color"
                      value={form.badgeColor}
                      onChange={(e) => setForm({ ...form, badgeColor: e.target.value })}
                      className="w-11 h-10 rounded-lg cursor-pointer border-0 p-0.5"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                      title="Warna badge"
                    />
                  </div>
                  {/* Badge presets */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {BADGE_PRESETS.map((b) => (
                      <button
                        key={b.label}
                        type="button"
                        className="px-2 py-0.5 rounded-md text-xs font-medium transition-all hover:scale-105"
                        style={{
                          background: `${b.color}22`,
                          border: `1px solid ${b.color}55`,
                          color: b.color,
                        }}
                        onClick={() => setForm({ ...form, badge: b.label, badgeColor: b.color })}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </Field>

                {/* Tanggal Ditambahkan */}
                <Field label="Tanggal Ditambahkan">
                  <Input
                    type="date"
                    value={form.dateAdded}
                    onChange={(v) => setForm({ ...form, dateAdded: v })}
                  />
                </Field>

                {/* Checkboxes */}
                <Field label="Status Khusus" span={2}>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm" style={{ color: C.muted }}>
                      <input
                        type="checkbox"
                        checked={form.isNew}
                        onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                        className="w-4 h-4 accent-teal-400"
                      />
                      Produk Baru
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none text-sm" style={{ color: C.muted }}>
                      <input
                        type="checkbox"
                        checked={form.isPopular}
                        onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                        className="w-4 h-4 accent-teal-400"
                      />
                      Populer
                    </label>
                  </div>
                </Field>

                {/* Tags */}
                <Field label="Tags (pisahkan koma)" span={2}>
                  <Input
                    value={form.tagsStr}
                    onChange={(v) => setForm({ ...form, tagsStr: v })}
                    placeholder="cth: glass, square, luxury"
                  />
                </Field>

                {/* Deskripsi */}
                <Field label="Deskripsi Singkat" span={2}>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Tulis deskripsi produk..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: C.text,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(39,199,195,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                  />
                </Field>

                {/* Gambar URL */}
                <Field label="URL Gambar Produk" span={2}>
                  <Input
                    value={form.image}
                    onChange={(v) => { setForm({ ...form, image: v }); setImgError(false); }}
                    placeholder="https://images.unsplash.com/..."
                  />
                  {/* Preview */}
                  {form.image && (
                    <div className="mt-3 flex items-start gap-3">
                      <div
                        className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {imgError ? (
                          <ImageOff size={20} color={C.muted} />
                        ) : (
                          <img
                            src={form.image}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => setImgError(true)}
                          />
                        )}
                      </div>
                      <p className="text-xs mt-1" style={{ color: C.muted }}>
                        {imgError ? "URL gambar tidak valid atau tidak bisa dimuat." : "Preview gambar produk."}
                      </p>
                    </div>
                  )}
                </Field>
              </div>

              {/* Form actions */}
              <div
                className="px-6 py-4 border-t flex items-center justify-end gap-3"
                style={{ borderColor: C.cardBorder }}
              >
                <button
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.05)", color: C.muted, border: `1px solid ${C.cardBorder}` }}
                  onClick={closeForm}
                >
                  Batal
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #27C7C3, #1fa8a5)",
                    color: "#fff",
                    boxShadow: "0 4px 16px rgba(39,199,195,0.25)",
                  }}
                  onClick={handleSave}
                >
                  <Save size={14} />
                  {editingProduct ? "Perbarui Produk" : "Simpan Produk"}
                </button>
              </div>
            </div>
          )}

          {/* ─── Search ──────────────────────────────────────────────────── */}
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: C.muted }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari produk berdasarkan nama, SKU, kategori..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: C.card,
                border: `1px solid ${C.cardBorder}`,
                color: C.text,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(39,199,195,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.cardBorder)}
            />
          </div>

          {/* ─── Product Table ───────────────────────────────────────────── */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{ background: C.card, border: `1px solid ${C.cardBorder}` }}
          >
            {/* Table head */}
            <div
              className="grid grid-cols-[2fr_1.2fr_1fr_0.7fr_0.7fr_auto] gap-4 px-5 py-3 text-xs font-semibold tracking-widest uppercase"
              style={{
                color: C.muted,
                background: "rgba(255,255,255,0.02)",
                borderBottom: `1px solid ${C.cardBorder}`,
              }}
            >
              <span>Produk</span>
              <span>Kategori</span>
              <span>MOQ</span>
              <span>Rating</span>
              <span>Badge</span>
              <span className="text-right">Aksi</span>
            </div>

            {/* Rows */}
            {filtered.length === 0 ? (
              <div className="py-16 text-center" style={{ color: C.muted }}>
                <PackageSearch size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">Tidak ada produk ditemukan.</p>
              </div>
            ) : (
              filtered.map((p, idx) => (
                <div
                  key={p.id}
                  className="grid grid-cols-[2fr_1.2fr_1fr_0.7fr_0.7fr_auto] gap-4 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]"
                  style={{
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${C.cardBorder}` : "none",
                  }}
                >
                  {/* Name + image */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${C.cardBorder}` }}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <ImageOff size={14} color={C.muted} />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: C.text }}>{p.name}</p>
                      <p className="text-xs truncate" style={{ color: C.muted }}>{p.sku}</p>
                    </div>
                  </div>

                  {/* Category */}
                  <span className="text-xs truncate" style={{ color: C.muted }}>{p.category}</span>

                  {/* MOQ */}
                  <span className="text-xs" style={{ color: C.muted }}>{p.moq || "—"}</span>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star size={11} fill="#F59E0B" color="#F59E0B" />
                    <span className="text-xs font-medium" style={{ color: C.text }}>{p.rating}</span>
                  </div>

                  {/* Badge */}
                  <div>
                    {p.badge ? (
                      <span
                        className="px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{
                          background: `${p.badgeColor ?? "#27C7C3"}22`,
                          border: `1px solid ${p.badgeColor ?? "#27C7C3"}55`,
                          color: p.badgeColor ?? "#27C7C3",
                        }}
                      >
                        {p.badge}
                      </span>
                    ) : (
                      <span style={{ color: C.muted }} className="text-xs">—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <button
                      className="p-1.5 rounded-lg transition-all hover:scale-110"
                      style={{ background: "rgba(39,199,195,0.1)", color: C.teal }}
                      title="Edit"
                      onClick={() => openEdit(p)}
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg transition-all hover:scale-110"
                      style={{ background: "rgba(212,24,61,0.1)", color: "#ff6b8a" }}
                      title="Hapus"
                      onClick={() => setDeleteConfirm(p.id)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ─── Delete confirm modal ────────────────────────────────────────── */}
      {deleteConfirm !== null && (
        <Modal onClose={() => setDeleteConfirm(null)}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(212,24,61,0.15)" }}
            >
              <Trash2 size={18} color="#ff6b8a" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: C.text }}>Hapus Produk?</h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                Produk{" "}
                <strong style={{ color: C.text }}>
                  {products.find((p) => p.id === deleteConfirm)?.name}
                </strong>{" "}
                akan dihapus secara permanen.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: C.muted, border: `1px solid ${C.cardBorder}` }}
              onClick={() => setDeleteConfirm(null)}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(212,24,61,0.8)", color: "#fff" }}
              onClick={() => handleDelete(deleteConfirm)}
            >
              Hapus
            </button>
          </div>
        </Modal>
      )}

      {/* ─── Reset confirm modal ─────────────────────────────────────────── */}
      {resetConfirm && (
        <Modal onClose={() => setResetConfirm(false)}>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(212,24,61,0.15)" }}
            >
              <RotateCcw size={18} color="#ff6b8a" />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: C.text }}>Reset Katalog?</h3>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                Semua perubahan akan hilang dan katalog akan kembali ke data default.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.06)", color: C.muted, border: `1px solid ${C.cardBorder}` }}
              onClick={() => setResetConfirm(false)}
            >
              Batal
            </button>
            <button
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "rgba(212,24,61,0.8)", color: "#fff" }}
              onClick={handleReset}
            >
              Reset Sekarang
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Field({
  label,
  children,
  span = 1,
}: {
  label: string;
  children: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color: "#7777a0" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#e8e8f0",
      }}
      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(39,199,195,0.5)")}
      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none transition-all"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#e8e8f0",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(39,199,195,0.5)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "#13131f" }}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: "#7777a0" }}
      />
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{
          background: "#13131f",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
