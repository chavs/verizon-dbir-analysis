# Methodology — DBIR Multi-Agent Analysis

**Version:** 1.0
**Last updated:** 2026-05-22

---

## 1. Sources

### 1.1 Primary
Verizon Data Breach Investigations Report, editions 2020 through 2026. All seven PDFs
were downloaded from official Verizon URLs and stored under `01-raw-pdfs/`. SHA-256
hashes can be regenerated for integrity checks via `scripts/verify-pdf-hashes.ts`
(future addition).

### 1.2 Secondary (Third-Party)
A blog or paper qualifies as a secondary source **only if** it spends **≥1500 words
analyzing DBIR data**. Counting rules:
- The 1500-word floor refers to substantive analytical text *about the DBIR*, not the
  total post length. A 5000-word post that mentions DBIR in one paragraph **fails**.
- Lists of stats with no synthesis fail.
- A piece that contrasts DBIR data with the vendor's own telemetry **passes**, provided
  the cross-reference is genuine analysis (not a sales argument).
- Verizon's own VTRAC posts and DBIR webinar transcripts qualify.

Persona #2 enforces this filter during review.

---

## 2. Citation Format

| Source type | Inline form |
|---|---|
| DBIR primary | `[DBIR-2024, p.43]` |
| DBIR figure | `[DBIR-2024, p.43, Fig. 12]` |
| Third-party | `[Vendor "Title", https://...]` |
| Verizon VTRAC | `[VTRAC "Title", https://...]` |

Page numbers reference the PDF page index, which matches both the rendered PNGs
in `02-extracted/pages-raw/` and the per-page JSON entries.

---

## 3. Topics in Scope

| ID       | Slug              | Topic                                                       |
|----------|-------------------|-------------------------------------------------------------|
| topic-1  | nhi               | Non-human identities                                        |
| topic-2  | supply-chain      | Supply chain security (3rd-party OAuth apps, SaaS security) |
| topic-3  | appsec            | Application security                                        |
| topic-4  | vuln-remediation  | Vulnerability remediation                                   |

Topic definitions are intentionally broad to allow Persona #1 to draw the boundaries
inside Section 1 of each draft. The keyword regex set (in `scripts/build-keyword-index.ts`)
is the operational definition for the pre-indexed citation candidates.

---

## 4. MITRE ATT&CK Mapping

Where Persona #1 references attacker behavior, they should map to ATT&CK Enterprise
matrix v15 or later. Format:

```
| Tactic | Technique ID | Technique Name | Observed in |
|--------|--------------|----------------|-------------|
| Initial Access | T1199 | Trusted Relationship | DBIR-2024 p.27, DBIR-2025 p.31 |
```

If a behavior doesn't map cleanly, leave Technique ID blank and explain.

---

## 5. Handling DBIR Taxonomy Changes

The DBIR has changed its taxonomy several times in the 2020–2026 window:
- 2021: "Action varieties" categorization shifted.
- 2022: Introduction of explicit "Supply Chain" pattern.
- 2023: Vulnerability exploitation broken out from "Hacking" actions.
- 2025: Cleaner separation of "Vulnerabilities" as a primary breach initial vector.

When trendline charts span these breaks, Persona #1 **must** annotate the chart or
table with the year of the break. Persona #2 will reject silent comparisons across
taxonomy changes.

---

## 6. Review Loop

- Round 1: Persona #2 reviews Persona #1's `draft-v1.md`.
- Persona #1 revises into `draft-v2.md` addressing all blocking issues.
- Round 2: Persona #2 reviews `draft-v2.md`.
- The result of Round 2 becomes `final.md` regardless of verdict.
- Any unresolved blocking issues from Round 2 are listed under an
  `## Appendix: Unresolved Disputes` heading in `final.md`.

This caps total review time at predictable budget.

---

## 7. Diagram Standards

- Mermaid version: 10.x syntax.
- Graphviz version: 2.50+ syntax (`dot` engine for hierarchical, `neato` for
  relationship maps).
- All custom diagrams rendered at 1600×900 minimum.
- Extracted DBIR figures retained at full source resolution (350 DPI page render
  default).
- File naming: `<topic-slug>-<short-name>.{mmd,dot,png}`.

---

## 8. Cross-Cutting Trend Identification (Persona #4)

A "cross-cutting trend" qualifies for the executive brief only if it appears in
≥2 of the 4 topic finals OR is supported by a unidirectional DBIR trendline across
≥4 of the 7 years. Persona #4 must cite which condition each trend satisfies.

---

## 9. Reproducibility Guarantees

This methodology will produce the same artifact set if:
- The same 7 PDFs are placed in `01-raw-pdfs/`.
- The same persona prompt versions (recorded in `agent-personas.md`) are used.
- The same LLM model + temperature are used (recorded in each `final.md` frontmatter).
- The same keyword regex set is used (versioned via git).

Stochastic variation in LLM output is documented as a known limitation.

---

## 10. Limitations

- **Page numbers extracted from PDF may drift by ±1** at section boundaries when
  PDF page numbering and printed page numbering differ. Persona #2 spot-checks
  mitigate this.
- **OCR is NOT applied.** If a DBIR has image-only pages (rare), text extraction
  will return empty strings for those pages.
- **Third-party source freshness** — blog URLs may rot. A snapshot via `webfetch`
  is captured in `06-sources/raw-snapshots/<hash>.html` (future addition).
