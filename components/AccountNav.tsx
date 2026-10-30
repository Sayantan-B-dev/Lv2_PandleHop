"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SessionUser {
  id: number;
  username: string;
}

export default function AccountNav() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [busy, setBusy] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { user: SessionUser | null }) => {
        if (active) setUser(payload.user ?? null);
      })
      .catch(() => {
        if (active) setUser(null);
      });
    return () => {
      active = false;
    };
  }, [pathname]);

  async function signOut() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (user === undefined) {
    return null;
  }

  if (!user) {
    return (
      <Link className="site-nav__auth" href="/login" aria-current={pathname === "/login" ? "page" : undefined}>
        Sign in
      </Link>
    );
  }

  return (
    <span className="site-nav__account">
      <span className="site-nav__user">{user.username}</span>
      <button className="site-nav__signout" type="button" onClick={signOut} disabled={busy}>
        {busy ? "Signing out" : "Sign out"}
      </button>
    </span>
  );
}
