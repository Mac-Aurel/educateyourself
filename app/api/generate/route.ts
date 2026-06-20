import { NextRequest, NextResponse } from "next/server";

type GeneratedSource = { name: string; url: string };

type GeneratedContent = {
  summary: string;
  keyFacts: string[];
  sources: GeneratedSource[];
  region: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}

async function searchWikipedia(query: string): Promise<{ summary: string; url: string } | null> {
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + " conflict crisis")}&srlimit=3&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    const results = searchData.query?.search;
    if (!results || results.length === 0) return null;

    const pageTitle = results[0].title;
    const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts&exintro=false&explaintext=true&exsectionformat=plain&format=json&origin=*`;
    const contentResponse = await fetch(contentUrl);
    const contentData = await contentResponse.json();
    const pages = contentData.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as { extract?: string; title?: string };
    const extract = page.extract ?? "";

    const paragraphs = extract.split("\n").filter((p: string) => p.trim().length > 100);
    const summary = paragraphs.slice(0, 5).join("\n\n");

    return {
      summary: summary.slice(0, 2000),
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/ /g, "_"))}`,
    };
  } catch {
    return null;
  }
}

async function searchReliefWeb(country: string): Promise<{
  summary: string;
  sources: GeneratedSource[];
  keyFacts: string[];
}> {
  try {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 6);

    const response = await fetch(
      `https://api.reliefweb.int/v1/reports?appname=${process.env.RELIEFWEB_APP_NAME ?? "raiseurvoice"}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filter: {
            operator: "AND",
            conditions: [
              { field: "country.name", value: country },
              { field: "date.created", value: { from: cutoff.toISOString() }, operator: "range" },
            ],
          },
          fields: { include: ["title", "body", "date.created", "source", "url"] },
          sort: ["date.created:desc"],
          limit: 10,
        }),
      }
    );

    if (!response.ok) return { summary: "", sources: [], keyFacts: [] };

    const json = await response.json();
    const reports = json.data ?? [];
    if (reports.length === 0) return { summary: "", sources: [], keyFacts: [] };

    const summaryParts: string[] = [];
    for (const report of reports.slice(0, 3)) {
      const body = stripHtml(report.fields.body ?? "");
      const paragraphs = body.split(/\n/).filter((p: string) => p.trim().length > 60);
      if (paragraphs.length > 0) summaryParts.push(paragraphs[0]);
    }

    const keyFacts: string[] = [];
    for (const report of reports) {
      const body = stripHtml(report.fields.body ?? "");
      const sentences = body.split(/[.!]/).map((s: string) => s.trim());
      for (const sentence of sentences) {
        const hasStats = /\d[\d,.]*\s*(million|billion|people|children|displaced|killed|refugees|dead|wounded|affected|households|families)/i.test(sentence);
        if (hasStats && sentence.length > 30 && sentence.length < 250 && keyFacts.length < 8) {
          const isDuplicate = keyFacts.some((f) => f.slice(0, 40).toLowerCase() === sentence.slice(0, 40).toLowerCase());
          if (!isDuplicate) keyFacts.push(sentence.endsWith(".") ? sentence : sentence + ".");
        }
      }
    }

    const seen = new Set<string>();
    const sources: GeneratedSource[] = [];
    for (const report of reports) {
      const sourceName = report.fields.source?.[0]?.name ?? "ReliefWeb";
      if (!seen.has(sourceName) && sources.length < 5) {
        seen.add(sourceName);
        sources.push({ name: `${sourceName}: ${report.fields.title}`, url: report.fields.url });
      }
    }

    return { summary: summaryParts.join(" "), keyFacts, sources };
  } catch {
    return { summary: "", sources: [], keyFacts: [] };
  }
}

async function searchUNHCR(countryName: string): Promise<{
  displaced: number;
  refugees: number;
  source: GeneratedSource | null;
  facts: string[];
}> {
  try {
    const year = new Date().getFullYear();
    const url = `https://api.unhcr.org/population/v1/population?year=${year}&coo_name=${encodeURIComponent(countryName)}&limit=20`;
    const response = await fetch(url, { headers: { Accept: "application/json" } });
    if (!response.ok) return { displaced: 0, refugees: 0, source: null, facts: [] };

    const json = await response.json();
    const items = json.items ?? [];

    let refugees = 0;
    let idps = 0;
    let asylumSeekers = 0;

    for (const item of items) {
      refugees += item.refugees ?? 0;
      idps += item.idps ?? 0;
      asylumSeekers += item.asylum_seekers ?? 0;
    }

    const total = refugees + idps + asylumSeekers;
    const facts: string[] = [];
    if (refugees > 0) facts.push(`${formatBigNumber(refugees)} refugees have fled the country.`);
    if (idps > 0) facts.push(`${formatBigNumber(idps)} people are internally displaced.`);
    if (total > 0) facts.push(`${formatBigNumber(total)} people displaced in total (refugees, IDPs, and asylum seekers).`);

    return {
      displaced: idps,
      refugees,
      source: total > 0 ? { name: "UNHCR Population Statistics", url: "https://www.unhcr.org/refugee-statistics/" } : null,
      facts,
    };
  } catch {
    return { displaced: 0, refugees: 0, source: null, facts: [] };
  }
}

async function searchGoogleNews(query: string): Promise<GeneratedSource[]> {
  try {
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query + " conflict crisis")}&hl=en&gl=US&ceid=US:en`;
    const response = await fetch(rssUrl);
    if (!response.ok) return [];

    const xml = await response.text();
    const sources: GeneratedSource[] = [];

    const itemRegex = /<item>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<link>([\s\S]*?)<\/link>[\s\S]*?<\/item>/g;
    let match;
    while ((match = itemRegex.exec(xml)) !== null && sources.length < 5) {
      const title = stripHtml(match[1]).replace(/&amp;/g, "&");
      const link = match[2].trim();
      if (title && link) sources.push({ name: title, url: link });
    }

    return sources;
  } catch {
    return [];
  }
}

function formatBigNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} million`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)},000+`;
  return n.toString();
}

function detectRegion(country: string): string {
  const regions: Record<string, string[]> = {
    "East Africa": ["Sudan", "South Sudan", "Somalia", "Ethiopia", "Eritrea", "Kenya", "Uganda", "Tanzania", "Rwanda", "Burundi", "Djibouti"],
    "West Africa": ["Nigeria", "Mali", "Niger", "Burkina Faso", "Cameroon", "Chad", "Guinea", "Senegal", "Sierra Leone", "Liberia", "Ivory Coast", "Ghana", "Togo", "Benin", "Gambia"],
    "Central Africa": ["Democratic Republic of the Congo", "Congo", "Central African Republic", "Gabon", "Equatorial Guinea"],
    "Southern Africa": ["South Africa", "Mozambique", "Zimbabwe", "Zambia", "Malawi", "Angola", "Namibia", "Botswana", "Madagascar"],
    "North Africa": ["Libya", "Egypt", "Tunisia", "Algeria", "Morocco"],
    "Middle East": ["Palestine", "Israel", "Syria", "Iraq", "Yemen", "Lebanon", "Jordan", "Iran", "Saudi Arabia"],
    "South Asia": ["Afghanistan", "Pakistan", "India", "Bangladesh", "Sri Lanka", "Nepal"],
    "Southeast Asia": ["Myanmar", "Philippines", "Thailand", "Indonesia", "Cambodia", "Vietnam", "Laos", "Malaysia"],
    "East Asia": ["China", "North Korea", "Taiwan"],
    "Central Asia": ["Kazakhstan", "Uzbekistan", "Tajikistan", "Kyrgyzstan", "Turkmenistan"],
    "Eastern Europe": ["Ukraine", "Russia", "Belarus", "Moldova", "Georgia", "Armenia", "Azerbaijan"],
    "Latin America": ["Colombia", "Venezuela", "Mexico", "Honduras", "Guatemala", "El Salvador", "Nicaragua", "Brazil", "Ecuador", "Peru"],
    "Caribbean": ["Haiti", "Cuba", "Jamaica", "Dominican Republic"],
  };

  for (const [region, countries] of Object.entries(regions)) {
    if (countries.some((c) => c.toLowerCase() === country.toLowerCase())) return region;
  }
  return "";
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { country, title } = body;

  if (!country || typeof country !== "string" || country.trim().length < 2) {
    return NextResponse.json({ error: "Country is required" }, { status: 400 });
  }

  const searchQuery = title ? `${title} ${country}` : country;

  const [wikipedia, reliefWeb, unhcr, news] = await Promise.all([
    searchWikipedia(searchQuery),
    searchReliefWeb(country.trim()),
    searchUNHCR(country.trim()),
    searchGoogleNews(searchQuery),
  ]);

  const summaryParts: string[] = [];
  if (wikipedia?.summary) summaryParts.push(wikipedia.summary);
  if (reliefWeb.summary) summaryParts.push(reliefWeb.summary);

  const summary = summaryParts.join("\n\n").slice(0, 3000);

  const allFacts = [...unhcr.facts, ...reliefWeb.keyFacts].slice(0, 10);

  const allSources: GeneratedSource[] = [];
  const seenUrls = new Set<string>();

  if (wikipedia) {
    allSources.push({ name: "Wikipedia", url: wikipedia.url });
    seenUrls.add(wikipedia.url);
  }
  for (const s of reliefWeb.sources) {
    if (!seenUrls.has(s.url)) { allSources.push(s); seenUrls.add(s.url); }
  }
  if (unhcr.source && !seenUrls.has(unhcr.source.url)) {
    allSources.push(unhcr.source);
    seenUrls.add(unhcr.source.url);
  }
  for (const s of news) {
    if (!seenUrls.has(s.url) && allSources.length < 10) { allSources.push(s); seenUrls.add(s.url); }
  }

  const region = detectRegion(country.trim());

  const content: GeneratedContent & { message?: string } = {
    summary,
    keyFacts: allFacts,
    sources: allSources,
    region,
  };

  if (!summary && allFacts.length === 0 && allSources.length === 0) {
    content.message = "No information found. You can write your own summary and add sources manually.";
  }

  return NextResponse.json(content);
}
