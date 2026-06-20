"use client";

import { useState } from "react";

type UserMenuProps = {
  username: string;
  onLogout: () => void;
};

export function UserMenu({ username, onLogout }: UserMenuProps) {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    onLogout();
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-neutral-500">
        Signed in as <span className="text-black">{username}</span>
      </span>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="text-xs uppercase tracking-[0.1em] text-neutral-400 underline underline-offset-4 transition-opacity hover:opacity-60 disabled:opacity-30"
      >
        Sign out
      </button>
    </div>
  );
}
