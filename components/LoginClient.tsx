"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function LoginClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Something went wrong. Try again.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Could not reach the server. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel auth-card" aria-label="Account access">
      <div className="auth-tabs" role="tablist" aria-label="Account mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "login"}
          className={`auth-tab${mode === "login" ? " is-selected" : ""}`}
          onClick={() => switchMode("login")}
        >
          Sign in
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "register"}
          className={`auth-tab${mode === "register" ? " is-selected" : ""}`}
          onClick={() => switchMode("register")}
        >
          Create account
        </button>
      </div>

      <h1 className="auth-card__title">{mode === "login" ? "Welcome back." : "Join the crawl."}</h1>
      <p className="auth-card__lead">
        {mode === "login"
          ? "Use your PandalPass username and password to open a session."
          : "Choose a username and a password of at least 8 characters."}
      </p>

      <form className="auth-form" onSubmit={submit}>
        {error ? (
          <p className="form-error" role="alert">
            {error}
          </p>
        ) : null}

        <label className="field" htmlFor="username">
          <span>Username</span>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            minLength={3}
            maxLength={24}
          />
        </label>

        <label className="field" htmlFor="password">
          <span>Password</span>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            maxLength={128}
          />
        </label>

        <button className="btn btn--wine auth-form__submit" type="submit" disabled={busy}>
          {busy ? "Please wait" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>
    </section>
  );
}
