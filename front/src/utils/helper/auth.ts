import { hasAuthHint, UserService } from "../../api/user";
import { User } from "../../interface/User";
import { router } from "../router/router-instance";

/**
 * Ensures authorized user exists and optionally redirects to login.
 * @param redirectPath Route used when authorization is missing.
 * @returns Current user or null if unauthorized.
 */
export async function requireCurrentUser(redirectPath = "/login"): Promise<User | null> {
  if (!hasAuthHint()) {
    router.navigate(redirectPath);
    return null;
  }

  try {
    const user = await UserService.getCurrent();

    if (!user) {
      router.navigate(redirectPath);
      return null;
    }

    return user;
  } catch (error) {
    console.error("Failed to load current user", error);
    router.navigate(redirectPath);
    return null;
  }
}
