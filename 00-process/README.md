# DBIR Multi-Agent Analysis — Reproducibility Runbook

A multi-agent pipeline that analyzes the Verizon Data Breach Investigations Report
(DBIR) across years 2020–2026 and produces a practitioner-grade research brief plus
an executive summary.

This is the **local prototype** phase. Cloudflare deployment instructions are added
in `cloudflare-deployment.md` (Phase 6+).

---

## At a Glance

```
01-raw-pdfs/         7 DBIR PDFs (2020-2026)
02-extracted/text/   per-page text extraction (TypeScript + pdfjs-dist)
02-extracted/index/  per-topic keyword hit index for citation pre-seeding
03-research/         per-topic deep-dive drafts and finals
04-diagrams/         custom Mermaid/Graphviz diagrams + DBIR figure crops
05-executive-summary/ PM-facing 2-3 page brief
06-sources/          bibliography + raw snapshots of third-party sources
00-process/          THIS FOLDER — runbook, persona prompts, methodology
```

---

## Quick Start (Local)

```powershell
# from the repo root
cd dbir-agents
npm install
npm run extract   # parse all 7 PDFs to text + per-page JSON
npm run index     # build the per-topic keyword hit index
```

This is Phase 0. Outputs:
- `02-extracted/text/<year>-dbir.txt`
- `02-extracted/text/<year>-dbir.pages.json`
- `02-extracted/text/_index.json`
- `02-extracted/index/topic-<N>-<slug>.json`
- `02-extracted/index/_summary.json`

Expected: 773 pages, ~1.6M chars across 7 reports.

---

## Phases

| Phase | What                                                              | Status        |
|-------|-------------------------------------------------------------------|---------------|
| 0     | Environment + extraction + keyword index                          | ✅ Complete   |
| 1     | Persona #1 (Analyst) deep-dive on 4 topics, in parallel           | Ready to run  |
| 2     | Persona #2 (Skeptical Manager) review, up to 2 cycles             | Ready to run  |
| 3     | Persona #3 (UX/Designer) creates diagrams + extracts DBIR figures | Ready to run  |
| 4     | Persona #4 (PM) writes 2-3 page executive brief                   | Ready to run  |
| 5     | Reproducibility docs finalization                                  | In progress   |
| 6     | Cloudflare scaffold (wrangler.toml, R2, D1, Vectorize)            | Not started   |
| 7     | Cloudflare deploy (Workflows + Agents SDK + Pages)                | Not started   |

---

## How to Re-run with a Different Threat Intel Report

The pipeline is designed to accept any annual security-report family (Mandiant
M-Trends, CrowdStrike Global Threat Report, IBM Cost of a Data Breach, etc.).
To swap:

1. Replace PDFs in `01-raw-pdfs/`.
2. Edit `scripts/build-keyword-index.ts` — the `YEARS` array and the `TOPICS`
   regex set are the only DBIR-specific bits.
3. Edit `00-process/methodology.md` — sections 5 (taxonomy changes) and 4
   (MITRE mapping) are DBIR-specific.
4. Edit `00-process/agent-personas.md` — the persona system prompts reference
   "DBIR" by name in a handful of places; replace.
5. Re-run `npm run extract && npm run index`.
6. Re-run Phases 1-4 via the agent invocations documented in `agent-personas.md`.

---

## Key Documents

- **agent-personas.md** — versioned system prompts for all 4 personas.
- **methodology.md** — source quality rules, citation format, taxonomy-change
  handling, MITRE mapping convention.
- **tooling-setup.md** — exact tool versions, install commands, troubleshooting.

---

## Decisions Locked at Project Inception

| # | Decision                                            |
|---|-----------------------------------------------------|
| 1 | DBIR scope: 2020–2026 (all 7 years)                 |
| 2 | Diagrams: Mermaid + Graphviz                        |
| 3 | PDF capture: render pages → PNG → crop              |
| 4 | Third-party filter: strict ≥1500 words DBIR analysis|
| 5 | Review loops: max 2 cycles                          |
| 6 | Executive summary: 2–3 pages, 4–6 diagrams          |
| 7 | Docs: Markdown runbook + versioned persona prompts  |
| 8 | Cloudflare adoption: full stack                     |
| 9 | Language: TypeScript on Workers                     |
| 10| Access: Cloudflare Access (one-time PIN via email)  |
| 11| AI Gateway: authenticated (token required)          |
| 12| Domain: default `*.pages.dev`                       |
| 13| Secrets: Cloudflare Secrets Store + `.dev.vars`     |
| 14| Build strategy: local prototype first, then deploy  |
| 15| Run analysis locally now while building pipeline    |

---

## Known Limitations

- LLM output is stochastic — exact wording will vary across runs even with the
  same prompts and same model.
- Page-number extraction can drift by ±1 at section boundaries.
- No OCR — image-only PDF pages are skipped (rare in DBIRs).
- Third-party blog URLs may rot between runs; snapshot capture planned for Phase 6.

---

## License & Attribution

This pipeline analyzes publicly published Verizon DBIRs. All quoted DBIR content
remains © Verizon. Pipeline code: MIT.
