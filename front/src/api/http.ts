const DEFAULT_HEADERS = {
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
} as const;

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

function buildHeaders(headers?: Record<string, string>): HeadersInit {
  return {
    ...DEFAULT_HEADERS,
    ...headers
  };
}

export async function parseJson<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message?: unknown }).message ?? "Request failed")
        : "Request failed";

    throw new Error(message);
  }

  return data as T;
}

export async function requestJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(url, options);

  return parseJson<T>(response);
}

export async function request(url: string, options: RequestOptions = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: buildHeaders(options.headers)
  });
}
