export type ApiQueryParams = Record<
  string,
  string | number | boolean | undefined | null
>;

const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");

function resolvePath(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return baseUrl ? `${baseUrl}${p}` : p;
}

function withQuery(url: string, params?: ApiQueryParams): string {
  if (!params) return url;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    sp.append(key, String(value));
  }
  const q = sp.toString();
  if (!q) return url;
  return url.includes("?") ? `${url}&${q}` : `${url}?${q}`;
}

function authHeaders(token?: string): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function parseBody<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }
  return text as unknown as T;
}

async function request<T>(
  method: string,
  path: string,
  options: { query?: ApiQueryParams; body?: unknown; token?: string }
): Promise<T> {
  const url = withQuery(resolvePath(path), options.query);
  const init: RequestInit = {
    method,
    headers: authHeaders(options.token),
  };
  if (options.body !== undefined && method !== "GET" && method !== "HEAD") {
    init.body = JSON.stringify(options.body);
  }
  const res = await fetch(url, init);
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(
      `${method} ${path} failed: ${res.status} ${res.statusText}${errText ? ` — ${errText}` : ""}`
    );
  }
  return parseBody<T>(res);
}

export const api = {
  get<T = unknown>(path: string, params?: ApiQueryParams, token?: string) {
    return request<T>("GET", path, { query: params, token });
  },

  post<T = unknown>(path: string, params?: unknown, token?: string) {
    return request<T>("POST", path, { body: params, token });
  },

  put<T = unknown>(path: string, params?: unknown, token?: string) {
    return request<T>("PUT", path, { body: params, token });
  },

  patch<T = unknown>(path: string, params?: unknown, token?: string) {
    return request<T>("PATCH", path, { body: params, token });
  },

  delete<T = unknown>(path: string, params?: ApiQueryParams, token?: string) {
    return request<T>("DELETE", path, { query: params, token });
  },
};
