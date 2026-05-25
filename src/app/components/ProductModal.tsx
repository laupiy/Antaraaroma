import { useState, useEffect, useRef } from "react";
import {
  X, Star, Package, Layers, Ruler, MessageCircle, ChevronRight,
  Send, CheckCircle2, Clock, UserCircle2, MessageSquare,
} from "lucide-react";
import { type Product } from "../data/catalogData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { addReview, getApprovedReviewsByProductId, type Review } from "../utils/storage";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const TEAL = "#27C7C3";

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const labels = ["", "Buruk", "Kurang", "Cukup", "Bagus", "Sangat Bagus"];
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 focus:outline-none">
          <Star size={26} className={n <= (hovered || value) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
        </button>
      ))}
      {value > 0 && <span className="ml-2 text-sm text-gray-500 self-center">{labels[value]}</span>}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.customerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const dateFormatted = new Date(review.dateAdded).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
        style={{ background: `linear-gradient(135deg, ${TEAL}, #1a9e9a)` }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-gray-900 text-sm font-semibold">{review.customerName}</span>
          <span className="text-gray-400 text-xs flex-shrink-0">{dateFormatted}</span>
        </div>
        <div className="flex gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={11} className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
          ))}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
      </div>
    </div>
  );
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const waMessage = encodeURIComponent(
    `Halo ANTARA AROMA, saya tertarik dengan produk *${product.name}* (SKU: ${product.sku}). Bisa minta info harga dan sampel?`
  );

  const [approvedReviews, setApprovedReviews] = useState<Review[]>([]);

  function loadReviews() {
    setApprovedReviews(getApprovedReviewsByProductId(product.id));
  }

  useEffect(() => {
    loadReviews();
    // Refresh otomatis saat review disetujui atau dihapus dari admin
    window.addEventListener("reviewsUpdated", loadReviews);
    return () => window.removeEventListener("reviewsUpdated", loadReviews);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Rating dihitung murni dari review approved — tidak memakai angka statis produk
  const ratingSummary = approvedReviews.length > 0
    ? { rating: Math.round((approvedReviews.reduce((s, r) => s + r.rating, 0) / approvedReviews.length) * 10) / 10, reviewCount: approvedReviews.length }
    : { rating: 0, reviewCount: 0 };

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [formError, setFormError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  function handleSubmitReview() {
    if (!reviewName.trim()) { setFormError("Nama tidak boleh kosong."); return; }
    if (reviewRating === 0) { setFormError("Pilih rating terlebih dahulu."); return; }
    if (!reviewComment.trim() || reviewComment.trim().length < 10) { setFormError("Komentar minimal 10 karakter."); return; }
    setFormError("");
    setSubmitting(true);
    setTimeout(() => {
      addReview({
        productId: product.id, productName: product.name,
        customerName: reviewName.trim(), rating: reviewRating,
        comment: reviewComment.trim(), status: "pending",
        dateAdded: new Date().toISOString(),
      });
      setSubmitSuccess(true);
      setSubmitting(false);
      setReviewName(""); setReviewRating(0); setReviewComment("");
    }, 500);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} style={{ fontFamily: "Poppins, sans-serif" }}>

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
          <X size={16} />
        </button>

        {/* Product info */}
        <div className="grid md:grid-cols-2">
          <div className="relative">
            <div className="h-72 md:h-full min-h-[280px] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden bg-gray-50">
              <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {product.badge && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white shadow"
                style={{ background: product.badgeColor || TEAL }}>
                {product.badge}
              </span>
            )}
          </div>

          <div className="p-7 flex flex-col">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-xs font-medium" style={{ color: TEAL }}>{product.category}</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-gray-400 text-xs">{product.sku}</span>
            </div>
            <h2 className="text-gray-900 text-xl mb-2" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}>
              {product.name}
            </h2>
            {/* Rating — computed */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13}
                    className={i < Math.floor(ratingSummary.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              {ratingSummary.reviewCount > 0 ? (
                <>
                  <span className="text-gray-700 text-xs font-medium">{ratingSummary.rating}</span>
                  <span className="text-gray-400 text-xs">({ratingSummary.reviewCount} ulasan)</span>
                </>
              ) : (
                <span className="text-gray-400 text-xs">Belum ada ulasan</span>
              )}
            </div>
            <p className="text-gray-500 text-sm mb-5" style={{ lineHeight: 1.75 }}>{product.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <SpecItem icon={<Layers size={14} />} label="Material" value={product.material} />
              <SpecItem icon={<Ruler size={14} />} label="Kapasitas" value={product.capacity.join(", ")} />
              <SpecItem icon={<Package size={14} />} label="MOQ" value={product.moq} />
              <SpecItem icon={<Package size={14} />} label="Finishing" value={product.finish} />
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs">#{tag}</span>
              ))}
            </div>
            <div className="flex gap-3 mt-auto">
              <a href={`https://wa.me/6281234567890?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all"
                style={{ background: TEAL, boxShadow: `0 8px 24px ${TEAL}40` }}>
                <MessageCircle size={15} /> Request Quote
              </a>
              <a href={`https://wa.me/6281234567890?text=${waMessage}`} target="_blank" rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:text-[#27C7C3] transition-all">
                Sampel
              </a>
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="border-t border-gray-100 px-7 pb-8 pt-6">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={18} style={{ color: TEAL }} />
            <h3 className="text-gray-900 font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Ulasan Pelanggan
            </h3>
            {approvedReviews.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: TEAL }}>
                {approvedReviews.length}
              </span>
            )}
          </div>

          {/* Review list */}
          {approvedReviews.length === 0 ? (
            <div className="text-center py-8 mb-6 rounded-2xl bg-gray-50">
              <UserCircle2 size={36} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-400 text-sm">Belum ada ulasan untuk produk ini.</p>
              <p className="text-gray-300 text-xs mt-1">Jadilah yang pertama memberikan ulasan!</p>
            </div>
          ) : (
            <div className="mb-8">
              {/* Rating summary */}
              <div className="flex items-center gap-5 p-4 rounded-2xl mb-4"
                style={{ background: `${TEAL}0d`, border: `1px solid ${TEAL}20` }}>
                <div className="text-center flex-shrink-0">
                  <div className="text-4xl font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: TEAL }}>
                    {ratingSummary.rating}
                  </div>
                  <div className="flex gap-0.5 justify-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11}
                        className={i < Math.round(ratingSummary.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{ratingSummary.reviewCount} ulasan</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = approvedReviews.filter((r) => r.rating === star).length;
                    const pct = approvedReviews.length > 0 ? (count / approvedReviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 w-3">{star}</span>
                        <Star size={9} className="text-amber-400 fill-amber-400 flex-shrink-0" />
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: TEAL }} />
                        </div>
                        <span className="text-xs text-gray-400 w-4 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* Review cards */}
              <div>
                {approvedReviews.slice().sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
                  .map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            </div>
          )}

          {/* ── Form Ulasan ── */}
          <div ref={formRef}>
            <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg,#f8fffe,#f0fffe)", border: `1px solid ${TEAL}25` }}>
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-gray-900"
                style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem" }}>
                <Star size={15} style={{ color: TEAL }} className="fill-current" />
                Tulis Ulasan Kamu
              </h4>

              {submitSuccess ? (
                <div className="text-center py-5">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${TEAL}15` }}>
                    <CheckCircle2 size={24} style={{ color: TEAL }} />
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Ulasan Berhasil Dikirim!</p>
                  <p className="text-gray-500 text-sm">Terima kasih atas ulasan kamu.</p>
                  <div className="flex items-center justify-center gap-1.5 text-amber-600 text-xs mt-3">
                    <Clock size={13} />
                    <span>Menunggu persetujuan admin sebelum ditampilkan.</span>
                  </div>
                  <button onClick={() => setSubmitSuccess(false)} className="mt-4 text-xs underline" style={{ color: TEAL }}>
                    Tulis ulasan lain
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Nama */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Kamu *</label>
                    <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)}
                      placeholder="cth: Budi Santoso" maxLength={80}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white transition-all"
                      style={{ border: `1px solid ${reviewName ? TEAL + "60" : "#e5e7eb"}`, color: "#111" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = `${TEAL}80`)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = reviewName ? `${TEAL}60` : "#e5e7eb")} />
                  </div>
                  {/* Rating */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Rating *</label>
                    <StarSelector value={reviewRating} onChange={setReviewRating} />
                  </div>
                  {/* Komentar */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">Komentar *</label>
                    <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Ceritakan pengalamanmu dengan produk ini..." rows={3} maxLength={500}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-white resize-none transition-all"
                      style={{ border: `1px solid ${reviewComment ? TEAL + "60" : "#e5e7eb"}`, color: "#111" }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = `${TEAL}80`)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = reviewComment ? `${TEAL}60` : "#e5e7eb")} />
                    <p className="text-right text-xs text-gray-300 mt-1">{reviewComment.length}/500</p>
                  </div>
                  {formError && <p className="text-red-500 text-xs flex items-center gap-1.5"><span>⚠</span> {formError}</p>}
                  <button onClick={handleSubmitReview} disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg,${TEAL},#1fa8a5)`, boxShadow: `0 4px 16px ${TEAL}35` }}>
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Mengirim...</>
                    ) : (
                      <><Send size={14} />Kirim Ulasan</>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    Ulasan akan ditampilkan setelah disetujui admin.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-gray-50">
      <div className="flex items-center gap-1.5 mb-0.5" style={{ color: TEAL }}>{icon}</div>
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-gray-800 text-xs font-medium">{value}</span>
    </div>
  );
}
