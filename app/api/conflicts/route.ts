import { NextRequest, NextResponse } from "next/server";
import { getAllConflicts } from "@/lib/supabase/queries/conflicts";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
  try {
    const conflicts = await getAllConflicts();
    return NextResponse.json(conflicts);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type SourceInput = { name: string; url: string };

type SubmissionInput = {
  title: string;
  country: string;
  region: string;
  summary: string;
  keyFacts: string[];
  sources: SourceInput[];
  imageUrl?: string;
};

function validateSubmission(body: Record<string, unknown>): SubmissionInput | string {
  const { title, country, region, summary, sources, imageUrl } = body;

  if (!title || typeof title !== "string" || title.trim().length < 3) {
    return "Title is required and must be at least 3 characters";
  }
  if (!country || typeof country !== "string" || country.trim().length < 2) {
    return "Country is required";
  }
  if (!region || typeof region !== "string" || region.trim().length < 2) {
    return "Region is required";
  }
  if (!summary || typeof summary !== "string" || summary.trim().length < 50) {
    return "Summary is required and must be at least 50 characters";
  }
  if (!Array.isArray(sources) || sources.length === 0) {
    return "At least one source is required";
  }

  const { keyFacts } = body as { keyFacts?: string[] };

  return {
    title: title.trim(),
    country: country.trim(),
    region: region.trim(),
    summary: summary.trim(),
    keyFacts: Array.isArray(keyFacts) ? keyFacts.filter((f): f is string => typeof f === "string" && f.trim().length > 0) : [],
    sources: sources as SourceInput[],
    imageUrl: typeof imageUrl === "string" && imageUrl.trim() ? imageUrl.trim() : undefined,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validated = validateSubmission(body);

  if (typeof validated === "string") {
    return NextResponse.json({ error: validated }, { status: 400 });
  }

  const session = await getSession();
  const slug = slugify(validated.title);

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("conflicts")
      .insert({
        slug,
        title: validated.title,
        country: validated.country,
        country_code: "",
        region: validated.region,
        status: "active",
        started_at: "",
        summary: validated.summary,
        key_facts: validated.keyFacts,
        sources: validated.sources,
        actions: [],
        image_url: validated.imageUrl ?? null,
        submitted_by: session?.username ?? "anonymous",
      })
      .select("slug")
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ error: "A conflict with this title already exists" }, { status: 409 });
      }
      throw new Error(error.message);
    }

    return NextResponse.json({ slug: data.slug }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
