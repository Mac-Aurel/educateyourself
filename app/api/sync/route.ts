import { NextRequest, NextResponse } from "next/server";
import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { syncAllConflicts } from "@/lib/api/syncConflict";
import { discoverNewConflicts } from "@/lib/api/discoverConflicts";
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
  const results = await syncAllConflicts(summaries as unknown as Conflict[]);
  const counts = countResults(results);

  const discovered = await discoverNewConflicts();

  return NextResponse.json({
    sync: { ...counts, results },
    discovered: {
      added: discovered.added,
      errors: discovered.errors,
    },
  }, { status: 200 });
}
