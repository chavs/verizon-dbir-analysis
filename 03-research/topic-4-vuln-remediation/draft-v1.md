---
topic: Vulnerability Remediation
persona: "#1 Senior Cybersecurity / Software Engineering Analyst"
version: draft-v1
years_in_scope: 2020-2026
date: 2026-05-24
model: anthropic/claude-opus-4-7
---

# Vulnerability Remediation — CVE Management, Patching Cadence, MTTR, KEV, EPSS/SSVC, and the Exploit-vs-Patch Race

## 1. Definition & Scope

**Vulnerability remediation** is the discipline that closes the loop between (a) a CVE being assigned to a defect in software an organization runs, and (b) every instance of that defect being patched, mitigated, or retired. It sits at the intersection of asset inventory, vulnerability scanning, threat intel, patch management, change control, and incident response.

The DBIR's relevant action variety is **Exploit vuln** (VERIS), which the report carves out from "Hacking" beginning in the 2023 edition (see methodology.md §5). Pre-2023 numbers are not directly comparable to today's "Exploitation of vulnerabilities" initial-access vector — the taxonomy break is the first thing any multi-year DBIR reader must internalize. The split is signaled in [DBIR-2023, p.24] which first publishes a dedicated ATT&CK mapping for `Exploit vuln (VERIS)`.

In scope: CVE-driven patch management, CISA KEV (Known Exploited Vulnerabilities) catalog as prioritization input, EPSS and SSVC as decision frameworks, MTTR, zero-day vs N-day exposure, mass exploitation of internet-exposed edge devices (firewalls, VPNs, file-transfer appliances), and the operational gap between "exploit available" and "patch deployed." Out of scope: pure AppSec code quality (Topic 3), credential-only intrusions (Topic 1), SBOM/SaaS supply-chain compromise (Topic 2).

## 2. DBIR Trendline 2020–2026

Keyword-index hits — 31/14/24/22/35/36/51 across 2020–2026 — already tell the story: 264% rise from 2021 to 2026, inflection at 2024.

- **2020:** Exploit vuln is a minor breach action — under 6% per Fig. 25 [DBIR-2020, p.21]. The chokepoint is identified as asset management, not patching speed: hosts vulnerable to EternalBlue tend to be vulnerable to many older CVEs [DBIR-2020, p.22–23, p.28]. Continuous Vulnerability Management (then CIS Control 3, later CIS 7) is recommended across industries [DBIR-2020, p.73, p.101–103].
- **2021:** Quiet year — keyword density at 7-year minimum. The report stresses attackers exploit *old* vulnerabilities; median internet-facing org has 17 exposed assets and a long tail of legacy CVEs [DBIR-2021, p.20–21, Fig. 30–32]. Ransomware affiliate use of unpatched VPN appliances (Citrix, Pulse Secure, FortiOS, Palo Alto VPN) is documented [DBIR-2021, p.102].
- **2022:** Log4Shell (CVE-2021-44228) arrives between data cutoff and publication. The DBIR introduces an explicit `Vulnerabilities` initial-access bucket in its "four key paths" framing [DBIR-2022, p.7]. Fig. 44 publishes a multi-year remediation-speed metric and concludes the industry is "patching more and faster" [DBIR-2022, p.32] — the last year that holds.
- **2023:** The taxonomy break. `Exploit vuln (VERIS)` is formally mapped to T1190, T1210, T1211, T1212, T1068 [DBIR-2023, p.24]. Log4Shell dominates — 90% of `Exploit vuln`-tagged 2022 incidents reference Log4j/CVE-2021-44228 [DBIR-2023, p.9] — and exploitation drops to ~10% of System Intrusion breaches as that tail recedes [DBIR-2023, p.36]. CIS guidance is restructured into a dedicated "Mitigating against vulnerability exploitation" block (CIS 7.1, 7.2, automated OS patching) [DBIR-2023, p.39].
- **2024 — inflection year.** "Our ways-in analysis witnessed a substantial growth of attacks involving the exploitation of vulnerabilities... almost tripled (180% increase) from last year" [DBIR-2024, p.7]. MOVEit (CVE-2023-34362) alone produced 1,567 identifiable breach notifications in Verizon's data; Cl0p claimed >8,000 victims per CISA [DBIR-2024, p.21, p.34–35]. Median CVE-publication-to-first-scan in honeypots: **5 days for KEV CVEs vs 68 days for non-KEV** [DBIR-2024, p.22, Fig. 20]. The DBIR cites CISA KEV [DBIR-2024, p.21, fn.37] and Cyentia's "Why your MTTR is probably bogus" by URL [DBIR-2024, p.21, fn.36].
- **2025:** Exploitation of vulnerabilities reaches **20% of breaches** (+34% YoY), closing on credential abuse (22%) [DBIR-2025, p.10, p.21, Fig. 16]. **Edge devices and VPNs** drive the rise: their share of `Exploit vuln` targets jumped nearly eight-fold (3% → 22%) [DBIR-2025, p.10, p.21, Fig. 17]. The edge-CVE subset showed 32-day median full-remediation and 54% remediation rate — better than the all-KEV 38% and all-scan-findings 9%, so defenders prioritized correctly but not fast enough [DBIR-2025, p.29, Fig. 29; p.31, Fig. 30]. Median CVE-to-KEV delta: **5 days catalog-wide, zero days for the edge subset** — 9 of 17 sampled edge CVEs hit KEV on or before CVE publication day [DBIR-2025, p.31, Fig. 31].
- **2026 — new top vector.** Exploitation of vulnerabilities is now the **#1 initial-access vector at 31%**; credential abuse down to 13% (partly reclassified to include Pretexting) [DBIR-2026, p.10, p.15–16]. Full KEV remediation **fell 38% → 26%**; median full-remediation time rose 32 → **43 days**; the median org now has **16 KEV CVEs/year, up from 11** — ~50% YoY workload increase [DBIR-2026, p.10, p.17, Fig. 12–14]. The 4-year survival analysis (Qualys >1B record dataset) shows 2025 wiped out the prior 3 years of gains: 35% of KEV instances still open at Day 28 (vs 27% in 2024), 9% never resolved — **47M structurally unaddressed instances; 184M open at Day 28 vs 31M in 2022** [DBIR-2026, p.18, Fig. 15]. The DBIR cites GreyNoise's exploitation-frequency clustering [DBIR-2026, p.19, Fig. 16–17] and finds a re-exploitation "half-life" — probability halves at 30/90/270 days [DBIR-2026, p.20, Fig. 18]. By industry: Public Administration **82% of hacking-related breaches** involve exploitation [DBIR-2026, p.91]; Manufacturing 38% initial access [DBIR-2026, p.88]; SMBs 26% [DBIR-2026, p.97]; EMEA 42% [DBIR-2026, p.100].

**2024 broke the trendline (MOVEit); 2025 made it structural (edge devices); 2026 is patch-capacity collapse under volume.**

## 3. Threat Actor TTPs (MITRE ATT&CK mapped)

| Tactic | Technique ID | Technique Name | Observed in |
|--------|--------------|----------------|-------------|
| Initial Access | T1190 | Exploit Public-Facing Application | DBIR-2023 p.24, DBIR-2024 p.30 & p.42, DBIR-2025 p.45, DBIR-2026 p.83 (Oracle EBS) |
| Initial Access | T1133 | External Remote Services | DBIR-2023 p.35, DBIR-2024 p.42 (VPN, RDP) |
| Lateral Movement / IA | T1210 | Exploitation of Remote Services | DBIR-2023 p.24, DBIR-2024 p.30, DBIR-2025 p.29 (edge devices) |
| Privilege Escalation | T1068 | Exploitation for Privilege Escalation | DBIR-2023 p.24, DBIR-2024 p.30, DBIR-2026 p.68 |
| Defense Evasion | T1211 | Exploitation for Defense Evasion | DBIR-2023 p.24, DBIR-2024 p.30 |
| Credential Access | T1212 | Exploitation for Credential Access | DBIR-2023 p.24, DBIR-2024 p.30 |
| Resource Development | T1588.005 | Obtain Capabilities: Exploits | DBIR-2022 p.102 (IAB economics), DBIR-2026 p.45 (ProxyShell long-tail) |

Behavioral notes layered on top:

- **Mass exploitation is now operationally indistinguishable between ransomware and espionage actors.** Cl0p ran MOVEit (financial) while Chinese APTs ran Ivanti CVE-2025-0282 deploying SPAWN the same months [DBIR-2026, p.108]. Exploitation reaches **70% of initial access in Espionage-motivated breaches** [DBIR-2025, p.21].
- **The race compresses pre-disclosure.** GreyNoise's "Ten Days Before Zero" (cited at [DBIR-2026, p.19, Fig. 16]) tracked 147.8M sessions across 18 edge vendors over 103 days: **session-volume surges precede public CVE advisory by a median of 11 days** [GreyNoise "Ten Days Before Zero", https://www.greynoise.io/resources/ten-days-before-zero]. Cisco CVE-2026-20127 (CVSS 10.0): 39-day lead. Fortinet CVE-2026-24858: 1-day lead.
- **Old vulns dominate.** Of CVEs in DBIR-2026's "Persistent" cluster (exploited ~96% of observed days), only 20% are from 2024–2025; **80% are 2+ years old** [DBIR-2026, p.19]. IAB listings 2-3 years after ProxyShell/ProxyLogon are still active [DBIR-2026, p.45].

## 4. Notable Incidents Referenced by DBIR

- **EternalBlue (CVE-2017-0144) cohort analysis** — 2020 DBIR uses it to show hosts vulnerable to one CVE tend to be vulnerable to many older ones; asset management is the bottleneck [DBIR-2020, p.23, p.28].
- **Log4Shell (CVE-2021-44228)** — Defines 2022/2023. Industry response was unusually fast: 32% of scanning activity within the first 30 days; biggest spike inside 17 days [DBIR-2023, p.9]. The 2024 DBIR notes we cannot expect a Log4j-magnitude industry response for every future CVE [DBIR-2024, p.22].
- **MOVEit Transfer (CVE-2023-34362)** — 2024 DBIR's poster child. 1,567 confirmed notifications in Verizon's sample; >8,000 victims industry-wide; Education absorbed >50% of victims [DBIR-2024, p.34, Fig. 32]. Cl0p re-emerged in late 2025 against an Oracle E-Business Suite zero-day, hitting >100 organizations [DBIR-2026, p.83].
- **Ivanti Connect Secure CVE-2025-0282** — Weaponized by UNC5337 deploying SPAWN, "providing persistent, unauthenticated access to hundreds of enterprise networks" [DBIR-2026, p.108].
- **Edge VPN appliances** — A through-line 2020→2026: Cisco/Fortinet/Citrix/Palo Alto/Pulse Secure named across [DBIR-2020, p.104–106], [DBIR-2021, p.102], [DBIR-2024, p.81], [DBIR-2025, p.102 (Cisco ASA ArcaneDoor)], [DBIR-2026, p.108–109 (CitrixBleed 2 CVE-2025-5777)].
- **SharePoint ToolShell (CVE-2025-53770)** — Linen Typhoon used the chain to gain unauthenticated access to "hundreds of high-value networks" in July 2025 [DBIR-2026, p.109].
- **The "edge-device hatching ground" phenomenon** — DBIR-2025 dedicates an "Edge cases in our initial access analysis" subsection [DBIR-2025, p.16, p.20–21, p.29–31]; DBIR-2026 escalates to survival + CWE root-cause analysis [DBIR-2026, p.17–20, p.31–32].

## 5. Detection & Mitigation Controls (practitioner-level)

The DBIR's repeated CIS mapping anchors the list at CIS Control 7 (Continuous Vulnerability Management) with sub-controls 7.1, 7.2, 7.6, plus automated OS patch management [DBIR-2024, p.46; DBIR-2025, p.54; DBIR-2026, p.47]. Below that ceiling:

**Telemetry to log:**

- **Vuln-scan findings tagged with KEV status and EPSS score at ingest** — store CVE + KEV-listed-date + EPSS-percentile + first-seen-in-environment. The 5-day median CVE-publication-to-first-scan for KEV CVEs [DBIR-2024, p.22] is meaningless if your SLA clock starts at patch-Tuesday.
- **Internet-exposed asset deltas** — daily Shodan/Censys polling or internal ASM; alert on new 22, 443, 8443, 4443, or vendor VPN-management ports. Even mature orgs have ~17 exposed assets [DBIR-2021, p.20].
- **Pre-disclosure scanner telemetry from the public internet** — GreyNoise-style honeypot signal gives a median 11-day lead [GreyNoise "Ten Days Before Zero", https://www.greynoise.io/resources/ten-days-before-zero]. If you cannot deploy honeypots, ingest the feed into your SIEM with `cve_id` and `vendor` tags.
- **Egress from edge devices to non-corporate IPs** — Ivanti/Fortinet compromises usually surface first as outbound C2 from the appliance itself; log appliance management-plane outbound separately from production.

**Signatures to alert on:** HTTP(S) requests to known KEV IOC paths on an edge appliance from outside your management CIDR (Ivanti CVE-2025-0282, NetScaler CVE-2025-5777, MOVEit CVE-2023-34362 all had public IOCs within 24 hours); anomalous scanner User-Agents against management interfaces (e.g., Chrome 119/Linux dominates SonicWall scanning per GreyNoise); silent admin-account creation on edge devices versus the last known-good baseline (a common Ivanti/SonicWall/Fortinet 2024–2026 pattern).

**Controls to deploy (prioritized by DBIR evidence):**

1. **KEV-prioritized patching, hard 14-day SLA for KEV CVEs on internet-exposed assets.** DBIR-2024: "if it goes into the KEV, go fix it ASAP" [DBIR-2024, p.22]. Tenable confirms only 26% of KEV is fully remediated [Tenable "Key findings from the Verizon DBIR 2026", https://www.tenable.com/blog/key-findings-from-the-verizon-dbir-2026].
2. **EPSS scoring in your vuln scanner.** EPSS (FIRST.org) gives a 30-day exploitation probability; integrate it as a column next to CVSS. DBIR-2024 fn.39 takes a direct shot at CVSS ("Eat your heart out, CVSS") and points to KEV [DBIR-2024, p.22]. CVSS + EPSS + KEV is a defensible ranking.
3. **SSVC decision trees for non-KEV CVEs.** CISA's SSVC framework yields a structured Act/Attend/Track/Track-star decision. VulnCheck publishes automated SSVC decisions [VulnCheck "Automating SSVC", https://vulncheck.com/blog/automating-ssvc]. Use SSVC for the 90%+ of CVEs not in KEV.
4. **Virtual patching via WAF/IPS** to close the CVE-publication → patch-deployed gap. Modern WAFs (Cloudflare, Akamai, F5, AWS WAF) and IPS (Suricata, Snort, vendor NGFW) ship CVE-specific signatures within hours; this window must close before the 5-day median-time-to-first-scan [DBIR-2024, p.22].
5. **Zero-day-friendly architecture.** Because 80% of frequently-exploited CVEs are 2+ years old [DBIR-2026, p.19] and 9 of 17 sampled edge CVEs hit KEV the same day as publication [DBIR-2025, p.31], "we'll patch in time" is a dead assumption. Compensating architecture: aggressive segmentation around edge devices (no flat trust from VPN concentrator to file servers); management plane on a dedicated VLAN reachable only from an MFA jump host; least-privilege appliance↔AD service accounts; micro-segmentation that blocks lateral movement even if the appliance is compromised.
6. **Asset inventory as Control Zero.** The 2020 DBIR identified asset management — not patching speed — as the bottleneck [DBIR-2020, p.28]; the 50%-larger 2026 workload [DBIR-2026, p.10] makes that more true. CIS Controls 1 and 2 are prerequisites — without them, KEV prioritization is theatre.
7. **Patch-capacity instrumentation.** Three monthly SLOs: median CVE-published → patch-deployed for KEV on internet-exposed assets; percentage of in-environment KEV CVEs fully remediated; Day-28 survival rate of new CVE detections. Benchmark against DBIR-2026 (43 days, 26%, 35%) [DBIR-2026, p.17–18].

## 6. Open Problems / Where the Data Is Weak

- **The 2023 taxonomy break is permanent.** Pre-2023, Exploit vuln was inside Hacking; post-2023 it is a top-level VERIS action with explicit ATT&CK mapping. "Exploit vuln rose from <5% to 31%" implicitly compares across this break. DBIR-2024 introduces a separate `Exploitation of vulnerabilities` initial-access category [DBIR-2024, p.7, p.11]. Read across the break as directional, not arithmetic.
- **The 2026 31% headline includes the Pretexting reclassification.** Credential abuse fell 22% → 13% partly because Pretexting was added to tracked initial-access vectors and there is overlap [DBIR-2026, p.16]. Without that addition, credential abuse would be 16%. The exploitation-vs-credentials gap is real but slightly inflated by classification.
- **MOVEit-style mega-events distort YoY comparisons.** The 2024 180% rise is largely a single-campaign artifact (Cl0p + MOVEit). The *structural* rise is 2025→2026 (20% → 31%).
- **Vuln-management data are biased toward security-mature orgs.** KEV remediation rates [DBIR-2026, p.17] come from organizations subscribed to Verizon's vuln-mgmt data partners — systematically more mature than the average breach victim. True industry KEV remediation is almost certainly below 26%.
- **No public baseline for "internal-detection-to-patch-deployed."** DBIR MTTR is vendor-scanner-detection to not-detected-again — not the operationally meaningful "patch released → deployed" SLA. Cyentia's "Why your MTTR is probably bogus" [Cyentia, https://www.cyentia.com/why-your-mttr-is-probably-bogus], cited at [DBIR-2024, p.21, fn.36], remains the canonical critique.
- **DBIR does not break out exploitation by software category.** Tenable's DBIR-2026 analysis fills this gap (dev tools, virtualization/hypervisor, RMM all >50% unremediated) [Tenable, https://www.tenable.com/blog/key-findings-from-the-verizon-dbir-2026] — third-party enrichment, not DBIR-native.

## 7. Forward-Looking 12–24 Month Outlook

1. **AI-accelerated vuln discovery widens the gap.** DBIR-2026 [p.5, p.32] and Tenable both flag that AI-assisted research (Anthropic's Project Glasswing, Google's Big Sleep [DBIR-2025, p.104]) will drive CVE publication volume higher. VulnCheck has observed CVE disclosures "surging across major software suppliers" attributable to AI [VulnCheck "The First CVE Wave", https://vulncheck.com/blog/ai-assisted-vulnerability-discovery]. With patch capacity structurally limited (Qualys' "speed of light" [Qualys "Inside the 2026 Verizon DBIR", https://blog.qualys.com/vulnerabilities-threat-research/2026/05/19/inside-the-2026-verizon-dbir-what-one-billion-records-revealed-about-vulnerability-remediation]), more CVEs = larger backlog. Expect KEV remediation below 20% in the 2027 DBIR absent machine-speed remediation.
2. **Edge devices remain the dominant exploitation surface through 2027.** No EDR on appliances + management-plane exposure by design + dense vendor-side vuln rates (Ivanti/Fortinet/Cisco/Citrix/Palo Alto all 2+ KEV CVEs in 2024–2025) + APT-resourced edge specialists (Typhoon groups, Cl0p, UNC5337) make this a stable pattern. GreyNoise's Project Swarm [https://www.greynoise.io/blog/project-swarm-join-the-collective-defend-the-edge] is a tacit admission no single vendor can cover the edge alone.
3. **KEV is supplemented or replaced by exploitation-recency signals.** DBIR-2026's half-life finding (probability halves at 30/90/270 days [DBIR-2026, p.20]) motivates a "recently-active CVE" feed over a static catalog. CISA KEV's "timestamp not timeline" weakness is now publicly acknowledged [DBIR-2026, p.19]. Watch for SSVC v2 or KEV-with-decay in 2026–2027.
4. **"Patch capacity" becomes a board-level metric.** Qualys' Risk Operations Center [Qualys, link above], Tenable's exposure-management framing [Tenable, link above], and theCUBE's "gap between risk and response" [theCUBE "Verizon's 2026 DBIR and the Gap Between Risk and Response", https://thecuberesearch.com/verizons-2026-dbir-and-the-gap-between-risk-and-response/] all converge: count is not the metric, throughput is. Expect "patch-throughput-per-FTE" and "Day-28 survival rate" as required board metrics by mid-2027.
5. **Compensating-architecture spend outpaces patching spend.** With the patch gap structurally widening, defenders rationally shift budget to segmentation, edge micro-segmentation, virtual patching, and ASM. DBIR-2026's CWE root-cause analysis (out-of-bounds reads, use-after-free, improper input validation — 6–13 month median 50%-survival in mature SDLCs [DBIR-2026, p.31–32]) is an implicit endorsement of memory-safe languages (Rust, Go) for new edge-device firmware.
6. **Third-party / supply-chain exploitation rises in lockstep.** DBIR-2026: 48% third-party involvement [DBIR-2026, p.11, p.21]; the dominant flavor is vulnerability-driven (your vendor's unpatched MOVEit, Snowflake, Oracle EBS) [DBIR-2026, p.21, p.83]. Vendor security track record as a procurement criterion (CISA "Secure by Design" [DBIR-2024, p.22]) becomes operationally enforceable.

## Sources

### Accepted

- **[Tenable] "Key findings from the Verizon DBIR 2026: Slower vulnerability remediation meets faster exploitation"** by Scott Caveza, Tenable Research, May 19 2026 — https://www.tenable.com/blog/key-findings-from-the-verizon-dbir-2026 — ~1,500 words of dedicated DBIR-2026 analysis plus supplementary Tenable Research data on product-category unremediated rates (dev tools, virtualization, RMM) the DBIR itself doesn't break out. Tenable was a named DBIR-2026 vuln-data contributor — this is primary-source enrichment. Qualifies under methodology.md §1.2.
- **[Qualys] "Inside the 2026 Verizon DBIR: What One Billion Records Revealed About Vulnerability Remediation"** by Saeed Abbasi, Qualys Threat Research Unit, May 19 2026 — https://blog.qualys.com/vulnerabilities-threat-research/2026/05/19/inside-the-2026-verizon-dbir-what-one-billion-records-revealed-about-vulnerability-remediation — Qualys supplied the >1B-record dataset behind DBIR-2026 Fig. 15 (survival analysis, p.18). Blog post ~1,100 words; the full "Broken Physics of Remediation" whitepaper linked from the post is the >1,500-word qualifying analysis. Qualifies as the source-data narrative for a major DBIR-2026 figure.
- **[theCUBE Research] "Verizon's 2026 DBIR and the Gap Between Risk and Response"** by Krista Case, May 19 2026 — https://thecuberesearch.com/verizons-2026-dbir-and-the-gap-between-risk-and-response/ — ~1,800 words of dedicated DBIR-2026 cross-domain analysis tying vuln exploitation to identity, third-party, shadow-AI, ransomware economics. Strongest non-vendor analytical synthesis in the publication window.
- **[GreyNoise] "Ten Days Before Zero: How Activity Surges in GreyNoise Data Precede Vulnerability Disclosure"** Apr 20 2026 — https://www.greynoise.io/resources/ten-days-before-zero (and companion https://www.greynoise.io/blog/the-internet-changes-before-the-advisory-drops) — Directly cited by [DBIR-2026, p.19, Fig. 16–17] for the exploitation-frequency clustering methodology. Dataset of 147.8M sessions / 18 vendors / 103 days / 33 CVEs / 16 vendor families is the methodological basis for DBIR-2026's half-life analysis. Combined gated PDF + companion blog exceeds 1,500 words of DBIR-relevant analysis.

### Rejected

- **DBIR-2026 vendor press releases (Business Insider, SecurityInfowatch, SecurityWeek, CPO Magazine)** — Recycle the same DBIR stats with no original analysis. Per methodology.md §1.2 ("lists of stats with no synthesis").
- **VulnCheck "Verizon's 2024 DBIR — Mapping MITRE Att&CK..."** (May 2 2024) — https://vulncheck.com/blog/verizon-dbir-2024-mitre — Useful one-pager but essentially an infographic + PDF; under 200 words of prose. Underlying ATT&CK mapping is incorporated into Section 3 with attribution to the DBIR appendix [DBIR-2024, p.30, p.42].
- **Rapid7 blog scan** — ETR bulletins on individual CVEs (Cisco SD-WAN CVE-2026-20182, Palo Alto CVE-2026-0265) but no dedicated DBIR-2026 deep-dive between DBIR release (May 19 2026) and this brief. Held for Round 2.
- **VulnCheck "Quantifying 2026 Routinely Targeted Vulnerabilities"** (May 21 2026) — Excellent KEV/exploit-intel content but does not analyze DBIR-2026 specifically. Per methodology.md §1.2.

### Source-fetch attempts that failed (documented per task instructions)

- `https://www.tenable.com/blog/the-2024-verizon-data-breach-investigations-report-tenable-research-weighs-in` — 404
- `https://www.greynoise.io/blog/dbir-2025-mass-internet-exploitation` — 404
- `https://www.rapid7.com/blog/post/2024/05/01/verizon-2024-dbir-key-takeaways/` — 404
- `https://www.first.org/epss/articles/dbir` — 404
- `https://www.qualys.com/research/threat-research/` — 404 (substantive Qualys piece located via search; in Accepted)
