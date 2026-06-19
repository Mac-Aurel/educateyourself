import type { AcledEvent, AcledResponse } from "@/types/api";
import { getTotalFatalitiesFromAcled } from "@/lib/utils/normalizeConflict";

const ACLED_BASE_URL = "https://api.acleddata.com/acled/read";
const ACLED_FIELDS = "event_id_cnty,event_date,country,event_type,fatalities,notes";
const ACLED_RESULTS_PER_COUNTRY = 500;

function buildAcledUrl(country: string): string {
  const params = new URLSearchParams({
    key: process.env.ACLED_API_KEY!,
    email: process.env.ACLED_EMAIL!,
    country,
    fields: ACLED_FIELDS,
    limit: String(ACLED_RESULTS_PER_COUNTRY),
    // Last 12 months only
    event_date: getOneYearAgoDate(),
    event_date_where: "BETWEEN",
    event_date2: getTodayDate(),
  });

  return `${ACLED_BASE_URL}?${params.toString()}`;
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function getOneYearAgoDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString().split("T")[0];
}

export async function fetchAcledEvents(country: string): Promise<AcledEvent[]> {
  const url = buildAcledUrl(country);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ACLED request failed for "${country}": ${response.statusText}`);
  }

  const json: AcledResponse = await response.json();

  if (json.status !== 200) {
    throw new Error(`ACLED returned error status ${json.status} for "${country}"`);
  }

  return json.data;
}

export function getTotalFatalities(events: AcledEvent[]): number {
  return getTotalFatalitiesFromAcled(events);
}

export function getMostRecentEvent(events: AcledEvent[]): AcledEvent | null {
  if (events.length === 0) return null;

  return events.reduce((latest, event) =>
    event.event_date > latest.event_date ? event : latest
  );
}
