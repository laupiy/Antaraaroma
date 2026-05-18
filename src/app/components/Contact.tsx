import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", company: "", message: "" });
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: "Alamat Kantor",
      value: "Jl. Industri Raya No. 45, Tangerang, Banten 15820, Indonesia",
    },
    {
      icon: Phone,
      label: "Telepon / WhatsApp",
      value: "+62 812-3456-7890",
    },
    {
      icon: Mail,
      label: "Email",
      value: "info@antaraaroma.com",
    },
    {
      icon: Clock,
      label: "Jam Operasional",
      value: "Mon–Fri: 08:00–17:00 WIB",
    },
  ];

  return (
    <section id="contact" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block px-4 py-1.5 rounded-full bg-[#27C7C3]/10 text-[#27C7C3] text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Contact Us
          </span>
          <h2
            className="text-4xl lg:text-5xl text-gray-900 mb-4"
            style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 700 }}
          >
            Mari{" "}
            <span className="text-[#27C7C3]">Bekerja Sama</span>
          </h2>
          <p
            className="text-gray-500 max-w-xl mx-auto"
            style={{ fontFamily: "Poppins, sans-serif", lineHeight: 1.8 }}
          >
            Ada pertanyaan tentang produk kami atau ingin penawaran khusus?
            Hubungi tim kami dan kami akan merespons dalam waktu 24 jam.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#27C7C3]/10 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#27C7C3]" />
                  </div>
                  <div>
                    <div
                      className="text-xs text-gray-400 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.label}
                    </div>
                    <div
                      className="text-gray-800 text-sm font-medium"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Social links */}
            <div className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <p
                className="text-xs text-gray-400 mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ikuti Kami
              </p>
              <div className="flex gap-3">
                {["Instagram", "TikTok", "Tokopedia"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-[#27C7C3]/10 hover:text-[#27C7C3] transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
            >
              <h3
                className="text-gray-900 font-semibold text-lg mb-6"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Send Us a Message
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-xs text-gray-500 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#27C7C3] focus:ring-2 focus:ring-[#27C7C3]/10 transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs text-gray-500 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@anda.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#27C7C3] focus:ring-2 focus:ring-[#27C7C3]/10 transition-all"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-xs text-gray-500 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Company / Brand Name
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Perusahaan atau merek Anda"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#27C7C3] focus:ring-2 focus:ring-[#27C7C3]/10 transition-all"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>

              <div className="mb-6">
                <label
                  className="block text-xs text-gray-500 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Message *
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Ceritakan kebutuhan kemasan Anda..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#27C7C3] focus:ring-2 focus:ring-[#27C7C3]/10 transition-all resize-none"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#27C7C3] text-white text-sm font-semibold hover:bg-[#1fb3af] transition-all duration-200 shadow-lg shadow-[#27C7C3]/30 hover:scale-[1.01]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {sent ? (
                  "Pesan Terkirim! ✓"
                ) : (
                  <>
                    Kirim Pesan
                    <Send size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
