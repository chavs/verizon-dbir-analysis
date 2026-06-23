---
topic: Supply Chain Security (3rd-party OAuth apps, SaaS posture, software dependencies, partner breaches)
persona: "#1 Senior Cybersecurity / Software Engineering Analyst"
draft: v2
review_round_addressed: 1
model: anthropic/claude-opus-4-7
years_in_scope: 2020-2026
keyword_index: 02-extracted/index/topic-2-supply-chain.json (167 hits)
---

# Supply Chain Security

## 1. Definition & Scope

"Supply chain security" here is the discipline of defending against incidents whose root cause sits in a *trusted external party* — software vendor, Software-as-a-Service (SaaS) provider, managed service, contractor with network connectivity, or open-source package upstream of the build pipeline. The DBIR did not give this risk class its own pattern until 2022, when it introduced an explicit "Supply Chain" treatment after SolarWinds, Kaseya, and 3CX made folding it into "System Intrusion" untenable [DBIR-2022, p.25] [DBIR-2022, p.29]. Any quantitative comparison against pre-2022 numbers compares apples to a pattern that did not yet exist as a first-class concept.

Two sub-domains sit under the umbrella and must not be conflated:

- **Code supply chain** — vulnerabilities or malicious code via software vendors, open-source packages (npm, PyPI, Maven, Go modules), CI/CD pipelines, container base images, or signed update channels. SolarWinds Orion (Sunburst), 3CX, **MOVEit** (Progress Software's managed-file-transfer product, CVE-2023-34362), XZ-utils, the GitHub Actions `tj-actions/changed-files` compromise, and the Shai-Hulud npm worm (self-replicating package compromise, 2025) all live here [DBIR-2024, p.14] [DBIR-2026, p.108].
- **SaaS / identity supply chain** — breaches propagating via **OAuth** (open standard for delegated authorization; one app holds a *token* granting scoped access to another) grants, **SCIM** (System for Cross-domain Identity Management — synchronizes user create/update/delete from an IdP to a SaaS tenant) provisioning links, SAML federation, or stolen credentials in a SaaS tenant. The **Snowflake** (cloud data-warehouse SaaS) customer campaign of 2024 and the 2025 ShinyHunters (UNC6040) abuse of Salesloft Drift OAuth tokens to pivot into Salesforce at Google, Zscaler, and Cisco are the canonical examples [DBIR-2025, p.16] [DBIR-2026, p.21] [DBIR-2026, p.109].

The DBIR's "third-party involvement" metric, introduced in the 2024 edition, spans both — including "physical breaches in a partner company facility or even partner vehicles" and third-party software vuln exploitation [DBIR-2024, p.14]. The 2026 report formalizes this into three archetypes: (1) vendor in the software supply chain, (2) vendor hosting your data, (3) vendor with a connection into your environment [DBIR-2026, p.21].

## 2. DBIR Trendline 2020–2026

The keyword index returns 167 hits across seven reports, but raw hit counts mislead because much of 2020/2021's "Partner" usage refers to the VERIS actor category in per-industry tables, not supply-chain incidents. The real narrative is a step-function in 2022, then exponential metric growth from 2024.

- **2020 — pre-pattern baseline.** "Partner" appears only as a VERIS actor at 1–3% of breaches; "supply chain" is not a top-level concept [DBIR-2020, p.7] [DBIR-2020, p.44]. LabCorp third-party billing breach referenced anecdotally [DBIR-2020, p.105].
- **2021 — SolarWinds shadow.** Report acknowledges "awareness of supply chain attacks has increased" but does not yet break out a pattern; Sunburst is described as the milestone that "will probably eclipse WannaCry as the most costly cyberattack" [DBIR-2021, p.13] [DBIR-2021, p.104].
- **2022 — taxonomy break.** "Supply Chain" pattern introduced as a System Intrusion sub-category. Partner and Software-update vectors land in the top vector list for the first time, driven by SolarWinds telemetry from 2021 [DBIR-2022, p.15] [DBIR-2022, p.26] [DBIR-2022, p.29]. Verizon dubs the year a "software supply chainpocalypse" [DBIR-2023, p.16].
- **2023 — Log4j year, supply-chain *vector* dip (not a risk dip).** Partner and Software-update fall out of top vectors, replaced by exploitation of vulnerable Internet-facing assets (Log4Shell aftermath) [DBIR-2023, p.16]. Sample-composition effect: the underlying risk did not decline, but the prominent vector shifted from supplier-pushed updates to customer-side exploitation of third-party software vulns.
- **2024 — third-party metric arrives; "tripling" headline is about exploit-vuln, not partner-credential abuse.** Verizon introduces a unified third-party / supply-chain interconnection metric covering partner-vector breaches plus third-party software exploitation. It comes in at **15% of breaches, a 68% YoY jump from 9%** [DBIR-2024, p.14]. Separately, exploitation of vulnerabilities as initial action **tripled (180% increase)**, driven almost entirely by MOVEit (CVE-2023-34362) and similar managed-file-transfer zero-days weaponized by Cl0p [DBIR-2024, p.7]. **Framing caveat (Section 6):** the popular shorthand of a "tripling of stolen-credentials-via-partner" maps to the *exploit-vuln* tripling, not a separately published partner-credential trendline. Verizon counted **1,567 breach notifications** (notifications, not Verizon-confirmed unique-victim counts) tied to MOVEit alone [DBIR-2024, p.21].
- **2025 — third-party doubles; Snowflake teaches a credential lesson.** Third-party involvement **doubles from 15% to 30% of breaches** [DBIR-2025, p.11] [DBIR-2025, p.15]. Snowflake is the case study: not breached itself, but customers' lack of mandatory multi-factor authentication (MFA) let UNC5537 industrialize credential-stuffing against ~165 tenants [DBIR-2025, p.16] [DBIR-2025, p.53]. Median time to remediate a leaked GitHub secret: **94 days**; 43% of disclosed cloud-infrastructure secrets are Google Cloud API keys [DBIR-2025, p.17].
- **2026 — third-party hits 48% (60% YoY growth); OAuth-pivot moves center stage.** Breaches with third-party involvement reach **48% of all breaches, up 60% from the prior dataset** [DBIR-2026, p.11]. The cover example is the ShinyHunters (UNC6040) Salesloft Drift OAuth-token theft pivoting into Salesforce at Google, Zscaler, Cisco [DBIR-2026, p.21] [DBIR-2026, p.109]. Survival analysis of third-party cloud posture shows MFA-related exposures take median ~1 month to remediate with a 32% lingering rate; the DBIR reports "37% of organizations had an admin account with MFA disabled on an IaaS offering" (IaaS = Infrastructure-as-a-Service: AWS, Azure, GCP) [DBIR-2026, p.22]. The `tj-actions/changed-files` GitHub Actions compromise (March 2025) exposed secrets across **23,000+ repositories** [DBIR-2026, p.108].

Taxonomy-adjusted, the arc is unambiguous: third-party-involved breaches went from sub-pattern in 2022 to ~half the DBIR corpus by 2026.

## 3. Threat Actor TTPs (MITRE ATT&CK Mapped)

The supply-chain umbrella collapses several ATT&CK Initial Access techniques (T1xxx = MITRE ATT&CK technique IDs; `.NNN` suffix = sub-technique) that commentary often confuses:

| Tactic | Technique ID | Technique Name | Observed in DBIR |
|---|---|---|---|
| Initial Access | T1195.002 | Supply Chain Compromise: Compromise Software Supply Chain (SolarWinds Orion, 3CX, Salesloft Drift backend) | DBIR-2022 p.26; DBIR-2024 p.14; DBIR-2026 p.109 |
| Initial Access | T1195.001 | Supply Chain Compromise: Compromise Software Dependencies and Development Tools (Shai-Hulud npm worm, `tj-actions` GitHub Actions) | DBIR-2026 p.108 |
| Initial Access | T1199 | Trusted Relationship (partner-vector breaches, MSP and HVAC-style pivots, vendor-with-connection archetype) | DBIR-2022 p.30; DBIR-2024 p.14; DBIR-2026 p.21 |
| Initial Access | T1078.004 | Valid Accounts: Cloud Accounts (Snowflake customer credential reuse; lack of mandatory MFA) | DBIR-2025 p.16; DBIR-2025 p.53; DBIR-2026 p.22 |
| Initial Access | T1190 | Exploit Public-Facing Application (MOVEit CVE-2023-34362; Oracle E-Business Suite 2025; Citrix Bleed 2) | DBIR-2024 p.7; DBIR-2026 p.83 |
| Credential Access / Lateral Movement | T1550.001 | Use Alternate Authentication Material: Application Access Token (Salesloft Drift OAuth tokens; Google OAuth API session hijacking) | DBIR-2025 p.101; DBIR-2026 p.21; DBIR-2026 p.109 |
| Persistence | T1098.001 | Account Manipulation: Additional Cloud Credentials (post-compromise expansion in stolen OAuth grants) | DBIR-2026 p.22 (excessive-permission survival analysis) |
| Initial Access | T1078 | Valid Accounts — including the credential-reuse-via-third-party-environment narrative the 2025 DBIR draws around the Snowflake campaign | DBIR-2025 p.16; DBIR-2025 p.53 |

T1195 (code) and T1550.001 / T1078.004 (SaaS-OAuth) are the two pillars practitioners conflate at their peril; detection telemetry and remediation playbooks differ substantially.

## 4. Notable Incidents Referenced by DBIR

- **SolarWinds Sunburst (Dec 2020).** Foundational supply-chain case. First named in [DBIR-2021, p.104]; recurring through [DBIR-2026, p.21]. Justifies the 2024 metric's inclusion of vendor backdoors pushed via signed updates.
- **Log4Shell (Dec 2021).** Software-dependency vuln rather than a vendor-update compromise, but the report treats it as supply-chain for accountability. 32% of scanning activity occurred within 30 days of disclosure [DBIR-2023, p.9] [DBIR-2024, p.22].
- **3CX (Mar 2023).** Cited alongside SolarWinds as the model "double supply chain" event — vendor build compromised, propagated downstream [DBIR-2024, p.14].
- **MOVEit / CVE-2023-34362 (May–Jul 2023).** 1,567 breach notifications (notifications, not Verizon-confirmed unique victims) tied to MOVEit; "MOVEit" appears 25 times in the 2024 report [DBIR-2024, p.13] [DBIR-2024, p.21].
- **Snowflake customer campaign (Apr–Jun 2024).** Not a Snowflake breach — ~165 customer tenants accessed via infostealer-harvested credentials (LummaStealer) because MFA was not mandatory [DBIR-2025, p.16] [DBIR-2025, p.53].
- **Salesloft Drift OAuth token theft (Aug 2025).** ShinyHunters (UNC6040) compromised Drift's OAuth tokens and pivoted into customer Salesforce instances at Google, Zscaler, Cisco — the cleanest published example of all three 2026 archetypes at once [DBIR-2026, p.21] [DBIR-2026, p.109].
- **GitHub Actions `tj-actions/changed-files` (Mar 2025) and Shai-Hulud npm worm (Sep 2025).** Code-supply-chain incidents exposing secrets across 23,000+ repos and 500+ npm packages respectively [DBIR-2026, p.108] [DBIR-2026, p.109].
- **Oracle E-Business Suite zero-day (mid-2025).** Cl0p pivoted from MOVEit to OEBS as the new mass-extortion target [DBIR-2026, p.83].
- **Jaguar Land Rover (Sep 2025).** Ransomware on a single manufacturer cascaded to ~5,000 downstream entities and ~£1.9B impact, illustrating supply-chain blast radius [DBIR-2026, p.105].

## 5. Detection & Mitigation Controls (Practitioner-Level)

**Partner-tier access reviews first.** Quarterly review of every vendor with network connectivity, OAuth grants, or SCIM provisioning rights. Use the 2026 DBIR's three archetypes as the review template — push-code vendors, data-custody vendors, connectivity vendors each get a different control set. This scopes every operational control below it.

Telemetry assumes a SIEM ingesting cloud audit logs (CloudTrail, Azure Activity, GCP Cloud Audit), identity-provider (IdP) logs (Okta System Log, Entra ID Sign-ins), and SaaS event APIs (Salesforce Event Monitoring, Google Workspace Reports, M365 Unified Audit Log).

**SaaS / OAuth attack class (Salesloft Drift, Snowflake patterns):**

- **OAuth scope minimization at the consent gate.** A *scope* is the specific permission a token confers (e.g., `Mail.Read`, `Files.ReadWrite.All`). Disable end-user consent for high-risk scopes (`offline_access`, broad `*.ReadWrite`, Salesforce `api`/`refresh_token`). Require admin-approval workflows. In Entra ID: `User can consent to apps accessing company data` → No.
- **OAuth token inventory and rotation.** Enumerate every granted `service_principal` / `connected_app` weekly. Alert on dormant grants (no use in 30 days) and non-Verified-Publisher apps with broad scopes. For Salesloft-Drift-class compromises, en-masse token revocation is the only remediation — pre-stage scripts.
- **SaaS Security Posture Management (SSPM).** A product category — analogous to CSPM but for SaaS tenants — that continuously evaluates each tenant against a baseline (MFA enforcement, session timeout, IP allowlisting, public sharing, dormant admins). Examples of vendors include AppOmni, Obsidian Security, Adaptive Shield (now CrowdStrike Falcon Shield), and Valence (no ranking implied; DBIR does not name SSPM vendors). A **Cloud Access Security Broker (CASB)** sits inline for DLP/anomaly detection — complementary to SSPM, not a substitute.
- **SCIM-driven deprovisioning.** Wire every SaaS tenant to the IdP via SCIM so HRIS termination revokes tokens in minutes. Quarterly audit-test: terminate a synthetic user, time the propagation. >1 hour is a finding.
- **Phishing-resistant MFA for high-value targets.** [DBIR-2023, p.38] calls out SaaS administrators as the population that "must use phishing-resistant MFA." WebAuthn / passkeys, not SMS or relayable TOTP.

**Telemetry to alert on:**

- New OAuth grant events with risk-classified scopes (`AppRoleAssignmentTo` in Entra ID; `oauth_app` install in Slack; `ConnectedAppOAuth*` in Salesforce). Alert on any non-Verified-Publisher app with `offline_access` or `*.ReadWrite.All`.
- OAuth token use from anomalous Autonomous System Numbers (ASNs — the network identifiers assigned to ISPs and hosting providers). The Snowflake actor called the API from atypical ASNs; ASN-tagging every auth event would have surfaced it.
- IdP impossible-travel pairs; session-token reuse on an IP other than issuance.
- Mass-export anomalies — Salesforce `REPORT_EXPORT`; Snowflake `query_history` rows matching `COPY INTO @stage` (the SQL data-egress pattern, surfaced via `query_text` and `data_transfer_history`); M365 `MailItemsAccessed` against per-user 7-day baselines.

**Code supply chain (MOVEit, Shai-Hulud, SolarWinds patterns):**

- **Pin dependencies; verify signatures.** Lockfiles only; pin Docker images to digests. Enforce **Sigstore** (open-source artifact-signing project; `cosign` is its CLI) verification at admission control.
- **Software Bill of Materials (SBOM) + reachability.** SBOM = machine-readable component inventory (CycloneDX, SPDX). It's a prerequisite, not a control — pair with reachability analysis so Log4Shell-class CVEs trigger remediation only where the vulnerable path is invoked.
- **Harden build runners.** GitHub Actions runners with no unrestricted egress; pin allowed registries; block exfil webhooks (Shai-Hulud's path).
- **OpenID Connect (OIDC) federation for CI → cloud.** Short-lived federated trust eliminates the 94-day median secret-remediation problem from [DBIR-2025, p.17].
- **S3 / blob exposure scanning.** Continuous external inventory (IAM Access Analyzer + Macie, or third-party CSPM). Most MOVEit-class secondary disclosures involved leftover staging buckets.

## 6. Open Problems / Where the Data Is Weak

- **Taxonomy discontinuity at 2022.** Pre-2022 "supply chain" numbers cannot be compared to 2022+ numbers without an asterisk. The 2024 DBIR's retroactive "9% in 2023" baseline is itself a re-cut, not what the 2023 report originally published.
- **The "tripling stolen-credentials-via-partner" framing.** The originating task brief refers to a 2024 DBIR tripling of "Use of stolen credentials via partner." The 2024 DBIR's 180% figure is for **exploitation of vulnerabilities as initial action**, not stolen-credentials-via-partner [DBIR-2024, p.7]. The closest legitimate stat is the **2025 doubling (15% → 30%) of third-party involvement**, much of which is credential reuse (Snowflake) [DBIR-2025, p.11]. The "tripling" claim, as worded, does not map cleanly to a published DBIR statistic.
- **Sample-composition shifts dominate single-vendor narratives.** When one zero-day affects 1,567 victims (MOVEit) and skews disproportionately U.S.-reporting/healthcare, the year's industry breakdown warps. Verizon partially addresses this with "what is the same / what is different" callouts, but the structural problem remains.
- **OAuth scope-level data is sparse.** The DBIR notes that Salesloft Drift OAuth tokens were used against Salesforce but does not publish a distribution of *which scopes* the abused tokens held. SSPM vendors hold that data but rarely share at industry-aggregate level.
- **Third-party metric counts "exploitation of vulnerabilities" as supply-chain.** Verizon itself calls this "controversial" [DBIR-2024, p.14]. Including every patched-too-late Citrix or Fortinet box inflates the metric versus a narrower "vendor caused the breach" reading.
- **No DBIR-published data on SCIM-deprovisioning latency, OAuth-token-rotation cadence, or SBOM coverage rates.** The most actionable supply-chain hygiene metrics live in vendor surveys (AppOmni, ReversingLabs, Sysdig), not the DBIR.
- **Source-pool gap on the SaaS-supply-chain angle.** No third-party analysis at the §1.2 ≥1500-words-analyzing-DBIR floor exists for SaaS OAuth supply chain specifically. SSPM vendors (AppOmni, Obsidian) discuss Salesloft Drift / Snowflake extensively but cite the DBIR only glancingly. This brief proceeds with two qualifying secondary sources rather than three.

## 7. Forward-Looking 12–24 Month Outlook

- **Third-party involvement crosses 50% in DBIR-2027.** The 15% → 30% → 48% trajectory extrapolates to a majority of breaches with a third-party root cause. Expect Verizon to refine the headline metric into sub-categories.
- **OAuth-pivot incidents become the dominant SaaS attack class.** Salesloft Drift will be remembered the way SolarWinds is — the case that crystallized a pattern. Expect another mass-event involving a CRM-integration plugin (Outreach, Gong, ZoomInfo, marketing-automation tools with broad Salesforce/HubSpot OAuth) within 12 months.
- **Agentic AI and Model Context Protocol (MCP) servers widen the OAuth attack surface.** Every AI agent integrating via OAuth creates another long-lived token in scope. The 2026 DBIR flags service and machine accounts as "the ones leveraged in our potential agentic AI future" [DBIR-2026, p.22]; the GenAI/agentic-AI discussion at [DBIR-2026, p.65] extends the warning to market-level disruption.
- **Code supply chain shifts left.** Sigstore / SLSA-3+ adoption accelerates, driven by the EU CRA and US Secure Software Development Attestation. Shai-Hulud and `tj-actions` force GitHub Actions and npm toward default AppSec-like policies.
- **TPCRM (Third-Party Cyber Risk Management) telemetry becomes a DBIR data source.** The 2026 report's TPCRM research partner [DBIR-2026, p.22] is a methodological shift; expect benchmark survival curves for MFA, secret rotation, and excessive-permission remediation by 2027.
- **Regulatory backstop.** CISA Secure-by-Design, the EU CRA, and the UK Code of Practice for Software Vendors shift liability toward producers and will color future DBIR commentary.

## Sources

### Accepted

1. **ReversingLabs — Paul Roberts, "Verizon 2024 DBIR: Software supply chain risks fuel a data breach epidemic"** [ReversingLabs "Verizon 2024 DBIR: Software supply chain risks fuel a data breach epidemic", https://www.reversinglabs.com/blog/verizon-2024-dbir-software-supply-chain-risks-fuel-a-data-breach-epidemic]. ~1600 words of DBIR-2024-specific analysis. Compares 2024 framing to the 2023 report's narrower treatment, quotes DBIR co-author David Hylender from the Verizon launch webinar, and ties findings to CISA Secure-by-Design / Jen Easterly's commentary in the report. RL is a 2024 DBIR data contributor.

2. **Qualys — Saeed Abbasi, "Key Cybersecurity Trends and Insights from Verizon's 2024 DBIR"** [Qualys "Key Cybersecurity Trends and Insights from Verizon's 2024 DBIR", https://blog.qualys.com/qualys-insights/2024/05/01/verizons-2024-dbir-unpacked-from-ransomware-evolution-to-supply-chain-vulnerabilities]. **Accepted with honest characterization (per Reviewer Fix #2):** post body is ~1500–1600 words of broad DBIR-2024 analysis, but supply-chain-specific content is one section ("Supply Chain and Third-Party Risks") of roughly one paragraph plus a direct DBIR quotation. The post is primarily about vulnerability exploitation and contains recurring Qualys-product placements (VMDR, QIDs). Author is a Qualys threat researcher; *Qualys the company* contributes data to the DBIR (the author is not separately named). Borderline on the §1.2 "primarily a product pitch" filter; retained for DBIR-quotation substance.

### Rejected (with reasons)

- **Eclypsium — "DBIR 2026: Network Asset Breaches Up 3x"** [https://eclypsium.com/blog/verizon-dbir-2026/]. **Withdrawn from v1 per Reviewer Fix #1.** Analytical body is ~800 words; topic is vuln remediation / network-edge devices, not supply chain. Belongs to Topic-4.
- **ReversingLabs — Tenerowicz, "Verizon DBIR 2024: rise in software supply chain attacks"** [https://www.reversinglabs.com/blog/verizon-dbir-2024-the-rise-in-software-supply-chain-attacks-explained]. ~900 words; webinar recap. Fails 1500-word floor.
- **CSA / BARR Advisory — "Analysis of the 2024 Verizon DBIR"** [https://cloudsecurityalliance.org/articles/analysis-of-the-2024-verizon-data-breach-investigations-report]. ~700 words; bullet-stat summary. Fails §1.2.
- **Pentera — "Verizon's 2024 DBIR: Key insights"** [https://pentera.io/blog/verizon-2024-dbir-key-insights/]. ~600 words; bullet-list + product CTAs. Fails marketing-fluff filter.
- **Obsidian Security — three posts** ("OAuth Token Abuse" [https://www.obsidiansecurity.com/blog/the-new-attack-surface-oauth-token-abuse]; "Vercel Breach" [https://www.obsidiansecurity.com/blog/the-vercel-breach-and-the-growing-saas-supply-chain-challenge]; "Rise of SaaS Supply Chain attacks" [https://www.obsidiansecurity.com/blog/the-rise-of-saas-supply-chain-attacks-why-you-arent-safe-from-the-next-salesloft-drift-attack]). Each is 1500+ words of strong SaaS-supply-chain analysis, **but none analyzes DBIR data**. Methodology §1.2 requires ≥1500 words *of DBIR analysis*. Fails despite directly relevant substance.
- **AppOmni / CrowdStrike (Adaptive Shield) blog indexes.** Reviewed. No current post combines DBIR analysis with SSPM/SaaS-supply-chain treatment at the 1500-word DBIR-analysis floor.
- **SecurityBoulevard, DarkReading, AppOmni direct DBIR-2024 deep-dive guess URLs.** Returned 403 / 404.

### Source-Gap Disclosure

Per Reviewer's "Note for Round 2," this brief proceeds with **two** qualifying secondary sources rather than three. The gap is itself a finding: SSPM vendors produce the most relevant SaaS-supply-chain analysis but don't anchor it to DBIR data; software-supply-chain vendors anchor to DBIR but skew toward code over SaaS.
