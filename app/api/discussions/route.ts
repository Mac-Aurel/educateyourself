import { NextRequest, NextResponse } from "next/server";
import { getDiscussionsByConflict } from "@/lib/supabase/queries/discussions";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapDiscussionRow } from "@/lib/utils/mappers";
import { getSession } from "@/lib/auth/session";
import type { DiscussionRow } from "@/types/discussion";

type MessageInput = {
  conflictId: string;
  parentId: string | null;
  authorName: string;
  content: string;
};

function validateMessageInput(body: Record<string, unknown>): MessageInput | string {
  const { conflictId, parentId, content } = body;

  if (!conflictId || typeof conflictId !== "string") {
    return "Missing or invalid conflictId";
  }
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    return "Missing or empty content";
  }
  if (parentId !== null && parentId !== undefined && typeof parentId !== "string") {
    return "Invalid parentId";
  }

  return {
    conflictId,
    parentId: (parentId as string) ?? null,
    authorName: "",
    content: content.trim(),
  };
}

export async function GET(request: NextRequest) {
  const conflictId = request.nextUrl.searchParams.get("conflictId");
  if (!conflictId) {
    return NextResponse.json({ error: "Missing conflictId query parameter" }, { status: 400 });
  }

  try {
    const messages = await getDiscussionsByConflict(conflictId);
    return NextResponse.json(messages);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = validateMessageInput(body);

  if (typeof validated === "string") {
    return NextResponse.json({ error: validated }, { status: 400 });
  }

  const session = await getSession();
  const authorName = session ? session.username : (body.authorName as string);

  if (!authorName || typeof authorName !== "string" || authorName.trim().length === 0) {
    return NextResponse.json({ error: "Missing authorName (required for anonymous posts)" }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("discussions")
      .insert({
        conflict_id: validated.conflictId,
        parent_id: validated.parentId,
        user_id: session?.userId ?? null,
        author_name: authorName.trim(),
        content: validated.content,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to post message: ${error.message}`);

    return NextResponse.json(mapDiscussionRow(data as DiscussionRow), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
