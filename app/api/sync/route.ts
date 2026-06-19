import { NextRequest, NextResponse } from "next/server";
import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { syncAllConflicts } from "@/lib/api/syncConflict";
import type { Conflict } from "@/types/conflict";

function isAuthorized(request: NextRequest): boolean {
  const secret = request.headers.get("x-sync-secret");
  return secret === process.env.SYNC_SECRET;
}

function countResults(results: { success: boolean }[]) {
  return {
    total: results.length,
    succeeded: results.filter((r) => r.success).length,
    failed: results.filter((r) => !r.success).length,
  };
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summaries = await getAllConflicts();

  // getAllConflicts returns ConflictSummary — we cast to Conflict since
  // syncOneConflict only needs the fields present in ConflictSummary
  const results = await syncAllConflicts(summaries as unknown as Conflict[]);
  const counts = countResults(results);

  return NextResponse.json({ ...counts, results }, { status: 200 });
}
