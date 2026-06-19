import type { AcledEvent, ReliefWebReport, UnhcrStatEntry } from "@/types/api";
import type { ConflictSource } from "@/types/conflict";

export function getTotalFatalitiesFromAcled(events: AcledEvent[]): number {
  return events.reduce((sum, event) => sum + (event.fatalities ?? 0), 0);
}

export function getSummaryFromReliefWeb(report: ReliefWebReport): string {
  const body = report.fields.body ?? "";
  const firstParagraph = body.split("\n").find((line) => line.trim().length > 0) ?? "";
  return firstParagraph.slice(0, 300).trim();
}

export function getSourceFromReliefWeb(report: ReliefWebReport): ConflictSource {
  const source = report.fields.source?.[0];
  return {
    name: source?.name ?? "ReliefWeb",
    url: report.fields.url,
  };
}

export function getTotalDisplacedFromUnhcr(entry: UnhcrStatEntry): number {
  return (entry.refugees ?? 0) + (entry.idps ?? 0) + (entry.asylum_seekers ?? 0);
}
