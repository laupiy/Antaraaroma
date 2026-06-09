// src/app/pages/AdminDashboardPage.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  LayoutDashboard, PackageSearch, Plus, Pencil, Trash2, X, LogOut, Save,
  ChevronDown, Star, RotateCcw, Search, ImageOff, AlertTriangle, CheckCircle2,
  Package, Upload, ImagePlus, MessageSquare, Clock, UserCircle2, CheckCheck,
} from "lucide-react";
import {
  isAdminLoggedIn, removeToken,
  apiGetProducts, apiCreateProduct, apiUpdateProduct, apiDeleteProduct,
  apiGetReviewsAdmin, apiApproveReview, apiRejectReview, apiDeleteReview,
  apiUploadImage,
  type ApiProduct, type ApiReview,
} from "../utils/api";
import type { Category } from "../data/products";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Exclude<Category,"All">[] = [
  "Perfume Bottles","Spray Bottles","Skincare Jars","Roll-On Bottles","Cosmetic Packaging",
];
const BADGE_PRESETS = [
  {label:"Terlaris",color:"#27C7C3"},{label:"Baru",color:"#10B981"},
  {label:"Populer",color:"#8B5CF6"},{label:"Elegan",color:"#6366F1"},
  {label:"Kustom",color:"#EF4444"},{label:"Best Seller",color:"#F59E0B"},
];
const ALLOWED_TYPES = ["image/jpeg","image/jpg","image/png","image/webp"];
const MAX_FILE_SIZE_MB = 5;

type Product = ApiProduct;
type Review = ApiReview;

type FormData = Omit<Product,"id"|"capacity"|"tags"|"rating"|"reviewCount"> & {
  capacityStr: string;
  tagsStr: string;
};
const EMPTY_FORM: FormData = {
  name:"",category:"Perfume Bottles",sku:"",material:"",capacityStr:"",finish:"",moq:"",
  badge:"",badgeColor:"#27C7C3",isNew:false,isPopular:false,image:"",description:"",tagsStr:"",
  dateAdded: new Date().toISOString().split("T")[0],
};

interface ToastMsg { id:number; type:"success"|"error"|"info"; text:string; }

// ─── Colors ───────────────────────────────────────────────────────────────────

const C = {
  bg:"#0c0c18",sidebar:"#0f0f1e",card:"#13131f",
  cardBorder:"rgba(255,255,255,0.07)",teal:"#27C7C3",
  text:"#e8e8f0",muted:"#7777a0",danger:"#d4183d",
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeMenu, setActiveMenu] = useState<"katalog"|"ulasan">("katalog");
  const [search, setSearch] = useState("");
  const [reviewFilter, setReviewFilter] = useState<"semua"|"pending"|"approved">("semua");
  const [reviewSearch, setReviewSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product|null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number|null>(null);
  const [deleteReviewConfirm, setDeleteReviewConfirm] = useState<number|null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const toastId = useRef(0);
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdminLoggedIn()) { navigate("/admin/login",{replace:true}); return; }
    refreshProducts();
    refreshReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  function toast(type:"success"|"error"|"info", text:string) {
    const id = ++toastId.current;
    setToasts((t) => [...t,{id,type,text}]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id!==id)), 3500);
  }

  async function refreshProducts() {
    try { setProducts(await apiGetProducts()); }
    catch (e) { toast("error", e instanceof Error ? e.message : "Gagal memuat produk."); }
  }

  async function refreshReviews() {
    try { setReviews(await apiGetReviewsAdmin()); }
    catch (e) { toast("error", e instanceof Error ? e.message : "Gagal memuat ulasan."); }
  }

  function handleLogout() { removeToken(); navigate("/admin/login",{replace:true}); }

  async function handleImageFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) { toast("error","Format tidak didukung. Gunakan JPG, PNG, atau WebP."); return; }
    if (file.size/1024/1024 > MAX_FILE_SIZE_MB) { toast("error",`Ukuran file terlalu besar (maks. ${MAX_FILE_SIZE_MB}MB).`); return; }
    setUploadLoading(true);
    try {
      const localPreview = URL.createObjectURL(file);
      setImagePreview(localPreview);
      const { image_url } = await apiUploadImage(file);
      setForm((prev) => ({ ...prev, image: image_url }));
      setImagePreview(image_url);
      URL.revokeObjectURL(localPreview);
      toast("success", "Gambar berhasil diunggah ke Cloudinary.");
    } catch (err) {
      setImagePreview("");
      toast("error", err instanceof Error ? err.message : "Gagal mengunggah gambar. Coba lagi.");
    } finally { setUploadLoading(false); }
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (file) handleImageFile(file); e.target.value="";
  }
  function handleDrop(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); const file=e.dataTransfer.files?.[0]; if(file) handleImageFile(file); }
  function handleDragOver(e: React.DragEvent<HTMLDivElement>) { e.preventDefault(); }
  function removeImage() { setForm((prev) => ({...prev,image:""})); setImagePreview(""); }

  function openAdd() {
    setEditingProduct(null); setForm({...EMPTY_FORM,dateAdded:new Date().toISOString().split("T")[0]});
    setImagePreview(""); setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({behavior:"smooth"}), 50);
  }
  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      name:product.name, category:product.category as Exclude<Category,"All">,
      sku:product.sku, material:product.material,
      capacityStr:product.capacity.join(", "), finish:product.finish, moq:product.moq,
      badge:product.badge??"", badgeColor:product.badgeColor??"#27C7C3",
      isNew:product.isNew??false, isPopular:product.isPopular??false,
      image:product.image, description:product.description,
      tagsStr:product.tags.join(", "), dateAdded:product.dateAdded,
    });
    setImagePreview(product.image); setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({behavior:"smooth"}), 50);
  }
  function closeForm() { setShowForm(false); setEditingProduct(null); setImagePreview(""); }

  async function handleSave() {
    if (!form.name.trim()) { toast("error","Nama produk tidak boleh kosong."); return; }
    if (!form.sku.trim()) { toast("error","Kode produk (SKU) tidak boleh kosong."); return; }
    const productData: Omit<Product,"id"> = {
      name:form.name.trim(), category:form.category as Exclude<Category,"All">,
      sku:form.sku.trim(), material:form.material.trim(),
      capacity:form.capacityStr.split(",").map((s)=>s.trim()).filter(Boolean),
      finish:form.finish.trim(), moq:form.moq.trim(),
      badge:form.badge.trim()||undefined, badgeColor:form.badge.trim()?form.badgeColor:undefined,
      isNew:form.isNew, isPopular:form.isPopular,
      rating:editingProduct?.rating??4.5, reviewCount:editingProduct?.reviewCount??0,
      image:form.image, description:form.description.trim(),
      tags:form.tagsStr.split(",").map((s)=>s.trim()).filter(Boolean),
      dateAdded:form.dateAdded,
    };
    try {
      if (editingProduct) {
        await apiUpdateProduct(editingProduct.id, productData);
        toast("success","Produk berhasil diperbarui.");
      } else {
        await apiCreateProduct(productData);
        toast("success","Produk baru berhasil ditambahkan.");
      }
      await refreshProducts();
      closeForm();
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Gagal menyimpan produk.");
    }
  }

  async function handleDelete(id:number) {
    try {
      await apiDeleteProduct(id);
      await refreshProducts();
      setDeleteConfirm(null);
      toast("success","Produk berhasil dihapus.");
    } catch (e) {
      toast("error", e instanceof Error ? e.message : "Gagal menghapus produk.");
    }
  }

  // Reset: hanya clear UI, tidak ada endpoint reset di backend
  function handleReset() { setResetConfirm(false); toast("info","Fitur reset tersedia melalui database admin."); }

  async function handleApproveReview(id:number) {
    try {
      await apiApproveReview(id);
      await refreshReviews();
      window.dispatchEvent(new Event("reviewsUpdated"));
      toast("success","Ulasan berhasil disetujui dan akan tampil di katalog.");
    } catch (e) { toast("error", e instanceof Error ? e.message : "Gagal menyetujui ulasan."); }
  }
  async function handleDeleteReview(id:number) {
    try {
      await apiDeleteReview(id);
      await refreshReviews();
      setDeleteReviewConfirm(null);
      window.dispatchEvent(new Event("reviewsUpdated"));
      toast("success","Ulasan berhasil dihapus.");
    } catch (e) { toast("error", e instanceof Error ? e.message : "Gagal menghapus ulasan."); }
  }

  const filteredProducts = products.filter((p) =>
    [p.name,p.sku,p.category,p.material].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const filteredReviews = reviews
    .filter((r) => reviewFilter==="semua"||(reviewFilter==="pending"&&r.status==="pending")||(reviewFilter==="approved"&&r.status==="approved"))
    .filter((r) => [r.customerName,r.productName,r.comment].join(" ").toLowerCase().includes(reviewSearch.toLowerCase()))
    .sort((a,b) => new Date(b.dateAdded).getTime()-new Date(a.dateAdded).getTime());

  const pendingCount = reviews.filter((r) => r.status==="pending").length;

  return (
    <div className="min-h-screen flex" style={{ background:C.bg, fontFamily:"Poppins, sans-serif", color:C.text }}>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl pointer-events-auto"
            style={{ background:t.type==="success"?"rgba(39,199,195,0.15)":t.type==="info"?"rgba(99,102,241,0.15)":"rgba(212,24,61,0.15)",
              border:`1px solid ${t.type==="success"?"rgba(39,199,195,0.4)":t.type==="info"?"rgba(99,102,241,0.4)":"rgba(212,24,61,0.4)"}`,
              color:t.type==="success"?C.teal:t.type==="info"?"#818cf8":"#ff6b8a", backdropFilter:"blur(12px)" }}>
            {t.type==="success"?<CheckCircle2 size={16}/>:t.type==="info"?<ImagePlus size={16}/>:<AlertTriangle size={16}/>}
            {t.text}
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background:C.sidebar, borderRight:`1px solid ${C.cardBorder}`, minHeight:"100vh" }}>
        <div className="px-6 py-6 border-b" style={{ borderColor:C.cardBorder }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background:"rgba(39,199,195,0.15)", border:"1px solid rgba(39,199,195,0.3)" }}>
              <Package size={16} color={C.teal}/>
            </div>
            <div>
              <div className="text-xs font-bold tracking-widest" style={{ color:C.teal }}>ANTARA AROMA</div>
              <div className="text-xs" style={{ color:C.muted }}>Panel Admin</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background:activeMenu==="katalog"?"rgba(39,199,195,0.12)":"transparent",
              color:activeMenu==="katalog"?C.teal:C.muted,
              border:activeMenu==="katalog"?"1px solid rgba(39,199,195,0.2)":"1px solid transparent" }}
            onClick={() => setActiveMenu("katalog")}>
            <PackageSearch size={16}/> Kelola Katalog Produk
          </button>

          <button
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background:activeMenu==="ulasan"?"rgba(39,199,195,0.12)":"transparent",
              color:activeMenu==="ulasan"?C.teal:C.muted,
              border:activeMenu==="ulasan"?"1px solid rgba(39,199,195,0.2)":"1px solid transparent" }}
            onClick={() => setActiveMenu("ulasan")}>
            <MessageSquare size={16}/>
            <span className="flex-1 text-left">Kelola Ulasan</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background:"#d4183d", minWidth:"20px", textAlign:"center" }}>
                {pendingCount}
              </span>
            )}
          </button>

          <a href="/" target="_blank" rel="noopener noreferrer"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ color:C.muted }}>
            <LayoutDashboard size={16}/> Lihat Halaman Utama ↗
          </a>
        </nav>

        <div className="px-3 pb-6">
          <div className="border-t mb-4" style={{ borderColor:C.cardBorder }}/>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{ background:"rgba(212,24,61,0.1)", border:"1px solid rgba(212,24,61,0.2)", color:"#ff6b8a" }}
            onClick={handleLogout}>
            <LogOut size={16}/> Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">

        {/* ═══════════════ KATALOG ═══════════════ */}
        {activeMenu === "katalog" && (
          <>
            <div className="px-8 py-5 border-b flex items-center justify-between sticky top-0 z-20"
              style={{ background:C.bg, borderColor:C.cardBorder, backdropFilter:"blur(12px)" }}>
              <div>
                <h1 className="text-lg font-semibold" style={{ color:C.text }}>Kelola Katalog Produk</h1>
                <p className="text-xs mt-0.5" style={{ color:C.muted }}>{products.length} produk tersimpan</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-80"
                  style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${C.cardBorder}`, color:C.muted }}
                  onClick={() => setResetConfirm(true)}>
                  <RotateCcw size={13}/> Reset Default
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                  style={{ background:"linear-gradient(135deg,#27C7C3,#1fa8a5)", color:"#fff", boxShadow:"0 4px 16px rgba(39,199,195,0.3)" }}
                  onClick={openAdd}>
                  <Plus size={14}/> Tambah Produk
                </button>
              </div>
            </div>

            <div className="px-8 py-6 space-y-6">
              {/* Form */}
              {showForm && (
                <div ref={formRef} className="rounded-2xl overflow-hidden" style={{ background:C.card, border:`1px solid ${C.cardBorder}` }}>
                  <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor:C.cardBorder }}>
                    <h2 className="text-sm font-semibold" style={{ color:C.text }}>{editingProduct?"Edit Produk":"Tambah Produk Baru"}</h2>
                    <button onClick={closeForm} className="opacity-50 hover:opacity-100 transition-opacity"><X size={18} color={C.text}/></button>
                  </div>

                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Field label="Nama Produk *" span={2}><Input value={form.name} onChange={(v)=>setForm({...form,name:v})} placeholder="cth: Botol Kaca Kotak Mewah"/></Field>
                    <Field label="Kategori">
                      <Select value={form.category} onChange={(v)=>setForm({...form,category:v as Exclude<Category,"All">})} options={CATEGORIES.map((c)=>({value:c,label:c}))}/>
                    </Field>
                    <Field label="Kode Produk (SKU) *"><Input value={form.sku} onChange={(v)=>setForm({...form,sku:v})} placeholder="cth: PB-SQ-001"/></Field>
                    <Field label="Material"><Input value={form.material} onChange={(v)=>setForm({...form,material:v})} placeholder="cth: Borosilicate Glass"/></Field>
                    <Field label="Ukuran / Kapasitas (pisahkan koma)"><Input value={form.capacityStr} onChange={(v)=>setForm({...form,capacityStr:v})} placeholder="cth: 30ml, 50ml, 100ml"/></Field>
                    <Field label="Minimum Order (MOQ)"><Input value={form.moq} onChange={(v)=>setForm({...form,moq:v})} placeholder="cth: 500 pcs"/></Field>
                    <Field label="Finish / Tampilan"><Input value={form.finish} onChange={(v)=>setForm({...form,finish:v})} placeholder="cth: Bening / Buram"/></Field>

                    <Field label="Badge / Status">
                      <div className="flex gap-2">
                        <div className="flex-1"><Input value={form.badge} onChange={(v)=>setForm({...form,badge:v})} placeholder="cth: Terlaris"/></div>
                        <input type="color" value={form.badgeColor} onChange={(e)=>setForm({...form,badgeColor:e.target.value})} className="w-11 h-10 rounded-lg cursor-pointer border-0 p-0.5" style={{ background:"rgba(255,255,255,0.06)" }}/>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {BADGE_PRESETS.map((b)=>(
                          <button key={b.label} type="button" className="px-2 py-0.5 rounded-md text-xs font-medium transition-all hover:scale-105"
                            style={{ background:`${b.color}22`, border:`1px solid ${b.color}55`, color:b.color }}
                            onClick={()=>setForm({...form,badge:b.label,badgeColor:b.color})}>{b.label}</button>
                        ))}
                      </div>
                    </Field>

                    <Field label="Tanggal Ditambahkan"><Input type="date" value={form.dateAdded} onChange={(v)=>setForm({...form,dateAdded:v})}/></Field>

                    <Field label="Status Khusus" span={2}>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-sm" style={{ color:C.muted }}>
                          <input type="checkbox" checked={form.isNew} onChange={(e)=>setForm({...form,isNew:e.target.checked})} className="w-4 h-4 accent-teal-400"/>
                          Produk Baru
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none text-sm" style={{ color:C.muted }}>
                          <input type="checkbox" checked={form.isPopular} onChange={(e)=>setForm({...form,isPopular:e.target.checked})} className="w-4 h-4 accent-teal-400"/>
                          Populer
                        </label>
                      </div>
                    </Field>

                    <Field label="Deskripsi Singkat" span={2}>
                      <textarea value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} placeholder="Tulis deskripsi produk..." rows={3}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:C.text }}
                        onFocus={(e)=>(e.currentTarget.style.borderColor="rgba(39,199,195,0.5)")}
                        onBlur={(e)=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.1)")}/>
                    </Field>

                    {/* Upload Gambar */}
                    <Field label="Upload Gambar Produk" span={2}>
                      <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleFileInputChange}/>
                      {!imagePreview ? (
                        <div className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-8 gap-3 cursor-pointer transition-all"
                          style={{ borderColor:"rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.02)" }}
                          onClick={()=>fileInputRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver}
                          onDragEnter={(e)=>{(e.currentTarget as HTMLDivElement).style.borderColor="rgba(39,199,195,0.6)";}}
                          onDragLeave={(e)=>{(e.currentTarget as HTMLDivElement).style.borderColor="rgba(255,255,255,0.15)";}}>
                          {uploadLoading ? (
                            <><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor:`${C.teal} transparent ${C.teal} ${C.teal}` }}/><p className="text-xs" style={{ color:C.muted }}>Memproses gambar...</p></>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background:"rgba(39,199,195,0.12)", border:"1px solid rgba(39,199,195,0.25)" }}><Upload size={22} color={C.teal}/></div>
                              <div className="text-center">
                                <p className="text-sm font-medium" style={{ color:C.text }}>Klik atau seret gambar ke sini</p>
                                <p className="text-xs mt-1" style={{ color:C.muted }}>JPG, JPEG, PNG, WebP · Maks. {MAX_FILE_SIZE_MB}MB</p>
                              </div>
                              <button type="button" className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90" style={{ background:"rgba(39,199,195,0.15)", border:"1px solid rgba(39,199,195,0.3)", color:C.teal }}>Pilih File</button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="relative rounded-xl overflow-hidden" style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)" }}>
                          <div className="flex items-start gap-4 p-4">
                            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background:"rgba(255,255,255,0.05)" }}>
                              {imagePreview ? <img src={imagePreview} alt="Preview" className="w-full h-full object-cover"/> : <ImageOff size={22} color={C.muted}/>}
                            </div>
                            <div className="flex-1 flex flex-col justify-between h-28">
                              <div>
                                <p className="text-sm font-medium" style={{ color:C.text }}>Gambar berhasil diunggah</p>
                                <p className="text-xs mt-1" style={{ color:C.muted }}>Gambar ini akan ditampilkan di katalog produk.</p>
                              </div>
                              <div className="flex gap-2">
                                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                  style={{ background:"rgba(39,199,195,0.12)", border:"1px solid rgba(39,199,195,0.25)", color:C.teal }}
                                  onClick={()=>fileInputRef.current?.click()}>
                                  <Upload size={12}/> Ganti Gambar
                                </button>
                                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                                  style={{ background:"rgba(212,24,61,0.1)", border:"1px solid rgba(212,24,61,0.2)", color:"#ff6b8a" }} onClick={removeImage}>
                                  <Trash2 size={12}/> Hapus
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <p className="text-xs mt-2" style={{ color:C.muted }}>💡 Rating &amp; ulasan dikelola otomatis dari fitur review pelanggan.</p>
                    </Field>
                  </div>

                  <div className="px-6 py-4 border-t flex items-center justify-end gap-3" style={{ borderColor:C.cardBorder }}>
                    <button className="px-5 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                      style={{ background:"rgba(255,255,255,0.05)", color:C.muted, border:`1px solid ${C.cardBorder}` }} onClick={closeForm}>Batal</button>
                    <button className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                      style={{ background:"linear-gradient(135deg,#27C7C3,#1fa8a5)", color:"#fff", boxShadow:"0 4px 16px rgba(39,199,195,0.25)" }} onClick={handleSave}>
                      <Save size={14}/> {editingProduct?"Perbarui Produk":"Simpan Produk"}
                    </button>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:C.muted }}/>
                <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Cari produk berdasarkan nama, SKU, kategori..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background:C.card, border:`1px solid ${C.cardBorder}`, color:C.text }}
                  onFocus={(e)=>(e.currentTarget.style.borderColor="rgba(39,199,195,0.4)")}
                  onBlur={(e)=>(e.currentTarget.style.borderColor=C.cardBorder)}/>
              </div>

              {/* Product Table */}
              <div className="rounded-2xl overflow-hidden" style={{ background:C.card, border:`1px solid ${C.cardBorder}` }}>
                <div className="grid grid-cols-[2fr_1.2fr_1fr_0.7fr_0.7fr_auto] gap-4 px-5 py-3 text-xs font-semibold tracking-widest uppercase"
                  style={{ color:C.muted, background:"rgba(255,255,255,0.02)", borderBottom:`1px solid ${C.cardBorder}` }}>
                  <span>Produk</span><span>Kategori</span><span>MOQ</span><span>Rating</span><span>Badge</span><span className="text-right">Aksi</span>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="py-16 text-center" style={{ color:C.muted }}>
                    <PackageSearch size={40} className="mx-auto mb-3 opacity-30"/><p className="text-sm">Tidak ada produk ditemukan.</p>
                  </div>
                ) : filteredProducts.map((p,idx) => (
                  <div key={p.id} className="grid grid-cols-[2fr_1.2fr_1fr_0.7fr_0.7fr_auto] gap-4 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom:idx<filteredProducts.length-1?`1px solid ${C.cardBorder}`:"none" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${C.cardBorder}` }}>
                        {p.image ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).style.display="none";}}/> : <ImageOff size={14} color={C.muted}/>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color:C.text }}>{p.name}</p>
                        <p className="text-xs truncate" style={{ color:C.muted }}>{p.sku}</p>
                      </div>
                    </div>
                    <span className="text-xs truncate" style={{ color:C.muted }}>{p.category}</span>
                    <span className="text-xs" style={{ color:C.muted }}>{p.moq||"—"}</span>
                    <div className="flex items-center gap-1"><Star size={11} fill="#F59E0B" color="#F59E0B"/><span className="text-xs font-medium" style={{ color:C.text }}>{p.rating}</span></div>
                    <div>{p.badge ? (
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium" style={{ background:`${p.badgeColor??"#27C7C3"}22`, border:`1px solid ${p.badgeColor??"#27C7C3"}55`, color:p.badgeColor??"#27C7C3" }}>{p.badge}</span>
                    ) : <span style={{ color:C.muted }} className="text-xs">—</span>}
                    </div>
                    <div className="flex items-center gap-2 justify-end">
                      <button className="p-1.5 rounded-lg transition-all hover:scale-110" style={{ background:"rgba(39,199,195,0.1)", color:C.teal }} onClick={()=>openEdit(p)}><Pencil size={13}/></button>
                      <button className="p-1.5 rounded-lg transition-all hover:scale-110" style={{ background:"rgba(212,24,61,0.1)", color:"#ff6b8a" }} onClick={()=>setDeleteConfirm(p.id)}><Trash2 size={13}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ ULASAN ═══════════════ */}
        {activeMenu === "ulasan" && (
          <>
            <div className="px-8 py-5 border-b flex items-center justify-between sticky top-0 z-20"
              style={{ background:C.bg, borderColor:C.cardBorder, backdropFilter:"blur(12px)" }}>
              <div>
                <h1 className="text-lg font-semibold" style={{ color:C.text }}>Kelola Ulasan Pelanggan</h1>
                <p className="text-xs mt-0.5" style={{ color:C.muted }}>{reviews.length} total ulasan · {pendingCount} menunggu persetujuan</p>
              </div>
            </div>

            <div className="px-8 py-6 space-y-5">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label:"Total Ulasan", value:reviews.length, color:C.teal },
                  { label:"Menunggu", value:reviews.filter(r=>r.status==="pending").length, color:"#F59E0B" },
                  { label:"Disetujui", value:reviews.filter(r=>r.status==="approved").length, color:"#10B981" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-4" style={{ background:C.card, border:`1px solid ${C.cardBorder}` }}>
                    <p className="text-2xl font-bold" style={{ color:s.color, fontFamily:"Montserrat, sans-serif" }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color:C.muted }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filter tabs + search */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex rounded-xl overflow-hidden border" style={{ borderColor:C.cardBorder }}>
                  {(([["semua","Semua"],["pending","Menunggu"],["approved","Disetujui"]] as const)).map(([val,lbl]) => (
                    <button key={val} onClick={()=>setReviewFilter(val)}
                      className="px-4 py-2 text-xs font-medium transition-all"
                      style={{ background:reviewFilter===val?"rgba(39,199,195,0.15)":"rgba(255,255,255,0.02)",
                        color:reviewFilter===val?C.teal:C.muted,
                        borderRight:val!=="approved"?`1px solid ${C.cardBorder}`:"none" }}>
                      {lbl}
                      {val==="pending"&&pendingCount>0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold text-white" style={{ background:"#d4183d" }}>{pendingCount}</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:C.muted }}/>
                  <input value={reviewSearch} onChange={(e)=>setReviewSearch(e.target.value)} placeholder="Cari nama, produk, komentar..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background:C.card, border:`1px solid ${C.cardBorder}`, color:C.text }}
                    onFocus={(e)=>(e.currentTarget.style.borderColor="rgba(39,199,195,0.4)")}
                    onBlur={(e)=>(e.currentTarget.style.borderColor=C.cardBorder)}/>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-3">
                {filteredReviews.length === 0 ? (
                  <div className="py-16 text-center rounded-2xl" style={{ background:C.card, border:`1px solid ${C.cardBorder}` }}>
                    <UserCircle2 size={40} className="mx-auto mb-3 opacity-30" style={{ color:C.muted }}/>
                    <p className="text-sm" style={{ color:C.muted }}>Tidak ada ulasan ditemukan.</p>
                  </div>
                ) : filteredReviews.map((r) => {
                  const initials = r.customerName.split(" ").map((w)=>w[0]).join("").slice(0,2).toUpperCase();
                  const dateStr = new Date(r.dateAdded).toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"});
                  return (
                    <div key={r.id} className="rounded-2xl p-5 transition-all" style={{ background:C.card, border:`1px solid ${r.status==="pending"?"rgba(245,158,11,0.2)":C.cardBorder}` }}>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
                          style={{ background:`linear-gradient(135deg,${C.teal},#1a9e9a)` }}>{initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="font-semibold text-sm" style={{ color:C.text }}>{r.customerName}</p>
                              <p className="text-xs mt-0.5" style={{ color:C.muted }}>
                                untuk <span style={{ color:C.teal }}>{r.productName}</span>
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {r.status === "pending" ? (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                                  style={{ background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", color:"#F59E0B" }}>
                                  <Clock size={11}/> Menunggu
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                                  style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#10B981" }}>
                                  <CheckCheck size={11}/> Disetujui
                                </span>
                              )}
                              <span className="text-xs" style={{ color:C.muted }}>{dateStr}</span>
                            </div>
                          </div>
                          <div className="flex gap-0.5 mt-2">
                            {Array.from({length:5}).map((_,i) => (
                              <Star key={i} size={13} className={i<r.rating?"text-amber-400 fill-amber-400":"text-gray-600 fill-gray-600"}/>
                            ))}
                          </div>
                          <p className="text-sm mt-2" style={{ color:"rgba(232,232,240,0.75)", lineHeight:1.7 }}>{r.comment}</p>
                          <div className="flex gap-2 mt-3">
                            {r.status === "pending" && (
                              <button onClick={()=>handleApproveReview(r.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                                style={{ background:"rgba(39,199,195,0.15)", border:"1px solid rgba(39,199,195,0.3)", color:C.teal }}>
                                <CheckCircle2 size={12}/> Setujui
                              </button>
                            )}
                            <button onClick={()=>setDeleteReviewConfirm(r.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                              style={{ background:"rgba(212,24,61,0.1)", border:"1px solid rgba(212,24,61,0.2)", color:"#ff6b8a" }}>
                              <Trash2 size={12}/> Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Delete product modal */}
      {deleteConfirm !== null && (
        <Modal onClose={()=>setDeleteConfirm(null)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(212,24,61,0.15)" }}><Trash2 size={18} color="#ff6b8a"/></div>
            <div>
              <h3 className="font-semibold" style={{ color:C.text }}>Hapus Produk?</h3>
              <p className="text-xs mt-0.5" style={{ color:C.muted }}>
                Produk <strong style={{ color:C.text }}>{products.find((p)=>p.id===deleteConfirm)?.name}</strong> akan dihapus secara permanen.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background:"rgba(255,255,255,0.06)", color:C.muted, border:`1px solid ${C.cardBorder}` }} onClick={()=>setDeleteConfirm(null)}>Batal</button>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background:"rgba(212,24,61,0.8)", color:"#fff" }} onClick={()=>handleDelete(deleteConfirm)}>Hapus</button>
          </div>
        </Modal>
      )}

      {/* Delete review modal */}
      {deleteReviewConfirm !== null && (
        <Modal onClose={()=>setDeleteReviewConfirm(null)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(212,24,61,0.15)" }}><Trash2 size={18} color="#ff6b8a"/></div>
            <div>
              <h3 className="font-semibold" style={{ color:C.text }}>Hapus Ulasan?</h3>
              <p className="text-xs mt-0.5" style={{ color:C.muted }}>Ulasan ini akan dihapus secara permanen dan tidak bisa dikembalikan.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background:"rgba(255,255,255,0.06)", color:C.muted, border:`1px solid ${C.cardBorder}` }} onClick={()=>setDeleteReviewConfirm(null)}>Batal</button>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ background:"rgba(212,24,61,0.8)", color:"#fff" }} onClick={()=>handleDeleteReview(deleteReviewConfirm)}>Hapus</button>
          </div>
        </Modal>
      )}

      {/* Reset confirm */}
      {resetConfirm && (
        <Modal onClose={()=>setResetConfirm(false)}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:"rgba(212,24,61,0.15)" }}><RotateCcw size={18} color="#ff6b8a"/></div>
            <div>
              <h3 className="font-semibold" style={{ color:C.text }}>Reset Katalog?</h3>
              <p className="text-xs mt-0.5" style={{ color:C.muted }}>Fitur reset tidak tersedia via API. Silakan gunakan database admin secara langsung.</p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background:"rgba(255,255,255,0.06)", color:C.muted, border:`1px solid ${C.cardBorder}` }} onClick={()=>setResetConfirm(false)}>Tutup</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({ label,children,span=1 }: { label:string; children:React.ReactNode; span?:1|2 }) {
  return (
    <div className={span===2?"md:col-span-2":""}>
      <label className="block text-xs font-medium mb-1.5 tracking-wide" style={{ color:"#7777a0" }}>{label}</label>
      {children}
    </div>
  );
}

function Input({ value,onChange,placeholder="",type="text" }: { value:string; onChange:(v:string)=>void; placeholder?:string; type?:string }) {
  return (
    <input type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
      style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e8e8f0" }}
      onFocus={(e)=>(e.currentTarget.style.borderColor="rgba(39,199,195,0.5)")}
      onBlur={(e)=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.1)")}/>
  );
}

function Select({ value,onChange,options }: { value:string; onChange:(v:string)=>void; options:{value:string;label:string}[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none appearance-none transition-all"
        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", color:"#e8e8f0" }}
        onFocus={(e)=>(e.currentTarget.style.borderColor="rgba(39,199,195,0.5)")}
        onBlur={(e)=>(e.currentTarget.style.borderColor="rgba(255,255,255,0.1)")}>
        {options.map((o)=>(<option key={o.value} value={o.value} style={{ background:"#13131f" }}>{o.label}</option>))}
      </select>
      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color:"#7777a0" }}/>
    </div>
  );
}

function Modal({ children,onClose }: { children:React.ReactNode; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(4px)" }} onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background:"#13131f", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 32px 64px rgba(0,0,0,0.6)" }} onClick={(e)=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
