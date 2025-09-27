export interface User {
  apellido: string;
  email: string;
}

export const USER_KEY = "rv_user_v1";

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as User;
    if (u && u.apellido && u.email) return u;
    return null;
  } catch {
    return null;
  }
}
