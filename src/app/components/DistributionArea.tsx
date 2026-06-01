// src/app/components/DistributionArea.tsx
// Peta distribusi interaktif — data dari GET /api/distribution

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, CheckCircle2, ChevronRight, Navigation2 } from "lucide-react";
import { apiGetDistribution, type ApiDistribution } from "../utils/api";

// ─── Fix Leaflet default icon di Vite ────────────────────────────────────────
const DEFAULT_ICON = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DEFAULT_ICON;

function createPinIcon(isActive: boolean): L.DivIcon {
  const size = isActive ? 40 : 34;
  const color = isActive ? "#1aa8a5" : "#27C7C3";
  const shadow = isActive
    ? "drop-shadow(0 4px 12px rgba(27,168,165,0.55))"
    : "drop-shadow(0 3px 7px rgba(39,199,195,0.35))";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${Math.round(size * 1.25)}" viewBox="0 0 40 50">
      <defs>
        <radialGradient id="pinGrad${isActive ? "A" : "B"}" cx="38%" cy="30%" r="65%">
          <stop offset="0%" stop-color="${isActive ? "#3dd9d5" : "#4de8e4"}"/>
          <stop offset="100%" stop-color="${color}"/>
        </radialGradient>
      </defs>
      <path d="M20 2 C10.6 2 3 9.6 3 19 C3 30.2 20 48 20 48 C20 48 37 30.2 37 19 C37 9.6 29.4 2 20 2Z"
        fill="url(#pinGrad${isActive ? "A" : "B"})"
        stroke="rgba(255,255,255,0.45)" stroke-width="1.5"/>
      <circle cx="20" cy="19" r="8" fill="rgba(255,255,255,0.25)"/>
      <circle cx="20" cy="19" r="4.5" fill="white" opacity="0.95"/>
    </svg>
  `;
  return L.divIcon({
    className: "",
    html: `<div style="filter:${shadow};transition:all 0.25s ease;transform:${isActive ? "scale(1.15)" : "scale(1)"}">${svg}</div>`,
    iconSize: [size, Math.round(size * 1.25)],
    iconAnchor: [size / 2, Math.round(size * 1.25)],
    popupAnchor: [0, -Math.round(size * 1.25) - 4],
  });
}

type Distribution = ApiDistribution;

function MapFlyController({ target }: { target: Distribution | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 10, { duration: 1.2, easeLinearity: 0.3 });
    }
  }, [target, map]);
  return null;
}

function CityMarker({
  point, isActive, onClick,
}: {
  point: Distribution;
  isActive: boolean;
  onClick: () => void;
}) {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isActive]);

  const totalOrders = point.totalOrders ?? point.total_orders ?? "";

  return (
    <Marker
      ref={markerRef}
      position={[point.lat, point.lng]}
      icon={createPinIcon(isActive)}
      eventHandlers={{ click: onClick }}
    >
      <Popup className="antara-popup" closeButton={true} maxWidth={260} minWidth={230}>
        <div className="antara-popup-inner">
          <div className="antara-popup-header">
            <div>
              <span className="antara-popup-province">{point.province}</span>
              <h4 className="antara-popup-city">{point.city}</h4>
            </div>
            <span className="antara-popup-status">
              <span className="antara-popup-dot" />
              {point.status}
            </span>
          </div>
          <div className="antara-popup-cats">
            {point.categories.map((cat) => (
              <span key={cat} className="antara-popup-cat">{cat}</span>
            ))}
          </div>
          <div className="antara-popup-orders">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#27C7C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span>{totalOrders} aktif</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

// ─── Komponen utama ───────────────────────────────────────────────────────────
export function DistributionArea() {
  const [distributionData, setDistributionData] = useState<Distribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState<Distribution | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    apiGetDistribution()
      .then((data) => setDistributionData(data))
      .catch((err) => console.error("Failed to load distribution:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSidebarClick = (point: Distribution) => {
    setActiveCity((prev) => (prev?.id === point.id ? null : point));
  };

  return (
    <section id="distribusi" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
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
            Klik marker atau pilih kota dari daftar untuk melihat detail layanan.
          </p>
        </div>

        {/* Map + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* MAP */}
          <div className="flex-1 min-w-0">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
              style={{ height: 500 }}
            >
              {isMounted && !loading ? (
                <MapContainer
                  center={[-2.5, 118.0]}
                  zoom={5}
                  scrollWheelZoom={true}
                  style={{ height: "100%", width: "100%", borderRadius: "1.5rem" }}
                  zoomControl={true}
                  attributionControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    maxZoom={19}
                  />
                  <MapFlyController target={activeCity} />
                  {distributionData.map((point) => (
                    <CityMarker
                      key={point.id}
                      point={point}
                      isActive={activeCity?.id === point.id}
                      onClick={() => handleSidebarClick(point)}
                    />
                  ))}
                </MapContainer>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#e8f9f9] to-[#f0fdfd] flex items-center justify-center rounded-3xl">
                  <div className="flex flex-col items-center gap-3 text-[#27C7C3]">
                    <Navigation2 size={32} className="animate-pulse" />
                    <span className="text-sm font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                      {loading ? "Memuat data…" : "Memuat peta…"}
                    </span>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="absolute top-4 left-4 z-[1000] flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md pointer-events-none">
                <span className="w-2.5 h-2.5 rounded-full bg-[#27C7C3]" />
                <span className="text-xs text-gray-600 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Titik Distribusi Aktif
                </span>
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-3" style={{ fontFamily: "Poppins, sans-serif" }}>
              Klik marker pada peta atau pilih kota di daftar untuk detail distribusi
            </p>
          </div>

          {/* SIDEBAR */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-3xl border border-gray-100 bg-gray-50 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Lokasi Distribusi
                </h3>
                <span className="text-xs text-[#27C7C3] font-semibold px-2.5 py-1 rounded-full bg-[#27C7C3]/10" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {distributionData.length} Kota
                </span>
              </div>

              <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-5 py-4 bg-white animate-pulse flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gray-100 shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-2 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))
                ) : distributionData.map((point) => {
                  const isActive = activeCity?.id === point.id;
                  return (
                    <button
                      key={point.id}
                      onClick={() => handleSidebarClick(point)}
                      className={`w-full text-left px-5 py-4 flex items-start gap-3.5 transition-all duration-200 ${
                        isActive
                          ? "bg-[#27C7C3]/8 border-l-4 border-[#27C7C3]"
                          : "bg-white hover:bg-[#27C7C3]/5 border-l-4 border-transparent"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? "bg-[#27C7C3] text-white" : "bg-[#27C7C3]/10 text-[#27C7C3]"
                        }`}
                      >
                        <MapPin size={15} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`text-sm font-semibold truncate ${isActive ? "text-[#27C7C3]" : "text-gray-900"}`}
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {point.city}
                          </p>
                          <span className="flex items-center gap-1 ml-2 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="text-xs text-emerald-600 font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                              {point.status}
                            </span>
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-2 truncate" style={{ fontFamily: "Poppins, sans-serif" }}>
                          {point.province}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {point.categories.slice(0, 2).map((cat) => (
                            <span key={cat} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                              {cat}
                            </span>
                          ))}
                          {point.categories.length > 2 && (
                            <span className="px-2 py-0.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-[10px] font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                              +{point.categories.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight size={14} className={`mt-2 shrink-0 transition-colors ${isActive ? "text-[#27C7C3]" : "text-gray-300"}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA card */}
            <div className="mt-4 rounded-3xl p-5 text-center" style={{ background: "linear-gradient(135deg, #27C7C3, #1aa8a5)" }}>
              <CheckCircle2 size={28} className="text-white/80 mx-auto mb-3" />
              <p className="text-white font-semibold text-sm mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Belum ada di kotamu?
              </p>
              <p className="text-white/75 text-xs mb-4" style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.7 }}>
                Kami melayani pengiriman ke seluruh Indonesia.
                Hubungi kami untuk info lebih lanjut.
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

        {/* Stats strip */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { value: `${distributionData.length || "8"}+`, label: "Kota Distribusi", sub: "Di seluruh Indonesia" },
            { value: "900+", label: "Klien Aktif", sub: "Dari berbagai kota" },
            { value: "3–7 Hari", label: "Estimasi Kirim", sub: "Standar pengiriman" },
            { value: "100%", label: "Terverifikasi", sub: "Setiap pengiriman" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="group p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#27C7C3]/30 hover:bg-[#27C7C3]/5 transition-all duration-300 text-center"
            >
              <div className="text-3xl text-[#27C7C3] mb-2 group-hover:scale-110 transition-transform duration-300" style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800 }}>
                {stat.value}
              </div>
              <div className="text-gray-900 text-sm font-semibold mb-1" style={{ fontFamily: "Poppins, sans-serif" }}>
                {stat.label}
              </div>
              <div className="text-gray-400 text-xs" style={{ fontFamily: "Poppins, sans-serif" }}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaflet popup styles */}
      <style>{`
        .antara-popup .leaflet-popup-content-wrapper {
          border-radius: 16px !important;
          padding: 0 !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08) !important;
          border: 1.5px solid rgba(39,199,195,0.18) !important;
          overflow: hidden;
          font-family: 'Poppins', sans-serif;
        }
        .antara-popup .leaflet-popup-content { margin: 0 !important; width: auto !important; }
        .antara-popup .leaflet-popup-tip { background: white !important; box-shadow: none !important; }
        .antara-popup-inner { padding: 16px 18px 14px; min-width: 210px; }
        .antara-popup-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 10px; gap: 8px; }
        .antara-popup-province { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #27C7C3; margin-bottom: 2px; }
        .antara-popup-city { font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 700; color: #111827; margin: 0; line-height: 1.2; }
        .antara-popup-status { display: inline-flex; align-items: center; gap: 5px; padding: 3px 9px; border-radius: 99px; background: #f0fdf4; color: #16a34a; font-size: 11px; font-weight: 600; white-space: nowrap; flex-shrink: 0; }
        .antara-popup-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; display: inline-block; }
        .antara-popup-cats { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
        .antara-popup-cat { padding: 3px 9px; border-radius: 99px; background: rgba(39,199,195,0.10); color: #1aa8a5; font-size: 10.5px; font-weight: 500; }
        .antara-popup-orders { display: flex; align-items: center; gap: 6px; font-size: 11.5px; color: #6b7280; font-weight: 500; }
        .leaflet-control-zoom { border-radius: 12px !important; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.13) !important; border: none !important; }
        .leaflet-control-zoom a { width: 34px !important; height: 34px !important; line-height: 34px !important; font-size: 18px !important; color: #374151 !important; background: white !important; border-bottom: 1px solid #f3f4f6 !important; font-weight: 400 !important; }
        .leaflet-control-zoom a:hover { background: #f9fafb !important; color: #27C7C3 !important; }
        .leaflet-control-attribution { font-size: 10px !important; background: rgba(255,255,255,0.75) !important; backdrop-filter: blur(4px) !important; border-radius: 8px 0 0 0 !important; }
      `}</style>
    </section>
  );
}
