import { useState } from "react";
import { MapPin, Package, CheckCircle2, ChevronRight } from "lucide-react";

// ─── Data distribusi (ganti dengan API call jika diperlukan) ───────────────
export const distributionData = [
  {
    id: 1,
    city: "Jakarta",
    province: "DKI Jakarta",
    categories: ["Botol Parfum", "Kemasan Kosmetik", "Kemasan Premium"],
    status: "Aktif",
    totalOrders: "320+ Klien",
    // koordinat SVG relatif terhadap viewBox peta (lihat di bawah)
    x: 298,
    y: 370,
  },
  {
    id: 2,
    city: "Bandung",
    province: "Jawa Barat",
    categories: ["Botol Parfum", "Kemasan Skincare"],
    status: "Aktif",
    totalOrders: "180+ Klien",
    x: 318,
    y: 385,
  },
  {
    id: 3,
    city: "Semarang",
    province: "Jawa Tengah",
    categories: ["Kemasan Kosmetik", "Vial & Ampul"],
    status: "Aktif",
    totalOrders: "140+ Klien",
    x: 358,
    y: 375,
  },
  {
    id: 4,
    city: "Yogyakarta",
    province: "DIY",
    categories: ["Botol Parfum", "Kemasan Artisanal"],
    status: "Aktif",
    totalOrders: "95+ Klien",
    x: 348,
    y: 385,
  },
  {
    id: 5,
    city: "Surabaya",
    province: "Jawa Timur",
    categories: ["Botol Parfum", "Kemasan Kosmetik", "Kemasan Industri"],
    status: "Aktif",
    totalOrders: "210+ Klien",
    x: 395,
    y: 375,
  },
  {
    id: 6,
    city: "Bali",
    province: "Bali",
    categories: ["Kemasan Premium", "Botol Parfum", "Kemasan Spa"],
    status: "Aktif",
    totalOrders: "120+ Klien",
    x: 430,
    y: 395,
  },
  {
    id: 7,
    city: "Medan",
    province: "Sumatera Utara",
    categories: ["Botol Parfum", "Kemasan Kosmetik"],
    status: "Aktif",
    totalOrders: "160+ Klien",
    x: 175,
    y: 258,
  },
  {
    id: 8,
    city: "Makassar",
    province: "Sulawesi Selatan",
    categories: ["Kemasan Kosmetik", "Botol Parfum"],
    status: "Aktif",
    totalOrders: "110+ Klien",
    x: 490,
    y: 370,
  },
];

// ─── Peta SVG Indonesia (simplified path, akurat secara geografis) ──────────
// ViewBox: 0 0 750 460
const INDONESIA_PATHS = [
  // Sumatera
  {
    id: "sumatra",
    d: "M100,210 L115,195 L130,185 L150,180 L168,175 L185,172 L205,170 L220,168 L235,172 L248,180 L258,192 L265,205 L268,220 L265,238 L258,252 L248,265 L235,278 L222,288 L210,296 L198,300 L185,298 L172,292 L160,282 L148,270 L136,255 L122,238 L110,224 Z",
    label: "Sumatera",
  },
  // Jawa
  {
    id: "java",
    d: "M268,358 L278,350 L295,345 L312,342 L330,342 L348,344 L365,347 L382,350 L400,352 L415,352 L430,348 L440,342 L445,352 L440,360 L430,365 L415,368 L400,370 L382,370 L365,368 L348,366 L330,368 L312,370 L295,370 L278,368 L268,362 Z",
    label: "Jawa",
  },
  // Kalimantan
  {
    id: "kalimantan",
    d: "M340,190 L358,178 L375,168 L395,160 L415,155 L440,152 L462,153 L482,158 L498,168 L508,182 L512,198 L510,215 L505,232 L496,248 L483,260 L468,270 L452,276 L435,278 L418,276 L402,270 L388,260 L375,248 L362,234 L352,218 L345,204 Z",
    label: "Kalimantan",
  },
  // Sulawesi
  {
    id: "sulawesi",
    d: "M490,210 L502,200 L510,215 L512,232 L508,248 L500,262 L490,274 L480,285 L475,298 L478,310 L485,318 L490,308 L496,298 L502,288 L508,278 L512,265 L515,252 L518,240 L515,228 L508,218 L500,208 Z M482,290 L475,298 L470,310 L468,322 L472,335 L480,342 L488,340 L492,330 L490,318 L485,305 Z",
    label: "Sulawesi",
  },
  // Papua (simplified)
  {
    id: "papua",
    d: "M575,250 L592,238 L612,232 L635,230 L658,232 L678,238 L692,250 L700,265 L698,282 L690,296 L676,308 L658,315 L640,318 L622,315 L605,308 L592,296 L582,282 L576,265 Z",
    label: "Papua",
  },
  // Bali & Lombok (kecil)
  {
    id: "bali",
    d: "M445,388 L452,383 L460,382 L468,385 L472,392 L468,398 L460,400 L452,398 L445,394 Z",
    label: "Bali",
  },
  // Nusa Tenggara
  {
    id: "ntt",
    d: "M472,390 L482,385 L495,382 L510,382 L522,386 L528,394 L522,402 L508,405 L494,403 L480,400 Z M530,385 L545,382 L555,386 L558,394 L550,400 L538,400 L530,394 Z",
    label: "NTT",
  },
  // Maluku
  {
    id: "maluku",
    d: "M542,255 L550,248 L558,252 L560,262 L555,272 L548,275 L540,270 L538,260 Z M558,235 L565,228 L572,232 L572,242 L565,248 L558,244 Z",
    label: "Maluku",
  },
];

type Distribution = (typeof distributionData)[0];

export function DistributionArea() {
  const [activeCity, setActiveCity] = useState<Distribution | null>(null);
  const [hoveredCity, setHoveredCity] = useState<number | null>(null);

  return (
    <section
      id="distribusi"
      className="py-24 bg-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── Header ── */}
        <div className="text-center mb-16">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Jangkauan Kami
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Area{" "}
            <span className="text-[#27C7C3]">Distribusi</span>
          </h2>
          <p
            className="text-gray-500 max-w-2xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            ANTARA AROMA melayani pengiriman ke berbagai kota besar di seluruh Indonesia.
            Klik titik distribusi untuk melihat detail layanan di setiap wilayah.
          </p>
        </div>

        {/* ── Main layout: Map + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* ── MAP ── */}
          <div className="flex-1 min-w-0">
            <div
              className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-xl bg-gradient-to-br from-[#e8f9f9] via-[#f0fdfd] to-[#e6f4f4]"
              style={{ minHeight: 320 }}
            >
              {/* Decorative grid */}
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, #27C7C320 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />

              <svg
                viewBox="0 0 750 460"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto relative z-10"
                style={{ display: "block" }}
              >
                {/* Ocean background */}
                <rect width="750" height="460" fill="transparent" />

                {/* Indonesia pulau */}
                {INDONESIA_PATHS.map((p) => (
                  <path
                    key={p.id}
                    d={p.d}
                    fill="#c8ede9"
                    stroke="#27C7C3"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    opacity="0.85"
                  />
                ))}

                {/* Connection lines from Jakarta to all cities */}
                {distributionData
                  .filter((d) => d.city !== "Jakarta")
                  .map((d) => {
                    const jakarta = distributionData[0];
                    return (
                      <line
                        key={`line-${d.id}`}
                        x1={jakarta.x}
                        y1={jakarta.y}
                        x2={d.x}
                        y2={d.y}
                        stroke="#27C7C3"
                        strokeWidth="0.8"
                        strokeDasharray="4 4"
                        opacity={
                          activeCity?.id === d.id || hoveredCity === d.id
                            ? 0.6
                            : 0.2
                        }
                        style={{ transition: "opacity 0.3s" }}
                      />
                    );
                  })}

                {/* Distribution markers */}
                {distributionData.map((d) => {
                  const isActive = activeCity?.id === d.id;
                  const isHovered = hoveredCity === d.id;
                  const highlight = isActive || isHovered;
                  return (
                    <g
                      key={d.id}
                      transform={`translate(${d.x}, ${d.y})`}
                      onClick={() =>
                        setActiveCity(isActive ? null : d)
                      }
                      onMouseEnter={() => setHoveredCity(d.id)}
                      onMouseLeave={() => setHoveredCity(null)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* Pulse ring */}
                      {highlight && (
                        <circle
                          r="18"
                          fill="#27C7C3"
                          opacity="0.15"
                          style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                        />
                      )}
                      {/* Outer ring */}
                      <circle
                        r={highlight ? 11 : 9}
                        fill={highlight ? "#27C7C3" : "#fff"}
                        stroke="#27C7C3"
                        strokeWidth={highlight ? 0 : 2.5}
                        style={{ transition: "all 0.25s ease" }}
                      />
                      {/* Inner dot */}
                      <circle
                        r={highlight ? 5 : 4}
                        fill={highlight ? "#fff" : "#27C7C3"}
                        style={{ transition: "all 0.25s ease" }}
                      />
                      {/* City label */}
                      <text
                        y={-16}
                        textAnchor="middle"
                        fontSize={highlight ? "8.5" : "7.5"}
                        fontWeight={highlight ? "700" : "500"}
                        fill={highlight ? "#27C7C3" : "#374151"}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          transition: "all 0.25s ease",
                          userSelect: "none",
                          paintOrder: "stroke",
                          stroke: "white",
                          strokeWidth: "3",
                          strokeLinejoin: "round",
                        }}
                      >
                        {d.city}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip popup on active city */}
              {activeCity && (
                <div
                  className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white rounded-2xl shadow-2xl border border-[#27C7C3]/20 p-5 z-20"
                  style={{ animation: "fadeSlideUp 0.25s ease" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p
                        className="text-xs font-semibold tracking-widest uppercase text-[#27C7C3] mb-0.5"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {activeCity.province}
                      </p>
                      <h4
                        className="text-lg text-gray-900"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {activeCity.city}
                      </h4>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {activeCity.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {activeCity.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-1 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-medium"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500" style={{ fontFamily: "Poppins, sans-serif" }}>
                    <Package size={13} className="text-[#27C7C3]" />
                    {activeCity.totalOrders} aktif
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md">
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C7C3]" />
                <span
                  className="text-xs text-gray-600 font-medium"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Titik Distribusi Aktif
                </span>
              </div>
            </div>

            {/* Hint text */}
            <p
              className="text-center text-xs text-gray-400 mt-3"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Klik pada titik marker untuk melihat detail distribusi
            </p>
          </div>

          {/* ── SIDEBAR LIST ── */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
                <h3
                  className="text-sm font-semibold text-gray-900"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Lokasi Distribusi
                </h3>
                <span
                  className="text-xs text-[#27C7C3] font-semibold px-2.5 py-1 rounded-full bg-[#27C7C3]/10"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {distributionData.length} Kota
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                {distributionData.map((d) => {
                  const isActive = activeCity?.id === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setActiveCity(isActive ? null : d)}
                      className={`w-full text-left px-5 py-4 flex items-start gap-3.5 transition-all duration-200 ${
                        isActive
                          ? "bg-[#27C7C3]/8 border-l-4 border-[#27C7C3]"
                          : "bg-white hover:bg-[#27C7C3]/5 border-l-4 border-transparent"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive
                            ? "bg-[#27C7C3] text-white"
                            : "bg-[#27C7C3]/10 text-[#27C7C3]"
                        }`}
                      >
                        <MapPin size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isActive ? "text-[#27C7C3]" : "text-gray-900"
                            }`}
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {d.city}
                          </p>
                          <span className="flex items-center gap-1 ml-2 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span
                              className="text-xs text-emerald-600 font-medium"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {d.status}
                            </span>
                          </span>
                        </div>
                        <p
                          className="text-xs text-gray-400 mb-2 truncate"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {d.province}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {d.categories.slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {cat}
                            </span>
                          ))}
                          {d.categories.length > 2 && (
                            <span
                              className="px-2 py-0.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-[10px] font-medium"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              +{d.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`mt-2 shrink-0 transition-colors ${
                          isActive ? "text-[#27C7C3]" : "text-gray-300"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA card */}
            <div
              className="mt-4 rounded-3xl p-5 text-center"
              style={{ background: "linear-gradient(135deg, #27C7C3, #1aa8a5)" }}
            >
              <CheckCircle2 size={28} className="text-white/80 mx-auto mb-3" />
              <p
                className="text-white font-semibold text-sm mb-1"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Belum ada di kotamu?
              </p>
              <p
                className="text-white/75 text-xs mb-4"
                style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.7 }}
              >
                Kami melayani pengiriman ke seluruh Indonesia. Hubungi kami untuk info lebih lanjut.
              </p>
              <a
                href="#contact"
                className="inline-block px-5 py-2.5 rounded-full bg-white text-[#27C7C3] text-xs font-bold hover:bg-gray-50 transition-all shadow-md hover:scale-105"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Hubungi Kami →
              </a>
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { value: "8+", label: "Kota Distribusi", sub: "Di seluruh Indonesia" },
            { value: "900+", label: "Klien Aktif", sub: "Dari berbagai kota" },
            { value: "3–7 Hari", label: "Estimasi Kirim", sub: "Standar pengiriman" },
            { value: "100%", label: "Terverifikasi", sub: "Setiap pengiriman" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#27C7C3]/30 hover:bg-[#27C7C3]/5 transition-all duration-300 text-center"
            >
              <div
                className="text-3xl text-[#27C7C3] mb-2 group-hover:scale-110 transition-transform duration-300"
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
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.6); opacity: 0.05; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
