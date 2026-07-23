import { api } from "./api";

export interface Session {
  token: string;
  email: string;
  name: string;
}

/**
 * Email auth. Tries the backend auth-service first; falls back to a
 * localStorage-backed store so the flow works fully offline in dev.
 *
 * NOTE (dev only): the fallback keeps a demo credential record in
 * localStorage. Real password hashing + JWTs live in auth-service.
 */
const LS_USERS = "drinkit_users";

type StoredUser = { name: string; email: string; password: string };

function readUsers(): Record<string, StoredUser> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(LS_USERS) ?? "{}");
  } catch {
    return {};
  }
}

function writeUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(LS_USERS, JSON.stringify(users));
}

export async function signup(input: {
  name: string;
  email: string;
  password: string;
}): Promise<Session> {
  const email = input.email.trim().toLowerCase();
  try {
    const { data } = await api.post("/auth/signup", { ...input, email });
    return { token: data.access_token, email, name: input.name };
  } catch (err: unknown) {
    // If the backend explicitly rejected (e.g. 409), surface that.
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status && status >= 400 && status < 500) {
      throw new Error("An account with this email already exists.");
    }
    // Offline fallback
    const users = readUsers();
    if (users[email]) throw new Error("An account with this email already exists.");
    users[email] = { name: input.name, email, password: input.password };
    writeUsers(users);
    return { token: `local-${btoa(email)}`, email, name: input.name };
  }
}

export async function login(input: { email: string; password: string }): Promise<Session> {
  const email = input.email.trim().toLowerCase();
  try {
    const { data } = await api.post("/auth/login", { email, password: input.password });
    return { token: data.access_token, email, name: data.name ?? email.split("@")[0] };
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status;
    if (status === 401) throw new Error("Invalid email or password.");
    // Offline fallback
    const users = readUsers();
    const u = users[email];
    if (!u || u.password !== input.password) throw new Error("Invalid email or password.");
    return { token: `local-${btoa(email)}`, email, name: u.name };
  }
}
