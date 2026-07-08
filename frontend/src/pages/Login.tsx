import { useState } from "react";

const Login = () => {
  // 🔹 STATE'LER
  const [studentNo, setStudentNo] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 LOGIN HANDLER
  const handleLogin = async () => {
    if (!studentNo || !password) {
      setError("Student number and password are required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: studentNo, // backend şu an email bekliyor
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("LOGIN SUCCESS:", data);

      // 🔜 ileride:
      // localStorage.setItem("token", data.token);
      // yönlendirme yapılacak

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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

        {/* FORM */}
        <div
          style={{
            width: "100%",
            maxWidth: "320px",
            margin: "0 auto",
          }}
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
          {error && (
            <div
              style={{
                color: "#f87171",
                fontSize: "13px",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          {/* LOGIN */}
          <button
            onClick={handleLogin}
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
          <button style={secondaryButtonStyle}>
            Scan QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const fieldStyle: React.CSSProperties = {
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

const primaryButtonStyle: React.CSSProperties = {
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

const secondaryButtonStyle: React.CSSProperties = {
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

export default Login;
