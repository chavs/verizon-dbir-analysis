---
topic: Supply Chain Security (3rd-party OAuth apps, SaaS posture, software dependencies, partner breaches)
persona: "#1 Senior Cybersecurity / Software Engineering Analyst"
draft: v1
model: anthropic/claude-opus-4-7
years_in_scope: 2020-2026
keyword_index: 02-extracted/index/topic-2-supply-chain.json (167 hits)
---

# Supply Chain Security

## 1. Definition & Scope

For the purposes of this brief, "supply chain security" is the discipline of defending an organization against incidents whose root cause sits in a *trusted external party* — whether a software vendor, a SaaS provider, a managed service, a contractor with network connectivity, or an open-source package upstream of the build pipeline. The DBIR did not give this risk class its own pattern until 2022, when it introduced an explicit "Supply Chain" treatment after SolarWinds, Kaseya, and 3CX made it untenable to fold into "System Intrusion" alone [DBIR-2022, p.25] [DBIR-2022, p.29]. That taxonomy change matters: any quantitative comparison of "supply chain breaches" against pre-2022 numbers is comparing apples to a pattern that did not yet exist as a first-class concept.

Two sub-domains sit under the umbrella and must not be conflated:

- **Code supply chain** — vulnerabilities or malicious code introduced via software vendors, open-source packages (npm, PyPI, Maven, Go modules), CI/CD pipelines, container base images, or signed update channels. SolarWinds Orion (Sunburst), 3CX, MOVEit, XZ-utils, the GitHub Actions `tj-actions/changed-files` compromise, and the Shai-Hulud npm worm all live here [DBIR-2024, p.14] [DBIR-2026, p.108].
- **SaaS / identity supply chain** — breaches that propagate through OAuth grants, SCIM provisioning links, SAML federation trusts, or stolen credentials in a SaaS tenant. The Snowflake customer campaign of 2024 and the 2025 ShinyHunters (UNC6040) abuse of Salesloft Drift OAuth tokens to pivot into Salesforce instances at Google, Zscaler, and Cisco are the canonical examples [DBIR-2025, p.16] [DBIR-2026, p.21] [DBIR-2026, p.109].

The DBIR's own "third-party involvement" metric, introduced in the 2024 edition, deliberately spans both — including "physical breaches in a partner company facility or even partner vehicles" and exploitation of third-party software vulnerabilities — to capture how interconnected the failure surface has become [DBIR-2024, p.14]. The 2026 report formalizes this into three archetypes: (1) vendor in the software supply chain, (2) vendor hosting your data, (3) vendor with a connection into your environment [DBIR-2026, p.21].

## 2. DBIR Trendline 2020–2026

The keyword index returns 167 hits across the seven reports, but raw hit counts are misleading because much of 2020/2021's "Partner" mentions refer to the VERIS actor category in per-industry tables, not to supply-chain incidents. The real narrative is a step-function in 2022, followed by exponential metric growth from 2024 onward.

- **2020 — pre-pattern baseline.** "Partner" appears only as a VERIS actor accounting for 1–3% of breaches across industries, and "supply chain" is not a top-level concept [DBIR-2020, p.7] [DBIR-2020, p.44]. The LabCorp third-party billing breach is referenced anecdotally [DBIR-2020, p.105].
- **2021 — SolarWinds shadow.** The report acknowledges "awareness of supply chain attacks has increased" but does not yet break out a pattern; Sunburst is described as the milestone that "will probably eclipse WannaCry as the most costly cyberattack" [DBIR-2021, p.13] [DBIR-2021, p.104].
- **2022 — taxonomy break.** The "Supply Chain" pattern is introduced as a sub-category of System Intrusion. Partner and Software-update vectors land in the top vector list for the first time, driven primarily by SolarWinds telemetry from 2021 incidents [DBIR-2022, p.15] [DBIR-2022, p.26] [DBIR-2022, p.29]. Verizon dubs the year a "software supply chainpocalypse" [DBIR-2023, p.16].
- **2023 — Log4j year, supply-chain dip.** Partner and Software-update fall out of the top vectors, replaced by exploitation of vulnerable Internet-facing assets (Log4Shell aftermath). Verizon explicitly calls out the absence: "the absence of Partner and Software update as action vectors for incidents this year" [DBIR-2023, p.16]. This is a sample-composition effect, not a real decline — the underlying risk simply shifted from supplier-pushed updates to vendor vulnerabilities customers had to remediate.
- **2024 — the third-party metric arrives, MOVEit dominates.** Verizon introduces a unified "third-party / supply-chain interconnection" metric that captures partner-vector breaches plus exploitation of third-party software. It comes in at **15% of breaches, a 68% year-over-year jump from 9%** [DBIR-2024, p.13] [DBIR-2024, p.14]. Exploit-vuln as an initial action variety **tripled (180% growth)**, driven almost entirely by MOVEit (CVE-2023-34362) and similar managed-file-transfer zero-days weaponized by Cl0p [DBIR-2024, p.7] [DBIR-2024, p.11] [DBIR-2024, p.21]. Note: the user-supplied framing of a "tripling of stolen-credentials-via-partner" matches the *exploit-vuln* tripling, not a stolen-credentials trendline — see Section 6.
- **2025 — third-party doubles, Snowflake teaches a credential lesson.** Third-party involvement **doubles from 15% to 30% of breaches** [DBIR-2025, p.11] [DBIR-2025, p.15]. Snowflake is the case study: not breached itself, but its customers' lack of mandatory MFA let a financially motivated actor (UNC5537) industrialize credential-stuffing against ~165 tenants [DBIR-2025, p.16] [DBIR-2025, p.53]. Median time to remediate a leaked secret in a public GitHub repo: **94 days**; 43% of disclosed cloud-infrastructure secrets are Google Cloud API keys [DBIR-2025, p.17].
- **2026 — third-party hits 48% (60% YoY growth) and OAuth-pivot moves center stage.** Breaches with third-party involvement reach **48% of all breaches, up 60% from the prior dataset** [DBIR-2026, p.11]. The cover example is the ShinyHunters (UNC6040) Salesloft Drift OAuth-token theft, used to pivot into Salesforce instances at Google, Zscaler, and Cisco [DBIR-2026, p.21] [DBIR-2026, p.109]. Survival analysis of third-party cloud posture reveals MFA-related exposures take a median ~1 month to remediate with a 32% lingering rate, and **37% of organizations had at least one IaaS admin account with MFA disabled** [DBIR-2026, p.22]. The cascading GitHub Actions `tj-actions/changed-files` breach (March 2025) exposed secrets across **23,000+ repositories** [DBIR-2026, p.108].

The arc, taxonomy-adjusted, is unambiguous: third-party-involved breaches went from a sub-pattern in 2022 to roughly half of the DBIR corpus by 2026.

## 3. Threat Actor TTPs (MITRE ATT&CK Mapped)

The supply-chain umbrella collapses several ATT&CK Initial Access techniques that mainstream commentary often confuses:

| Tactic | Technique ID | Technique Name | Observed in DBIR |
|---|---|---|---|
| Initial Access | T1195.002 | Supply Chain Compromise: Compromise Software Supply Chain (SolarWinds Orion, 3CX, Salesloft Drift backend) | DBIR-2022 p.26; DBIR-2024 p.14; DBIR-2026 p.109 |
| Initial Access | T1195.001 | Supply Chain Compromise: Compromise Software Dependencies and Development Tools (Shai-Hulud npm worm, `tj-actions` GitHub Actions) | DBIR-2026 p.108 |
| Initial Access | T1199 | Trusted Relationship (partner-vector breaches, MSP and HVAC-style pivots, vendor-with-connection archetype) | DBIR-2022 p.30; DBIR-2024 p.13–14; DBIR-2026 p.21 |
| Initial Access | T1078.004 | Valid Accounts: Cloud Accounts (Snowflake customer credential reuse; lack of mandatory MFA) | DBIR-2025 p.16; DBIR-2025 p.53; DBIR-2026 p.22 |
| Initial Access | T1190 | Exploit Public-Facing Application (MOVEit CVE-2023-34362; Oracle E-Business Suite 2025; Citrix Bleed 2) | DBIR-2024 p.7; DBIR-2026 p.83 |
| Credential Access / Lateral Movement | T1550.001 | Use Alternate Authentication Material: Application Access Token (Salesloft Drift OAuth tokens; Google OAuth API session hijacking) | DBIR-2025 p.101; DBIR-2026 p.21; DBIR-2026 p.109 |
| Persistence | T1098.001 | Account Manipulation: Additional Cloud Credentials (post-compromise expansion in stolen OAuth grants) | DBIR-2026 p.22 (excessive-permission survival analysis) |
| Initial Access | T1078 | Valid Accounts (generic stolen-credentials-via-partner pattern, including IAB ecosystem) | DBIR-2023 p.31; DBIR-2024 p.21 |

T1195 (code) and T1550.001 / T1078.004 (SaaS-OAuth) are the two ATT&CK pillars that practitioners conflate at their peril; the detection telemetry and remediation playbooks differ substantially.

## 4. Notable Incidents Referenced by DBIR

- **SolarWinds Sunburst (Dec 2020).** The foundational supply-chain case. First named in [DBIR-2021, p.104] and recurring through [DBIR-2026, p.21]; justifies the 2024 metric's inclusion of vendor backdoors via signed updates.
- **Log4Shell (Dec 2021).** A software-dependency vuln rather than a vendor-update compromise, but the report treats it as supply-chain for accountability purposes. 32% of scanning activity occurred within 30 days of disclosure [DBIR-2023, p.9] [DBIR-2024, p.22].
- **3CX (March 2023).** Cited alongside SolarWinds as the model "double supply chain" event — vendor build compromised, then propagated downstream [DBIR-2024, p.14].
- **MOVEit / CVE-2023-34362 (May–July 2023).** Verizon counted **1,567 breach notifications** tied to MOVEit; "MOVEit" appears 25 times in the 2024 report [DBIR-2024, p.13] [DBIR-2024, p.21]. One zero-day moved the supply-chain metric materially.
- **Snowflake customer campaign (Apr–Jun 2024).** Not a Snowflake breach — ~165 customer tenants accessed via infostealer-harvested credentials (LummaStealer) because MFA was not mandatory. Verizon treats it as a SaaS-supply-chain authentication failure [DBIR-2025, p.16] [DBIR-2025, p.53].
- **Salesloft Drift OAuth token theft (Aug 2025).** ShinyHunters (UNC6040) compromised Drift's OAuth tokens and pivoted into customer Salesforce instances at Google, Zscaler, and Cisco — the cleanest published example of all three 2026 archetypes at once [DBIR-2026, p.21] [DBIR-2026, p.109].
- **GitHub Actions `tj-actions/changed-files` (Mar 2025) and Shai-Hulud npm worm (Sep 2025).** Code-supply-chain incidents exposing secrets across 23,000+ repos and 500+ npm packages respectively [DBIR-2026, p.108] [DBIR-2026, p.109].
- **Oracle E-Business Suite zero-day (mid-2025).** Cl0p — the same crew behind MOVEit — pivoted to OEBS as the new mass-extortion target [DBIR-2026, p.83].
- **Jaguar Land Rover (Sep 2025).** A ransomware hit on a single manufacturer cascaded to ~5,000 downstream entities and ~£1.9B impact, illustrating supply-chain blast radius [DBIR-2026, p.105].

## 5. Detection & Mitigation Controls (Practitioner-Level)

Telemetry assumes a SIEM ingesting cloud audit logs (CloudTrail, Azure Activity, GCP Cloud Audit), IdP logs (Okta System Log, Entra ID Sign-ins), and SaaS event APIs (Salesforce Event Monitoring, Google Workspace Reports, M365 Unified Audit Log).

**SaaS / OAuth attack class (Salesloft Drift, Snowflake patterns):**

- **OAuth scope minimization at the consent gate.** Disable end-user consent for high-risk scopes (`offline_access`, broad `*.ReadWrite`, `Mail.Read`, `Files.Read.All`, Salesforce `api`/`refresh_token`). Require admin-approval workflows for any third-party app. In Entra ID: `User can consent to apps accessing company data` → No.
- **OAuth token inventory and rotation.** Enumerate every granted `service_principal` / `connected_app` weekly. Alert on dormant grants (no use in 30 days) and non-Verified-Publisher apps with broad scopes. For Salesloft-Drift-class compromises, en-masse token revocation is the only remediation — pre-stage scripts.
- **SSPM (SaaS Security Posture Management).** Continuously evaluate each tenant against a baseline: MFA enforcement, session timeout, IP allowlisting, public sharing, dormant admins. AppOmni, Obsidian, Adaptive Shield (CrowdStrike Falcon Shield), and Valence are the named category leaders. CASB retains an inline DLP role but SSPM is the supply-chain control of record.
- **SCIM-driven deprovisioning.** Wire every SaaS tenant to the IdP via SCIM so HRIS termination revokes tokens in minutes. Quarterly audit-test: terminate a synthetic user, time the propagation. >1 hour is a finding.
- **Phishing-resistant MFA for high-value targets.** [DBIR-2023, p.38] explicitly calls out SaaS administrators as the population that "must use phishing-resistant MFA." WebAuthn / passkeys, not SMS or relayable TOTP.

**Telemetry to alert on:**

- New OAuth grant events with risk-classified scopes (`AppRoleAssignmentTo` in Entra ID; `oauth_app` install in Slack; `ConnectedAppOAuth*` in Salesforce). Alert on any non-Verified-Publisher app with `offline_access` or `*.ReadWrite.All`.
- OAuth token use from anomalous ASNs (residential-proxy or hosting-provider egress). The Snowflake actor called the API from atypical ASNs; ASN-tagging every auth event would have surfaced it.
- IdP impossible-travel pairs; session-token reuse on an IP other than issuance.
- Mass-export anomalies — Salesforce `REPORT_EXPORT`, Snowflake `COPY INTO @stage`, M365 `MailItemsAccessed` against a per-user 7-day baseline.

**Code supply chain (MOVEit, Shai-Hulud, SolarWinds patterns):**

- **Pin dependencies; verify signatures.** Lockfiles only; pin Docker images to digests, not tags. Enforce Sigstore / cosign verification at admission control.
- **SBOM + reachability.** SBOM is a prerequisite, not a control — pair it with reachability analysis so Log4Shell-class CVEs trigger remediation only where the vulnerable path is invoked.
- **Harden build runners.** GitHub Actions runners with no unrestricted egress; pin allowed registries; block exfil to arbitrary webhooks (the Shai-Hulud worm's exfil path).
- **OIDC for CI → cloud, no long-lived secrets.** Short-lived federated trust eliminates the 94-day median secret-remediation problem from [DBIR-2025, p.17].
- **S3 / blob exposure scanning.** Continuous external inventory (IAM Access Analyzer + Macie, or third-party CSPM). Most MOVEit-class secondary disclosures involved leftover staging buckets.

**Partner-tier access reviews.** Quarterly review of every vendor with network connectivity, OAuth grants, or SCIM rights. Use the 2026 DBIR's three archetypes as the review template — push-code vendors, data-custody vendors, connectivity vendors each get a different control set.

## 6. Open Problems / Where the Data Is Weak

- **Taxonomy discontinuity at 2022.** Pre-2022 "supply chain" numbers cannot be compared to 2022+ numbers without an asterisk. The 2024 DBIR's own retroactive "9% in 2023" baseline is itself a re-cut of the 2023 dataset, not what the 2023 report originally published. Persona #2 should flag any cross-year arithmetic that ignores this.
- **The "tripling stolen-credentials-via-partner" framing.** The originating task brief refers to a 2024 DBIR tripling of "Use of stolen credentials via partner." The 2024 DBIR's 180% (~tripling) figure is for **exploitation of vulnerabilities as initial action**, not stolen-credentials-via-partner specifically [DBIR-2024, p.7]. The stolen-credentials-via-partner risk does grow, but the cleanest data point is the **2025 doubling (15% → 30%) of third-party involvement**, much of which is credential reuse (Snowflake) rather than vuln exploitation [DBIR-2025, p.11]. The "tripling" claim, as worded, does not map cleanly to a single published DBIR statistic — see this caveat.
- **Sample-composition shifts dominate single-vendor narratives.** When one zero-day affects 1,567 victims (MOVEit) and those victims happen to be disproportionately U.S.-reporting and healthcare-adjacent, the year's industry breakdown warps. Verizon partially addresses this with "what is the same / what is different" callouts, but the structural problem remains.
- **OAuth scope-level data is sparse.** The DBIR can say "Salesloft Drift OAuth tokens were used to access Salesforce" but does not — and likely cannot — publish a distribution of *which scopes* the abused tokens held. Defenders need that data to prioritize scope-minimization investment; SSPM vendors hold it but rarely share at industry-aggregate level.
- **Third-party metric counts "exploitation of vulnerabilities" as supply-chain.** Verizon calls this "controversial" itself [DBIR-2024, p.14]. Including every patched-too-late Citrix or Fortinet box inflates the metric relative to a narrower "vendor caused the breach" reading. A defender wanting to separate "the vendor failed us" from "we failed to patch the vendor's product" must dis-aggregate manually.
- **No DBIR-published data on SCIM-deprovisioning latency, OAuth-token-rotation cadence, or SBOM coverage rates.** These are the most actionable supply-chain hygiene metrics and remain in vendor surveys (AppOmni, ReversingLabs, Sysdig) rather than the DBIR proper.

## 7. Forward-Looking 12–24 Month Outlook

- **Third-party involvement crosses 50% in DBIR-2027.** The 15% → 30% → 48% trajectory extrapolates to a majority of breaches with a third-party root cause by next report. Expect Verizon to refine the headline metric into sub-categories.
- **OAuth-pivot incidents become the dominant SaaS attack class.** Salesloft Drift will be remembered the way SolarWinds is — the case that crystallized a pattern. Expect another mass-event involving a CRM-integration plugin (Outreach, Gong, ZoomInfo, marketing-automation tools with broad Salesforce/HubSpot OAuth grants) within 12 months. Defenders who built OAuth inventories in 2025 will be paid back.
- **Agentic AI and MCP servers widen the OAuth attack surface.** Every AI agent integrating via OAuth (Claude Desktop with MCP, M365 Copilot connectors, Glean) creates another long-lived token in scope for the next ShinyHunters. The 2026 DBIR already warns on agentic-AI service accounts [DBIR-2026, p.22]; expect a named pattern by 2027.
- **Code supply chain shifts left.** Sigstore / SLSA-3+ adoption will accelerate, driven by the EU CRA and US Secure Software Development Attestation. Shai-Hulud and `tj-actions` will force GitHub Actions and npm to ship default policies that look like AppSec controls.
- **TPCRM telemetry becomes a DBIR data source.** The 2026 report's TPCRM research partner [DBIR-2026, p.22] is a methodological shift. By 2027 expect benchmark survival curves for MFA enforcement, secret rotation, and excessive-permission remediation as standard figures.
- **Regulatory backstop.** CISA Secure-by-Design, the EU CRA, and the UK Code of Practice for Software Vendors all shift liability toward producers. This will color 2026/2027 DBIR commentary even though it won't move VERIS counts directly.

## Sources

### Accepted

1. **Qualys — Saeed Abbasi, "Key Cybersecurity Trends and Insights from Verizon's 2024 Data Breach Investigations Report"** [Qualys "Key Cybersecurity Trends and Insights from Verizon's 2024 DBIR", https://blog.qualys.com/qualys-insights/2024/05/01/verizons-2024-dbir-unpacked-from-ransomware-evolution-to-supply-chain-vulnerabilities]. ~1700 words of DBIR-specific synthesis with direct quotations from the report on the supply-chain interconnection metric, MOVEit, and the "180% increase" framing. Author is a Verizon DBIR contributor (Qualys provides vulnerability telemetry). Section dedicated to "Supply Chain and Third-Party Risks" with original commentary. Passes the methodology §1.2 filter.

2. **ReversingLabs — Paul Roberts, "Verizon 2024 DBIR: Software supply chain risks fuel a data breach epidemic"** [ReversingLabs "Verizon 2024 DBIR: Software supply chain risks fuel a data breach epidemic", https://www.reversinglabs.com/blog/verizon-2024-dbir-software-supply-chain-risks-fuel-a-data-breach-epidemic]. ~1600 words of DBIR-2024-specific analysis. Compares 2024 framing to the 2023 report's narrower treatment, includes original quotes from DBIR co-author David Hylender from the Verizon launch webinar, and connects DBIR findings to CISA Secure-by-Design and Easterly's commentary in the report itself. RL is a 2024 DBIR data contributor. Passes the filter.

3. **Eclypsium — Chase Snyder, "DBIR 2026: Network Asset Breaches Up 3x as Vulnerability Exploitation Accelerates"** [Eclypsium "DBIR 2026: Network Asset Breaches Up 3x", https://eclypsium.com/blog/verizon-dbir-2026/]. ~1200 words — slightly below the 1500-word floor but accepted with caveat because the entire piece is DBIR-2026 analysis with direct quotes from the report, JPMorganChase CISO commentary from RSAC 2026 framing the supply-chain edge-device angle, and original synthesis on the KEV-remediation trajectory (26% in 2025 vs 38% in 2024). Connects DBIR data to a defensible argument about network-edge devices as a third-party / firmware supply-chain failure. Flagged for Persona #2 review on word count.

### Rejected

- **ReversingLabs — Kate Tenerowicz, "Verizon DBIR 2024: The rise in software supply chain attacks explained"** [https://www.reversinglabs.com/blog/verizon-dbir-2024-the-rise-in-software-supply-chain-attacks-explained]. ~900 words; webinar summary rather than independent analysis. Fails the 1500-word floor.
- **Cloud Security Alliance / BARR Advisory — "Analysis of the 2024 Verizon Data Breach Investigations Report"** [https://cloudsecurityalliance.org/articles/analysis-of-the-2024-verizon-data-breach-investigations-report]. ~700 words; bullet-stat summary plus generic compliance advice. No supply-chain-specific synthesis. Fails methodology §1.2.
- **Pentera — Dana Meschiany, "Verizon's 2024 DBIR: Key insights"** [https://pentera.io/blog/verizon-2024-dbir-key-insights/]. ~600 words; bullet-list dump with product CTA after each section. Fails the "vendor marketing fluff" filter.
- **AppOmni and Obsidian Security direct DBIR analyses.** Attempted via multiple guessed URLs; all returned 404. Documented for the methodology log; SSPM vendor DBIR analyses are referenced indirectly through industry coverage.
- **SecurityBoulevard syndication and DarkReading coverage.** Returned 403 / 404 from automated fetch.


