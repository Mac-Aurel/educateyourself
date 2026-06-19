import { createSupabaseServiceClient } from "@/lib/supabase/server";
import type { AppUser } from "@/types/auth";

type UserRow = {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
};

function mapUserRow(row: UserRow): AppUser {
  return { id: row.id, username: row.username, createdAt: row.created_at };
}

export async function findUserByUsername(username: string): Promise<(AppUser & { passwordHash: string }) | null> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("app_users")
    .select("id, username, password_hash, created_at")
    .eq("username", username)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Failed to find user "${username}": ${error.message}`);
  }

  const row = data as UserRow;
  return { ...mapUserRow(row), passwordHash: row.password_hash };
}

export async function createUser(username: string, passwordHash: string): Promise<AppUser> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase
    .from("app_users")
    .insert({ username, password_hash: passwordHash })
    .select("id, username, created_at")
    .single();

  if (error) {
    if (error.code === "23505") throw new Error("Username already taken");
    throw new Error(`Failed to create user: ${error.message}`);
  }

  return mapUserRow(data as UserRow);
}
