import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { conflicts } from "./conflicts-data";

type ConflictSeed = (typeof conflicts)[number];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseClient(): SupabaseClient {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
}

async function upsertConflict(supabase: SupabaseClient, conflict: ConflictSeed) {
  const { error } = await supabase
    .from("conflicts")
    .upsert(conflict, { onConflict: "slug" });

  if (error) throw new Error(`Failed to upsert "${conflict.title}": ${error.message}`);
}

function logResult(title: string, success: boolean, error?: string) {
  const icon = success ? "✓" : "✗";
  const detail = error ? ` — ${error}` : "";
  console.log(`${icon} ${title}${detail}`);
}

async function seed() {
  const supabase = getSupabaseClient();

  console.log(`Seeding ${conflicts.length} conflicts...\n`);

  for (const conflict of conflicts) {
    try {
      await upsertConflict(supabase, conflict);
      logResult(conflict.title, true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logResult(conflict.title, false, message);
    }
  }

  console.log("\nDone.");
}

seed();
