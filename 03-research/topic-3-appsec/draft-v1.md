# Application Security — Web Apps, APIs, and the BWAA Pattern Across DBIR 2020–2026

**Author persona:** Persona #1 — Senior Cybersecurity / Software Engineering Analyst
**Draft:** v1
**Model:** anthropic/claude-opus-4-7 (cloudflare-ai-gateway)
**Scope years:** 2020–2026

---

## 1. Definition & Scope

**Application security (AppSec)** here covers controls, telemetry, and engineering practice protecting internet-facing web applications and APIs: Static, Dynamic, and Interactive Application Security Testing (SAST/DAST/IAST), Software Composition Analysis (SCA), Web Application Firewalls (WAF), Runtime Application Self-Protection (RASP) / Application Detection and Response (ADR), API discovery and schema enforcement, and OWASP Top 10 plus OWASP API Top 10 control mappings.

In the DBIR, the primary lens is the **Basic Web Application Attacks (BWAA)** Incident Classification Pattern, introduced in 2021 to replace the older "Web Applications" pattern. BWAA is "attacks against a Web application, [where] after the initial compromise, they do not have a large number of additional Actions… the 'get in, get the data and get out' pattern" [DBIR-2022, p.24]; [DBIR-2025, p.38]. It covers two sub-patterns: (a) credential abuse against web, API, or email front-ends, and (b) exploitation of web-layer vulnerabilities with minimal post-compromise activity [DBIR-2021, pp.58–61].

What BWAA does **not** cover matters as much. Complex chains starting with a web exploit and pivoting inside the network (ransomware, hands-on-keyboard, data staging) are routed to **System Intrusion**, where vulnerability exploitation is also a top action [DBIR-2023, p.25]; [DBIR-2026, p.40]. Counting only BWAA breaches systematically *under-represents* web-layer initial access. Any year-over-year comparison that ignores this routing rule is wrong.

The keyword index for this topic shows 48 hits in 2020 declining to 19 in 2026. **This is a taxonomy artifact, not a reduction in web-app risk.** The 2020 report used "Web Applications" as a broad pattern that swept up incidents now classified under System Intrusion or Social Engineering [DBIR-2021, pp.31–34]. The literal string "Web Application Attacks" appears less as the analytical pattern got narrower, while the threat itself is, by every other measure, larger than it was in 2020.

## 2. DBIR Trendline 2020–2026

- **2020 — "Web Applications" pattern is broad and dominant.** Web apps were involved in 43% of breaches [DBIR-2020, p.7]. Cloud breaches involved an email or web-app server 73% of the time; 77% of those cloud breaches also involved breached credentials [DBIR-2020, p.27]. The dataset analyzed 5.5 billion web application attack blocks (top varieties: PHP injection, SQL injection, file upload, LFI, XSS) [DBIR-2020, p.37]. Credential abuse and vuln exploitation are still conflated.

- **2021 — BWAA introduced; this is the inflection point.** Verizon renamed the pattern and carved out multi-step incidents to the new System Intrusion pattern [DBIR-2021, pp.32–34]; [DBIR-2021, p.58]. BWAA: 4,862 incidents, 1,384 confirmed breaches; financial motive 89%, credentials in 80% of breaches [DBIR-2021, p.58]. Credential-stuffing telemetry: 23% of monitored orgs had events, with 95% receiving 637 to 3.3 billion attempts in a year [DBIR-2021, p.60]. **Every subsequent "BWAA decline" must be read against this scope cut.**

- **2022 — BWAA stable; mail servers prominent.** BWAA n=972 breaches [DBIR-2022, p.37]. Web-app servers were 56% and mail servers 28% of compromised server assets [DBIR-2022, p.17]; 80% of compromised mail servers fell to stolen credentials [DBIR-2022, p.38]. Web application was the #1 attack vector overall [DBIR-2022, p.15]. BWAA overtook Miscellaneous Errors as the top breach pattern in Healthcare [DBIR-2022, p.61].

- **2023 — Exploit vuln promoted; BWAA share holds.** BWAA n=1,404 incidents, 1,315 breaches [DBIR-2023, p.35]. "50% of organizations [experienced] over 39 Web application attacks this year" [DBIR-2023, p.36]. Inside the System Intrusion pattern, web applications are the dominant vector for vuln-exploit incidents [DBIR-2023, p.25]. The 2023 edition breaks "Exploit vuln" out as its own first-class action — the second major taxonomy event in our window.

- **2024 — apparent BWAA collapse, real exploit surge elsewhere.** BWAA dropped from ~25% to "just over 8% of breaches" [DBIR-2024, p.43]. **This is not a defender win.** The same year, the MOVEit zero-day (CVE-2023-34362) — a SQL-injection-based web-app exploit — triggered an industry-wide breach wave [DBIR-2024, p.35]; [DBIR-2024, p.82], but those incidents landed in System Intrusion, not BWAA. Web applications remained the primary vector for exploit-driven initial access [DBIR-2024, p.7]; [DBIR-2024, p.12]. Credential stuffing flagged as a growing concern for consumer-facing apps and APIs [DBIR-2024, p.44].

- **2025 — espionage spike, credential ecosystem deep-dive.** BWAA n=1,701 incidents, 1,387 breaches; for the first time **espionage overtook financial motive, 61% vs 34%** [DBIR-2025, p.52]. Stolen credentials remained the defining action at ~88% of BWAA breaches [DBIR-2025, p.53]. The report introduced a credential-ecosystem section on infostealers, marketplaces, and three categories of leaked secrets: web-app infrastructure, dev/CI-CD, and cloud-platform secrets [DBIR-2025, p.17]. The Snowflake customer-breach campaign is the representative case [DBIR-2025, p.53]. VPN/edge devices surge to 22% of initial-access vectors, up from 3% [DBIR-2025, p.21].

- **2026 — BWAA doubles; Exploit vuln returns inside BWAA.** BWAA n=3,217 incidents, 2,281 breaches [DBIR-2026, p.54] — a near-doubling from 2025. Stolen creds top action again, but Exploit vuln within BWAA rises, tied to unpatched software in the org's or a partner's infrastructure [DBIR-2026, p.55]. Password dumper debuts as a top action variety [DBIR-2026, p.55]. The first dedicated SAST/DAST commentary appears in the report, with first acknowledgment of GenAI-driven vulnerability discovery [DBIR-2026, p.32]. Web applications are the primary vector in 71% of malware-driven breach cases via System Intrusion [DBIR-2026, p.83]. In APAC, BWAA share doubled to 22% of breaches [DBIR-2026, p.101].

The arc is not a decline. The headline BWAA share fluctuates because the DBIR keeps narrowing what counts. The web/API attack surface is, by incident volume, vector ranking, and absolute vuln-exploit frequency, the same — or larger — problem, now spread across two patterns.

## 3. Threat Actor TTPs (MITRE ATT&CK mapped)

| Tactic | Technique ID | Technique | Observed in |
|---|---|---|---|
| Reconnaissance | T1595.002 | Active Scanning: Vulnerability Scanning | DBIR-2024 p.42 |
| Resource Development | T1586.002 | Compromise Accounts: Email Accounts | DBIR-2024 p.42 |
| Initial Access | T1190 | Exploit Public-Facing Application | DBIR-2023 p.25; DBIR-2024 p.7 (MOVEit); DBIR-2024 p.42; DBIR-2026 p.83 |
| Initial Access | T1133 | External Remote Services | DBIR-2024 p.42; DBIR-2025 p.21 (VPN/edge 22%) |
| Initial Access | T1078 | Valid Accounts | DBIR-2021 p.58 (80% of BWAA); DBIR-2024 p.42 |
| Initial Access | T1078.001 / .002 | Default / Domain Accounts | DBIR-2024 p.42 |
| Initial Access | T1078.004 | Cloud Accounts | DBIR-2020 p.27 (cloud creds 77%); DBIR-2025 p.53 (Snowflake) |
| Credential Access | T1110 + sub-techniques | Brute Force / Stuffing / Spraying | DBIR-2021 p.60; DBIR-2024 p.42; DBIR-2024 p.44 |
| Credential Access | T1539 | Steal Web Session Cookie | DBIR-2025 p.17 (infostealer logs); DBIR-2025 p.53 |
| Credential Access | T1003 | OS Credential Dumping (Password dumper) | DBIR-2026 p.55 |
| Defense Evasion / Lateral | T1550.001 | App Access Token | DBIR-2024 p.42; DBIR-2025 p.17 (API keys in repos) |

Web-app initial access drove the three landmark cases of the period: MOVEit (T1190 → ransomware via System Intrusion) [DBIR-2024, p.35]; the Snowflake customer campaign (T1078.004 + T1539 from infostealer logs) [DBIR-2025, p.53]; and the 2025-summer return of the MOVEit operators with new tooling [DBIR-2026, p.83].

## 4. Notable Incidents Referenced by DBIR

- **MOVEit (CVE-2023-34362).** Progress Software's managed file transfer product, exploited via SQL injection: "the vulnerability essentially did was to allow the attackers to upload a backdoor through a crafty SQL injection attack" [DBIR-2024, p.35]. Exploitation began May 27, 2023; victim reports flooded in by June [DBIR-2024, p.82]. The same operators returned in late summer 2025 with a different ransomware playbook [DBIR-2026, p.83]. The canonical recent T1190 case.

- **Magento / Magecart (2020).** Mass scanning and SQL-injection attacks against e-commerce platforms; payment-card scraping scripts on PrismWeb and OpenCart [DBIR-2020, p.105]. The 2021 DBIR re-routed Magecart cases into System Intrusion because their footprint exceeded BWAA's "get in, get out" definition [DBIR-2021, pp.55–56]. A clean example of the taxonomy shift in action.

- **APT41 / Winnti exploitation of a vulnerable web app (2022 dataset).** "Exploitation of a vulnerable web application led to lateral exploitation of networks in several US state governments by APT41" [DBIR-2023, p.74]. Espionage actor, T1190, lateral movement — illustrative of the "web-app exploit → System Intrusion" pathway.

- **Snowflake customer breaches (2024).** Customer-facing web/API endpoints accessed via stolen credentials harvested from infostealer malware on user/contractor endpoints; absence of enforced MFA enabled account takeover [DBIR-2025, p.53]. T1078.004 + T1539. The canonical example of the credential-ecosystem chain that BWAA now codifies.

## 5. Detection & Mitigation Controls (practitioner-level)

The DBIR's recurring guidance is CIS Controls 5 (Account Management), 6 (Access Control / MFA), 7 (Continuous Vulnerability Management), and 16 (Application Software Security) [DBIR-2023, pp.41 & 67]; [DBIR-2025, p.54]; [DBIR-2026, p.55]. The expansion below is what those map to in practice.

**Pre-merge / pre-deploy.**
- **SAST in PR gates.** Run on every pull request; fail the build on a fresh CWE-79/89/22/918 finding above org-defined severity. The 2026 DBIR identifies Improper Input Validation (parent of SQLi/XSS) as the worst-surviving CWE class at >13 months median time to 50% remediation [DBIR-2026, p.32]. Veracode's analysis of the same dataset puts the top-three CWE categories at 6–7 months median 50% remediation [Veracode "What the 2026 Verizon DBIR Reveals About the State of Application Security", https://www.veracode.com/blog/2026-verizon-dbir-application-security/]. Catching at PR time changes the survival math.
- **SCA on every push with KEV-blocking policy.** Block merge if a direct dependency introduces a CVE in CISA's KEV catalog. The 2026 DBIR's cohort shows median time to full KEV remediation crept to 43 days from 32 the prior year, with median per-org KEV count rising from 11 to 16 [Veracode, op. cit.].
- **DAST in pre-prod with auth.** Run authenticated DAST (or IAST in the test environment) against every release-candidate of an internet-facing service. Target OWASP API Top 10 (API1 BOLA, API2 broken auth, API3 broken object property level authz). Industrial-scale credential stuffing [DBIR-2021, p.60] and consumer-API stuffing [DBIR-2024, p.44] both fit here.
- **Secrets scanning, pre-commit + repo-side.** The 2025 DBIR's three-category leaked-secret taxonomy [DBIR-2025, p.17] maps directly to rule sets; wire auto-revocation pipelines for hits.

**Runtime.**
- **WAF rule tuning by app type.** E-commerce needs Magecart detection, SRI enforcement, and card-regex egress alerts; B2B APIs need schema enforcement and BOLA-style anomaly detection; healthcare portals need MFA-bypass and ATO detection. Cloudflare reported 6.5% of global traffic mitigated in 2024 (half WAF, half DDoS), with Gambling/Games as the most-attacked industry [Cloudflare "Cloudflare 2024 Year in Review", https://blog.cloudflare.com/radar-2024-year-in-review/]. Tune per app — not a single default ruleset everywhere.
- **API discovery + schema enforcement.** Inventory every endpoint from real traffic (don't trust the swagger doc), then enforce the OpenAPI schema at the gateway. Cloudflare reports more than half of dynamic traffic is API-related [Cloudflare 2024 Y-i-R, op. cit.]. The 2024 DBIR calls out consumer-facing apps and APIs as a credential-stuffing target [DBIR-2024, p.44].
- **RASP / ADR.** In-process instrumentation that sees the SQL query a user input produced, not just the HTTP request. The 2026 DBIR notes SAST and DAST "have distinct capabilities to find different types of weaknesses" [DBIR-2026, p.32]; runtime instrumentation is the bridge.
- **Credential-stuffing controls at the auth endpoint.** Given the 637-to-3.3-billion-attempts-per-org range [DBIR-2021, p.60], rate-limiting alone is insufficient. Stack (a) device-bound credentials / passkeys, (b) bot detection at login, (c) MFA for all externally exposed apps per CIS 6.3 [DBIR-2025, p.54], (d) impossible-travel and unfamiliar-ASN alerts.
- **Infostealer-exposure feeds.** Subscribe to a stolen-credential feed (HIBP, vendor-specific); pre-emptively force password resets and session invalidations for matches. The 2025 infostealer/marketplace section [DBIR-2025, pp.53–54] makes this an explicit gap.

**Telemetry to log (SIEM coverage).**
1. WAF block events with rule ID, method, path, parameter, IP, ASN.
2. Application auth events (success/failure) with user_id, session_id, client_id, source IP, user agent, MFA method.
3. API gateway logs with caller identity (mTLS / token `client_id`), endpoint, latency, status, request/response size delta.
4. Token-issuance events (OAuth `iss`, `aud`, `client_id`, `scope`, IP, device fingerprint).
5. RASP/ADR alerts mapped to OWASP Top 10 / API Top 10 IDs.
6. SBOM diffs per release tied to KEV and EPSS feeds.

**Signatures to alert on.**
- Same source IP attempting login on >25 distinct usernames in <10 min (credential stuffing).
- WAF block followed within minutes by an authenticated login from the same IP (WAF evasion success).
- API call sequence skipping authorization endpoints (BOLA candidate).
- SQL error string in response body with reflective parameter (SQLi blind probing).
- Cookie/session identifier reuse across geographically impossible source IPs (T1539 session theft).
- Outbound egress to a known infostealer C2 from a developer endpoint (credential-theft precursor).

## 6. Open Problems / Where the Data is Weak

- **Taxonomy non-comparability across years.** The 2021 BWAA split, 2023 Exploit-vuln promotion, and 2024 reclassification of MOVEit-style mass-exploits to System Intrusion mean **no clean longitudinal "web-app breach" comparison exists in the DBIR**. The keyword-index decline from 48 to 19 is taxonomy noise; practitioners should look at "Web application" as an *action vector* across patterns rather than at BWAA share. The DBIR makes that data available but rarely on headline pages.

- **The 2025 espionage spike in BWAA is unexplained.** The jump from ~10–20% to 62% espionage motive [DBIR-2025, p.53] is described as "perhaps a testament to the increasing quality of our partners" — a polite way of saying dataset composition changed. Without partner-mix disclosure we can't separate real growth from sampling artifact. The 2026 numbers regress toward financial [DBIR-2026, p.54], which supports the artifact hypothesis but doesn't prove it.

- **API-specific data is thin.** The DBIR's VERIS asset taxonomy does not separate API endpoints from web pages beyond "Web application server." This is out of step with both the architecture of the apps under attack and the existence of a separate OWASP API Top 10 since 2019.

- **MFA-bypass / AiTM is undercounted.** Adversary-in-the-Middle phishing kits (Tycoon, EvilProxy) that defeat push MFA are heavily discussed in vendor telemetry but rarely tagged in BWAA action varieties. They likely surface as plain "Use of stolen credentials."

- **Vuln-fix timing data is limited.** The 2026 DBIR's CWE survival analysis [DBIR-2026, p.32] is genuinely new and useful, but the cohort is limited to orgs contributing SDLC telemetry to one Verizon partner.

## 7. Forward-Looking 12–24 Month Outlook

- **AI-driven vulnerability discovery will compress the disclosure cycle.** The 2026 DBIR's GenAI sidebar [DBIR-2026, p.32] flags both offensive (faster zero-day discovery, automated exploit dev) and defensive use. SCA and SAST both have to keep up with a higher new-CVE-vs-codebase match rate. Patch SLAs measured in weeks become untenable; KEV-eligible CVEs need a days-not-weeks target, with hot-patch / RASP fallback for the gap.

- **BWAA share will keep looking small while web-app initial access grows.** Expect 2027–2028 to show BWAA at 10–20% while System Intrusion (driven by web/edge exploits) holds 50%+. The 2026 framing — "defenders may be successfully raising the bar [...] or attackers are leveraging their initial access to achieve more complex objectives" [DBIR-2026, p.54] — strongly implies the latter.

- **Infostealer → web/API account takeover is now the dominant credential pathway.** The 2025 credential-ecosystem section [DBIR-2025, pp.17, 53–54] and 2026 password-dumper debut [DBIR-2026, p.55] both point to credentials acquired off-host (infostealers, repo leaks, prior breaches) being weaponized against web auth endpoints. Counter-move: device-bound credentials (passkeys), workforce MFA hardening, customer-side MFA enforcement on consumer apps.

- **API security tools shift from discovery to policy enforcement.** Cloudflare's API traffic composition data [Cloudflare 2024 Y-i-R, op. cit.] and Datadog's finding that 74% of attacks are mistargeted when filtered by runtime context [Datadog "State of Application Security", https://www.datadoghq.com/state-of-application-security/] both argue for runtime context as the prioritization signal. Schema enforcement, BOLA-aware detection, and per-route authorization policy become table-stakes.

- **The DBIR will likely introduce API as a first-class asset or vector.** Given the 2025 callout of API keys in repos [DBIR-2025, p.17] and the rising prominence of API-only services, expect the 2027–2028 editions to add an API asset category.

## Sources

### Accepted

1. **Verizon DBIR 2020–2026** (seven primary editions). Page citations throughout.
2. **Veracode — "What the 2026 Verizon DBIR Reveals About the State of Application Security"** (https://www.veracode.com/blog/2026-verizon-dbir-application-security/). Veracode is a named data contributor to the 2026 DBIR. ~1,500–1,600 words of DBIR-data analysis: vuln-exploitation as #1 vector at 31%, 26% KEV remediation rate, 43-day median time to fix, CWE survival 6–7 months for top-3 and >13 months for Improper Input Validation. **PASS.**
3. **Cloudflare — "Cloudflare 2024 Year in Review" / Radar 2024** (https://blog.cloudflare.com/radar-2024-year-in-review/). ~9,000+ words; the security and bot/API sections (~1,800 words) provide WAF-mitigation rates (6.5%), Log4j persistence years after disclosure, most-attacked industries, and API traffic share of dynamic traffic. Cross-validates DBIR findings on web-app vector dominance and exploit longevity per methodology §1.2. **PASS.**
4. **Datadog — "State of Application Security"** (https://www.datadoghq.com/state-of-application-security/). ~3,500 words engaging OWASP Top 10 / API Top 10 framing, Log4Shell exploitability (<0.1% of orgs), SQL injection (5% of orgs/year), SSRF (2%), and the runtime-context point that 74% of attacks are mistargeted. Provides triangulating telemetry against DBIR claims. **PASS** as a triangulating telemetry source under methodology §1.2 (vendor telemetry contrasted with DBIR data); does not strictly hit "≥1500 words analyzing DBIR" if read narrowly.

### Rejected

1. **Snyk blog** (https://snyk.io/blog/). Index live; specific DBIR-year URLs returned 404 within attempted depth. No single Snyk post with ≥1,500 words of DBIR-specific analysis verified. **Rejected: cannot verify deep-dive bar.**
2. **Contrast Security DBIR topic page** (https://www.contrastsecurity.com/security-influencers/topic/dbir). Three short CISO-insight posts mention DBIR in a paragraph or two; none meet ≥1,500-word DBIR-analysis bar. **Rejected: insufficient depth.**
3. **Imperva blog** — URL guesses for known DBIR-correlated posts returned 404. **Rejected: not accessible.**
4. **SecurityWeek and Dark Reading DBIR coverage** — attempted DBIR-specific URLs 404'd. **Rejected: not accessible.**
5. **IBM SecurityIntelligence "Key Takeaways DBIR 2024"** — destination redirected to a generic IBM Security marketing landing page with no DBIR analysis on the landing page. **Rejected: redirect strips the analytical content.**

---

*End of draft-v1.*
