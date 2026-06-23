---
review_round: 1
topic: Supply Chain Security
reviewer_persona: "#2 Skeptical Cybersecurity Manager"
draft_under_review: draft-v1.md
model: anthropic/claude-opus-4-7
---

# Review Round 1 — Supply Chain Security

## Verdict

**REVISE.**

The draft is well-written, demonstrates real subject-matter depth, and — credit where due — correctly identifies and discloses the 2022 taxonomy break and the "tripling" framing problem (Section 6 is, by itself, better than most published vendor analyses of this report). However, there are enough blocking issues around source quality, jargon, and a small handful of unverifiable citations that I cannot approve as-is. Most are tractable in one revision pass.

I want to be explicit about one thing before the fix list: the *substance* of the analysis is largely defensible. My objections are about supporting infrastructure (sources, definitions, page-number rigor), not the trendline conclusions.

---

## Required Fixes (BLOCKING)

1. **Section "Sources / Accepted" — Eclypsium source materially mis-described.**
   The draft characterizes the Eclypsium piece (Chase Snyder, "DBIR 2026: Network Asset Breaches Up 3x...") as a supply-chain analysis. Reading it end-to-end, the analytical body is closer to **~800 words, not ~1200**, and the topic is **vulnerability remediation / network-edge devices**, not supply-chain. "Supply chain" appears in the post only in the navigation chrome (Eclypsium's product category) and not in the analysis itself. The JPMorganChase CISO quote is about edge-device legacy architecture, which the draft re-frames as "firmware supply chain." That is the author's framing, not Eclypsium's. **Required change:** either move this citation to Topic-4 (Vuln Remediation) where it actually fits, or replace it with a genuine third supply-chain-specific source ≥1500 words. Do not paper this over by re-stating the firmware-supply-chain framing — methodology §1.2 requires the source itself to do the analysis.

2. **Section "Sources / Accepted" — Qualys source overstated, borderline on the vendor-fluff filter.**
   The Qualys post is real and roughly the claimed length (~1500–1600 words of body text), but: (a) the "Supply Chain and Third-Party Risks" section the draft leans on is **one paragraph plus one quoted sentence** — not the bulk of the post; the post is primarily about vulnerability exploitation and Qualys VMDR; (b) the post contains repeated Qualys product placements ("Qualys VMDR offers comprehensive coverage…", "Qualys takes pride in its ability…", "Our methodology, using QIDs…"). It is close to the line for the "primarily a product pitch" rejection criterion. (c) The draft's claim that the author "Saeed Abbasi" is "a Verizon DBIR contributor" is sloppy — *Qualys* contributes data; the individual author is a Qualys threat researcher, not a named DBIR contributor. **Required change:** down-grade the description to honestly reflect that this is a Qualys analyst's broad DBIR readout containing one supply-chain paragraph, and either (i) accept it with that honest characterization plus a second supply-chain-heavy source, or (ii) replace it.

3. **Section 2, 2024 bullet — un-verifiable specific page citations need confirmation or page-TBD treatment.**
   The draft cites `[DBIR-2024, p.7]` for the 180% (~"tripling") exploit-vuln figure. I spot-checked: that page does contain the "almost tripled (180% increase)" phrase — citation passes. However the draft also cites `[DBIR-2024, p.21]` for the MOVEit count of "1,567 breach notifications." I verified that one as well — passes. **But** the draft's `[DBIR-2024, p.11]` citation in the same bullet attributes the 180% increase to a *second* page; in the source it's a re-discussion, not a new statistic, and the citation is doing double work. Not blocking by itself, but: **consolidate the duplicate citations and confirm every page number in this bullet still matches after consolidation.** See Spot-Check #3 below for the specific concern.

4. **Section 2, 2026 bullet — "37% of organizations had at least one IaaS admin account with MFA disabled."**
   I verified [DBIR-2026, p.22]: the report says "37% of organizations had an admin account with MFA disabled on an IaaS offering." Citation **passes** but the draft's paraphrase ("had at least one IaaS admin account") subtly broadens the statistic. The DBIR phrasing is closer to "an admin account" (singular, point-in-time). **Required change:** mirror the DBIR phrasing exactly or drop the "at least one" qualifier, which I can't substantiate from the source page.

5. **Section 1 — Jargon-heavy paragraph fails the manager-readability check.**
   In two sentences I count: SCIM, SAML federation trusts, OAuth grants, IAB (in Section 3 table footnote), VERIS, MFA, MSP, CSPM, IaaS, OIDC, PKCE, KEV, TPCRM, and — introduced later without definition — SBOM, Sigstore, SLSA, MCP, CRA. The draft's prompt specifically lists SCIM, SSPM, CASB, OAuth scopes, SBOM, Sigstore, MOVEit, Snowflake as requiring first-appearance definitions. Of those: **MOVEit** is referenced ~10× before being implicitly defined; **SBOM, Sigstore, SCIM, SSPM, CASB** are used cold; **Snowflake** is treated as common knowledge in the Section 1 introductory text. I, the manager, should not have to context-switch this hard. **Required change:** add parenthetical first-appearance definitions for at minimum: SCIM, SSPM, CASB, SBOM, Sigstore, OAuth (scopes/grants), MOVEit (file-transfer software), Snowflake (cloud data warehouse SaaS). One short clause each is enough — don't bloat the doc.

6. **Section 3, MITRE table — T1078 row is broader than the cited evidence supports.**
   The "Valid Accounts (generic stolen-credentials-via-partner pattern, including IAB ecosystem)" row cites `[DBIR-2023, p.31]` and `[DBIR-2024, p.21]`. The 2023 p.31 reference is the Social Engineering pattern summary — it lists T1550.001 and T1078 in a list of ATT&CK techniques associated with Social Engineering, *not* a partner-credential pattern. The draft is conflating a generic Valid Accounts technique with a "stolen-credentials-via-partner" sub-narrative that the DBIR itself doesn't actually slice that way until 2025. **Required change:** either narrow this row's framing (drop "stolen-credentials-via-partner") or replace the 2023 citation with a 2025 page that actually frames the credential-via-partner story (e.g., the Snowflake discussion at [DBIR-2025, p.16] or [DBIR-2025, p.53], both of which are already in your index).

7. **Section 5 — "AppOmni, Obsidian, Adaptive Shield (CrowdStrike Falcon Shield), and Valence are the named category leaders."**
   Named-leader claims about specific vendors need a source. The DBIR does not name SSPM vendors; neither does the methodology let you assert "named category leaders" without a citation. This reads like analyst opinion presented as fact. **Required change:** either (a) cite Gartner/Forrester/etc. and confirm the vendors named, or (b) re-phrase as "Examples of vendors in this category include …" without the "named category leaders" framing.

---

## Strong Suggestions (NON-BLOCKING)

1. **Section 6 — the "tripling" caveat is the strongest paragraph in the draft.** It correctly disentangles a real source-of-numbers problem. Consider promoting one sentence of it into Section 2's 2024 bullet so the reader doesn't first hear the framing and then six paragraphs later read the caveat. Lead with the qualifier.

2. **Section 2 — the 2023 "dip" framing could be sharper.** You correctly call this a sample-composition effect, but a manager reading this will still walk away thinking supply-chain risk dropped in 2023. One additional sentence — e.g., "the underlying risk did not decline; the prominent vector simply changed from supplier-pushed updates to customer-side vuln exploitation" — would prevent the wrong takeaway.

3. **Section 4 — MOVEit notification count.** The "1,567 breach notifications" figure is correctly cited but worth flagging that this is a *notification* count, not a unique-victim count or a Verizon-confirmed-breach count. The DBIR is explicit about this on p.21. Adding "(notifications, not confirmed incidents)" parenthetically would survive a future auditor's reading.

4. **Section 5 — telemetry block is strong but the SaaS list could use a sanity-check.** "Salesforce `REPORT_EXPORT`" is the correct event name; "M365 `MailItemsAccessed`" is the correct event name. Good. But "Snowflake `COPY INTO @stage`" is a SQL action, not an audit event name — the Snowflake audit field is `query_text` containing that SQL pattern, or the `data_transfer_history` view. Sub-fix on phrasing only.

5. **Section 7 — the agentic-AI / MCP point.** You're citing [DBIR-2026, p.22] for an "already warns on agentic-AI service accounts" claim. The page I read covers TPCRM survival analysis and MFA-disabled admin accounts; the agentic-AI warning is elsewhere in the 2026 report (the GenAI section around p.61–65). The substantive forecast is fine; the citation page is probably wrong. Verify and re-cite.

6. **Section 5 partner-tier access review tied to the 2026 archetypes** is the single most useful operational paragraph in the brief. Consider pulling it forward — it's currently buried at the end.

7. **"Shai-Hulud npm worm" appears in three sections without definition.** Even practitioners won't all recognize it. One-clause definition on first use.

---

## Spot-Check Results

I spot-checked three quantitative claims against the page-level JSON extracts. Methodology: pulled the exact page text from `02-extracted/text/<year>-dbir.pages.json` and compared the claim's wording to the source.

| # | Citation under test | Claim in draft | Result | Notes |
|---|---|---|---|---|
| 1 | `[DBIR-2025, p.17]` | "Median time to remediate a leaked secret in a public GitHub repo: 94 days; 43% of disclosed cloud-infrastructure secrets are Google Cloud API keys." | **PASS** | Page 17 contains both: the 94-day median time and the 43% Google Cloud API keys figure, verbatim. |
| 2 | `[DBIR-2026, p.22]` | "MFA-related exposures take a median ~1 month to remediate with a 32% lingering rate, and 37% of organizations had at least one IaaS admin account with MFA disabled." | **PASS with nit** | Page 22 confirms the ~1-month median, the 32% lingering tail (paraphrased from "tail converges to roughly 32%"), and "37% of organizations had an admin account with MFA disabled on an IaaS offering." The draft's "at least one" insertion is a paraphrase the source doesn't authorize. See Blocking Fix #4. |
| 3 | `[DBIR-2024, p.7]` | "Exploit-vuln as an initial action variety tripled (180% growth)…" | **PASS** | Page 7 contains "almost tripled (180% increase) from last year." Citation accurate. (The secondary [DBIR-2024, p.11] citation in the same bullet is redundant but not wrong — it's the same statistic restated; see Blocking Fix #3.) |

**Spot-check summary: 3 of 3 page-number citations verified; 2 fully clean, 1 with a paraphrase nit that is being treated as a blocking fix on phrasing rather than on the citation itself.**

I deliberately spot-checked recent-year, high-stakes citations (the ones the analysis hangs on). I did not re-verify the 2020–2022 citations because the trendline argument doesn't depend on them numerically and they are clearly bounded by the taxonomy disclaimer the author already added in Section 6.

---

## Counter-Evidence Check (Checklist Item E)

The author handled the 2022 taxonomy break explicitly in Section 6 and in the Section 2 narrative. I want to record that I looked for silent cross-taxonomy comparisons and found:
- The 2022 "step-function" framing is correctly tied to the introduction of the Supply Chain pattern, not presented as a real-world spike.
- The 2024 "9% baseline" is correctly flagged as a retroactive re-cut, not the originally published 2023 number.
- The 15% → 30% → 48% trajectory does compare three numbers that are all from the post-2022 taxonomy, so no cross-break arithmetic.

This part of the draft is unusually careful. I have no blocking issue under Item E.

---

## Note for Round 2

If Required Fixes 1 and 2 cannot both be resolved (i.e., the author cannot find a genuine third ≥1500-word supply-chain-focused source), I will accept the draft with only two sources cited and a documented note in Section 6 about the third-source gap. That is a worse outcome than finding a real third source, but it is better than padding the source list with a piece that doesn't fit the methodology.
