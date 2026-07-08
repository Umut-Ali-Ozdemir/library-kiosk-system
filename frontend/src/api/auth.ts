import { apiFetch } from "./client";
import type { AuthUser } from "../types";

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export function loginWithPassword(identifier: string, password: string) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export function loginWithQr(studentNo: string) {
  return apiFetch<LoginResponse>("/auth/qr", {
    method: "POST",
    body: JSON.stringify({ studentNo }),
  });
}
