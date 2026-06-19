import { NextRequest, NextResponse } from "next/server";
import { createUser, findUserByUsername } from "@/lib/supabase/queries/users";
import { hashPassword } from "@/lib/auth/hash";
import { createSessionToken, buildSessionCookie } from "@/lib/auth/session";

const USERNAME_MIN = 3;
const USERNAME_MAX = 30;
const PASSWORD_MIN = 6;

function validateInput(username: string, password: string): string | null {
  if (username.length < USERNAME_MIN) return `Username must be at least ${USERNAME_MIN} characters`;
  if (username.length > USERNAME_MAX) return `Username must be at most ${USERNAME_MAX} characters`;
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) return "Username can only contain letters, numbers, _ and -";
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters`;
  return null;
}

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validationError = validateInput(username ?? "", password ?? "");
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const existing = await findUserByUsername(username);
  if (existing) {
    return NextResponse.json({ error: "Username already taken" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await createUser(username, passwordHash);
  const token = await createSessionToken({ userId: user.id, username: user.username });

  return NextResponse.json(
    { user: { id: user.id, username: user.username } },
    { status: 201, headers: { "Set-Cookie": buildSessionCookie(token) } }
  );
}
