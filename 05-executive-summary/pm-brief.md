# Verizon DBIR 2020–2026 — Executive Brief for Cybersecurity Tooling

## TL;DR

1. **Non-human identities (NHI) outnumber humans 25–50× but lacked DBIR recognition until 2025** — now 441K leaked secrets/yr with 94-day median remediation.
2. **Supply-chain breaches exploded from sub-pattern (2022) to 48% of all breaches (2026)** — OAuth-app pivots (Salesloft Drift) are the new SolarWinds.
3. **Web-app attacks never declined; the patterns just got renamed** — BWAA share fluctuates but incident volume doubled 2025→2026; exploitation of vulnerabilities is now the #1 vector at 31%.
4. **Patch capacity is collapsing under volume** — KEV remediation fell 38%→26%, median time rose 32→43 days, 184M vulnerabilities open at Day 28.
5. **Every trend converges on one control: short-lived, narrowly scoped, attestable identity** — whether for humans, service accounts, AI agents, or CI/CD pipelines.

---

## The Five Cross-Cutting Trends

### 1. Credential Abuse Persisted; Machine Credentials Eclipsed Humans

**What changed:** Credentials dominated every year, but DBIR-2025/2026 finally separated human from machine identity. NHI-specific signals (OAuth tokens, API keys, CI/CD secrets) jumped 2.5× in 2025 with the first non-password-credentials sidebar. Salesloft Drift (2026) demonstrated vendor OAuth tokens chaining into customer data exfiltration — a pattern distinct from stolen employee passwords.

**So what for our product:** NHI governance is no longer a "future roadmap" item. Every identity platform must inventory service accounts, map owners, enforce rotation (<90 days for static keys, <1 hour for mTLS), and detect secret leaks in repos within 24 hours (current DBIR median: 94 days).

**Build vs buy vs partner:** **Buy** secret-scanning (GitGuardian, TruffleHog) and vaulting (HashiCorp Vault, AWS Secrets Manager). **Build** NHI-to-human ownership mapping and CI/CD OIDC federation. **Partner** with cloud providers on workload identity (SPIFFE/SPIRE, AWS IAM Roles Anywhere).

---

### 2. Supply Chain Went from Niche to Majority

**What changed:** Third-party involvement went from 1–3% of breaches (2020, as VERIS "Partner" actor) to 15% (2024), 30% (2025), and **48% (2026)**. SolarWinds and MOVEit were precursors; Salesloft Drift and GitHub Actions cascades (23,000+ repos) normalized OAuth-app supply chain as a standing threat class.

**So what for our product:** Vendor risk assessment must be automated and continuous, not annual questionnaires. OAuth grant inventories, SCIM deprovisioning latency tests, and SaaS Security Posture Management (SSPM) are table stakes.

**Build vs buy vs partner:** **Buy** SSPM/AppOmni/Obsidian and CASB. **Build** vendor-tier access-review workflows (quarterly, archetype-scoped). **Partner** with IdPs for SCIM-driven deprovisioning (<1 hour from HRIS termination).

---

### 3. AppSec Never Declined — The Taxonomy Just Splintered

**What changed:** The 2021 BWAA pattern carve-out, 2022 Supply Chain pattern, 2023 Exploit-vuln promotion, and 2025 standalone vulnerability-exploitation vector all split what was once a single "Web Applications" metric. Headline BWAA share dropped to 8% (2024) then doubled to ~16% (2026), but absolute incident volume rose. MOVEit — a SQL-injection web-app exploit — landed in System Intrusion, not BWAA.

**So what for our product:** AppSec tooling must track vulnerabilities across all patterns, not just BWAA. API discovery, schema enforcement, and BOLA/IDOR detection are gaps the DBIR hints at but does not explicitly measure.

**Build vs buy vs partner:** **Buy** DAST/IAST (Veracode, Contrast) and API security (Salt, Noname). **Build** KEV-blocking merge gates in CI/CD. **Partner** with WAF vendors for CVE-specific virtual patching.

---

### 4. Vulnerability Exploitation Became the #1 Vector — And Defenders Fell Behind

**What changed:** Exploitation of vulnerabilities rose from <6% (2020) to 31% (2026), overtaking credential abuse. Edge devices (VPN, firewall, MDM) drove the surge: 3%→22% of exploit targets in one year. Meanwhile KEV remediation **fell** 38%→26%, median time rose 32→43 days, and 184M vulnerabilities remained open at Day 28 — three years of gains erased.

**So what for our product:** Prioritization is the bottleneck, not detection. EPSS scoring, SSVC decision trees, and virtual patching must sit between scanner findings and change-control tickets. "Patch capacity" — throughput per FTE — will become a board metric by 2027.

**Build vs buy vs partner:** **Buy** exposure management (Tenable, VulnCheck) and virtual patching (Cloudflare, Akamai). **Build** KEV+EPSS prioritization into vulnerability management workflows. **Partner** with CISA for KEV feed automation.

---

### 5. AI Agents Are the Next NHI Wave

**What changed:** DBIR-2026 explicitly flags agentic AI as "the ones leveraged in our potential agentic AI future" [DBIR-2026, p.22]. GitGuardian reports AI-service secrets +81% YoY. Every AI integration via OAuth or API key creates another long-lived, rarely-rotated credential.

**So what for our product:** Treat AI agents as first-class NHIs from day one: scoped identities, short TTL, no shared keys, audit logs for every model invocation.

**Build vs buy vs partner:** **Build** agent-identity lifecycle (issue, rotate, revoke per agent instance). **Buy** secret scanning that covers AI API keys (OpenAI, Anthropic, Azure OpenAI). **Partner** with model-gateway vendors for unified authZ.

---

## Budget Implications

| # | Initiative | Magnitude | Trend(s) Served |
|---|-----------|-----------|----------------|
| 1 | NHI inventory + secret-scanning deployment | **M** ($200–500K) | 1, 5 |
| 2 | SSPM + CASB for SaaS supply chain | **M** ($150–400K) | 2 |
| 3 | KEV/EPSS prioritization + virtual patching | **M** ($100–300K) | 4 |
| 4 | API security + BOLA detection | **S** ($50–150K) | 3 |
| 5 | Agent-identity infrastructure (SPIFFE/SPIRE or cloud equivalent) | **L** ($500K–1M) | 1, 5 |

---

## Tooling Shortlist (vendor-neutral categories)

- **NHI Governance:** Service-account inventory, secret scanning, vaulting, CI/CD OIDC
- **SSPM/CASB:** SaaS tenant posture, OAuth grant inventory, shadow-IT detection  
- **Exposure Management:** KEV/EPSS prioritization, ASM, virtual patching, patch-capacity metrics
- **API Security:** API discovery, schema enforcement, BOLA/IDOR detection, bot detection
- **Agent Identity:** Workload identity, short-lived credentials, per-instance scoping

---

## Risks I'd Raise to Execs

1. **Vendor Consolidation Risk.** HashiCorp/IBM, Broadcom/VMware, and Cisco-Splunk shifts may destabilize tooling roadmaps. Mitigation: favor API-first, open-standard (OIDC, SPIFFE, SIGSTORE) solutions over proprietary stacks.
2. **Regulatory Lag.** EU NIS2, US SEC cyber rules, and Australia's ransomware-payment regime will mandate NHI inventory and patch SLA disclosure before most orgs are ready. Mitigation: instrument patch-capacity and NHI coverage now to ahead of compliance deadlines.
3. **Talent Gap.** NHI governance, SSVC decision-making, and AI-agent identity are not standard SOC or IAM skill sets. Mitigation: train existing IAM/AppSec teams rather than hiring niche specialists; invest in automation to reduce manual-toil dependency.
4. **False Confidence from "Zero Trust" Label.** The DBIR shows credential abuse and exploitation rising in parallel — identity-centric security does not eliminate vuln-driven initial access. Mitigation: pair identity investments with exposure management and virtual patching; do not defund vuln mgmt.

---

## What I'm Not Doing And Why

- **Ransomware-specific product investments:** Ransomware is a *downstream* outcome (50% of victims had a prior credential/infostealer event [DBIR-2026, p.44]). Addressing initial access (Trends 1–4) reduces ransomware more effectively than a dedicated anti-ransomware module.
- **Insider-threat program expansion:** Insider threat is 17% of breaches but heavily overlaps with credential abuse and NHI misuse. Existing identity controls address the majority; a standalone insider-threat team delivers diminishing returns.
- **Zero-day hunting / threat-intel feeds:** The DBIR shows 80% of exploited CVEs are 2+ years old [DBIR-2026, p.19]. Prioritizing n-day patch velocity over zero-day detection yields better ROI for most orgs.

---

*Synthesized from Verizon DBIR 2020–2026 topic analyses: Non-Human Identities, Supply Chain Security, Application Security, Vulnerability Remediation.*
