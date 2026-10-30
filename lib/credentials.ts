const USERNAME_PATTERN = /^[A-Za-z0-9_]{3,24}$/;

export type CredentialResult =
  | { ok: true; username: string; password: string }
  | { ok: false; error: string };

export function readCredentials(body: unknown): CredentialResult {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Enter a username and password." };
  }

  const record = body as Record<string, unknown>;
  const username = typeof record.username === "string" ? record.username.trim() : "";
  const password = typeof record.password === "string" ? record.password : "";

  if (!username || !password) {
    return { ok: false, error: "Enter a username and password." };
  }
  if (!USERNAME_PATTERN.test(username)) {
    return { ok: false, error: "Usernames use 3 to 24 letters, numbers or underscores." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Passwords need at least 8 characters." };
  }
  if (password.length > 128) {
    return { ok: false, error: "Passwords can be at most 128 characters." };
  }

  return { ok: true, username, password };
}
