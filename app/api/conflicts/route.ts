import { NextResponse } from "next/server";
import { getAllConflicts } from "@/lib/supabase/queries/conflicts";

export async function GET() {
  try {
    const conflicts = await getAllConflicts();
    return NextResponse.json(conflicts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
