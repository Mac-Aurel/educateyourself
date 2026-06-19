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
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as <span className="font-medium text-zinc-900 dark:text-zinc-100">{username}</span>
      </span>
      <button
        onClick={handleLogout}
        disabled={loading}
        className="text-xs text-zinc-400 hover:text-zinc-600 disabled:opacity-40 dark:hover:text-zinc-300"
      >
        Sign out
      </button>
    </div>
  );
}
