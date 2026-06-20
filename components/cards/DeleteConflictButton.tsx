"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteConflictButtonProps = {
  slug: string;
  submittedBy: string;
};

export function DeleteConflictButton({ slug, submittedBy }: DeleteConflictButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  if (!checked) {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setCurrentUser(data.user?.username ?? null);
        setChecked(true);
      });
    return null;
  }

  if (currentUser !== submittedBy) return null;

  async function handleDelete() {
    setDeleting(true);
    const response = await fetch(`/api/conflicts/${slug}`, { method: "DELETE" });

    if (response.ok) {
      router.push("/");
    } else {
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-xs text-neutral-500">Delete this conflict?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-600 px-4 py-2 text-xs uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-80 disabled:opacity-30"
        >
          {deleting ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs uppercase tracking-[0.1em] text-neutral-400 underline underline-offset-4 hover:opacity-60"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs uppercase tracking-[0.1em] text-neutral-400 underline underline-offset-4 transition-opacity hover:opacity-60"
    >
      Delete this conflict
    </button>
  );
}
