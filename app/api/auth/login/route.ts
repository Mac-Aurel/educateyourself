import { NextRequest, NextResponse } from "next/server";
import { findUserByUsername } from "@/lib/supabase/queries/users";
import { verifyPassword } from "@/lib/auth/hash";
import { createSessionToken, buildSessionCookie } from "@/lib/auth/session";

const INVALID_CREDENTIALS_MESSAGE = "Invalid username or password";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 400 });
  }

  const user = await findUserByUsername(username);
  if (!user) {
    return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json({ error: INVALID_CREDENTIALS_MESSAGE }, { status: 401 });
  }

  const token = await createSessionToken({ userId: user.id, username: user.username });

  return NextResponse.json(
    { user: { id: user.id, username: user.username } },
    { headers: { "Set-Cookie": buildSessionCookie(token) } }
  );
}
