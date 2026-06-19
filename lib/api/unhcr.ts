import type { UnhcrStatEntry, UnhcrResponse } from "@/types/api";
import { getTotalDisplacedFromUnhcr } from "@/lib/utils/normalizeConflict";

const UNHCR_BASE_URL = "https://api.unhcr.org/population/v1/population";
const CURRENT_YEAR = new Date().getFullYear();

function buildUnhcrUrl(countryCode: string): string {
  const params = new URLSearchParams({
    coo: countryCode,
    year: String(CURRENT_YEAR),
    limit: "10",
  });

  return `${UNHCR_BASE_URL}?${params.toString()}`;
}

export async function fetchUnhcrStats(countryCode: string): Promise<UnhcrStatEntry[]> {
  const url = buildUnhcrUrl(countryCode);

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `UNHCR request failed for country code "${countryCode}": ${response.statusText}`
    );
  }

  const json: UnhcrResponse = await response.json();
  return json.items;
}

export function getTotalDisplaced(entries: UnhcrStatEntry[]): number {
  return entries.reduce((sum, entry) => sum + getTotalDisplacedFromUnhcr(entry), 0);
}

export function getRefugeeCount(entries: UnhcrStatEntry[]): number {
  return entries.reduce((sum, entry) => sum + (entry.refugees ?? 0), 0);
}

export function getInternallyDisplacedCount(entries: UnhcrStatEntry[]): number {
  return entries.reduce((sum, entry) => sum + (entry.idps ?? 0), 0);
}
