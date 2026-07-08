import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Floor = {
  id: number;
  name: string;
  occupancy: number;
};

const floors: Floor[] = [
  { id: 1, name: "1. Kat", occupancy: 65 },
  { id: 2, name: "2. Kat", occupancy: 100 },
  { id: 3, name: "3. Kat", occupancy: 40 },
];

const FloorSelect = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top, #0f172a 0%, #020617 75%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "110px",
        color: "#e5e7eb",
      }}
    >
      {/* TITLE */}
      <h1
        style={{
          fontSize: "34px",
          marginBottom: "6px",
          letterSpacing: "0.6px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.6s ease",
        }}
      >
        Kat Seçimi
      </h1>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "15px",
          marginBottom: "14px",
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease",
        }}
      >
        Kullanmak istediğiniz katı seçin
      </p>

      {/* DIVIDER */}
      <div
        style={{
          width: "260px",
          height: "2px",
          background:
            "linear-gradient(to right, transparent, #38bdf8, transparent)",
          marginBottom: "44px",
          opacity: 0.6,
        }}
      />

      {/* FLOOR CARDS */}
      <div
        style={{
          display: "flex",
          gap: "36px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {floors.map((floor, index) => {
          const isFull = floor.occupancy >= 100;

          return (
            <div
              key={floor.id}
              onClick={() => {
                if (!isFull) navigate("/seats");
              }}
              style={{
                width: "300px",
                height: "230px",
                padding: "28px",
                borderRadius: "22px",
                background: isFull
                  ? "rgba(30,41,59,0.45)"
                  : "rgba(15,23,42,0.9)",
                border: "1px solid rgba(148,163,184,0.15)",
                cursor: isFull ? "not-allowed" : "pointer",
                opacity: mounted ? (isFull ? 0.4 : 1) : 0,
                transform: mounted
                  ? "translateY(0)"
                  : "translateY(24px)",
                transition: `all 0.6s ease ${index * 0.15}s`,
                boxShadow: isFull
                  ? "none"
                  : "0 30px 70px rgba(0,0,0,0.55)",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseEnter={(e) => {
                if (!isFull) {
                  e.currentTarget.style.transform =
                    "translateY(-8px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 45px 90px rgba(56,189,248,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow =
                  "0 30px 70px rgba(0,0,0,0.55)";
              }}
            >
              {/* TOP */}
              <h2
                style={{
                  fontSize: "24px",
                  marginBottom: "24px",
                }}
              >
                {floor.name}
              </h2>

              {/* CENTER CONTENT */}
              <div style={{ flexGrow: 1 }}>
                <div
                  style={{
                    fontSize: "40px",
                    fontWeight: 700,
                    color: isFull ? "#94a3b8" : "#22c55e",
                    marginBottom: "6px",
                  }}
                >
                  %{floor.occupancy}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#94a3b8",
                    marginBottom: "16px",
                  }}
                >
                  Doluluk Oranı
                </div>

                {/* PROGRESS */}
                <div
                  style={{
                    height: "8px",
                    borderRadius: "999px",
                    background: "rgba(148,163,184,0.22)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${floor.occupancy}%`,
                      height: "100%",
                      background: isFull
                        ? "#64748b"
                        : "linear-gradient(90deg, #22c55e, #4ade80)",
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FloorSelect;
