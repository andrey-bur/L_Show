const DEFAULT_HEADERS = {
  "X-Pinggy-No-Screen": "true",
  "User-Agent": "vite-app"
} as const;

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
};

/**
 * Builds request headers with defaults used by the client.
 * @param headers Optional custom headers.
 * @returns Merged headers object.
 */
function buildHeaders(headers?: Record<string, string>): HeadersInit {
  return {
    ...DEFAULT_HEADERS,
    ...headers
  };
}

/**
 * Parses JSON response body and throws typed API error for non-2xx status.
 * @template T
 * @param response Fetch response object.
 * @returns Parsed JSON response.
 * @throws Error when response status is not successful.
 */
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

/**
 * Sends HTTP request and parses JSON response.
 * @template T
 * @param url Target URL.
 * @param options Fetch options.
 * @returns Parsed JSON payload.
 */
export async function requestJson<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const response = await request(url, options);

  return parseJson<T>(response);
}

/**
 * Sends HTTP request with default headers.
 * @param url Target URL.
 * @param options Fetch options.
 * @returns Raw response.
 */
export async function request(url: string, options: RequestOptions = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    headers: buildHeaders(options.headers)
  });
}
