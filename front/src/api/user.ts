import { User, UserDTO } from "../interface/User";
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

/**
 * Stores authorization hint in localStorage.
 * @param value Session marker.
 */
function setAuthHint(value: boolean): void {
  try {
    window.localStorage.setItem(AUTH_HINT_KEY, String(value));
  } catch {
    // Ignore storage errors so auth flow still works in restricted browsers.
  }
}

/**
 * Reads authorization hint from localStorage.
 * @returns True when user likely has an active session.
 */
export function hasAuthHint(): boolean {
  try {
    return window.localStorage.getItem(AUTH_HINT_KEY) === "true";
  } catch {
    return false;
  }
}

export const UserService = {
  /**
   * Authenticates user and returns profile model.
   * @param payload Login data.
   * @returns Authorized user.
   */
  async login(payload: LoginPayload): Promise<User> {
    const data = await requestJson<UserDTO>(`${API_URL}/login`, {
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

  /**
   * Registers user and returns profile model.
   * @param payload Registration data.
   * @returns Created user.
   */
  async register(payload: RegisterPayload): Promise<User> {
    const data = await requestJson<UserDTO>(`${API_URL}/registration`, {
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

  /**
   * Updates user and returns a fresh profile snapshot.
   * @param id User id.
   * @param data Partial profile update payload.
   * @returns Updated user.
   */
  async update(id: number, data: UpdateUserPayload): Promise<User> {
    const response = await requestJson<UserDTO>(`${API_URL}/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return new User(response);
  },

  /**
   * Returns current user from active session cookie.
   * @returns Current user or null when unauthorized.
   */
  async getCurrent(): Promise<User | null> {
    const response = await request(`${API_URL}/me`, {
      credentials: "include"
    });

    if (response.status === 401) {
      setAuthHint(false);
      return null;
    }

    const data = await parseJson<UserDTO>(response);
    setAuthHint(true);
    return new User(data);
  },

  /**
   * Logs user out and clears local session hint.
   * @returns Promise resolved after logout request.
   */
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
