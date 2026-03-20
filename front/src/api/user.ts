import { User } from "../interface/User";
import { parseJson, request, requestJson } from "./http";

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
    const data = await requestJson<User>(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setAuthHint(true);
    return new User(data);
  },

  async register(payload: RegisterPayload): Promise<User> {
    const data = await requestJson<User>(`${API_URL}/registration`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setAuthHint(true);
    return new User(data);
  },

  async update(id: number, data: UpdateUserPayload): Promise<void> {
    await requestJson<{ message: string }>(`${API_URL}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
  },

  async getCurrent(): Promise<User | null> {
    const response = await request(`${API_URL}/me`, {
      credentials: "include"
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
      await requestJson<{ message: string }>(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });
    } finally {
      setAuthHint(false);
    }
  }
};
