# Tooling Setup

**Version:** 1.0
**Last updated:** 2026-05-22

This document records the exact toolchain used in the **local prototype** phase.
Cloudflare-deployment tools (wrangler, Workers AI, Vectorize, etc.) are documented
separately in `cloudflare-deployment.md` (added in Phase 6).

---

## 1. Required Tools (Local Phase)

| Tool          | Version Used | Purpose                                          | Install                         |
|---------------|--------------|--------------------------------------------------|---------------------------------|
| Node.js       | 24.15.0      | Runtime for extraction + index scripts           | https://nodejs.org              |
| npm           | 11.12.1      | Package manager                                  | bundled with Node               |
| tsx           | 4.19+        | Run TypeScript directly (no build step)          | `npm i -D tsx`                  |
| pdfjs-dist    | 4.7+         | Per-page PDF text extraction                     | `npm i pdfjs-dist`              |
| TypeScript    | 5.6+         | Type checking                                    | `npm i -D typescript`           |

---

## 2. Verification Commands

After install, verify with:

```powershell
node --version    # expect v24+
npm  --version    # expect 11+
npx tsx --version # expect 4.19+
```

Then validate the extraction tooling on a single PDF:

```powershell
cd dbir-agents
npm install
npm run extract   # populates 02-extracted/text/
npm run index     # populates 02-extracted/index/
```

If `npm run extract` succeeds, you should see:
- 7 `.txt` files in `02-extracted/text/` (one per DBIR year)
- 7 `.pages.json` files in `02-extracted/text/`
- `_index.json` summary in `02-extracted/text/`
- 4 `topic-N-*.json` hit files in `02-extracted/index/`
- `_summary.json` in `02-extracted/index/`

---

## 3. Optional Tools (For Later Phases)

### 3.1 Diagram rendering (Phase 3)

| Tool                | Install                                              |
|---------------------|------------------------------------------------------|
| @mermaid-js/mermaid-cli | `npm i -g @mermaid-js/mermaid-cli`                |
| Graphviz            | `winget install graphviz` (Windows)                  |
|                     | `brew install graphviz` (macOS)                      |
|                     | `apt install graphviz` (Debian/Ubuntu)               |

Verify:
```powershell
mmdc --version     # Mermaid CLI
dot -V             # Graphviz
```

### 3.2 PDF page rendering for diagram screenshots (Phase 3)

For the local prototype we will use `pdfjs-dist` with `@napi-rs/canvas` to render
pages to PNG. On Cloudflare we will swap this for the Browser Rendering API.

Install:
```powershell
npm install @napi-rs/canvas
```

The renderer script (`scripts/render-pages.ts`) will be added in Phase 3 when
Persona #3 needs them.

### 3.3 Cloudflare deployment (Phase 6+)

| Tool       | Install                                |
|------------|----------------------------------------|
| Wrangler   | `npm install -g wrangler`              |
| Auth       | `wrangler login` (OAuth)               |

See `cloudflare-deployment.md` (added Phase 6).

---

## 4. Why No Python?

The original plan considered Python (`pdfplumber`, `pdf2image`, `Pillow`). After
discovering Python is not installed on this machine and Node 24 is, we standardized
on TypeScript. Benefits:
- Same language for local prototype and Cloudflare Workers.
- Zero extra runtime to install.
- `pdfjs-dist` is the canonical PDF library that runs identically in Node and Workers.

---

## 5. Troubleshooting

### `Setting up fake worker failed`
**Cause:** pdfjs-dist 4.x requires the worker module path explicitly.
**Fix (already applied):** `scripts/extract-text.ts` resolves the worker path via
`require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs")` and sets
`GlobalWorkerOptions.workerSrc` before calling `getDocument()`.

### `Cannot find module 'pdfjs-dist/legacy/build/pdf.mjs'`
**Cause:** Ran `npm install` in the wrong folder.
**Fix:** `cd dbir-agents && npm install`.

### Different page counts than documented
The recorded page counts (773 total) are from the specific PDFs Verizon published on
the URLs supplied. If Verizon republishes a PDF (errata releases happen), counts may
shift by ±2 pages.
