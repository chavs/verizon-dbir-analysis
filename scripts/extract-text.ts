/**
 * Phase 0: Extract text from all 7 Verizon DBIR PDFs (2020-2026).
 *
 * Reads each PDF in 01-raw-pdfs/, extracts page-by-page text, and writes:
 *   - 02-extracted/text/<year>-dbir.txt          (full text, page-delimited)
 *   - 02-extracted/text/<year>-dbir.pages.json   (per-page text array for citation precision)
 *
 * Uses pdfjs-dist legacy build (works in Node and Cloudflare Workers).
 */
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, basename, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

// Tell pdfjs where the worker lives BEFORE importing getDocument.
const workerPath = require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs");
const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf.mjs");
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const PDF_DIR = join(PROJECT_ROOT, "01-raw-pdfs");
const OUT_DIR = join(PROJECT_ROOT, "02-extracted", "text");

interface PageRecord {
  page: number;
  text: string;
  charCount: number;
}

interface ExtractionResult {
  year: string;
  filename: string;
  pageCount: number;
  totalChars: number;
  pages: PageRecord[];
}

async function extractOne(pdfPath: string): Promise<ExtractionResult> {
  const filename = basename(pdfPath);
  const yearMatch = filename.match(/^(\d{4})/);
  const year = yearMatch ? yearMatch[1] : "unknown";

  const data = new Uint8Array(await readFile(pdfPath));
  const loadingTask = pdfjsLib.getDocument({
    data,
    verbosity: 0,
    useWorkerFetch: false,
    isEvalSupported: false,
    useSystemFonts: true,
    disableFontFace: true,
  });
  const pdf = await loadingTask.promise;

  const pages: PageRecord[] = [];
  let totalChars = 0;

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    let text = "";
    let lastY: number | null = null;
    for (const item of content.items as Array<{ str: string; transform?: number[] }>) {
      const y = item.transform ? item.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
        text += "\n";
      }
      text += item.str + " ";
      if (y !== null) lastY = y;
    }
    text = text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
    pages.push({ page: pageNum, text, charCount: text.length });
    totalChars += text.length;
    page.cleanup();
  }

  const pageCount = pdf.numPages;
  await pdf.destroy();

  return {
    year,
    filename,
    pageCount,
    totalChars,
    pages,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const files = (await readdir(PDF_DIR))
    .filter((f) => f.toLowerCase().endsWith(".pdf"))
    .sort();

  if (files.length === 0) {
    console.error(`No PDFs found in ${PDF_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} PDFs in ${PDF_DIR}`);

  const summary: Array<{ year: string; pages: number; chars: number; outFile: string }> = [];

  for (const f of files) {
    const start = Date.now();
    console.log(`\nExtracting ${f}...`);
    const result = await extractOne(join(PDF_DIR, f));

    const concatenated =
      `# Verizon DBIR ${result.year}\n` +
      `# Source: ${result.filename}\n` +
      `# Pages: ${result.pageCount}\n` +
      `# Extracted: ${new Date().toISOString()}\n\n` +
      result.pages
        .map((p) => `\n===== PAGE ${p.page} =====\n${p.text}\n`)
        .join("");

    const txtPath = join(OUT_DIR, `${result.year}-dbir.txt`);
    const jsonPath = join(OUT_DIR, `${result.year}-dbir.pages.json`);

    await writeFile(txtPath, concatenated, "utf8");
    await writeFile(
      jsonPath,
      JSON.stringify(
        {
          year: result.year,
          filename: result.filename,
          pageCount: result.pageCount,
          totalChars: result.totalChars,
          pages: result.pages,
        },
        null,
        2
      ),
      "utf8"
    );

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(
      `  ${result.pageCount} pages, ${result.totalChars.toLocaleString()} chars in ${elapsed}s`
    );

    summary.push({
      year: result.year,
      pages: result.pageCount,
      chars: result.totalChars,
      outFile: txtPath,
    });
  }

  const indexPath = join(OUT_DIR, "_index.json");
  await writeFile(indexPath, JSON.stringify(summary, null, 2), "utf8");
  console.log(`\nIndex written to ${indexPath}`);
  console.log(
    `\nTotal: ${summary.reduce((s, x) => s + x.pages, 0)} pages, ${summary
      .reduce((s, x) => s + x.chars, 0)
      .toLocaleString()} chars across ${summary.length} reports.`
  );
}

main().catch((err) => {
  console.error("Extraction failed:", err);
  process.exit(1);
});
