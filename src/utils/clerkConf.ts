export function getPublishableKey() {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing publishable key");
  }

  return PUBLISHABLE_KEY;
}

export const SIGN_IN_URL = import.meta.env.VITE_SIGN_IN_URL || "/login";
export const REDIRECT_URL = import.meta.env.VITE_REDIRECT_URL || "/";

export const REGISTER = import.meta.env.VITE_REDIRECT_URL || "/register";
