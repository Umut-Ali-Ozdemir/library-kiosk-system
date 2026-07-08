import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithPassword, loginWithQr } from "../api/auth";
import { ApiError } from "../api/client";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [studentNo, setStudentNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [qrMode, setQrMode] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [qrLoading, setQrLoading] = useState(false);

  const redirectByRole = (role: "STUDENT" | "ADMIN") => {
    navigate(role === "ADMIN" ? "/admin" : "/floors");
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!studentNo || !password) {
      setError("Öğrenci numarası ve şifre zorunludur");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const data = await loginWithPassword(studentNo, password);
      login(data.token, data.user);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Giriş başarısız oldu");
    } finally {
      setLoading(false);
    }
  };

  const handleQrSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!qrValue.trim()) {
      setError("QR kod / öğrenci numarası okutulmadı");
      return;
    }

    setError("");
    setQrLoading(true);

    try {
      const data = await loginWithQr(qrValue.trim());
      login(data.token, data.user);
      redirectByRole(data.user.role);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "QR ile giriş başarısız oldu");
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(12px)",
          padding: "60px 50px",
          borderRadius: "20px",
          boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
        }}
      >
        {/* TITLE */}
        <h1
          style={{
            textAlign: "center",
            fontSize: "28px",
            marginBottom: "15px",
            letterSpacing: "0.5px",
          }}
        >
          Library Kiosk
        </h1>

        <p
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#94a3b8",
            marginBottom: "18px",
          }}
        >
          Sign in to select your seat
        </p>

        {/* DIVIDER */}
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(to right, transparent, #334155, transparent)",
            marginBottom: "28px",
          }}
        />

        {!qrMode ? (
          <form
            onSubmit={handleLogin}
            style={{ width: "100%", maxWidth: "320px", margin: "0 auto" }}
          >
            {/* STUDENT NUMBER */}
            <input
              placeholder="Student Number"
              value={studentNo}
              onChange={(e) => setStudentNo(e.target.value)}
              style={fieldStyle}
            />

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...fieldStyle, marginBottom: "22px" }}
            />

            {/* ERROR */}
            {error && <div style={errorStyle}>{error}</div>}

            {/* LOGIN */}
            <button
              type="submit"
              disabled={loading}
              style={{
                ...primaryButtonStyle,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* DIVIDER */}
            <div
              style={{
                margin: "20px 0px 2px",
                height: "1px",
                background:
                  "linear-gradient(to right, transparent, #334155, transparent)",
              }}
            />

            {/* QR */}
            <button
              type="button"
              onClick={() => {
                setError("");
                setQrMode(true);
              }}
              style={secondaryButtonStyle}
            >
              Scan QR Code
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleQrSubmit}
            style={{ width: "100%", maxWidth: "320px", margin: "0 auto" }}
          >
            <p
              style={{
                fontSize: "13px",
                color: "#94a3b8",
                textAlign: "center",
                marginTop: 0,
                marginBottom: "16px",
              }}
            >
              QR kodunuzu okutucuya gösterin ya da öğrenci numaranızı girin
            </p>

            <input
              autoFocus
              placeholder="Öğrenci Numarası"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              style={{ ...fieldStyle, marginBottom: "22px" }}
            />

            {error && <div style={errorStyle}>{error}</div>}

            <button
              type="submit"
              disabled={qrLoading}
              style={{
                ...primaryButtonStyle,
                opacity: qrLoading ? 0.7 : 1,
                cursor: qrLoading ? "not-allowed" : "pointer",
              }}
            >
              {qrLoading ? "Giriş yapılıyor..." : "QR ile Giriş Yap"}
            </button>

            <button
              type="button"
              onClick={() => {
                setError("");
                setQrValue("");
                setQrMode(false);
              }}
              style={{ ...secondaryButtonStyle, marginTop: "14px" }}
            >
              Geri Dön
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const fieldStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "rgba(2, 6, 23, 0.7)",
  color: "#e5e7eb",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const primaryButtonStyle: CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  border: "none",
  color: "#022c22",
  fontWeight: 700,
  fontSize: "15px",
  boxSizing: "border-box",
};

const secondaryButtonStyle: CSSProperties = {
  width: "100%",
  padding: "14px",
  marginTop: "14px",
  borderRadius: "12px",
  background: "transparent",
  border: "1px dashed #475569",
  color: "#cbd5f5",
  fontSize: "14px",
  cursor: "pointer",
  boxSizing: "border-box",
};

const errorStyle: CSSProperties = {
  color: "#f87171",
  fontSize: "13px",
  marginBottom: "12px",
  textAlign: "center",
};

export default Login;
