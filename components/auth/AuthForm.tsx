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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      <h3 className="text-xs uppercase tracking-[0.15em] text-neutral-400">
        {mode === "login" ? "Sign in to discuss" : "Create an account"}
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Username"
          value={username}
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          className="border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          onChange={(e) => setPassword(e.target.value)}
          className="border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading || !username || !password}
          className="self-start bg-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:opacity-30"
        >
          {loading ? "..." : mode === "login" ? "Sign in" : "Create account"}
        </button>
      </form>

      <button
        onClick={toggleMode}
        className="self-start text-xs uppercase tracking-[0.1em] text-neutral-400 underline underline-offset-4 transition-opacity hover:opacity-60"
      >
        {mode === "login" ? "No account? Register" : "Already have an account? Sign in"}
      </button>

      <p className="text-xs text-neutral-400">
        Or post without an account. Just type a name below.
      </p>
    </div>
  );
}
