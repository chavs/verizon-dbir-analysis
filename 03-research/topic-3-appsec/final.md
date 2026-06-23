# Application Security — Web Apps, APIs, and the BWAA Pattern Across DBIR 2020–2026

**Author persona:** Persona #1 — Senior Cybersecurity / Software Engineering Analyst
**Final** (Round 1 review addressed)
**Model:** anthropic/claude-opus-4-7 (cloudflare-ai-gateway)
**Scope years:** 2020–2026

---

## 1. Definition & Scope

**Application security (AppSec)** covers controls, telemetry, and engineering practice protecting internet-facing web applications and Application Programming Interfaces (APIs). Tooling acronyms: **SAST** (Static AST — source-code analysis without execution), **DAST** (Dynamic AST — black-box probing of a running app), **IAST** (Interactive AST — in-process instrumentation during testing), **SCA** (Software Composition Analysis — finds known-vulnerable open-source dependencies), **WAF** (Web Application Firewall — gateway rule engine blocking malicious HTTP), **RASP** (Runtime Application Self-Protection — in-process production agent), **ADR** (Application Detection and Response — runtime detection feeding a SOC). **OWASP Top 10** and **OWASP API Top 10** are separate Open Web Application Security Project lists of the ten most common web-app and API weaknesses (API list last revised 2023).

The DBIR's lens is the **Basic Web Application Attacks (BWAA)** Incident Classification Pattern, introduced in 2021. BWAA is *"attacks against a Web application, [where] after the initial compromise, they do not have a large number of additional Actions… the 'get in, get the data and get out' pattern"* [DBIR-2022, p.24]; [DBIR-2025, p.38]. Two sub-patterns: credential abuse against web/API/email front-ends, and exploitation of web-layer vulnerabilities with minimal post-compromise activity [DBIR-2021, pp.58–61].

What BWAA does **not** cover matters as much. Complex post-exploit chains (ransomware, hands-on-keyboard, data staging) route to **System Intrusion** [DBIR-2023, p.25]; [DBIR-2026, p.40]. Supply-chain-driven web-app initial-access (third-party platform compromised → downstream victims) routes to the **Supply Chain** pattern introduced in DBIR-2022 [DBIR-2022, p.4]. From DBIR-2025 onward, *Exploitation of vulnerabilities* is a standalone top-level initial-access vector reported across all patterns [DBIR-2025, p.21]; [DBIR-2026, p.10] — a MOVEit-class incident now potentially counts across BWAA, System Intrusion, **and** Supply Chain. Comparisons that ignore these routing rules are wrong.

**The 48→19 keyword-index decline is a taxonomy artifact, demonstrated by per-page distribution.** Of 48 DBIR-2020 hits, ~30 are on per-industry/per-region pages (the old broad pattern appeared in nearly every industry section pp.41–82 and regional pages pp.85–98); ~9 on broad pattern/asset pages. DBIR-2026's 19 hits: ~6 on intro/TOC/asset pages, 1 on the dedicated BWAA page (p.54), the rest across only ~9 industry/region pages — far thinner per-industry coverage. The phrase appears less because the analytical pattern was narrowed (2021), promoted to its own action (2023 Exploit vuln), and split across Supply Chain (2022) and standalone Vulnerability-Exploitation reporting (2025). By every non-keyword measure, the threat is larger than 2020 (§2).

## 2. DBIR Trendline 2020–2026

- **2020 — "Web Applications" pattern dominates.** Web apps in 43% of breaches [DBIR-2020, p.7]. Cloud breaches involved an email or web-app server 73% of the time; 77% also involved breached credentials [DBIR-2020, p.27]. 5.5 billion web app attack blocks analyzed (top varieties: PHP injection, SQLi, file upload, LFI, **XSS** — Cross-Site Scripting) [DBIR-2020, p.37]. Credential abuse and vulnerability exploitation still conflated.

- **2021 — BWAA introduced; first inflection point.** Multi-step incidents carved out into the new System Intrusion pattern [DBIR-2021, pp.32–34]; [DBIR-2021, p.58]. BWAA: 4,862 incidents, 1,384 breaches; financial 89%, credentials in 80% [DBIR-2021, p.58]. Credential-stuffing telemetry: 23% of monitored orgs had events, with 95% receiving 637 to 3.3 billion attempts in a year [DBIR-2021, p.60]. **Every subsequent "BWAA decline" must be read against this scope cut.**

- **2022 — BWAA stable; Supply Chain carve-out.** BWAA n=972 [DBIR-2022, p.37]. Web-app servers 56% / mail servers 28% of compromised server assets [DBIR-2022, p.17]; 80% of compromised mail servers fell to stolen creds [DBIR-2022, p.38]. Web application = #1 attack vector overall [DBIR-2022, p.15]. New **Supply Chain** pattern [DBIR-2022, p.4] absorbs web-app initial-access incidents whose victim is downstream of a compromised third-party platform — second narrowing event. BWAA top pattern in Healthcare [DBIR-2022, p.61].

- **2023 — Exploit vuln promoted; BWAA holds.** BWAA n=1,404 incidents, 1,315 breaches [DBIR-2023, p.35]. "50% of organizations [experienced] over 39 Web application attacks this year" [DBIR-2023, p.36]. Inside System Intrusion, web applications are the dominant vector for vuln-exploit incidents [DBIR-2023, p.25]. "Exploit vuln" promoted to first-class action — third taxonomy event.

- **2024 — apparent BWAA collapse, real exploit surge elsewhere.** BWAA dropped from ~25% to "just over 8% of breaches" [DBIR-2024, p.43]. **This is not a defender win.** MOVEit (CVE-2023-34362), a SQL-injection web-app exploit, triggered an industry-wide breach wave [DBIR-2024, p.35]; [DBIR-2024, p.82] but landed in System Intrusion, not BWAA. **Counterfactual:** had MOVEit-class mass-exploits stayed in the old Web Applications pattern, BWAA share would plausibly have stayed in the 20–25% range of 2023 rather than collapsing to 8%. Web applications remained the primary vector for exploit-driven initial access [DBIR-2024, p.7]; [DBIR-2024, p.12]. Credential stuffing flagged for consumer-facing apps/APIs [DBIR-2024, p.44].

- **2025 — espionage spike (sampling), credential ecosystem deep-dive; fourth taxonomy event.** BWAA n=1,701 incidents, 1,387 breaches; **espionage overtook financial at 61% vs 34%** in the actor-motive block [DBIR-2025, p.52] (narrative rounds to 62% [DBIR-2025, p.53]). Stolen creds 88% of BWAA actions [DBIR-2025, p.53]. Report **separates "Exploitation of vulnerabilities" as a primary initial-access vector across all patterns** (VPN/edge from 3% to 22%) [DBIR-2025, p.21] — fourth taxonomy event. New credential-ecosystem section: infostealers, marketplaces, three leaked-secret categories (web-app infra, dev/CI-CD, cloud-platform) [DBIR-2025, p.17]. Snowflake breaches representative [DBIR-2025, p.53].

- **2026 — BWAA doubles; Exploit vuln returns inside BWAA; espionage reverts.** BWAA n=3,217 incidents, 2,281 breaches [DBIR-2026, p.54] — near-doubling from 2025. Motives revert to Financial 74% / Espionage 23% [DBIR-2026, p.54]. Stolen creds top action; Exploit vuln rises within BWAA, tied to unpatched org/partner software [DBIR-2026, p.55]. Password dumper debuts as a top action [DBIR-2026, p.55]. First dedicated SAST/DAST commentary, first acknowledgment of GenAI-driven vulnerability discovery [DBIR-2026, p.32]. **At the report level, Exploitation of vulnerabilities is the #1 initial-access vector at 31%, overtaking credential abuse at 13%** [DBIR-2026, p.10]. In APAC, BWAA share doubled to 22% [DBIR-2026, p.101].

The arc is not a decline. Headline BWAA share fluctuates because the DBIR keeps narrowing what counts. By incident volume, vector ranking, and absolute vuln-exploit frequency, the web/API attack surface is the same or larger than 2020, distributed across multiple patterns and a top-level vector statistic.

## 3. Threat Actor TTPs (MITRE ATT&CK mapped)

| Tactic | Technique | Observed in |
|---|---|---|
| Reconnaissance | T1595.002 Vulnerability Scanning | DBIR-2024 p.42 |
| Resource Development | T1586.002 Compromise Accounts: Email | DBIR-2024 p.42 |
| Initial Access | T1190 Exploit Public-Facing Application | DBIR-2023 p.25; DBIR-2024 p.7 (MOVEit); DBIR-2024 p.42; DBIR-2026 p.10 (31% of vectors) |
| Initial Access | T1133 External Remote Services | DBIR-2024 p.42; DBIR-2025 p.21 (VPN/edge 22%) |
| Initial Access | T1078 Valid Accounts | DBIR-2021 p.58 (80% of BWAA); DBIR-2024 p.42 |
| Initial Access | T1078.001 Default Accounts | DBIR-2024 p.42 |
| Initial Access | T1078.002 Domain Accounts | DBIR-2024 p.42 |
| Initial Access | T1078.004 Cloud Accounts | DBIR-2020 p.27 (cloud creds 77%); DBIR-2025 p.53 (Snowflake) |
| Credential Access | T1110 Brute Force (+ .001–.004 sub-techniques) | DBIR-2021 p.60; DBIR-2024 p.42; DBIR-2024 p.44 |
| Credential Access | T1539 Steal Web Session Cookie | DBIR-2025 p.17; DBIR-2025 p.53 |
| Credential Access | T1003 OS Credential Dumping ("Password dumper") | DBIR-2026 p.55 |
| Defense Evasion / Lateral | T1550.001 App Access Token | DBIR-2024 p.42; DBIR-2025 p.17 (API keys in repos) |

Web-app initial access drove the three landmark cases of the period: MOVEit (T1190 → ransomware via System Intrusion) [DBIR-2024, p.35]; Snowflake customer campaign (T1078.004 + T1539 from infostealer logs) [DBIR-2025, p.53]; 2025-summer return of the MOVEit operators, observed in the Educational Services sector dataset [DBIR-2026, p.83].

## 4. Notable Incidents Referenced by DBIR

- **MOVEit (CVE-2023-34362).** Progress Software's managed file transfer product, exploited via SQL injection — "attackers to upload a backdoor through a crafty SQL injection attack" [DBIR-2024, p.35]. Exploitation began May 27, 2023; victim reports flooded in by June [DBIR-2024, p.82]. The same operators returned in late summer 2025; the Education-sector dataset captures their web-app vector dominance at 71% of malware-driven cases (n=272) — an **Education-sector-specific** statistic, not global [DBIR-2026, p.83]. Canonical recent T1190 case.

- **Magento / Magecart (2020).** Mass SQL-injection attacks against e-commerce platforms; payment-card scraping scripts on PrismWeb and OpenCart [DBIR-2020, p.105]. The 2021 DBIR re-routed Magecart cases to System Intrusion because their footprint exceeded BWAA's "get in, get out" definition [DBIR-2021, pp.55–56] — clean example of the taxonomy shift.

- **APT41 / Winnti exploitation of a vulnerable web app (2022 dataset).** "Exploitation of a vulnerable web application led to lateral exploitation of networks in several US state governments by APT41" [DBIR-2023, p.74]. Espionage actor, T1190, lateral movement — the web-app-exploit → System-Intrusion pathway.

- **Snowflake customer breaches (2024).** Customer-facing web/API endpoints accessed via stolen credentials harvested from infostealer malware; absence of enforced MFA enabled account takeover [DBIR-2025, p.53]. T1078.004 + T1539. Canonical credential-ecosystem chain BWAA now codifies.

## 5. Detection & Mitigation Controls (practitioner-level)

The DBIR's recurring guidance is **CIS Controls** (Center for Internet Security Critical Security Controls) 5 (Account Management), 6 (Access Control / **MFA** — Multi-Factor Authentication), 7 (Continuous Vulnerability Management), and 16 (Application Software Security) [DBIR-2023, pp.41 & 67]; [DBIR-2025, p.54]; [DBIR-2026, p.55]. Additional acronyms first used here: **KEV** (CISA's Known Exploited Vulnerabilities catalog), **EPSS** (Exploit Prediction Scoring System — FIRST.org's per-CVE 30-day exploitation likelihood score), **SBOM** (Software Bill of Materials), **mTLS** (mutual TLS — both client and server present certificates), **CWE** (Common Weakness Enumeration — MITRE's taxonomy of software flaw types).

**Pre-merge / pre-deploy.**
- **SAST in PR gates.** Fail the build on fresh CWE-79 (XSS), CWE-89 (SQLi), CWE-22 (Path Traversal), or CWE-918 (**SSRF** — Server-Side Request Forgery, attacker tricks server into attacker-chosen outbound requests) findings above org severity. DBIR-2026 finds Improper Input Validation (parent of SQLi/XSS) the worst-surviving CWE at >13 months median to 50% remediation; top-3 CWE classes at 6–7 months [DBIR-2026, p.32]. Catching at PR time changes that math.
- **SCA on every push with KEV-blocking policy.** Block merge on a direct dependency introducing a KEV-listed CVE. DBIR-2026 reports median time to fully remediate critical KEV vulns rose to **43 days** (from 32); only **26% were fully remediated** in 2025 (down from 38%); median org had **50% more critical vulns to patch** YoY [DBIR-2026, p.10]. These are DBIR-native findings; Veracode [Veracode "What the 2026 Verizon DBIR Reveals About the State of Application Security", https://www.veracode.com/blog/2026-verizon-dbir-application-security/] re-states them as a DBIR contributor (see §6).
- **DAST in pre-prod with authentication.** Authenticated DAST (or IAST) on every release-candidate. Target OWASP API Top 10, particularly API1 **BOLA** (Broken Object Level Authorization — attacker manipulates an object ID in an API call to access another user's data; legacy term: **IDOR** — Insecure Direct Object Reference), API2 (Broken Authentication), API3 (Broken Object Property Level Authorization). 2021 stuffing data [DBIR-2021, p.60] and 2024 consumer-API stuffing callout [DBIR-2024, p.44] both fit here.
- **Secrets scanning, pre-commit + repo-side.** The 2025 three-category leaked-secret taxonomy [DBIR-2025, p.17] maps to rule sets; wire auto-revocation.

**Runtime.**
- **WAF rule tuning by app type.** E-commerce: Magecart detection, **SRI** (Subresource Integrity — browser hash-validation of loaded scripts) enforcement, card-regex egress alerts. B2B APIs: schema enforcement, BOLA-style anomaly detection. Healthcare portals: MFA-bypass and Account Takeover detection. Cloudflare reported 6.5% of global traffic mitigated in 2024, WAF Managed Rules + DDoS accounting for the majority [Cloudflare "Cloudflare 2024 Year in Review", https://blog.cloudflare.com/radar-2024-year-in-review/]. Tune per app.
- **API discovery + schema enforcement.** Inventory endpoints from real traffic (don't trust the OpenAPI doc), enforce schema at the gateway. Akamai's 2025 SOTI year-in-review flags API inventory blindness as a key 2026 risk: "nearly two-thirds of APAC organizations don't know which of their APIs are processing sensitive data," projecting APIs become "the dominant source of application-layer data breaches" [Akamai "The Year in Review 2025: AI, APIs, and a Whole Lot of Audacity", https://www.akamai.com/blog/security/year-review-2025-ai-apis-audacity]. DBIR-2024 calls out consumer apps/APIs as stuffing targets [DBIR-2024, p.44]; DBIR-2025's leaked-API-keys-in-repos section [DBIR-2025, p.17] is the upstream half.
- **RASP / ADR.** In-process instrumentation sees the SQL query a user input produced, not just the HTTP request. DBIR-2026 notes SAST and DAST "have distinct capabilities" [DBIR-2026, p.32]; runtime is the bridge.
- **Credential-stuffing controls at auth + infostealer-exposure feeds.** Given the 637–3.3-billion-attempts-per-org range [DBIR-2021, p.60], rate-limiting alone is insufficient. Stack: (a) device-bound credentials / passkeys, (b) bot detection at login, (c) MFA for externally exposed apps per CIS 6.3 **and** MFA for remote network access per CIS 6.4 [DBIR-2025, p.54] (the latter addresses the 22% VPN/edge surge [DBIR-2025, p.21]), (d) impossible-travel / unfamiliar-ASN alerts, (e) stolen-credential feed subscription with pre-emptive password resets and session invalidations — the 2025 infostealer/marketplace section [DBIR-2025, pp.53–54] makes this an explicit gap.

**Telemetry to log (SIEM; minimum retention 12 months hot, 24 months cold — MOVEit-style campaigns showed weeks-to-months dwell):** WAF block events (rule ID, method, path, param, IP, ASN); app auth events (`user_id`, `session_id`, `client_id`, IP, UA, MFA method); API gateway logs (mTLS cert subject or token `client_id`, endpoint, status, size delta); OAuth token-issuance events (`iss`, `aud`, `client_id`, `scope`, IP, device fingerprint); RASP/ADR alerts mapped to OWASP Top 10 / API Top 10 IDs; SBOM diffs per release tied to KEV + EPSS feeds.

**Signatures to alert on:** same source IP attempting login on >25 distinct usernames in <10 min (stuffing); WAF block followed within minutes by an authenticated login from same IP (WAF-evasion success); API call sequence skipping authorization endpoints (BOLA candidate); SQL error string in response body with reflective parameter (SQLi blind probing); cookie/session identifier reuse across geographically impossible source IPs (T1539 session theft); outbound egress to a known infostealer C2 from a developer endpoint.

## 6. Open Problems / Where the Data is Weak

- **Taxonomy non-comparability.** Four documented events (2021 BWAA split, 2022 Supply Chain pattern, 2023 Exploit-vuln promotion, 2025 Vulnerability-Exploitation-as-vector standalone) mean **no clean longitudinal "web-app breach" comparison exists in the DBIR**. The 48→19 keyword decline is taxonomy noise (§1). Track "Web application" as an *action vector* across patterns, not as BWAA share.

- **2025 espionage spike was a sampling artifact.** The jump to 61–62% espionage motive [DBIR-2025, pp.52–53] was described as "perhaps a testament to the increasing quality of our partners" — i.e., dataset composition changed. 2026 BWAA motives are Financial 74% / Espionage 23% [DBIR-2026, p.54], a near-complete reversion — strong support for the composition hypothesis.

- **The 2026 KEV / CWE-survival cohort is not independent of Veracode.** The 26% KEV remediation, 43-day median, and CWE-survival findings on DBIR-2026 pp.10 and 32 are drawn from a contributor cohort that includes Veracode, a **named data contributor to the 2026 DBIR**. The Veracode blog [Veracode, op. cit.] is the contributor analyzing data they themselves supplied — not independent triangulation. Numbers credible; commentary is DBIR-contributor framing.

- **API-specific data is thin.** The DBIR's VERIS asset taxonomy does not separate API endpoints from web pages beyond "Web application server" — out of step with modern architecture and the separate OWASP API Top 10. Akamai's projection that APIs become the dominant app-layer attack vector [Akamai SOTI, op. cit.] is not yet visible in DBIR's headline pattern accounting.

- **MFA-bypass / AiTM (Adversary-in-the-Middle — phishing kits like EvilProxy/Tycoon that proxy the real login flow to intercept session tokens after MFA) is undercounted.** Heavily discussed in vendor telemetry, rarely tagged in BWAA; likely surfaces as plain "Use of stolen credentials."

- **CWE-survival cohort limits.** The 2026 analysis [DBIR-2026, p.32] is new and useful but the cohort is limited to one DBIR contributor's SDLC-telemetry customer base.

## 7. Forward-Looking 12–24 Month Outlook

- **AI-driven vulnerability discovery will compress the disclosure cycle.** DBIR-2026's GenAI sidebar [DBIR-2026, p.32] flags both offensive (faster zero-day discovery, automated exploit dev) and defensive use. **Falsifiable prediction:** by end-2027, median time-to-public-PoC for a high-severity web-app CVE drops below 14 days. KEV-eligible CVEs need a days-not-weeks SLA, with hot-patch / RASP fallback. Akamai agrees: "the time required for AI-enabled exploits to achieve success [is] compressed dramatically" [Akamai SOTI, op. cit.].

- **API will be promoted to a first-class DBIR asset or vector by the 2028 edition.** Given the 2025 leaked-API-keys callout [DBIR-2025, p.17] and Akamai's per-region API-attack data, expect a VERIS taxonomy change in 2027 or 2028. **Falsifiable prediction:** the 2028 DBIR introduces an "API" asset variety or a dedicated "API Attacks" pattern.

- **BWAA share will look modest while web-app initial access grows in absolute terms.** Expect 2027–2028 to show BWAA at 10–25% while System Intrusion and the standalone "Exploitation of vulnerabilities" vector hold majority shares. The 2026 framing — "defenders may be successfully raising the bar [...] or attackers are leveraging their initial access to achieve more complex objectives" [DBIR-2026, p.54] — combined with Exploit-vuln as #1 vector at 31% [DBIR-2026, p.10], makes 2027 the test case.

## Sources

### Accepted (independent third-party)

1. **Verizon DBIR 2020–2026** — primary sources, page citations throughout.
2. **Akamai — "The Year in Review 2025: AI, APIs, and a Whole Lot of Audacity"** (https://www.akamai.com/blog/security/year-review-2025-ai-apis-audacity). ~2,800-word multi-author year-in-review by Akamai's Security Intelligence Group; **not a DBIR contributor**. Substantive AppSec content correlating to DBIR themes: 94% YoY Layer-7 DDoS growth, 300% AI-bot traffic growth, OWASP framework mapping (32% of real attack alerts map to OWASP), API inventory coverage gap (47% of AppSec teams maintain full inventory but cannot identify sensitive-data APIs), forward projection that APIs become the dominant app-layer attack vector. **PASS** under methodology §1.2.
3. **Cloudflare — "Cloudflare 2024 Year in Review" / Radar 2024** (https://blog.cloudflare.com/radar-2024-year-in-review/). ~9,000-word post; **not a DBIR contributor.** Security and bot/API sections (~1,800 words): WAF-mitigation rates (6.5% of global traffic), Log4j persistence years after disclosure, API traffic share of dynamic traffic (>50%). **PASS.**

### Accepted with disclosure

4. **Veracode — "What the 2026 Verizon DBIR Reveals About the State of Application Security"** (https://www.veracode.com/blog/2026-verizon-dbir-application-security/). **PASS WITH DISCLOSURE.** Veracode is a **named data contributor to the 2026 DBIR**; this is the contributor's own commentary on a report containing their data, not independent triangulation. CWE-survival, KEV-remediation, and time-to-fix numbers are DBIR-native findings sourced (in part) from Veracode telemetry supplied to Verizon. Cited for context and to make contributor-circularity explicit (see §6). **Not counted toward the ≥3-independent-source requirement.**

### Rejected

1. **Datadog — "State of Application Security"** — substantive AppSec telemetry but does not engage the DBIR substantively. **Rejected per methodology §1.2.**
2. **Snyk blog** (https://snyk.io/blog/) — specific DBIR-year URLs returned 404. **Rejected: cannot verify deep-dive bar.**
3. **Contrast Security DBIR topic page** — only three short CISO-insight posts mention DBIR in a paragraph each. **Rejected: insufficient depth.**
4. **F5 Labs / Imperva / SecurityWeek / Dark Reading / CSO Online / SANS / IBM SecurityIntelligence** — DBIR-specific URLs 404 or redirected to marketing landing pages. **Rejected: not accessible.**

---

*End of final.*
