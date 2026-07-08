import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types";

const STORAGE_KEY = "libraryKiosk.auth";

interface StoredAuth {
  token: string | null;
  user: AuthUser | null;
}

interface AuthContextValue extends StoredAuth {
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadStoredAuth(): StoredAuth {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { token: null, user: null };
    const parsed = JSON.parse(raw) as Partial<StoredAuth>;
    return { token: parsed.token ?? null, user: parsed.user ?? null };
  } catch {
    return { token: null, user: null };
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<StoredAuth>(loadStoredAuth);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth,
      login: (token: string, user: AuthUser) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, user }));
        setAuth({ token, user });
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEY);
        setAuth({ token: null, user: null });
      },
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
