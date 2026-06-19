import { NextRequest, NextResponse } from "next/server";
import { getConflictBySlug } from "@/lib/supabase/queries/conflicts";

type RouteParams = { params: Promise<{ slug: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  try {
    const conflict = await getConflictBySlug(slug);
    if (!conflict) {
      return NextResponse.json({ error: "Conflict not found" }, { status: 404 });
    }
    return NextResponse.json(conflict);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
