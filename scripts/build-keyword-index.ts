/**
 * Phase 0 (final step): Build a per-topic keyword index across all 7 DBIRs.
 *
 * For each of the 4 topics, scan every per-page JSON and produce:
 *   - 02-extracted/index/topic-N-<slug>.json    (array of hits with year/page/snippet)
 *   - 02-extracted/index/_summary.json          (counts per topic per year)
 *
 * The Persona #1 agents receive these pre-computed citation candidates so they
 * don't have to re-grep 1.6M characters of raw text.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const TEXT_DIR = join(PROJECT_ROOT, "02-extracted", "text");
const INDEX_DIR = join(PROJECT_ROOT, "02-extracted", "index");

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];

interface Topic {
  id: string;
  slug: string;
  name: string;
  // Each keyword group is OR'd; multiple groups improve recall.
  // We match case-insensitively, word-boundary where useful.
  keywords: RegExp[];
}

const TOPICS: Topic[] = [
  {
    id: "topic-1",
    slug: "nhi",
    name: "Non-human identities",
    keywords: [
      /\bnon-?human\s+ident/i,
      /\bmachine\s+ident/i,
      /\bservice\s+account/i,
      /\bservice\s+principal/i,
      /\bworkload\s+ident/i,
      /\bAPI\s+key/i,
      /\bsecret(s)?\b/i,
      /\bcredential(s)?\s+(leak|expos|stuff|theft)/i,
      /\bsecret(s)?\s+(leak|sprawl|expos)/i,
      /\bSSH\s+key/i,
      /\bcert(ificate)?\s+(rotation|management|theft)/i,
      /\btoken(s)?\s+(theft|abuse|leak|expos)/i,
      /\b(robot|bot)\s+ident/i,
    ],
  },
  {
    id: "topic-2",
    slug: "supply-chain",
    name: "Supply chain security (3rd-party OAuth apps, SaaS security)",
    keywords: [
      /\bsupply\s+chain/i,
      /\bthird[\s-]?party\b/i,
      /\bpartner\b/i,
      /\bOAuth\b/i,
      /\bSaaS\b/i,
      /\bSAML\b/i,
      /\bSSO\b/i,
      /\bMOVEit\b/i,
      /\bSolar\s?Winds\b/i,
      /\bLog4j\b/i,
      /\bvendor\s+(breach|compromise|incident)/i,
      /\b3rd[\s-]?party\b/i,
      /\bnon-business[\s-]relevant/i,
      /\bconnected\s+app/i,
      /\b(third|3rd)[\s-]party\s+(software|service|app|vendor)/i,
    ],
  },
  {
    id: "topic-3",
    slug: "appsec",
    name: "Application security",
    keywords: [
      /\bweb\s+app(lication)?/i,
      /\bAppSec\b/i,
      /\bapplication\s+security/i,
      /\bSAST\b/i,
      /\bDAST\b/i,
      /\bSCA\b/i,
      /\bRASP\b/i,
      /\bWAF\b/i,
      /\bSQL\s*inj/i,
      /\bXSS\b/i,
      /\bCSRF\b/i,
      /\bAPI\s+(abuse|attack|security)/i,
      /\bOWASP\b/i,
      /\bweb\s+application\s+attack/i,
      /\bbasic\s+web\s+app/i,
      /\binsecure\s+(direct\s+)?object/i,
    ],
  },
  {
    id: "topic-4",
    slug: "vuln-remediation",
    name: "Vulnerability remediation",
    keywords: [
      /\bvulnerabilit(y|ies)/i,
      /\bCVE\b/i,
      /\bpatch(ing|ed|es)?\b/i,
      /\bremediation\b/i,
      /\bexploit(ed|ation)?\b/i,
      /\bzero[\s-]?day/i,
      /\bMTTR\b/i,
      /\btime[\s-]to[\s-](patch|remediat|fix)/i,
      /\bKEV\b/i,
      /\bknown\s+exploited/i,
      /\bcatalog\b.{0,40}\bexploit/i,
      /\bvuln(\s+)?management/i,
      /\bedge\s+device/i,
      /\bmass[\s-]exploit/i,
    ],
  },
];

interface PageDoc {
  year: string;
  filename: string;
  pageCount: number;
  totalChars: number;
  pages: Array<{ page: number; text: string; charCount: number }>;
}

interface Hit {
  year: string;
  page: number;
  matchedTerms: string[];
  snippet: string;
  snippetStart: number;
}

const SNIPPET_RADIUS = 240; // chars on either side of the first match

function makeSnippet(text: string, idx: number): { snippet: string; start: number } {
  const start = Math.max(0, idx - SNIPPET_RADIUS);
  const end = Math.min(text.length, idx + SNIPPET_RADIUS);
  let snippet = text.slice(start, end).replace(/\s+/g, " ").trim();
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return { snippet, start };
}

async function loadYear(year: string): Promise<PageDoc | null> {
  try {
    const raw = await readFile(join(TEXT_DIR, `${year}-dbir.pages.json`), "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`  (skipping ${year}: ${(e as Error).message})`);
    return null;
  }
}

async function main() {
  await mkdir(INDEX_DIR, { recursive: true });

  const summary: Record<
    string,
    { name: string; totalHits: number; perYear: Record<string, number> }
  > = {};

  for (const topic of TOPICS) {
    const hits: Hit[] = [];
    const perYear: Record<string, number> = {};

    for (const year of YEARS) {
      const doc = await loadYear(year);
      if (!doc) continue;
      perYear[year] = 0;

      for (const page of doc.pages) {
        const text = page.text;
        const matchedTerms = new Set<string>();
        let firstIdx = -1;

        for (const rx of topic.keywords) {
          const m = rx.exec(text);
          if (m) {
            matchedTerms.add(m[0]);
            if (firstIdx === -1 || m.index < firstIdx) firstIdx = m.index;
          }
        }

        if (matchedTerms.size > 0 && firstIdx >= 0) {
          const { snippet, start } = makeSnippet(text, firstIdx);
          hits.push({
            year,
            page: page.page,
            matchedTerms: Array.from(matchedTerms),
            snippet,
            snippetStart: start,
          });
          perYear[year]++;
        }
      }
    }

    const outPath = join(INDEX_DIR, `${topic.id}-${topic.slug}.json`);
    await writeFile(
      outPath,
      JSON.stringify(
        {
          topic: topic.name,
          id: topic.id,
          slug: topic.slug,
          keywordCount: topic.keywords.length,
          totalHits: hits.length,
          perYear,
          hits,
        },
        null,
        2
      ),
      "utf8"
    );

    summary[topic.id] = { name: topic.name, totalHits: hits.length, perYear };
    console.log(`${topic.id} (${topic.name})`);
    console.log(`  total hits: ${hits.length}`);
    console.log(`  per year:   ${JSON.stringify(perYear)}`);
    console.log(`  -> ${outPath}`);
  }

  const summaryPath = join(INDEX_DIR, "_summary.json");
  await writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(`\nSummary -> ${summaryPath}`);
}

main().catch((err) => {
  console.error("Index build failed:", err);
  process.exit(1);
});
