import { User } from "../interface/User";

const API_URL = "http://localhost:3000/users";
const AUTH_HINT_KEY = "hasActiveSession";

type LoginPayload = {
  identifier: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  login: string;
  phone: string;
  password: string;
};

export type UpdateUserPayload = Partial<User> & {
  oldPassword?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
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

function setAuthHint(value: boolean): void {
  try {
    window.localStorage.setItem(AUTH_HINT_KEY, String(value));
  } catch {
    // Ignore storage errors so auth flow still works in restricted browsers.
  }
}

export function hasAuthHint(): boolean {
  try {
    return window.localStorage.getItem(AUTH_HINT_KEY) === "true";
  } catch {
    return false;
  }
}

export const UserService = {
  async login(payload: LoginPayload): Promise<User> {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Pinggy-No-Screen": "true",
        "User-Agent": "vite-app"
      },
      body: JSON.stringify(payload)
    });

    const data = await parseJson<User>(response);
    setAuthHint(true);
    return new User(data);
  },

  async register(payload: RegisterPayload): Promise<User> {
    const response = await fetch(`${API_URL}/registration`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Pinggy-No-Screen": "true",
        "User-Agent": "vite-app"
      },
      body: JSON.stringify(payload)
    });

    const data = await parseJson<User>(response);
    setAuthHint(true);
    return new User(data);
  },

  async update(id: number, data: UpdateUserPayload): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Pinggy-No-Screen": "true",
        "User-Agent": "vite-app"
      },
      body: JSON.stringify(data)
    });

    await parseJson<{ message: string }>(response);
  },

  async getCurrent(): Promise<User | null> {
    const response = await fetch(`${API_URL}/me`, {
      credentials: "include",
      headers: {
        "X-Pinggy-No-Screen": "true",
        "User-Agent": "vite-app"
      }
    });

    if (response.status === 401) {
      setAuthHint(false);
      return null;
    }

    const data = await parseJson<User>(response);
    setAuthHint(true);
    return new User(data);
  },

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-Pinggy-No-Screen": "true",
          "User-Agent": "vite-app"
        }
      });

      await parseJson<{ message: string }>(response);
    } finally {
      setAuthHint(false);
    }
  }
};
