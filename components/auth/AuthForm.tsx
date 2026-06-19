"use client";

import { useState } from "react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  onSuccess: (user: { id: string; username: string }) => void;
};

async function submitAuth(mode: AuthMode, username: string, password: string) {
  const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) throw new Error(data.error ?? "Something went wrong");
  return data.user;
}

export function AuthForm({ onSuccess }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleMode() {
    setMode((m) => (m === "login" ? "register" : "login"));
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await submitAuth(mode, username, password);
      onSuccess(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
        {mode === "login" ? "Sign in to discuss" : "Create an account"}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !username || !password}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {loading ? "…" : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={toggleMode}
        className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
      >
        {mode === "login" ? "No account? Register" : "Already have an account? Sign in"}
      </button>

      <p className="text-xs text-zinc-400">
        Or post without an account — just type a name below.
      </p>
    </div>
  );
}
