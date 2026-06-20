import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "You must be signed in to like" }, { status: 401 });
  }

  const { discussionId } = await request.json();
  if (!discussionId || typeof discussionId !== "string") {
    return NextResponse.json({ error: "Missing discussionId" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  const { data: existing } = await supabase
    .from("discussion_likes")
    .select("id")
    .eq("discussion_id", discussionId)
    .eq("user_id", session.userId)
    .single();

  if (existing) {
    await supabase
      .from("discussion_likes")
      .delete()
      .eq("id", existing.id);

    return NextResponse.json({ liked: false });
  }

  const { error } = await supabase
    .from("discussion_likes")
    .insert({ discussion_id: discussionId, user_id: session.userId });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ liked: true });
}
