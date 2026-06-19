import type { ConflictRow, Conflict, ConflictSummary } from "@/types/conflict";
import type { DiscussionRow, DiscussionMessage } from "@/types/discussion";

export function mapConflictRow(row: ConflictRow): Conflict {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    country: row.country,
    countryCode: row.country_code,
    status: row.status,
    summary: row.summary,
    fatalities: row.fatalities,
    displaced: row.displaced,
    sources: row.sources,
    actions: row.actions,
    lastSyncedAt: row.last_synced_at,
    createdAt: row.created_at,
  };
}

export function mapConflictRowToSummary(row: ConflictRow): ConflictSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    country: row.country,
    countryCode: row.country_code,
    status: row.status,
    summary: row.summary,
    fatalities: row.fatalities,
    displaced: row.displaced,
    lastSyncedAt: row.last_synced_at,
  };
}

export function mapDiscussionRow(row: DiscussionRow): DiscussionMessage {
  return {
    id: row.id,
    conflictId: row.conflict_id,
    parentId: row.parent_id,
    authorName: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  };
}
