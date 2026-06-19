export type ConflictStatus = "active" | "monitoring" | "resolved";

export type ConflictAction = {
  label: string;
  url: string;
};

export type ConflictSource = {
  name: string;
  url: string;
};

export type Conflict = {
  id: string;
  slug: string;
  title: string;
  country: string;
  status: ConflictStatus;
  summary: string;
  fatalities: number | null;
  displaced: number | null;
  sources: ConflictSource[];
  actions: ConflictAction[];
  lastSyncedAt: string;
  createdAt: string;
};

export type ConflictSummary = Pick<
  Conflict,
  "id" | "slug" | "title" | "country" | "status" | "summary" | "fatalities" | "displaced" | "lastSyncedAt"
>;
