# Review Round 1 — Non-Human Identities (NHI)

**Reviewer:** Persona #2 (Skeptical Cybersecurity Manager)
**Draft reviewed:** `03-research/topic-1-nhi/draft-v1.md`
**Date:** 2026-05-25

---

## Verdict

**REVISE.**

The draft is technically strong and the spot-checks against the page JSON pass — the author clearly read the DBIRs and is not making numbers up. But there are three categories of blocking issues that I won't sign off on:

1. **Source quality fails the methodology's own ≥1500-word floor.** The draft cites three GitGuardian posts. The headline source (`verizon-dbir-2025`) is published as a "5 min read" — that is ~1,000–1,300 words *total*, not 1,700 of DBIR analysis. A second source is admitted by the author to be ~1,200 words of DBIR-specific content. The methodology is unambiguous (`methodology.md §1.2`: "The 1500-word floor refers to substantive analytical text *about the DBIR*"). The third-party-sources section is currently the weakest link in the brief and must be reworked or the requirement explicitly waived.
2. **All three accepted sources are from a single vendor (GitGuardian).** The Persona #1 prompt requires "at least 3 third-party deep-dive analyses." It does not say "from three vendors," but the spirit of independent corroboration is plainly violated. The draft itself acknowledges "GitGuardian heavy" risk. This is a single-source-of-truth problem, especially for NHI where GitGuardian has an obvious commercial axe to grind.
3. **Jargon density is too high for a brief that is supposed to be reader-accessible.** The acronym storm in Sections 1, 3, 5 (SPIFFE, SVID, PKCE, SCIM, KEV, MTTR, OIDC, AiTM, CAE, IAB, MFA, JWT, PAT, BWAA, SPN, TGS-REQ, etc.) appears almost entirely without first-use definition. I am a manager. I cannot brief my CISO from this draft without a glossary, and Persona #1's own prompt mandates definitions on first appearance.

The MITRE mapping, page-citation discipline, and Section 5 actionability are strong — Section 5 is in fact exemplary. The fixes are bounded and the draft is salvageable in one revision pass.

---

## Required Fixes (BLOCKING)

1. **§Sources — replace or supplement at least 2 of 3 GitGuardian sources.**
   *Problem:* All three accepted sources are GitGuardian. Source #1 (`verizon-dbir-2025`) is published with a "5 min read" tag, which corresponds to roughly 1,000–1,300 words total — well under the 1,500-word DBIR-analysis floor required by `methodology.md §1.2`. The author estimated "~1,700 words" without evidence; the public post does not support that number. Source #3 the author *admits* is "closer to 1,200 words" of DBIR-specific content and tries to negotiate it in via the cross-reference clause. That is a stretch the methodology does not authorize for a piece that is ~50% own-telemetry promotion.
   *Required change:* Either (a) replace at least two of the three GitGuardian sources with non-GitGuardian DBIR deep-dives — candidates include Verizon's own VTRAC quarterly intel posts (explicitly allowed by methodology §1.2), Permiso/Astrix/Aembit/Token Security/Oasis blogs if any pass the 1500-word floor, SANS ISC diaries, CSA Labs analyses, or academic preprints summarizing DBIR-2025 — *or* (b) acknowledge the requirement is unmet and document it as an Unresolved Dispute, accepting that the brief is single-vendor-corroborated. Option (a) is strongly preferred. Word-count claims must be substantiated, not estimated.

2. **§Sources — verify and disclose actual word counts.**
   *Problem:* The author wrote "~1,700 words" against a post visibly published with a "5 min read" indicator. Estimated word counts that aren't backed by `wc -w` (or equivalent) on the fetched HTML body are speculation.
   *Required change:* For every accepted source, provide the *measured* word count of the DBIR-analysis portion (not the full post). State the measurement method. If a post fails 1500 words, list it as rejected.

3. **§1 / §3 / §5 — define every acronym on first appearance.**
   *Problem:* The following acronyms appear without parenthetical or inline definition on first use: SPIFFE, SVID, SCIM, PKCE, OIDC, JWT, IAM, MFA (acceptable for security audience but should still expand once), CMDB, PAT, PoP, CAE, AiTM, IAB, KEV, MTTR, BWAA, SPN, TGS-REQ, mTLS, SAML, IaaS/PaaS/SaaS (expanded once, good), CIDR. Persona #1's own prompt mandates "no security jargon without parenthetical translation on first use" — actually that constraint is in Persona #4, but the manager-reviewer (me) cannot read this brief without a glossary, which is the C-check.
   *Required change:* Add a 1-line parenthetical on first use of each acronym, OR add a `## Glossary` block before §1 covering the ~25 acronyms used. I'd prefer the glossary — it's less visually noisy.

4. **§1 — "outnumber humans 25–50× in cloud-native estates" is a contested, marketing-derived figure cited only to GitGuardian.**
   *Problem:* This is a foundational claim (it's literally axis (a) of the NHI definition). It is sourced to a single GitGuardian commentary on a non-DBIR briefing ("Mythos-Ready"). The figure also varies between vendors (CyberArk says 45:1, Astrix says 50:1, Microsoft Entra blog says "10x to 50x") — that range alone says it isn't a measured number. The DBIR itself does not publish this ratio. A manager would correctly ask "where does that number come from?"
   *Required change:* Either (a) cite the *primary* survey or telemetry behind the 25–50× figure (probably a CSA or vendor benchmark report — find the original, not a blog summary of a briefing), and disclose the methodology and sample size; or (b) soften the claim to "GitGuardian and CSA reporting place this ratio in the 25–50× range; DBIR does not publish a count" and move on.

5. **§2 — 2020 bullet collapses two different uses of the word "Secrets" without flagging it.**
   *Problem:* The bullet says `Secrets` data variety in Cyber-Espionage "is framed as nation-state IP theft, not cryptographic-secret." Good — but the *same draft* then uses Secrets-data-variety percentages from 2022 p.80 (`Secrets reaches 18–20%`) and 2025 p.40 (`Internal 85%, Secrets 25%`) in a way that *implies* those are NHI-relevant. They aren't — those are the same VERIS data-variety, still meaning "confidential information" not "credentials." This is the exact taxonomy-break problem methodology §5 warns about. The author calls it out in §6 but then violates it in §2 and §3.
   *Required change:* Annotate every use of `Secrets` (the VERIS data variety) in §2/§3 with `[VERIS data-variety: confidential information, NOT cryptographic secrets]`. Remove or recategorize any number where the data variety meaning is "IP/confidential info" and the author is implying "credentials." Specifically, the 2022 APAC/EMEA `Secrets 18–20%` line in §2 is misleading framed and should be cut or relabeled.

6. **§5.2 regex for JWTs has issues.**
   *Problem:* The regex `eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\..*` will false-positive on any base64-encoded blob beginning with `{"` and false-negative on JWTs with `+` or `/` characters from non-URL-safe base64. The Stripe and Slack regexes are also incomplete. This is in a section explicitly marked "concrete" and "practitioner-grade" — bad detection rules in a practitioner brief are worse than no rules.
   *Required change:* Either (a) drop the regexes and link to canonical sources (TruffleHog detector catalog, GitHub secret-scanning patterns), or (b) fix the patterns and cite the source of each. Picking your own regex without a citation is the kind of unsupported leap (Check D) I'm paid to flag.

7. **§6 — sample-size caveat on 94-day median is correct but undersells the issue.**
   *Problem:* The 94-day median has n=141, comes from a *single* data contributor scanning *public* repos only. The draft says "thin sample" — accurate, but the bigger problem is that the headline figure is then quoted in §2 and §5.2 as if it represents a generalizable median across all org types and repo visibilities. It does not.
   *Required change:* In every place the 94-day number appears (§2 2025 bullet, §5.2, §6, §7-adjacent), append "(n=141, public-repo-only, single contributor — see §6)". One disclaimer in §6 isn't enough when the number appears 3+ times above it.

---

## Strong Suggestions (NON-BLOCKING)

1. **§2 — quantify the inflection-point claim.** The author asserts 2025 is the inflection. Why not graph the per-year keyword hits (already in `_summary.json` / `topic-1-nhi.json`: 17 / 10 / 11 / 5 / 10 / 25 / 20) and let the reader see the 2.5× jump? Visual makes the point harder to argue with.

2. **§3 — the "displacing brute force" sentence under the table is correlation-implies-direction.** "Credential-access techniques against NHIs are increasingly displacing brute force." Where is the time-series evidence that T1110 share is falling? DBIR-2026 p.42–45 still leans heavily on credential-abuse as initial vector. Re-word as "are emerging alongside" unless you can show the substitution.

3. **§4 — "Snowflake … MFA not enforced" is correct, but "Headline NHI lesson: missing control was vendor-mandated MFA on machine and human accounts alike" oversells the NHI angle.** The Snowflake compromise was, by the DBIR's own framing on p.16, primarily a *human* credential-reuse + missing MFA story. The NHI angle is the *secondary* lesson (token expiration, machine creds in repos). Persona #2 would call this load-bearing framing. Recommend softening to "Snowflake is *adjacent* to NHI — the same controls (mandatory MFA, token expiration, secret-rotation) apply to machine principals."

4. **§5.4 — GitHub Actions OIDC trust-policy example is good but assumes AWS.** Add 1 line for Azure (`federated-credential` on app registration) and GCP (Workload Identity Pool conditions). Otherwise it reads as AWS-only practitioner advice.

5. **§5.7 — "Treat AI agents as NHIs" is the right take, but the 2026 DBIR Secret Service appendix [p.113] is a *narrative* appendix from the U.S. Secret Service, not a statistical finding.** Make clear this is a forward-looking position from the agency partner, not a DBIR data point.

6. **§7 — "Vault-as-a-service consolidation" prediction is reasonable but unsourced.** Either cite an analyst (Gartner MQ, Forrester Wave on machine identity) or drop it. Right now it reads like industry gossip.

7. **§Rejected — the 404/bot-blocked rejections should be re-attempted with Wayback Machine / archive.org URLs.** "Bing bot-blocked" is not a permanent state; archive.org likely has snapshots. Worth one more search pass before final.

8. **Stylistic — §1 sentence "MFA is rarely applicable" is too absolute.** Workload MFA via SPIRE attestation and hardware-bound keys *is* a thing. Re-word to "MFA in its phone-prompt/TOTP form is rarely applicable."

---

## Spot-Check Results

I picked 3 citations at semi-random (using the keyword index as guide) and pulled the corresponding page text from `02-extracted/text/<year>-dbir.pages.json` to verify.

| # | Citation in draft | Claim being supported | Page-text verification | Pass/Fail |
|---|---|---|---|---|
| 1 | `[DBIR-2025, p.17]` for "median time-to-remediate a leaked GitHub secret = 94 days" and "n=441,780 leaked secrets" and "66% JWTs of web-app infra secrets" and "43% Google Cloud API keys" and "GitLab tokens = 50% of CI/CD" | All five sub-claims | Page 17 explicitly contains: "median time to remediate discovered leaked secrets on a GitHub repository is 94 days", "Figure 12. Top categories of exposed secrets in public git repos (n=441,780)", "66% of disclosed web application infrastructure secrets are JSON Web Tokens (JWT)", "43% of disclosed cloud-infrastructure secrets are Google Cloud API keys", and "GitLab tokens, representing 50% of all development and CI/CD secrets". Every number lands. | **PASS** |
| 2 | `[DBIR-2026, p.21]` for "the customer OAuth tokens… from the Salesloft Drift application were compromised… and then they were used against the Salesforce platform" | Salesloft Drift → Salesforce attribution | Page 21 contains verbatim: "the customer OAuth tokens (or the keys to derive those OAuth tokens at will) from the Salesloft Drift application were compromised … and then they were used against the Salesforce platform to steal data from the customers". Quote is accurate. Page 21 also contains the "insecure authentication … or lack of least privilege enforcement for users or service accounts" line. | **PASS** |
| 3 | `[DBIR-2026, p.45]` for "Median credential-leak events: 7/yr small orgs, 20/yr large" | Per-year credential-leak medians by org size | Page 45 contains: "Small organizations represented in this dataset experienced a median of seven credential leak events over the course of the year, while larger organizations faced around 20." Numbers match exactly. **However**, page 45 says "credential leak events" (in general, including human creds from infostealer dumps). The draft's §2 2026 bullet implies this is an NHI metric. It isn't — it's an aggregate credential-leak count covering both human and machine credentials. Cite-page is correct; framing is mildly misleading. | **PASS-with-caveat** (page number correct, claim is right, but NHI-specific framing slightly overreaches) |

**Spot-check totals: 3 of 3 PASS** on page-number accuracy. 1 of 3 has a minor framing nit (see Strong Suggestion-adjacent, captured under blocking Fix #5 since it's the same `Secrets`/NHI-conflation problem class).

I also pulled `[DBIR-2025, p.47]` (token-theft = 31% MFA bypass), `[DBIR-2025, p.16]` (Snowflake ~165 victims, 80% prior cred exposure), `[DBIR-2026, p.68]` (Kerberoasting against service accounts), and `[DBIR-2026, p.108]` (GitHub Actions 23,000 repos / Silk Typhoon BeyondTrust key) as informal additional verifications. All four match the page text exactly. The author's primary-source citation discipline is genuinely good — this is the part of the draft I had the *least* leverage to attack, which is to their credit.

---

## Summary for the Author

You did the hard part — the DBIR reading and the page-cite hygiene are above the bar. The fixes are concentrated in sources (single-vendor reliance + unverified word counts), jargon, and one specific taxonomy-conflation problem (the VERIS `Secrets` data variety vs. cryptographic secrets). Section 5 is the strongest in the draft and needs almost no work other than the regex correction. Fix the seven blocking items and this will pass Round 2.

— Persona #2
