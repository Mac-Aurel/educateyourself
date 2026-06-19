export type AppUser = {
  id: string;
  username: string;
  createdAt: string;
};

export type SessionPayload = {
  userId: string;
  username: string;
};

export type AuthResult =
  | { success: true; user: AppUser }
  | { success: false; error: string };
