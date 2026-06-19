export type ConflictStatus = "active" | "monitoring" | "resolved";

export type ConflictAction = {
  label: string;
  url: string;
};

export type ConflictSource = {
  name: string;
  url: string;
};

// Shape returned directly from Supabase (snake_case columns)
export type ConflictRow = {
  id: string;
  slug: string;
  title: string;
  country: string;
  country_code: string;
  status: ConflictStatus;
  summary: string;
  fatalities: number | null;
  displaced: number | null;
  sources: ConflictSource[];
  actions: ConflictAction[];
  last_synced_at: string | null;
  created_at: string;
};

// App-facing type (camelCase) — produced by mapConflictRow()
export type Conflict = {
  id: string;
  slug: string;
  title: string;
  country: string;
  countryCode: string;
  status: ConflictStatus;
  summary: string;
  fatalities: number | null;
  displaced: number | null;
  sources: ConflictSource[];
  actions: ConflictAction[];
  lastSyncedAt: string | null;
  createdAt: string;
};

export type ConflictSummary = Pick<
  Conflict,
  | "id"
  | "slug"
  | "title"
  | "country"
  | "countryCode"
  | "status"
  | "summary"
  | "fatalities"
  | "displaced"
  | "lastSyncedAt"
>;
