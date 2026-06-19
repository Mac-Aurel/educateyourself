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
  region: string;
  status: ConflictStatus;
  started_at: string;
  summary: string;
  key_facts: string[];
  fatalities: number | null;
  displaced: number | null;
  refugees: number | null;
  children_affected: number | null;
  image_url: string | null;
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
  region: string;
  status: ConflictStatus;
  startedAt: string;
  summary: string;
  keyFacts: string[];
  fatalities: number | null;
  displaced: number | null;
  refugees: number | null;
  childrenAffected: number | null;
  imageUrl: string | null;
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
  | "region"
  | "status"
  | "startedAt"
  | "summary"
  | "fatalities"
  | "displaced"
  | "imageUrl"
  | "lastSyncedAt"
>;
