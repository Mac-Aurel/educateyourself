import { formatRelativeDate } from "@/lib/utils/formatDate";
import type { DiscussionMessage } from "@/types/discussion";

type DiscussionBubbleProps = {
  message: DiscussionMessage;
  isReply: boolean;
};

export function DiscussionBubble({ message, isReply }: DiscussionBubbleProps) {
  return (
    <div className={`flex flex-col gap-1 ${isReply ? "ml-8 border-l border-neutral-200 pl-4" : ""}`}>
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-[0.1em]">{message.authorName}</span>
        <span className="text-[10px] text-neutral-400">{formatRelativeDate(message.createdAt)}</span>
      </div>
      <p className="text-sm leading-relaxed text-neutral-600">
        {message.content}
      </p>
    </div>
  );
}
