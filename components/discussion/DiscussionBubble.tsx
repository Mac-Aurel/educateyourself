"use client";

import { useState } from "react";
import { formatRelativeDate } from "@/lib/utils/formatDate";
import type { DiscussionMessage } from "@/types/discussion";

type DiscussionBubbleProps = {
  message: DiscussionMessage;
  isReply: boolean;
  isLoggedIn: boolean;
};

export function DiscussionBubble({ message, isReply, isLoggedIn }: DiscussionBubbleProps) {
  const [likes, setLikes] = useState(message.likes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!isLoggedIn || loading) return;

    setLoading(true);
    try {
      const response = await fetch("/api/discussions/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ discussionId: message.id }),
      });

      const data = await response.json();
      if (response.ok) {
        setLiked(data.liked);
        setLikes((prev) => data.liked ? prev + 1 : prev - 1);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex flex-col gap-1 ${isReply ? "ml-8 border-l border-neutral-200 pl-4" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium uppercase tracking-[0.08em] sm:text-xs">{message.authorName}</span>
        <span className="text-xs text-neutral-400">{formatRelativeDate(message.createdAt)}</span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-600">
        {message.content}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={toggleLike}
          disabled={!isLoggedIn}
          className={`text-xs transition-opacity ${
            liked ? "text-red-500" : "text-neutral-400"
          } ${isLoggedIn ? "hover:opacity-60 cursor-pointer" : "cursor-default opacity-50"}`}
          title={isLoggedIn ? (liked ? "Unlike" : "Like") : "Sign in to like"}
        >
          {liked ? "♥" : "♡"}
        </button>
        {likes > 0 && (
          <span className="text-xs text-neutral-400">{likes}</span>
        )}
      </div>
    </div>
  );
}
