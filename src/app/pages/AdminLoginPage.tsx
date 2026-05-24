import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, User, LogIn } from "lucide-react";
import { loginAdmin, isAdminLoggedIn } from "../utils/storage";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdminLoggedIn()) navigate("/admin/dashboard", { replace: true });
  }, [navigate]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = loginAdmin(username.trim(), password);
      if (ok) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setError("Username atau password salah.");
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background:
          "linear-gradient(135deg, #0a0a12 0%, #111120 50%, #0d0d1a 100%)",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #27C7C3, transparent)",
          transform: "translate(-30%, -30%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #6C8EAF, transparent)",
          transform: "translate(30%, 30%)",
        }}
      />

      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header strip */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, #27C7C3, #6C8EAF, #27C7C3)",
          }}
        />

        <div className="px-8 py-10">
          {/* Logo / title */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: "rgba(39,199,195,0.12)",
                border: "1px solid rgba(39,199,195,0.3)",
              }}
            >
              <Lock size={28} color="#27C7C3" />
            </div>
            <h1
              className="text-2xl font-bold tracking-wide"
              style={{ color: "#ffffff" }}
            >
              ANTARA AROMA
            </h1>
            <p className="text-sm mt-1" style={{ color: "#8a8aaa" }}>
              Panel Admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                className="block text-xs font-medium mb-2 tracking-widest uppercase"
                style={{ color: "#8a8aaa" }}
              >
                Username
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#8a8aaa" }}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  required
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(39,199,195,0.6)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs font-medium mb-2 tracking-widest uppercase"
                style={{ color: "#8a8aaa" }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "#8a8aaa" }}
                />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="w-full pl-9 pr-10 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(39,199,195,0.6)")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.1)")
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <EyeOff size={16} color="#8a8aaa" />
                  ) : (
                    <Eye size={16} color="#8a8aaa" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl"
                style={{
                  background: "rgba(212,24,61,0.1)",
                  border: "1px solid rgba(212,24,61,0.3)",
                  color: "#ff6b8a",
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200"
              style={{
                background: loading
                  ? "rgba(39,199,195,0.4)"
                  : "linear-gradient(135deg, #27C7C3, #1fa8a5)",
                color: "#fff",
                boxShadow: loading ? "none" : "0 8px 24px rgba(39,199,195,0.3)",
                transform: loading ? "scale(0.98)" : "scale(1)",
              }}
            >
              {loading ? (
                <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <LogIn size={18} />
                  Masuk
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "#555570" }}>
            Hanya untuk pengelola toko resmi Antara Aroma
          </p>
        </div>
      </div>
    </div>
  );
}
