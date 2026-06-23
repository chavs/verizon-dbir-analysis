# Review Round 1 — Application Security

**Reviewer persona:** Persona #2 — Skeptical Cybersecurity Manager
**Draft reviewed:** `03-research/topic-3-appsec/draft-v1.md`
**Reviewer model:** anthropic/claude-opus-4-7 (cloudflare-ai-gateway)

---

## Verdict

**REVISE.**

The draft is *substantively strong* — the taxonomy narrative is the right story, the MITRE mapping is competent, and the controls in §5 are mostly concrete. But the draft has (a) one citation that misrepresents a sector-specific finding as a global one, (b) an undisclosed independence problem with the Veracode source, (c) a Datadog source the author already half-flags as borderline, and (d) several first-use jargon terms that a non-AppSec reader (i.e., me) cannot decode without Googling. These are fixable in a v2 but they are blocking — I will not approve until they are addressed.

I want to be clear what I am **not** disputing: the central thesis that the keyword-index decline (48→19) is a taxonomy artifact rather than a real reduction in web-app risk is well-argued and the author handled the three big taxonomy events (2021 BWAA split, 2023 Exploit-vuln promotion, 2024 MOVEit-into-System-Intrusion reclassification) explicitly. That is the right move. See `Required Fix #5` for the one taxonomy event I think is underweighted.

---

## Required Fixes (BLOCKING)

### 1. §2 / §3 — "[DBIR-2026, p.83]" misrepresents a *sector-specific* statistic as global

**Location:** §2 (last bullet, "Web applications are the primary vector in 71% of malware-driven breach cases via System Intrusion [DBIR-2026, p.83]") and §3 last paragraph (same citation supporting MITRE T1190 attribution).

**Problem:** I spot-checked DBIR-2026 page 83. The "71% of cases" / Web-application primary vector statistic is in the **Educational Services industry** section (Figures 82 and 83), not a cross-dataset finding. The page reads: "The primary vector of infection is via Web applications (Figure 83), which serve as the front door in 71% of cases" — and Figure 83 is captioned "Top Malware vectors in Educational Services breaches (n=272)." The author has lifted an industry statistic and presented it as a global trend.

**Required change:** Either (a) re-cite to a page where the same claim is made on the full dataset (DBIR-2026 p.32 or the patterns section discusses web-app dominance in System Intrusion globally — find one or drop the claim), or (b) qualify the sentence: "In the Education sector, web applications are the primary malware vector in 71% of malware-driven breach cases [DBIR-2026, p.83]." Industry-specific framing is acceptable but it must be labeled. The current wording overstates the evidence.

### 2. §5 / §6 / Sources — Veracode's independence as a DBIR data contributor is undisclosed conflict

**Location:** §5 bullets on SAST and SCA cite Veracode for KEV-remediation and CWE-survival numbers; Sources §1 calls Veracode a "named data contributor to the 2026 DBIR" but does not flag this as a methodological concern.

**Problem:** Veracode is in the credits section of the 2026 DBIR as a data contributor. When Veracode then publishes a blog summarizing "what the 2026 DBIR reveals," they are partly analyzing data **they themselves provided to Verizon**. That is not independent third-party analysis — it is a primary contributor re-publishing their own underlying telemetry through the DBIR's brand. The methodology §1.2 says a piece must contain "genuine analysis (not a sales argument)," but it doesn't address self-citation by contributors. The author noted the contributor status as a *credit* without flagging that it means the Veracode numbers are **not independent triangulation** of the DBIR — they are upstream input.

**Required change:** Two parts:
1. In §6 (Open Problems), add a paragraph explicitly disclosing that the CWE-survival and KEV-remediation cohort statistics (DBIR-2026 p.32 and the Veracode blog) are drawn from **the same Veracode customer-base SDLC telemetry** — citing the Veracode blog as corroboration of the DBIR data is circular.
2. In Sources, downgrade Veracode from a clean "PASS" to "PASS WITH DISCLOSURE." Note the contributor status next to the source. Add at least one *non-contributor* third-party deep-dive (e.g., a SANS DBIR commentary, a Black Hat / academic AppSec analysis, or a non-contributor vendor like Snyk, Checkmarx, or Synopsys) so the body relies on at least one truly independent secondary source.

This is blocking because the draft currently presents Veracode numbers as if they corroborate the DBIR; in reality, they are mostly *the same data dressed differently*.

### 3. Sources / §5 — Datadog source does not meet the ≥1500-word DBIR-analysis bar

**Location:** Sources §4 ("Datadog — State of Application Security") and §5 / §7 citations (74% mistargeted-attacks claim, Log4Shell <0.1% claim, SQLi 5%, SSRF 2%).

**Problem:** The author already concedes this in the Sources block: "does not strictly hit ≥1500 words analyzing DBIR if read narrowly." That is not a defense — that is an admission the source fails the methodology §1.2 bar. The methodology says "a piece that contrasts DBIR data with the vendor's own telemetry **passes**, provided the cross-reference is genuine analysis." If the Datadog report does not engage the DBIR substantively, it does not pass. Self-flagging that it almost fails is not the same as fixing it.

**Required change:** Either (a) Demonstrate by quotation that the Datadog report contains ≥1500 words *of substantive engagement with DBIR data* (not just side-by-side stat dropping). Quote at least three passages where Datadog contrasts its telemetry with a DBIR finding. (b) If you cannot, demote Datadog to the **Rejected** list with reason "does not meet methodology §1.2 ≥1500-word DBIR-analysis bar" and remove the §5 BOLA / runtime-context citation that depends on it, or replace it with a DBIR-internal citation (DBIR-2025 has API content; DBIR-2026 has SAST/DAST). Currently the draft has only **two** clearly-passing third-party sources (Veracode — see Fix #2, Cloudflare), which after Fix #2 leaves one. The methodology says "at least 3 third-party deep-dive analyses... per topic." The draft is below the floor.

### 4. §1 / §5 — First-appearance jargon definitions are inconsistent

**Location:** §1 expands SAST, DAST, IAST, SCA, WAF, RASP, ADR on first use — good. But the following are **not** defined on first appearance, and as a governance/compliance manager I had to look them up:

- **BWAA** — expanded as "Basic Web Application Attacks" in §1, but the first time it appears in §1 it is parenthetical to "Basic Web Application Attacks (BWAA)" only once; subsequent uses are pure acronym. Acceptable but borderline.
- **OWASP Top 10 / OWASP API Top 10** — referenced in §1 and §5 with no definition. A reader who has heard of OWASP but does not know "OWASP API Top 10 is a separate list of the ten most common API security weaknesses, published by OWASP and most recently revised in 2023" will not understand §5's "Target OWASP API Top 10 (API1 BOLA, API2 broken auth, API3 broken object property level authz)."
- **BOLA** — used in §5 ("BOLA-style anomaly detection") and §7 ("BOLA-aware detection") with **zero** definition. BOLA = Broken Object Level Authorization, OWASP API1. I had to look this up.
- **SRI** — §5 "Magecart detection, SRI enforcement, and card-regex egress alerts." SRI = Subresource Integrity. Undefined.
- **AiTM** — §6 "MFA-bypass / AiTM is undercounted." AiTM = Adversary-in-the-Middle. Defined in the parenthetical *after* the acronym, which is the reverse of how it should read.
- **KEV** — §5 "KEV-blocking policy" used before any definition. KEV = Known Exploited Vulnerabilities (CISA's catalog). Defined a sentence later via "CISA's KEV catalog" but the first occurrence is the acronym.
- **EPSS** — §5 telemetry list "SBOM diffs per release tied to KEV and EPSS feeds." EPSS = Exploit Prediction Scoring System. Undefined.
- **SBOM** — same line. Undefined.
- **mTLS** — §5 telemetry list "API gateway logs with caller identity (mTLS / token client_id)." Undefined.
- **OIDC PKCE / SCIM** — these are in the methodology prompt as *examples* of concreteness, not in this draft, so ignore.
- **CWE-79/89/22/918** — §5 cites these without translation. As a manager I need to know these are XSS / SQLi / Path Traversal / SSRF respectively, or I cannot tell whether the author's SAST recommendation is on-target.

**Required change:** First-appearance parenthetical definitions for **all** of the above. Pattern: "BOLA (Broken Object Level Authorization — OWASP API1)," "KEV (CISA's Known Exploited Vulnerabilities catalog)," "EPSS (Exploit Prediction Scoring System — FIRST.org's per-CVE 0-30-day exploitation likelihood score)," etc. The persona definition explicitly says "I, the manager, should be able to read this and understand it." Right now I cannot.

### 5. §1 / §2 — The 48→19 hit-count decline narrative is *asserted*, not *demonstrated*

**Location:** §1 final paragraph ("This is a taxonomy artifact, not a reduction in web-app risk") and §2 closing paragraph ("The arc is not a decline").

**Problem:** The author *claims* the decline is a taxonomy artifact and gives a plausible mechanism (the literal phrase "Web Application Attacks" appears less because the analytical scope narrowed). But the *evidence offered for the claim* is mostly the author's own narrative, not a side-by-side. As a reviewer I want to see: of the 48 hits in 2020, how many are in the (broad) "Web Applications" pattern section vs. in industry/region pages? Of the 19 hits in 2026, what are they distributed across? If the 2020 hits are heavily concentrated in pattern-pages and industry-pages, and the 2026 hits are concentrated in BWAA-pattern-only, that is *evidence*. As written, the manager reading this has to trust the author's framing.

Additionally, the author tells me the 2024 MOVEit reclassification routed mass-exploit cases to System Intrusion (good — that's the third taxonomy event), but does not give me a **counterfactual estimate**. If MOVEit-era exploits had stayed in BWAA, what would the BWAA breach share have been in 2024 instead of 8%? Even a one-sentence rough estimate ("had they remained, BWAA share would plausibly have stayed in the 20–25% range") would convert the assertion into a defensible quantitative claim.

**Required change:** In §1 add a one-sentence breakdown of where the 48 hits in 2020 actually land (industry sections vs. pattern section) — this is verifiable against the keyword-index JSON the author already used. In §2 (2024 bullet), add a one-sentence counterfactual estimate of what BWAA share would have been if MOVEit were not reclassified. This converts the central thesis from "trust me" to "here is the math."

### 6. §1 — Missing handling of the 2022 Supply-Chain pattern introduction

**Location:** §1 final paragraph lists taxonomy changes: "2021 BWAA split, 2023 Exploit-vuln promotion, and 2024 reclassification of MOVEit-style mass-exploits to System Intrusion."

**Problem:** The methodology (§5) flags four taxonomy events: 2021 action-varieties shift, 2022 explicit Supply Chain pattern introduction, 2023 vuln-exploit split, 2025 vulnerabilities-as-initial-vector separation. The draft handles 3 of these (2021, 2023, 2024-reclass) but is silent on the 2022 Supply Chain pattern and the 2025 vulnerabilities-as-initial-vector cleaner separation. The 2022 Supply Chain pattern matters for AppSec because some web-app initial-access incidents now route to Supply Chain when a third-party platform was the entry point (Kaseya, SolarWinds-like). The 2025 separation also matters because it changes how the "exploitation of vulnerabilities" count is computed.

**Required change:** Add one or two sentences in §1 acknowledging the 2022 Supply Chain pattern carve-out and the 2025 vulnerabilities-as-initial-vector separation, and explain whether/how they further fragment the "true web-app breach" count. If the author thinks they are immaterial to AppSec, say so explicitly and why. Silent comparisons across taxonomy changes are exactly what the methodology §5 says Persona #2 will reject.

### 7. §5 — Veracode KEV-remediation numbers (43-day, 11→16, 26%) appear without DBIR citation

**Location:** §5 "SCA on every push with KEV-blocking policy" bullet, and Sources block.

**Problem:** The numbers "43 days," "median KEV count rising from 11 to 16," and "26% KEV remediation rate" are attributed to "[Veracode, op. cit.]" but the Sources block characterizes Veracode's content as analyzing the DBIR. If these are Veracode's *own* statistics on their customer base, that's a vendor telemetry citation, not a DBIR-analysis citation, and the author has not separated those two roles for this source. Combined with Fix #2 (Veracode is also a DBIR contributor), the numbers may in fact be DBIR-reported and Veracode is just re-stating them.

**Required change:** For each Veracode-attributed number in §5 and §7, state whether it is (a) Veracode's own customer-base telemetry that was *not* in the DBIR, (b) data Veracode contributed to the DBIR that appears in the DBIR, or (c) the same number from both. If (b) or (c), cite the DBIR page directly instead of/in addition to Veracode.

### 8. §3 — One T1078 sub-technique row mixes two sub-techniques into a single cell

**Location:** §3 MITRE table, row "Initial Access | T1078.001 / .002 | Default / Domain Accounts | DBIR-2024 p.42."

**Problem:** Per methodology §4, each row should be a single technique or single sub-technique. "T1078.001 / .002" is two sub-techniques (Default Accounts; Domain Accounts) mashed into one row. The DBIR-2024 p.42 ATT&CK block clearly enumerates them separately, so there is no justification for combining.

**Required change:** Split into two rows: T1078.001 Default Accounts and T1078.002 Domain Accounts. Minor but a methodology-compliance item.

---

## Strong Suggestions (NON-BLOCKING)

### S1. §2 2025 bullet — "61% vs 34%" appears alongside "62% espionage" on the following page

I spot-checked DBIR-2025 p.52 and p.53. The actor-motive block on p.52 reports Espionage 61% / Financial 34%; the narrative on p.53 says "62%." This is harmless rounding/sample-frame drift but the author should pick one number and cite consistently, or note the two-number discrepancy explicitly. (Not blocking; verified the underlying finding is real.)

### S2. §5 — "Stack (a) device-bound credentials / passkeys, (b) bot detection at login, (c) MFA... (d) impossible-travel and unfamiliar-ASN alerts" is solid but lacks one thing

The DBIR-2025 §54 CIS Controls block explicitly calls out CIS 6.3 (MFA for externally-exposed apps) and CIS 6.4 (MFA for remote network access). The author cites 6.3. CIS 6.4 belongs in the stack for the VPN/edge-device 22% surge they cite in the same paragraph from DBIR-2025 p.21. Add it.

### S3. §5 telemetry list — log retention SLA missing

For an incident-response manager, the SIEM coverage list is good but says nothing about *how long* these logs should be retained. WAF/auth/token logs at 90 days are useless when MOVEit-style campaigns have weeks-to-months dwell. Suggest adding a one-line minimum-retention recommendation (e.g., "12 months hot, 24 months cold, anchored to KEV-eligible incident-investigation SLA").

### S4. §6 — The "2025 espionage spike is unexplained" point is excellent; tighten

The author writes "without partner-mix disclosure we can't separate real growth from sampling artifact." Good. But then they say "the 2026 numbers regress toward financial... which supports the artifact hypothesis but doesn't prove it." That's correct but flabby. Replace with: "2026 data shows Financial 74% / Espionage 23% [DBIR-2026, p.54], a near-complete reversion to the historical pattern — strong support for the dataset-composition hypothesis." Less hedging, same intellectual honesty.

### S5. §7 — Forward-looking outlook is mostly hand-wavy; sharpen the one that matters

The "AI-driven vulnerability discovery will compress the disclosure cycle" point is the most concrete of the five and could carry the whole §7 if expanded. The other four feel like "more of the same, but more." Consider cutting §7 to three bullets where each has a falsifiable prediction (numbers, dates) that we can grade in 2027.

### S6. §4 — Notable Incidents has only 4 entries; one is from 2020

The Magento/Magecart entry is genuinely useful for the taxonomy story (the author uses it that way) but the section is otherwise thin and skewed early. Consider adding one 2025–2026 BWAA-pattern incident outside Snowflake (e.g., the late-2025 Oracle E-Business Suite zero-day campaign referenced on DBIR-2026 p.83 in the Education section) to balance the timeline.

### S7. Cloudflare source — "Gambling/Games as the most-attacked industry" is a stat-drop, not analysis

In §5 the author cites Cloudflare's "Gambling/Games as the most-attacked industry" claim. This is exactly the kind of single-stat drop that the methodology §1.2 says doesn't qualify — it's used in this draft as one fact rather than as part of substantive DBIR cross-reference. The broader Cloudflare source still passes because of the WAF / API / Log4j discussion, but trim the stat-drop or tie it to a DBIR industry comparison.

---

## Spot-Check Results

Methodology: I picked three citations to verify by reading the cited page in `02-extracted/text/<year>-dbir.pages.json`. Two additional bonus checks added because two of the first three raised follow-up questions.

| # | Citation | Claim in draft | Verified text on page | Result |
|---|---|---|---|---|
| 1 | [DBIR-2024, p.43] | "BWAA dropped from ~25% to 'just over 8% of breaches'" | "Last year, this type of attack accounted for one-quarter of all breaches. This year, however, our dataset shows just over 8% of breaches in the Basic Web Application Attacks pattern." | **PASS.** Exact match. |
| 2 | [DBIR-2025, p.53] | "espionage overtook financial motive, 61% vs 34%" | p.52 (actor-motive block): Espionage 61%, Financial 34%. p.53 narrative: "this year it accounts for an eye-opening 62%." | **PASS WITH NIT.** The 61/34 numbers are on p.52, not p.53; p.53 has 62%. Pick one or both with consistent citation. (See S1.) |
| 3 | [DBIR-2026, p.83] | "Web applications are the primary vector in 71% of malware-driven breach cases via System Intrusion" | p.83 reads "primary vector of infection is via Web applications... 71% of cases" but Figure 83 caption is "Top Malware vectors in **Educational Services** breaches (n=272)." | **FAIL.** Statistic is sector-specific (Education), not global. See Required Fix #1. |
| 4 (bonus) | [DBIR-2021, p.60] | "23% of monitored orgs had events, with 95% receiving 637 to 3.3 billion attempts" | "23% of the organizations monitored had security events related to those types of attacks, with 95% of them getting between 637 and 3.3 billion(!) attempts against them" | **PASS.** Verbatim. |
| 5 (bonus) | [DBIR-2023, p.36] | "50% of organizations [experienced] over 39 Web application attacks this year" | "with 50% of organizations experiencing over 39 Web application attacks this year" | **PASS.** Verbatim. |

**Pass: 4** (#1, #2 with nit, #4, #5). **Fail: 1** (#3).

The fail on #3 is non-trivial because the author leans on it twice (§2 closing bullet and §3 MITRE-mapping commentary) to argue web-app dominance is rising in 2026. The underlying claim *may still be true* in the global dataset — but the cited page does not support it as a global statistic. Author must either re-cite or qualify.

---

## Summary for the Author

- **Verdict:** REVISE (round 2 needed).
- **Blocking issues:** 8 (one citation misattribution, one independence-disclosure problem, one source-quality failure, one jargon-density issue, one weak-evidence in central thesis, one missing taxonomy event, one source-attribution split, one MITRE-table formatting).
- **Non-blocking suggestions:** 7.
- **Spot-checks:** 4 pass, 1 fail (out of 5).
- **Word count concern:** The draft as written is within the 3000-word cap. After fixes #2, #4, #5, #6, and #7 add content, watch the cap — be willing to compress §7 (see S5) to make room.

The thesis is right and the structure works. Fix the citations, fix the source-quality story, and define the jargon. I'll approve at round 2 if these are addressed.

— Persona #2
