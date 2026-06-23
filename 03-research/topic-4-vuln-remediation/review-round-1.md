---
topic: Vulnerability Remediation
reviewer: "#2 Skeptical Cybersecurity Manager"
round: 1
target: draft-v1.md
date: 2026-05-25
---

# Review Round 1 — Vulnerability Remediation

## Verdict

**REVISE.**

The technical content is strong and the spot-checked DBIR citations are accurate — but four
structural problems must be fixed before this can move to Round 2: (1) at least two of the
four accepted third-party sources do not credibly meet the 1500-word DBIR-analysis bar that
methodology.md §1.2 requires; (2) the GreyNoise "11 days pre-disclosure" finding is presented
as a clean lead-time when the underlying study reports it from a *filtered subset* of surges
and the headline elides a one-third miss rate; (3) at least eight technical acronyms/terms
(KEV, EPSS, SSVC, ASM, MTTR, IAB, ORB, virtual patching) appear without first-use definitions
that a non-specialist manager can parse; (4) Section 5 control #5 ("Zero-day-friendly
architecture") mixes concrete telemetry with abstractions in a way that crosses the
"defense-in-depth platitude" line. The draft is ~80% there; one pass fixes it.

---

## Required Fixes (BLOCKING)

1. **§Sources / methodology.md §1.2 — Qualys source admits failing the 1500-word floor.**
   The author writes: *"Blog post ~1,100 words; the full 'Broken Physics of Remediation'
   whitepaper linked from the post is the >1,500-word qualifying analysis."* Methodology
   §1.2 says the 1500-word floor applies to *"the post"*, not to a separate gated whitepaper
   the reader may not have read. You cannot launder a borderline source by gesturing at a
   companion paper. **Required change:** either (a) verify the whitepaper IS public, fetch
   it, and explicitly cite from it (with its own URL), or (b) move Qualys to *Rejected* and
   replace with a fourth ≥1500-word piece. Do not move forward citing "blog post +
   whitepaper" as a single source.

2. **§Sources / methodology.md §1.2 — GreyNoise source URL pair is similarly a workaround.**
   The author cites the gated PDF at `/resources/ten-days-before-zero` plus the public blog
   `/blog/the-internet-changes-before-the-advisory-drops`. I spot-checked the public blog:
   ~600 words of substantive prose, the rest is "download the full report." The DBIR itself
   cites GreyNoise's methodology (per [DBIR-2026, p.19]), which is fine, but the *secondary
   source* status under §1.2 requires ≥1500 words of analytical text. **Required change:**
   either confirm the gated PDF is fetchable and cite its actual word count, or downgrade
   GreyNoise to "DBIR-referenced primary data only" (cite via the DBIR footnote, not as a
   third-party deep dive).

3. **§Sources — Tenable word count claim needs verification.**
   The author claims "~1,500 words of dedicated DBIR-2026 analysis." I fetched the post:
   the Tenable site labels it a "7-minute read," and the substantive analytical prose
   (excluding header/footer/CTA/related links) lands closer to ~1,200–1,400 words by
   inspection. It is the strongest of the four because it adds original product-category
   unremediated-rate data the DBIR itself does not break out, so it likely *does* qualify
   under the §1.2 carve-out ("contrasts DBIR data with the vendor's own telemetry…provided
   the cross-reference is genuine analysis"). **Required change:** in Sources, change
   "~1,500 words of dedicated DBIR-2026 analysis" to "qualifies under §1.2's
   vendor-telemetry-cross-reference carve-out" and supply an actual word count (or note it
   as a sub-1500 source admitted on that basis). Be honest about the count.

4. **§3 / §5 — GreyNoise "11 days pre-disclosure" overstates the finding.**
   The draft says: *"session-volume surges precede public CVE advisory by a median of
   11 days."* The underlying GreyNoise data says 68 of 104 surge events (≈65%) preceded
   a vendor-matched CVE; the 11-day median is computed *over that 65% subset*. The other
   ~35% of surges did NOT precede a CVE — they either lagged disclosure or were never
   matched to one. **Required change:** add the qualifier explicitly in both §3 and §5,
   e.g., "Of the surges that preceded a CVE disclosure (68 of 104 observed surges, ~65%),
   the median lead was 11 days." Without that qualifier, the reader walks away believing
   "GreyNoise sees 11 days of warning on everything" — they will not.

5. **§3 — Counter-evidence on the GreyNoise finding is missing entirely.**
   The author treats the 11-day lead as actionable signal, but:
   (a) the same GreyNoise blog cites Mandiant M-Trends 2026 saying "mean time-to-exploit
   has gone negative" and VulnCheck saying "28.96% of KEVs in 2025 were exploited on or
   before publication day" — directly contradicting the rosy 11-day picture for the
   most-dangerous tail;
   (b) the DBIR-2025 finding the author already cites — "9 of 17 sampled edge CVEs hit KEV
   on or before CVE publication day" [DBIR-2025, p.31] — says the same thing.
   The author has the counter-evidence in their own draft and doesn't connect it.
   **Required change:** add a paragraph in §3 (or §5) noting that the 11-day lead is for
   the *bulk* of CVEs but the *most damaging subset* (edge devices, zero-days) has zero or
   negative lead, which is exactly why virtual patching and compensating architecture
   (§5 controls 4 & 5) are not optional.

6. **§C Jargon — first-appearance definitions missing for at least 8 terms.**
   I am the persona target audience (governance/compliance manager). I do not know
   off-the-top-of-my-head what these mean, and they are introduced without definition:
   - **EPSS** — appears §1, §3 (sort of), §5 control 2 with parenthetical "(FIRST.org)"
     and the description "30-day exploitation probability." Move that definition to first
     use in §1.
   - **SSVC** — §1 ("decision frameworks"); first real explanation buried in §5 control
     3. Define on first appearance: *"Stakeholder-Specific Vulnerability Categorization,
     a CISA decision-tree framework."*
   - **ASM** — appears in §5 telemetry ("internal ASM") and §7 forecast with no definition.
     Spell out: Attack Surface Management.
   - **MTTR** — used in headline; defined only by implication via the Cyentia link.
     Spell out on first use: *"Mean Time To Remediate."*
   - **virtual patching** — §5 control 4 uses the term as if it's universally understood.
     Add a one-sentence parenthetical: *"using WAF/IPS rules to block exploit traffic
     until the upstream patch is deployed."*
   - **n-day** — appears in §1. Define: *"a vulnerability for which a patch already
     exists; opposite of zero-day."*
   - **IAB** — §3 ("IAB economics" cited at [DBIR-2022, p.102]) and §3 again ("IAB listings").
     Define on first use: *"Initial Access Broker — criminal middlemen selling pre-broken
     access to victim networks."*
   - **ORB** — does not appear in the draft, but DBIR-2026 p.34 uses it; if you add the
     EOL cellular router cohort to §4, define.
   Also: **KEV** is defined inline (good) but only in §2's 2024 bullet — pull the
   definition up to the first appearance in §1.

7. **§5 control #5 — "Zero-day-friendly architecture" mixes a concrete control with
   defense-in-depth handwave.**
   The bullet packs five sub-controls into one paragraph ("aggressive segmentation,"
   "management plane on a dedicated VLAN," "MFA jump host," "least-privilege appliance↔AD
   service accounts," "micro-segmentation"). Two of those are concrete; three drift toward
   the platitudes Persona #1's prompt explicitly forbids. **Required change:** split into
   three numbered bullets with measurable acceptance criteria. Example:
   - 5a. Edge appliance management plane on dedicated VLAN; only reachable from named
     bastion CIDR; firewall rule + alert on any other source.
   - 5b. Service account from edge appliance to AD restricted to read-only LDAP bind
     (no domain-join, no Kerberos delegation); rotate via SCIM or scripted refresh
     every 30 days.
   - 5c. East-west firewall rule between VPN-terminated user subnet and crown-jewel file
     servers — drop by default, allow only via app-aware proxy.

8. **§2 / §6 — The 2026 31% headline trajectory claim needs one more honesty caveat.**
   §6 correctly flags two reasons the 31% is partly inflated: (a) the 2023 taxonomy break,
   (b) the 2026 Pretexting reclassification that drops credential abuse from 22% to 13%
   (vs. 16% without it). But the §2 summary line — *"2026 — new top vector"* — is stated
   without that qualifier. Add a parenthetical at the §2-2026 bullet on first use of "31%":
   *"31% — but see §6: ~6-9 percentage points of the gap vs credentials is reclassification
   artifact, not pure trend."* The trajectory IS real (15% → 20% → 31% per
   [DBIR-2024, p.7; DBIR-2025, p.10; DBIR-2026, p.10]), but the gap vs credentials is
   smaller than 31-vs-13 suggests.

---

## Strong Suggestions (NON-BLOCKING)

- **§5 — Three of the seven controls are unnumbered "telemetry" / "signatures" bullets
  while four are numbered controls.** Renumber so the practitioner can reference them
  consistently in budget docs. Either everything 1–N, or split into clearly labeled
  sub-headings (Telemetry T1–T4, Signatures S1–S3, Controls C1–C7).

- **§2 — The "264% rise from 2021 to 2026" lede is keyword-hit-count, not breach-share.**
  Methodology §5 warns against this kind of cross-taxonomy comparison. Keyword density
  measures how often the report talks about something, not how often it happened. Replace
  with the cleaner breach-share trajectory `<6% → 20% → 31%` you already cite, and move
  the keyword line to a footnote.

- **§4 — The MOVEit/Education citation at [DBIR-2024, p.34, Fig. 32]** is good, but
  pages 34–35 of DBIR-2024 cover MOVEit; cite both for the >50% Education figure since
  the chart legend is on p.35. Spot-check ambiguity.

- **§5 control 2 EPSS** — the line *"DBIR-2024 fn.39 takes a direct shot at CVSS ('Eat
  your heart out, CVSS')"* — confirmed on [DBIR-2024, p.22]. Good cite. But the
  inference *"CVSS + EPSS + KEV is a defensible ranking"* is the author's recommendation,
  not a DBIR claim. Flag it as such (`(author recommendation)`) or back it with a
  third-party citation (FIRST.org EPSS user guide or Cyentia EPSS performance studies).

- **§6 — Add one more limitation: the survival analysis at [DBIR-2026, p.18, Fig. 15]
  combines four different cohorts of orgs across four years; the author treats this as
  a clean cross-year comparison.** The DBIR itself notes "the number of distinct
  organizations in this dataset did not vary significantly YoY" — quote that line for
  defensibility; otherwise a CFO reading this will (correctly) ask if the orgs were the
  same.

- **§7 forecast #5 — "memory-safe languages (Rust, Go) for new edge-device firmware"**
  is a leap. The DBIR-2026 CWE root-cause data motivates memory safety, but recommending
  specific languages is the author's policy preference, not a DBIR finding. Soften to
  "memory-safe languages and frameworks" without naming.

- **Table in §3 — T1588.005 (Obtain Capabilities: Exploits) cited at [DBIR-2022, p.102]
  for IAB economics** — that page covers IAB pricing, not specifically the T1588.005
  sub-technique. Either move the citation to [DBIR-2023, p.35] where T1190/T1133 are
  more cleanly mapped or add a footnote that the mapping is the author's, not the DBIR's.

- **§1 — "Pre-2023 numbers are not directly comparable to today's 'Exploitation of
  vulnerabilities' initial-access vector"** is exactly the right framing per
  methodology.md §5. Good. But you then quote a "<6%" 2020 number in §2 and a "31%" 2026
  number in §2 in the same sentence-summary at line 32. That's the silent cross-break
  comparison §5 says I should reject. Add a one-sentence guardrail at the end of the
  §2 summary line: *"These percentages span the 2023 taxonomy break and are directional,
  not arithmetic — see §6."*

---

## Spot-Check Results

I picked four citations spanning four DBIRs, weighted toward the load-bearing claims.

| # | Citation in draft | Claim being verified | Verification source | Pass/Fail |
|---|---|---|---|---|
| 1 | [DBIR-2024, p.21] | "MOVEit (CVE-2023-34362) alone produced 1,567 identifiable breach notifications…; Cl0p claimed >8,000 victims per CISA" | DBIR-2024 p.21 text confirms "1,567 breach notifications…related to MOVEit" and "more than 8,000 global organizations" via CISA reference. | **PASS** |
| 2 | [DBIR-2024, p.22] | "Median CVE-publication-to-first-scan in honeypots: 5 days for KEV CVEs vs 68 days for non-KEV." | DBIR-2024 p.22 text: "the median time for that to happen for a Common Vulnerabilities and Exposures (CVE) registered vulnerability in the CISA KEV is five days. On the other hand, the median time for non-CISA KEV vulnerabilities sits at 68 days." Verbatim. | **PASS** |
| 3 | [DBIR-2025, p.31] | "Median CVE-to-KEV delta: 5 days catalog-wide, zero days for the edge subset — 9 of 17 sampled edge CVEs hit KEV on or before CVE publication day" | DBIR-2025 p.31 text: "the estimate of a median of five days for a CISA KEV vulnerability to be mass exploited still holds…for our edge device vulnerability subset was, you guessed it, zero. We didn't need a lot of math for that one because 9 of the 17 were published on the KEV list the day of or earlier than their CVE publication." Verbatim. | **PASS** |
| 4 | [DBIR-2026, p.18, Fig. 15] | "47M structurally unaddressed instances; 184M open at Day 28 vs 31M in 2022" | DBIR-2026 p.18 text: "9%. This represents 47 million vulnerability instances…At Day 28, that 35% translates to 184 million open vulnerability instances, up from 31 million in 2022." Verbatim. | **PASS** |

**Spot-check summary: 4 PASS / 0 FAIL.** Quantitative DBIR citations are tight. The
problem area is third-party source quality (Required Fixes 1–3) and interpretive overreach
on the GreyNoise finding (Required Fix 4), not numeric accuracy on DBIR primary citations.

---

## Bottom Line for the Author

The DBIR data work is solid — that's the hardest part. Round 2 readiness depends on
honesty in the Sources section (don't laundry-list a sub-1500-word post by appending a
gated whitepaper), one explicit "what we don't see" paragraph on the GreyNoise finding,
and the jargon glossary pass. Estimated 60–90 minutes of revision.
