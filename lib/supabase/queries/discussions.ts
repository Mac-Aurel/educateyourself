import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { mapDiscussionRow } from "@/lib/utils/mappers";
import type { DiscussionRow, DiscussionMessage, NewMessage } from "@/types/discussion";

export async function getDiscussionsByConflict(
  conflictId: string
): Promise<DiscussionMessage[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("discussions")
    .select("*")
    .eq("conflict_id", conflictId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Failed to fetch discussions: ${error.message}`);
  return (data as DiscussionRow[]).map(mapDiscussionRow);
}

export async function postMessage(message: NewMessage): Promise<DiscussionMessage> {
  const supabase = createSupabaseBrowserClient();

  const { data, error } = await supabase
    .from("discussions")
    .insert({
      conflict_id: message.conflictId,
      parent_id: message.parentId,
      author_name: message.authorName.trim(),
      content: message.content.trim(),
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to post message: ${error.message}`);
  return mapDiscussionRow(data as DiscussionRow);
}
