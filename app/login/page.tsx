import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginClient from "@/components/LoginClient";
import { readSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to PandalHoppers with your username and password, or create an account.",
};

export default async function LoginPage() {
  const user = await readSession();
  if (user) redirect("/");

  return (
    <div className="page">
      <div className="shell auth-layout">
        <LoginClient />
        <aside className="panel auth-aside" aria-label="About accounts">
          <p className="eyebrow">Why sign in</p>
          <h2>An account, not a data grab.</h2>
          <ul className="auth-aside__list">
            <li>Usernames and scrypt password hashes live in the PandalHoppers MySQL database.</li>
            <li>Your session is a signed, http-only cookie that lasts seven days.</li>
            <li>Only a username and password are stored. No email, no tracking, no profile.</li>
          </ul>
          <p className="note">Crowd, time and cost on the routes remain planning estimates.</p>
        </aside>
      </div>
    </div>
  );
}
