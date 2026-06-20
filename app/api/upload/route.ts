import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServiceClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024;
const BUCKET = "conflict-images";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG, and WebP images are allowed" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const extension = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  try {
    const supabase = createSupabaseServiceClient();

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file, { contentType: file.type });

    if (error) throw new Error(error.message);

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(fileName);

    return NextResponse.json({ url: urlData.publicUrl }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
