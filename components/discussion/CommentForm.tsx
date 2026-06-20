"use client";

import { useState } from "react";
import type { DiscussionMessage } from "@/types/discussion";

type CommentFormProps = {
  conflictId: string;
  parentId?: string | null;
  prefilledName?: string;
  onMessagePosted: (message: DiscussionMessage) => void;
};

const AUTHOR_MAX_LENGTH = 50;
const CONTENT_MAX_LENGTH = 1000;

function isFormValid(authorName: string, content: string): boolean {
  return authorName.trim().length > 0 && content.trim().length > 0;
}

export function CommentForm({ conflictId, parentId = null, prefilledName, onMessagePosted }: CommentFormProps) {
  const [authorName, setAuthorName] = useState(prefilledName ?? "");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid(authorName, content)) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conflictId,
          parentId: parentId ?? null,
          authorName,
          content,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error ?? "Failed to post message");
      }

      const posted: DiscussionMessage = await response.json();
      onMessagePosted(posted);
      setContent("");
    } catch {
      setError("Could not post your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Your name"
        value={authorName}
        maxLength={AUTHOR_MAX_LENGTH}
        readOnly={!!prefilledName}
        onChange={(e) => setAuthorName(e.target.value)}
        className="border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300 read-only:text-neutral-400"
      />
      <textarea
        placeholder="Share your thoughts..."
        value={content}
        maxLength={CONTENT_MAX_LENGTH}
        rows={3}
        onChange={(e) => setContent(e.target.value)}
        className="resize-none border-b border-neutral-200 bg-transparent py-2.5 text-sm outline-none transition-colors focus:border-black placeholder:text-neutral-300"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={submitting || !isFormValid(authorName, content)}
        className="self-end bg-black px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-80 disabled:opacity-30"
      >
        {submitting ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
