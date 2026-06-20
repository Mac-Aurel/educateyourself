import { NextRequest, NextResponse } from "next/server";
import { getConflictBySlug } from "@/lib/supabase/queries/conflicts";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

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

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be signed in" }, { status: 401 });
  }

  const conflict = await getConflictBySlug(slug);
  if (!conflict) {
    return NextResponse.json({ error: "Conflict not found" }, { status: 404 });
  }

  const supabase = createSupabaseServiceClient();

  const { data: row } = await supabase
    .from("conflicts")
    .select("submitted_by")
    .eq("slug", slug)
    .single();

  if (row?.submitted_by !== session.username) {
    return NextResponse.json({ error: "You can only delete conflicts you submitted" }, { status: 403 });
  }

  const { error } = await supabase
    .from("conflicts")
    .delete()
    .eq("slug", slug);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
