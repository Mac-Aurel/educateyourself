import type { ReliefWebReport, ReliefWebResponse } from "@/types/api";
import { getSummaryFromReliefWeb, getSourceFromReliefWeb } from "@/lib/utils/normalizeConflict";
import type { ConflictSource } from "@/types/conflict";

const RELIEFWEB_BASE_URL = "https://api.reliefweb.int/v1/reports";
const REPORTS_PER_COUNTRY = 5;
const SUMMARY_MAX_DAYS = 90;

function buildReliefWebUrl(): string {
  return `${RELIEFWEB_BASE_URL}?appname=${process.env.RELIEFWEB_APP_NAME ?? "educateyourself"}`;
}

function buildReliefWebBody(country: string): object {
  const cutoffDate = getDateDaysAgo(SUMMARY_MAX_DAYS);

  return {
    filter: {
      operator: "AND",
      conditions: [
        { field: "country.name", value: country },
        { field: "date.created", value: { from: cutoffDate }, operator: "range" },
      ],
    },
    fields: {
      include: ["title", "body", "date.created", "country", "source", "url"],
    },
    sort: ["date.created:desc"],
    limit: REPORTS_PER_COUNTRY,
  };
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export async function fetchReliefWebReports(country: string): Promise<ReliefWebReport[]> {
  const url = buildReliefWebUrl();

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildReliefWebBody(country)),
  });

  if (!response.ok) {
    throw new Error(`ReliefWeb request failed for "${country}": ${response.statusText}`);
  }

  const json: ReliefWebResponse = await response.json();
  return json.data;
}

export function extractSummary(report: ReliefWebReport): string {
  return getSummaryFromReliefWeb(report);
}

export function extractSource(report: ReliefWebReport): ConflictSource {
  return getSourceFromReliefWeb(report);
}

export function extractAllSources(reports: ReliefWebReport[]): ConflictSource[] {
  return reports.map(getSourceFromReliefWeb);
}
