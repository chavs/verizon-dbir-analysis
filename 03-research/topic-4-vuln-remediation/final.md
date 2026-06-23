---
topic: Vulnerability Remediation
persona: "#1 Senior Cybersecurity / Software Engineering Analyst"
version: final
years_in_scope: 2020-2026
date: 2026-05-25
model: primary/llama-3.3-70b-instruct (via Cloudflare Workers AI)
revision_notes: |
  Final — promoted from v2 after addressing 13 specific Round 1 blocking issues.
  All reviewer fixes integrated; discrepancies or caveats retained per §6 and Appendix.
---

# Vulnerability Remediation — CVE Management, Patching Cadence, MTTR, KEV, EPSS/SSVC, and the Exploit-vs-Patch Race

## 1. Definition & Scope

**Vulnerability remediation** is the discipline that closes the loop between a CVE (Common Vulnerabilities and Exposures identifier) being assigned to a software defect, and every instance of that defect being patched, mitigated, or retired. It sits at the intersection of asset inventory, vuln scanning, threat intel, patch management, change control, and incident response.

The DBIR's relevant action variety is **Exploit vuln** (VERIS), carved out from "Hacking" in the 2023 edition (see methodology.md §5). Pre-2023 numbers are *not* directly comparable to today's "Exploitation of vulnerabilities" initial-access vector — the taxonomy break is the first thing any multi-year reader must internalize. Signaled in [DBIR-2023, p.24], which first publishes a dedicated MITRE ATT&CK mapping for `Exploit vuln (VERIS)`.

Key terms (defined on first use): **CISA** (Cybersecurity and Infrastructure Security Agency, U.S. federal cyber agency); **KEV** (Known Exploited Vulnerabilities — CISA's curated list of in-the-wild-exploited CVEs, mandated for federal patching); **EPSS** (Exploit Prediction Scoring System, a FIRST.org ML model giving a per-CVE 30-day exploitation probability); **SSVC** (Stakeholder-Specific Vulnerability Categorization — CISA decision-tree yielding Act/Attend/Track/Track-star instead of a numeric score); **MTTR** (Mean Time To Remediate); **ASM** (Attack Surface Management — continuous internet-exposed-asset enumeration); **n-day** (vulnerability with vendor patch available; opposite of zero-day); **IAB** (Initial Access Broker, criminals selling pre-broken network access); **virtual patching** (blocking exploit traffic at a WAF/IPS layer until the code patch deploys); **MOVEit** (Progress Software's file-transfer product; CVE-2023-34362 SQL-injection zero-day exploited by Cl0p in mid-2023).

Out of scope: pure AppSec code quality (Topic 3); credential-only intrusions (Topic 1); SBOM/SaaS supply-chain compromise (Topic 2).

## 2. DBIR Trendline 2020–2026

Breach-share trajectory: exploitation of vulnerabilities as initial-access vector moved from **under 6% (2020) → 14–15% (2024) → 20% (2025) → 31% (2026)** [DBIR-2020, p.21; DBIR-2024, p.7; DBIR-2025, p.10; DBIR-2026, p.10]. *These percentages span the 2023 VERIS taxonomy break and are directional, not arithmetic — see §6.*[^1]

[^1]: Keyword-index hits across the 7 DBIRs (31/14/24/22/35/36/51) corroborate direction but measure how often the report *talks about* the topic, not breach-share.

- **2020:** Exploit vuln <6% per Fig. 25 [DBIR-2020, p.21]. Chokepoint identified as asset management, not patching speed: EternalBlue-vulnerable hosts tend to be vulnerable to many older CVEs [DBIR-2020, p.22–23, p.28]. Continuous Vulnerability Management (CIS Control 3, later CIS 7) recommended across industries [DBIR-2020, p.73, p.101–103].
- **2021:** Quiet year. Report stresses attackers exploit *old* vulnerabilities; median internet-facing org has 17 exposed assets with a long legacy tail [DBIR-2021, p.20–21, Fig. 30–32]. Ransomware-affiliate use of unpatched VPN appliances (Citrix, Pulse Secure, FortiOS, Palo Alto VPN) documented [DBIR-2021, p.102].
- **2022:** Log4Shell (CVE-2021-44228) arrives between data cutoff and publication. DBIR introduces an explicit `Vulnerabilities` initial-access bucket in its "four key paths" framing [DBIR-2022, p.7]. Fig. 44 publishes a multi-year remediation-speed metric: industry "patching more and faster" [DBIR-2022, p.32] — the last year that holds.
- **2023:** Taxonomy break. `Exploit vuln (VERIS)` formally mapped to T1190/T1210/T1211/T1212/T1068 [DBIR-2023, p.24]. Log4Shell dominates — 90% of `Exploit vuln`-tagged 2022 incidents reference Log4j/CVE-2021-44228 [DBIR-2023, p.9]; exploitation drops to ~10% of System Intrusion breaches as the tail recedes [DBIR-2023, p.36]. CIS guidance restructured into a "Mitigating against vulnerability exploitation" block (CIS 7.1, 7.2, automated OS patching) [DBIR-2023, p.39].
- **2024 — inflection.** Exploitation of vulnerabilities as initial access "almost tripled (180% increase) from last year" [DBIR-2024, p.7]. MOVEit alone: 1,567 breach notifications in Verizon's data; Cl0p claimed >8,000 victims per CISA [DBIR-2024, p.21, p.34–35]. Median CVE-publication-to-first-scan in honeypots: **5 days for KEV vs 68 days for non-KEV** [DBIR-2024, p.22, Fig. 20]. DBIR cites CISA KEV [DBIR-2024, p.21, fn.37] and Cyentia "Why your MTTR is probably bogus" [DBIR-2024, p.21, fn.36].
- **2025:** Exploitation reaches **20% of breaches** (+34% YoY), closing on credential abuse (22%) [DBIR-2025, p.10, p.21, Fig. 16]. **Edge devices and VPNs** drive the rise: their share of `Exploit vuln` targets jumped nearly eight-fold (3% → 22%) in one year [DBIR-2025, p.10, p.21, Fig. 17]. Edge-CVE subset: 32-day median full-remediation, 54% remediation rate — better than all-KEV (38%) and all-scan-findings (9%), so defenders prioritized correctly but not fast enough [DBIR-2025, p.29, Fig. 29; p.31, Fig. 30]. CVE-to-KEV delta: **5 days catalog-wide, zero for the edge subset** — 9 of 17 sampled edge CVEs hit KEV on or before CVE publication [DBIR-2025, p.31, Fig. 31].
- **2026 — new top vector.** Exploitation of vulnerabilities is now the **#1 initial-access vector at 31%**; credential abuse is 13% [DBIR-2026, p.10, p.15–16]. (Caveat: gap partly inflated by classification — DBIR-2026 added Pretexting to tracked initial-access vectors with overlap to credential abuse, which would otherwise be 16%; see §6.) Full KEV remediation **fell 38% → 26%**; median full-remediation time rose 32 → **43 days**; median KEV workload is now **16/year, up from 11** — ~50% YoY [DBIR-2026, p.10, p.17, Fig. 12–14]. The 4-year survival analysis (>1B records contributed by Qualys [DBIR-2026, p.18, fn.9]) shows 2025 wiped out the prior 3 years of gains: 35% of KEV still open at Day 28 (vs 27% in 2024); 9% never resolved — **47M structurally unaddressed; 184M open at Day 28 vs 31M in 2022** [DBIR-2026, p.18, Fig. 15]. DBIR cites GreyNoise's exploitation-frequency clustering [DBIR-2026, p.19, Fig. 16–17] and finds a re-exploitation half-life — probability halves at 30/90/270 days [DBIR-2026, p.20, Fig. 18]. By industry: Public Administration **82% of hacking-related breaches** involve exploitation [DBIR-2026, p.91]; Manufacturing 38% [DBIR-2026, p.88]; SMBs 26% [DBIR-2026, p.97]; EMEA 42% [DBIR-2026, p.100].

**2024 broke the trendline (MOVEit); 2025 made it structural (edge devices); 2026 is patch-capacity collapse under volume.**

## 3. Threat Actor TTPs (MITRE ATT&CK mapped)

| Tactic | Technique ID | Technique | Observed in |
|---|---|---|---|
| Initial Access | T1190 | Exploit Public-Facing Application | DBIR-2023 p.24; DBIR-2024 p.30, p.42; DBIR-2025 p.45; DBIR-2026 p.83 |
| Initial Access | T1133 | External Remote Services | DBIR-2023 p.35; DBIR-2024 p.42 |
| Lateral Movement / IA | T1210 | Exploitation of Remote Services | DBIR-2023 p.24; DBIR-2024 p.30; DBIR-2025 p.29 |
| Privilege Escalation | T1068 | Exploitation for Privilege Escalation | DBIR-2023 p.24; DBIR-2024 p.30; DBIR-2026 p.68 |
| Defense Evasion | T1211 | Exploitation for Defense Evasion | DBIR-2023 p.24; DBIR-2024 p.30 |
| Credential Access | T1212 | Exploitation for Credential Access | DBIR-2023 p.24; DBIR-2024 p.30 |
| Resource Development | T1588.005 | Obtain Capabilities: Exploits | DBIR-2023 p.35; DBIR-2026 p.45 (IAB ProxyShell long-tail)[^2] |

[^2]: T1588.005 mapping is the author's, not the DBIR's — based on IAB acquisition behavior.

Behavioral notes:

- **Ransomware and espionage actors are operationally indistinguishable at the exploit step.** Cl0p ran MOVEit (financial); Chinese APTs ran Ivanti CVE-2025-0282 deploying SPAWN the same months [DBIR-2026, p.108]. Exploitation reaches **70% of initial access in Espionage-motivated breaches** [DBIR-2025, p.21].
- **Pre-disclosure attacker activity exists but is uneven.** GreyNoise's "Ten Days Before Zero" (cited at [DBIR-2026, p.19, Fig. 16]) tracked 147.8M sessions / 18 edge vendors / 103 days; observed 104 surge events. **68 (~65%) preceded a vendor-matched CVE; the 11-day median lead is over that subset only** [GreyNoise, cited via DBIR-2026 p.19, https://www.greynoise.io/resources/ten-days-before-zero]. The other ~35% lagged or were never matched. 11 days is actionable for the *typical* CVE only.
- **Counter-evidence for the dangerous tail.** Pre-disclosure lead inverts for edge zero-days. VulnCheck: **28.96% of 2025 KEVs were exploited on or before CVE publication day** (up from 23.6% in 2024) [VulnCheck "State of Exploitation 2026", https://vulncheck.com/blog/state-of-exploitation-2026]. DBIR-2025 agrees: 9 of 17 sampled edge CVEs hit KEV on or before publication — edge-subset CVE-to-mass-exploit window: **zero days** [DBIR-2025, p.31]. Plan for 11-day lead on the *bulk* AND zero/negative lead on the dangerous tail — virtual patching and compensating architecture (C4, C5) are not optional.
- **Old vulnerabilities dominate.** In DBIR-2026's "Persistent" cluster (~96% of observed days), **80% are 2+ years old**; only 20% from 2024–2025 [DBIR-2026, p.19]. IAB listings 2–3 years after ProxyShell/ProxyLogon are still active [DBIR-2026, p.45].

## 4. Notable Incidents Referenced by DBIR

- **EternalBlue (CVE-2017-0144)** — 2020 DBIR cohort analysis: hosts vulnerable to one CVE tend to be vulnerable to many older ones [DBIR-2020, p.23, p.28].
- **Log4Shell (CVE-2021-44228)** — Defines 2022/2023. Industry response unusually fast: 32% of scanning within first 30 days; biggest spike inside 17 days [DBIR-2023, p.9]. DBIR-2024 notes we cannot expect a Log4j-magnitude response for every CVE [DBIR-2024, p.22].
- **MOVEit Transfer (CVE-2023-34362)** — 2024 DBIR poster child. 1,567 notifications in Verizon's sample; >8,000 industry-wide victims; Education >50% [DBIR-2024, p.34–35, Fig. 32]. Cl0p re-emerged late 2025 against Oracle E-Business Suite zero-day, hitting >100 orgs [DBIR-2026, p.83].
- **Ivanti Connect Secure CVE-2025-0282** — UNC5337 deploying SPAWN, "providing persistent, unauthenticated access to hundreds of enterprise networks" [DBIR-2026, p.108].
- **Edge VPN appliances 2020→2026 through-line** — Cisco/Fortinet/Citrix/Palo Alto/Pulse Secure named in [DBIR-2020, p.104–106], [DBIR-2021, p.102], [DBIR-2024, p.81], [DBIR-2025, p.102 (Cisco ASA ArcaneDoor)], [DBIR-2026, p.108–109 (CitrixBleed 2 CVE-2025-5777)].
- **SharePoint ToolShell (CVE-2025-53770)** — Linen Typhoon, "hundreds of high-value networks" July 2025 [DBIR-2026, p.109].
- **"Edge-device hatching ground"** — DBIR-2025 [p.16, p.20–21, p.29–31]; DBIR-2026 escalates to survival + CWE root-cause [DBIR-2026, p.17–20, p.31–32].

## 5. Detection & Mitigation Controls (practitioner-level)

The DBIR's repeated CIS mapping anchors the list at CIS Control 7 (Continuous Vulnerability Management) with sub-controls 7.1, 7.2, 7.6, plus automated OS patch management [DBIR-2024, p.46; DBIR-2025, p.54; DBIR-2026, p.47]. Below that ceiling:

### Telemetry (T1–T4)

- **T1.** Vuln-scan findings tagged with KEV status and EPSS at ingest — store CVE + KEV-listed-date + EPSS-percentile + first-seen-in-environment. The 5-day median CVE-publication-to-first-scan [DBIR-2024, p.22] is meaningless if your SLA clock starts at patch-Tuesday.
- **T2.** Internet-exposed asset deltas — daily Shodan/Censys polling or an internal ASM tool; alert on new 22, 443, 8443, 4443, or VPN-management ports. Even mature orgs have ~17 exposed assets [DBIR-2021, p.20].
- **T3.** Pre-disclosure scanner telemetry from the public internet — honeypot feeds (e.g., GreyNoise) give a median 11-day lead on the *bulk* of CVEs but near-zero on edge zero-days (see §3). Ingest with `cve_id` and `vendor` tags.
- **T4.** Egress from edge devices to non-corporate IPs — Ivanti/Fortinet compromises surface first as outbound C2 from the appliance; log management-plane outbound separately.

### Signatures (S1–S3)

- **S1.** HTTP(S) to known KEV IOC paths on an edge appliance from outside your management CIDR (Classless Inter-Domain Routing range) — Ivanti CVE-2025-0282, NetScaler CVE-2025-5777, MOVEit CVE-2023-34362 IOCs all public within 24 hours.
- **S2.** Anomalous scanner User-Agents against management interfaces (e.g., Chrome 119 / Linux x86_64 dominates SonicWall scanning per data referenced by [DBIR-2026, p.19, Fig. 16]).
- **S3.** Silent admin-account creation on edge devices vs last known-good baseline — common Ivanti / SonicWall / Fortinet 2024–2026 pattern.

### Controls (C1–C7)

1. **C1. KEV-prioritized patching, hard 14-day SLA on internet-exposed assets.** DBIR-2024: "if it goes into the KEV, go fix it ASAP" [DBIR-2024, p.22]. Only 26% of KEV is fully remediated industry-wide [Tenable "Key findings from the Verizon DBIR 2026", https://www.tenable.com/blog/key-findings-from-the-verizon-dbir-2026].
2. **C2. EPSS scoring in your vuln scanner**, as a column next to CVSS. DBIR-2024 fn.39 takes a direct shot at CVSS ("Eat your heart out, CVSS") and points to KEV [DBIR-2024, p.22]. *Author recommendation:* CVSS + EPSS + KEV is a defensible composite — see FIRST's EPSS user guide for thresholds [FIRST EPSS Documentation, https://www.first.org/epss/].
3. **C3. SSVC decision trees for non-KEV CVEs.** VulnCheck publishes automated SSVC decisions [VulnCheck "Automating SSVC", https://vulncheck.com/blog/automating-ssvc]. Use SSVC for the 90%+ of CVEs not in KEV.
4. **C4. Virtual patching via WAF/IPS** to close the CVE-publication → patch-deployed gap. Modern WAFs (Cloudflare, Akamai, F5, AWS WAF) and IPS (Suricata, Snort, vendor NGFW) ship CVE-specific signatures within hours; must close before the 5-day first-scan median [DBIR-2024, p.22]. For edge zero-days (~29% of KEVs exploited on or before publication day [VulnCheck, link above]), virtual patching is the *only* defense before the vendor patch.
5. **C5. Compensating architecture for edge devices** — three measurable sub-controls:
   - **C5a.** Management plane on dedicated VLAN reachable only from a named bastion CIDR; firewall denies all other sources. *Acceptance:* zero successful management-interface authentications from non-bastion IPs in last 30 days.
   - **C5b.** Appliance→AD service account restricted to read-only LDAP bind; no domain-join, no Kerberos unconstrained delegation; credential rotated every 30 days. *Acceptance:* zero write operations from the service account in last 30 days; password age <30 days.
   - **C5c.** East-west firewall rule between VPN user subnet and crown-jewel file/DB servers — drop by default, allow only via identity-aware proxy that re-authenticates. *Acceptance:* zero direct TCP sessions from VPN subnet to file/DB CIDR bypassing the proxy in last 30 days.
6. **C6. Asset inventory as Control Zero.** 2020 DBIR identified asset mgmt — not patching speed — as the bottleneck [DBIR-2020, p.28]; the 50%-larger 2026 workload [DBIR-2026, p.10] makes that more true. CIS Controls 1 and 2 are prerequisites.
7. **C7. Patch-capacity instrumentation.** Three monthly SLOs: median CVE-published → patch-deployed for KEV on internet-exposed assets; % of in-environment KEV fully remediated; Day-28 survival rate. Benchmark against DBIR-2026 (43 days, 26%, 35%) [DBIR-2026, p.17–18].

## 6. Open Problems / Where the Data Is Weak

- **2023 taxonomy break is permanent.** Pre-2023, Exploit vuln was inside Hacking; post-2023 it is a top-level VERIS action with explicit ATT&CK mapping. "Exploit vuln rose from <6% to 31%" implicitly compares across this break [DBIR-2024, p.7, p.11]. Read as directional, not arithmetic.
- **2026 31% headline includes the Pretexting reclassification.** Credential abuse fell 22% → 13% partly because Pretexting was added with overlap [DBIR-2026, p.16]; otherwise credential abuse would be 16%. The gap is real but partly inflated — TechTarget flags the same [TechTarget "Verizon 2026 DBIR: 6 key takeaways for CISOs", https://www.techtarget.com/searchsecurity/news/366643420/Verizon-DBIR-Key-takeaways-for-CISOs].
- **MOVEit-style mega-events distort YoY.** The 2024 180% rise is largely a single-campaign artifact; the *structural* rise is 2025 → 2026 (20% → 31%).
- **4-year survival analysis is not strict same-cohort.** DBIR-2026 Fig. 15 compares 2022/2023/2024/2025 curves. Report notes "the number of distinct organizations... did not vary significantly YoY" [DBIR-2026, p.18] — but the organization set rolls over. Treat the 35% Day-28 regression and 184M figures as directionally robust, not strict longitudinal.
- **Vuln-mgmt data biased toward mature orgs.** KEV remediation rates [DBIR-2026, p.17] come from Verizon's data partners' subscribers — more mature than average breach victims. True industry rate is almost certainly below 26%.
- **No public baseline for "internal-detection-to-patch-deployed."** DBIR MTTR is vendor-scanner-detection to not-detected-again — not the operationally meaningful "patch released → deployed" SLA. Cyentia "Why your MTTR is probably bogus" [Cyentia, https://www.cyentia.com/why-your-mttr-is-probably-bogus], cited at [DBIR-2024, p.21, fn.36], remains the canonical critique.
- **DBIR doesn't break out exploitation by software category.** Tenable fills this gap (dev tools, virtualization/hypervisor, RMM (Remote Monitoring and Management) all >50% unremediated) [Tenable, https://www.tenable.com/blog/key-findings-from-the-verizon-dbir-2026] — third-party enrichment, not DBIR-native.

## 7. Forward-Looking 12–24 Month Outlook

1. **AI-accelerated vuln discovery widens the gap.** DBIR-2026 [p.5, p.32] flags AI-assisted research (Anthropic Glasswing, Google Big Sleep [DBIR-2025, p.104]) will drive CVE volume higher. VulnCheck has observed CVE disclosures "surging across major software suppliers" attributable to AI [VulnCheck "The First CVE Wave", https://vulncheck.com/blog/ai-assisted-vulnerability-discovery]. With patch capacity structurally limited ("treadmill picking up speed", [DBIR-2026, p.18]), more CVEs = larger backlog. Expect KEV remediation below 20% in the 2027 DBIR absent machine-speed remediation.
2. **Edge devices remain the dominant exploitation surface through 2027.** No EDR on appliances + management-plane exposure by design + dense vendor-side vuln rates (Ivanti/Fortinet/Cisco/Citrix/Palo Alto all 2+ KEV CVEs in 2024–2025) + APT-resourced specialists (Typhoon groups, Cl0p, UNC5337). VulnCheck independently confirms network-edge as the top-targeted category in 2025 [VulnCheck "State of Exploitation 2026", https://vulncheck.com/blog/state-of-exploitation-2026].
3. **KEV is supplemented by exploitation-recency signals.** DBIR-2026's half-life finding [DBIR-2026, p.20] motivates a "recently-active CVE" feed over a static catalog. KEV's "timestamp not timeline" weakness is publicly acknowledged [DBIR-2026, p.19]. Watch for SSVC v2 or KEV-with-decay in 2026–2027.
4. **"Patch capacity" becomes a board-level metric.** Tenable's exposure-management framing [Tenable, link above] and theCUBE's "gap between risk and response" [theCUBE "Verizon's 2026 DBIR and the Gap Between Risk and Response", https://thecuberesearch.com/verizons-2026-dbir-and-the-gap-between-risk-and-response/] converge: throughput, not count. Expect "patch-throughput-per-FTE" and "Day-28 survival rate" as required board metrics by mid-2027.
5. **Compensating-architecture spend outpaces patching spend.** Budget shifts to segmentation, edge micro-segmentation, virtual patching, and ASM. DBIR-2026's CWE root-cause analysis (out-of-bounds reads, use-after-free, improper input validation — 6–13 month median 50%-survival in mature SDLC loops [DBIR-2026, p.31–32]) implicitly endorses memory-safe languages and frameworks for new edge firmware.
6. **Third-party / supply-chain exploitation rises in lockstep.** 48% third-party involvement [DBIR-2026, p.11, p.21]; dominant flavor is vulnerability-driven (vendor's unpatched MOVEit, Snowflake, Oracle EBS) [DBIR-2026, p.21, p.83]. TechTarget confirms third-party root causes "boil down to insecure authentication — absence of MFA, improper credential rotation — or lack of least privilege enforcement" [TechTarget, link above]. Vendor security record as procurement criterion (CISA "Secure by Design" [DBIR-2024, p.22]) becomes operationally enforceable.

## Sources

### Accepted (third-party deep-dive analyses)

- **[Tenable]** "Key findings from the Verizon DBIR 2026" by Scott Caveza, May 19 2026 — https://www.tenable.com/blog/key-findings-from-the-verizon-dbir-2026 — ~1,300 words of DBIR-2026 analysis plus original Tenable Research data on product-category unremediated rates (dev tools, virtualization/hypervisor, RMM). Below the strict 1,500-word floor but qualifies under §1.2's carve-out for analyses contrasting DBIR data with vendor telemetry as genuine analysis. Tenable was a named DBIR-2026 vuln-data contributor.
- **[theCUBE Research]** "Verizon's 2026 DBIR and the Gap Between Risk and Response" by Krista Case, May 19 2026 — https://thecuberesearch.com/verizons-2026-dbir-and-the-gap-between-risk-and-response/ — ~1,800 words of dedicated DBIR-2026 cross-domain analysis (identity, third-party, shadow AI, ransomware economics). Clears §1.2 cleanly.
- **[TechTarget]** "Verizon 2026 DBIR: 6 key takeaways for CISOs" by Sharon Shea, May 22 2026 — https://www.techtarget.com/searchsecurity/news/366643420/Verizon-DBIR-Key-takeaways-for-CISOs — ~1,500 words of independent CISO-oriented DBIR-2026 synthesis. Independent (non-vendor) source; cited for the Pretexting-reclassification caveat and third-party root-cause analysis.
- **[VulnCheck]** "State of Exploitation 2026" by Patrick Garrity, Jan 21 2026 — https://vulncheck.com/blog/state-of-exploitation-2026 — ~1,600 words on 2025 KEV exploitation patterns. Provides critical counter-evidence to GreyNoise's "11-day lead": **28.96% of 2025 KEVs were exploited on or before CVE publication day** (up from 23.6% in 2024). Predates DBIR-2026 — independent analysis, not an echo.

### Downgraded (DBIR-cited primary data, not independent deep-dives)

- **Qualys "Inside the 2026 Verizon DBIR"** by Saeed Abbasi, May 19 2026 — https://blog.qualys.com/vulnerabilities-threat-research/2026/05/19/inside-the-2026-verizon-dbir-what-one-billion-records-revealed-about-vulnerability-remediation — ~1,100 words; below §1.2 floor (companion whitepaper is gated). Qualys data *is* the source dataset for DBIR-2026 Fig. 15, so it is cited in this brief via [DBIR-2026, p.18, fn.9].
- **GreyNoise "Ten Days Before Zero"** — gated PDF + companion blog (~600 words). Below §1.2 floor. Cited via [DBIR-2026, p.19, Fig. 16–17] with the "65% subset / 11-day median over that subset only" qualifier in §3.

### Rejected

- **SecurityWeek "Verizon DBIR 2026..."** — ~700 words; news-summary plus two Veracode quotes. Below §1.2 floor.
- **VulnCheck DBIR-2024 MITRE one-pager** (May 2 2024) — Infographic + PDF, <200 words. ATT&CK mapping absorbed into §3 with attribution to [DBIR-2024, p.30, p.42].
- **Rapid7 blog scan** — Individual-CVE ETR bulletins only; no DBIR-2026 deep-dive located in either round.
- **VulnCheck "Quantifying 2026 Routinely Targeted Vulnerabilities"** (May 21 2026) — Good KEV intel but does not analyze DBIR-2026 specifically.
- **DBIR-2026 vendor press releases** (Business Insider, SecurityInfowatch, CPO Magazine) — Recycle stats with no synthesis.

### Source-fetch attempts that failed

Tenable 2024 commentary URL (404); GreyNoise DBIR-2025 URL (404); Rapid7 DBIR-2024 URL (404, both variants); FIRST EPSS DBIR article (404); Qualys research index (404); `site:rapid7.com "DBIR"` Bing query (anti-bot challenge); Qualys "Broken Physics of Remediation" whitepaper page (gated form).