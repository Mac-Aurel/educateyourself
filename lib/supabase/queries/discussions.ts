import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DiscussionMessage } from "@/types/discussion";

export async function getDiscussionsByConflict(
  conflictId: string
): Promise<DiscussionMessage[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("discussions")
    .select("*, discussion_likes(count)")
    .eq("conflict_id", conflictId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch discussions: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    conflictId: row.conflict_id,
    parentId: row.parent_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
    likes: row.discussion_likes?.[0]?.count ?? 0,
  }));
}
