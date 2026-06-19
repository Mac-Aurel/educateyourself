import { formatRelativeDate } from "@/lib/utils/formatDate";
import type { DiscussionMessage } from "@/types/discussion";

type DiscussionBubbleProps = {
  message: DiscussionMessage;
  isReply: boolean;
};

function AuthorLine({ name, date }: { name: string; date: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{name}</span>
      <span className="text-xs text-zinc-400">{formatRelativeDate(date)}</span>
    </div>
  );
}

export function DiscussionBubble({ message, isReply }: DiscussionBubbleProps) {
  return (
    <div className={`flex flex-col gap-1 ${isReply ? "ml-8 border-l-2 border-zinc-200 pl-4 dark:border-zinc-700" : ""}`}>
      <AuthorLine name={message.authorName} date={message.createdAt} />
      <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
        {message.content}
      </p>
    </div>
  );
}
