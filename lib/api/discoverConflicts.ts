import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils/slugify";

type ReliefWebCountry = {
  name: string;
  iso3: string;
};

type ReliefWebDisaster = {
  id: number;
  fields: {
    name: string;
    country: ReliefWebCountry[];
    type: { name: string }[];
    status: string;
    date: { created: string };
  };
};

type DiscoveredConflict = {
  title: string;
  country: string;
  countryCode: string;
  summary: string;
};

const REGIONS: Record<string, string[]> = {
  "East Africa": ["Sudan", "South Sudan", "Somalia", "Ethiopia", "Eritrea", "Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi"],
  "West Africa": ["Nigeria", "Mali", "Niger", "Burkina Faso", "Cameroon", "Chad", "Guinea", "Senegal", "Sierra Leone"],
  "Central Africa": ["Democratic Republic of the Congo", "Congo", "Central African Republic"],
  "Southern Africa": ["South Africa", "Mozambique", "Zimbabwe", "Zambia", "Angola"],
  "North Africa": ["Libya", "Egypt", "Tunisia", "Algeria", "Morocco"],
  "Middle East": ["Palestine", "Israel", "Syria", "Iraq", "Yemen", "Lebanon", "Jordan", "Iran"],
  "South Asia": ["Afghanistan", "Pakistan", "India", "Bangladesh", "Sri Lanka", "Nepal"],
  "Southeast Asia": ["Myanmar", "Philippines", "Thailand", "Indonesia", "Cambodia"],
  "East Asia": ["China", "North Korea"],
  "Central Asia": ["Kazakhstan", "Uzbekistan", "Tajikistan", "Kyrgyzstan"],
  "Eastern Europe": ["Ukraine", "Russia", "Belarus", "Moldova", "Georgia", "Armenia", "Azerbaijan"],
  "Latin America": ["Colombia", "Venezuela", "Mexico", "Honduras", "Guatemala", "El Salvador", "Ecuador", "Peru"],
  "Caribbean": ["Haiti", "Cuba"],
};

function detectRegion(country: string): string {
  for (const [region, countries] of Object.entries(REGIONS)) {
    if (countries.some((c) => c.toLowerCase() === country.toLowerCase())) return region;
  }
  return "";
}

async function fetchRecentDisasters(): Promise<ReliefWebDisaster[]> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const response = await fetch(
    `https://api.reliefweb.int/v1/disasters?appname=raiseurvoice`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        filter: {
          operator: "AND",
          conditions: [
            { field: "status", value: "ongoing" },
            { field: "date.created", value: { from: thirtyDaysAgo.toISOString() }, operator: "range" },
          ],
        },
        fields: { include: ["name", "country", "type", "status", "date.created"] },
        sort: ["date.created:desc"],
        limit: 20,
      }),
    }
  );

  if (!response.ok) return [];
  const json = await response.json();
  return json.data ?? [];
}

async function fetchSummaryForCountry(country: string): Promise<string> {
  try {
    const response = await fetch(
      `https://api.reliefweb.int/v1/reports?appname=raiseurvoice`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: { field: "country.name", value: country },
          fields: { include: ["title", "body"] },
          sort: ["date.created:desc"],
          limit: 3,
        }),
      }
    );

    if (!response.ok) return "";
    const json = await response.json();
    const reports = json.data ?? [];
    if (reports.length === 0) return "";

    const body = (reports[0].fields.body ?? "")
      .replace(/<[^>]*>/g, "")
      .replace(/&[a-z]+;/g, " ")
      .trim();

    const paragraphs = body.split("\n").filter((p: string) => p.trim().length > 60);
    return paragraphs.slice(0, 4).join(" ").slice(0, 1500);
  } catch {
    return "";
  }
}

function isConflictType(types: { name: string }[]): boolean {
  const conflictTypes = ["conflict", "violence", "war", "armed", "coup", "civil unrest", "epidemic", "flood", "earthquake", "drought", "famine"];
  return types.some((t) => conflictTypes.some((ct) => t.name.toLowerCase().includes(ct)));
}

async function getExistingCountries(): Promise<Set<string>> {
  const supabase = createSupabaseServiceClient();
  const { data } = await supabase.from("conflicts").select("country");
  return new Set((data ?? []).map((r) => r.country.toLowerCase()));
}

export async function discoverNewConflicts(): Promise<{ added: string[]; errors: string[] }> {
  const added: string[] = [];
  const errors: string[] = [];

  const disasters = await fetchRecentDisasters();
  const existingCountries = await getExistingCountries();

  const candidates: DiscoveredConflict[] = [];

  for (const disaster of disasters) {
    if (!isConflictType(disaster.fields.type)) continue;

    for (const country of disaster.fields.country) {
      if (existingCountries.has(country.name.toLowerCase())) continue;

      const alreadyAdded = candidates.some((c) => c.country.toLowerCase() === country.name.toLowerCase());
      if (alreadyAdded) continue;

      candidates.push({
        title: disaster.fields.name,
        country: country.name,
        countryCode: country.iso3,
        summary: "",
      });
    }
  }

  const supabase = createSupabaseServiceClient();

  for (const candidate of candidates.slice(0, 5)) {
    try {
      const summary = await fetchSummaryForCountry(candidate.country);
      if (!summary || summary.length < 50) continue;

      const slug = slugify(candidate.title);
      const region = detectRegion(candidate.country);

      const { error } = await supabase.from("conflicts").insert({
        slug,
        title: candidate.title,
        country: candidate.country,
        country_code: candidate.countryCode,
        region,
        status: "active",
        started_at: "",
        summary,
        key_facts: [],
        sources: [
          { name: "ReliefWeb", url: `https://reliefweb.int/country/${candidate.countryCode.toLowerCase()}` },
        ],
        actions: [],
        image_url: null,
        submitted_by: "auto-sync",
      });

      if (error) {
        if (error.code !== "23505") errors.push(`${candidate.title}: ${error.message}`);
        continue;
      }

      added.push(candidate.title);
    } catch (err) {
      errors.push(`${candidate.title}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return { added, errors };
}
