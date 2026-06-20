// Shape returned directly from Supabase (snake_case columns)
export type DiscussionRow = {
  id: string;
  conflict_id: string;
  parent_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
};

// App-facing type (camelCase)
export type DiscussionMessage = {
  id: string;
  conflictId: string;
  parentId: string | null;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
};

export type DiscussionThread = {
  conflictId: string;
  messages: DiscussionMessage[];
};

export type NewMessage = Pick<
  DiscussionMessage,
  "conflictId" | "parentId" | "authorName" | "content"
>;
