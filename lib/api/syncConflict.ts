import { fetchAcledEvents, getTotalFatalities } from "@/lib/api/acled";
import { fetchReliefWebReports, extractSummary, extractAllSources } from "@/lib/api/reliefweb";
import { fetchUnhcrStats, getTotalDisplaced } from "@/lib/api/unhcr";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { Conflict, ConflictSource } from "@/types/conflict";

type SyncResult = {
  conflictId: string;
  title: string;
  success: boolean;
  error?: string;
};

async function fetchFatalities(country: string): Promise<number | null> {
  try {
    const events = await fetchAcledEvents(country);
    return getTotalFatalities(events);
  } catch {
    return null;
  }
}

async function fetchDisplaced(countryCode: string): Promise<number | null> {
  try {
    const entries = await fetchUnhcrStats(countryCode);
    return getTotalDisplaced(entries);
  } catch {
    return null;
  }
}

async function fetchSummaryAndSources(
  country: string
): Promise<{ summary: string; sources: ConflictSource[] }> {
  try {
    const reports = await fetchReliefWebReports(country);
    const summary = reports.length > 0 ? extractSummary(reports[0]) : "";
    const sources = extractAllSources(reports);
    return { summary, sources };
  } catch {
    return { summary: "", sources: [] };
  }
}

async function writeConflictUpdate(
  conflictId: string,
  updates: {
    summary: string;
    fatalities: number | null;
    displaced: number | null;
    sources: ConflictSource[];
  }
): Promise<void> {
  const supabase = createSupabaseServiceClient();

  const { error } = await supabase
    .from("conflicts")
    .update({
      summary: updates.summary,
      fatalities: updates.fatalities,
      displaced: updates.displaced,
      sources: updates.sources,
      last_synced_at: new Date().toISOString(),
    })
    .eq("id", conflictId);

  if (error) throw new Error(error.message);
}

export async function syncOneConflict(conflict: Conflict): Promise<SyncResult> {
  try {
    const [{ summary, sources }, fatalities, displaced] = await Promise.all([
      fetchSummaryAndSources(conflict.country),
      fetchFatalities(conflict.country),
      fetchDisplaced(conflict.countryCode),
    ]);

    await writeConflictUpdate(conflict.id, {
      summary: summary || conflict.summary,
      fatalities: fatalities ?? conflict.fatalities,
      displaced: displaced ?? conflict.displaced,
      sources: sources.length > 0 ? sources : conflict.sources,
    });

    return { conflictId: conflict.id, title: conflict.title, success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { conflictId: conflict.id, title: conflict.title, success: false, error: message };
  }
}

export async function syncAllConflicts(conflicts: Conflict[]): Promise<SyncResult[]> {
  const results = await Promise.allSettled(conflicts.map(syncOneConflict));

  return results.map((result) =>
    result.status === "fulfilled"
      ? result.value
      : { conflictId: "", title: "", success: false, error: String(result.reason) }
  );
}
