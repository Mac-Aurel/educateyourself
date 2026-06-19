"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { DiscussionBubble } from "@/components/discussion/DiscussionBubble";
import { CommentForm } from "@/components/discussion/CommentForm";
import { AuthForm } from "@/components/auth/AuthForm";
import { UserMenu } from "@/components/auth/UserMenu";
import { mapDiscussionRow } from "@/lib/utils/mappers";
import type { DiscussionMessage, DiscussionRow } from "@/types/discussion";

type SessionUser = { id: string; username: string };

type DiscussionThreadProps = {
  conflictId: string;
  initialMessages: DiscussionMessage[];
};

function groupReplies(messages: DiscussionMessage[]) {
  const topLevel = messages.filter((m) => m.parentId === null);
  const replies = messages.filter((m) => m.parentId !== null);

  return topLevel.map((parent) => ({
    parent,
    replies: replies.filter((r) => r.parentId === parent.id),
  }));
}

function useRealtimeMessages(conflictId: string, initial: DiscussionMessage[]) {
  const [messages, setMessages] = useState<DiscussionMessage[]>(initial);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    const channel = supabase
      .channel(`discussions:${conflictId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "discussions",
          filter: `conflict_id=eq.${conflictId}`,
        },
        (payload) => {
          const newMessage = mapDiscussionRow(payload.new as DiscussionRow);
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [conflictId]);

  return {
    messages,
    addMessage: (m: DiscussionMessage) => setMessages((prev) => [...prev, m]),
  };
}

function useCurrentUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { setUser(data.user); setChecked(true); });
  }, []);

  return { user, checked, setUser };
}

export function DiscussionThread({ conflictId, initialMessages }: DiscussionThreadProps) {
  const { messages, addMessage } = useRealtimeMessages(conflictId, initialMessages);
  const { user, checked, setUser } = useCurrentUser();
  const threads = groupReplies(messages);

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        Discussion ({messages.length})
      </h2>

      <div className="mb-8 flex flex-col gap-6">
        {threads.length === 0 ? (
          <p className="text-sm text-zinc-400">No messages yet. Be the first to discuss.</p>
        ) : (
          threads.map(({ parent, replies }) => (
            <div key={parent.id} className="flex flex-col gap-3">
              <DiscussionBubble message={parent} isReply={false} />
              {replies.map((reply) => (
                <DiscussionBubble key={reply.id} message={reply} isReply={true} />
              ))}
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        {checked && (
          <div className="mb-4">
            {user ? (
              <UserMenu username={user.username} onLogout={() => setUser(null)} />
            ) : (
              <AuthForm onSuccess={(u) => setUser(u)} />
            )}
          </div>
        )}

        <CommentForm
          conflictId={conflictId}
          prefilledName={user?.username}
          onMessagePosted={addMessage}
        />
      </div>
    </section>
  );
}
