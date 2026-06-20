"use client";

import { useEffect, useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

type AuthGateProps = {
  children: React.ReactNode;
};

export function AuthGate({ children }: AuthGateProps) {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user ?? null);
        setChecked(true);
      });
  }, []);

  if (!checked) return null;

  if (!user) {
    return (
      <div className="mx-auto max-w-sm border border-neutral-200 p-8">
        <p className="mb-6 text-center text-sm text-neutral-500">
          You need to sign in or create an account to submit a conflict.
        </p>
        <AuthForm onSuccess={(u) => setUser(u)} />
      </div>
    );
  }

  return <>{children}</>;
}
