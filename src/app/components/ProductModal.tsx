import { X, Star, Package, Layers, Ruler, MessageCircle, ChevronRight } from "lucide-react";
import { type Product } from "../data/catalogData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const waMessage = encodeURIComponent(
    `Halo ANTARA AROMA, saya tertarik dengan produk *${product.name}* (SKU: ${product.sku}). Bisa minta info harga dan sampel?`
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Image */}
          <div className="relative">
            <div className="h-72 md:h-full min-h-[280px] rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none overflow-hidden bg-gray-50">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.badge && (
              <span
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold text-white shadow"
                style={{ background: product.badgeColor || "#27C7C3" }}
              >
                {product.badge}
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-7 flex flex-col">
            {/* Category breadcrumb */}
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-[#27C7C3] text-xs font-medium">{product.category}</span>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="text-gray-400 text-xs">{product.sku}</span>
            </div>

            {/* Name */}
            <h2
              className="text-gray-900 text-xl mb-2"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
            >
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                  />
                ))}
              </div>
              <span className="text-gray-700 text-xs font-medium">{product.rating}</span>
              <span className="text-gray-400 text-xs">({product.reviewCount} ulasan)</span>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm mb-5" style={{ lineHeight: 1.75 }}>
              {product.description}
            </p>

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <SpecItem icon={<Layers size={14} />} label="Material" value={product.material} />
              <SpecItem icon={<Ruler size={14} />} label="Kapasitas" value={product.capacity.join(", ")} />
              <SpecItem icon={<Package size={14} />} label="MOQ" value={product.moq} />
              <SpecItem icon={<Package size={14} />} label="Finishing" value={product.finish} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mt-auto">
              <a
                href={`https://wa.me/6281234567890?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#27C7C3] text-white text-sm font-semibold hover:bg-[#1fb3af] transition-all shadow-lg shadow-[#27C7C3]/25"
              >
                <MessageCircle size={15} />
                Request Quote
              </a>
              <a
                href={`https://wa.me/6281234567890?text=${waMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#27C7C3]/30 hover:text-[#27C7C3] transition-all"
              >
                Sampel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-xl bg-gray-50">
      <div className="flex items-center gap-1.5 text-[#27C7C3] mb-0.5">{icon}</div>
      <span className="text-gray-400 text-xs">{label}</span>
      <span className="text-gray-800 text-xs font-medium">{value}</span>
    </div>
  );
}
