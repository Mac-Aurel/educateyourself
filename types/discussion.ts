export type DiscussionMessage = {
  id: string;
  conflictId: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
};

export type DiscussionThread = {
  conflictId: string;
  messages: DiscussionMessage[];
};

export type NewMessage = Pick<
  DiscussionMessage,
  "conflictId" | "parentId" | "authorName" | "content"
>;
