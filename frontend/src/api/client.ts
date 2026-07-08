const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const AUTH_STORAGE_KEY = "libraryKiosk.auth";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getStoredToken(): string | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string | null };
    return parsed.token ?? null;
  } catch {
    return null;
  }
}

/**
 * Thin fetch wrapper shared by all api/* modules: resolves the backend base
 * URL, attaches the stored JWT (if any), and normalizes error handling.
 */
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Sunucuya ulaşılamıyor. Bağlantınızı kontrol edin.", 0);
  }

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json")
    ? await res.json().catch(() => null)
    : null;

  if (!res.ok) {
    throw new ApiError(
      (body && body.message) || `İstek başarısız oldu (${res.status})`,
      res.status
    );
  }

  return body as T;
}
