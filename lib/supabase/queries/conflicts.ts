import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapConflictRow, mapConflictRowToSummary } from "@/lib/utils/mappers";
import type { ConflictRow } from "@/types/conflict";
import type { Conflict, ConflictSummary } from "@/types/conflict";

export async function getAllConflicts(): Promise<ConflictSummary[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conflicts")
    .select("id, slug, title, country, status, summary, fatalities, displaced, last_synced_at")
    .order("status", { ascending: true })
    .order("title", { ascending: true });

  if (error) throw new Error(`Failed to fetch conflicts: ${error.message}`);
  return (data as ConflictRow[]).map(mapConflictRowToSummary);
}

export async function getConflictBySlug(slug: string): Promise<Conflict | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("conflicts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to fetch conflict "${slug}": ${error.message}`);
  }

  return mapConflictRow(data as ConflictRow);
}
