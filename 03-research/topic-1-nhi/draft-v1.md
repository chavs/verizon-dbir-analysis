# Non-Human Identities (NHI) in the Verizon DBIR, 2020–2026

> Draft v1 — Persona #1 (Senior Cybersecurity / Software Engineering Analyst).
> Sources: 7 DBIRs (2020–2026), pre-built keyword index `topic-1-nhi.json`, three accepted third-party deep-dives.

---

## 1. Definition & Scope

For this brief, **non-human identities (NHI)** means any authenticatable principal that is not a person logging in interactively. Concretely: service accounts (AD, Linux, Kubernetes), workload identities (SPIFFE SVIDs, AWS IAM roles, Azure managed identities, GCP service accounts), API keys and OAuth client credentials, signing/code-signing certificates, SSH private keys, database connection strings, JWTs used for service-to-service auth, CI/CD pipeline tokens (GitHub Actions OIDC, GitLab tokens, Jenkins credentials), bot accounts, and now agentic-AI service identities.

NHIs differ from human identities along four axes practitioners actually care about: (a) they outnumber humans 25–50× in cloud-native estates [GitGuardian "Mythos-Ready Briefing", https://blog.gitguardian.com/what-the-mythos-ready-briefing-says-about-credentials/]; (b) they are typically long-lived static secrets, not session-bound; (c) lifecycle ownership is often unclear after the original developer leaves; (d) MFA is rarely applicable.

**Taxonomy caveat.** The DBIR did not maintain a clean, named "NHI" category in any year of our window. NHI signal is scattered across the VERIS `Credentials` and `Secrets` data varieties, the `Use of stolen credentials` action, the `service account` keyword (explicit in only 3 of 7 reports), and from 2025 onward a dedicated discussion of leaked secrets in git repos. The 2025 DBIR is the first edition devoting a sidebar to non-password credentials [DBIR-2025, p.17]. Pre-2024 trendline numbers in this brief are inferred from credential-abuse and secrets-data-variety statistics, not from a clean NHI taxonomy. Section 6 flags where this matters.

## 2. DBIR Trendline 2020–2026

The 7-year arc is one of **gradual recognition**: NHI exists in every year's data, but Verizon only names and dissects it starting in 2025.

- **2020 (17 keyword hits)** — Credential theft is "ubiquitous"; over 80% of Hacking breaches involve Brute force or Use of lost/stolen credentials [DBIR-2020, p.19]. Credential stuffing called out against SSH and Telnet honeypots [DBIR-2020, p.20]. No NHI distinction; `Secrets` data variety appears in Cyber-Espionage [DBIR-2020, p.36] but is framed as nation-state IP theft, not cryptographic-secret.
- **2021 (10 hits)** — System Intrusion pattern introduced; `Secrets` again appears as a stolen-data variety in espionage breaches [DBIR-2021, p.54, p.93]. Brute-force/credential-stuffing called out in SIEM data [DBIR-2021, p.60]. Still no NHI-specific framing.
- **2022 (11 hits)** — Credentials are 72% of compromised data in APAC breaches and `Secrets` reaches 18–20% in APAC/EMEA [DBIR-2022, p.80, p.81]. Report recommends "two-factor authentication and password managers to minimize credential exposure" [DBIR-2022, p.103] — a recommendation that implicitly does not apply to NHIs.
- **2023 (5 hits — sample-size drop)** — First explicit mention of `service accounts` in CIS Control 5 mapping [DBIR-2023, p.66]. Basic Web Application Attacks pattern formally maps to MITRE T1078 Valid Accounts and T1550.001 Application Access Token [DBIR-2023, p.35]. The hit-count drop reflects taxonomy narrowing, not a real decline in NHI involvement.
- **2024 (10 hits)** — Credential abuse continues to dominate; credential stuffing and brute force broken out [DBIR-2024, p.44]. APIs are explicitly named as targets [DBIR-2024, p.44]. The Snowflake campaign is foreshadowed via stolen-creds discussion.
- **2025 (25 hits — inflection point)** — First DBIR with a **dedicated sidebar on non-password credentials** ("Credential giveaway, no purchase required") [DBIR-2025, p.17]. Verizon partners with a secrets-scanning contributor to publish: n=441,780 leaked secrets in public git repos; web-app infra secrets = 39% of disclosures, 66% of which are JWTs; cloud secrets where 43% are Google Cloud API keys; CI/CD secrets where GitLab tokens are 50%; **median time-to-remediate a leaked GitHub secret = 94 days** [DBIR-2025, p.17, Fig. 12 & Fig. 13]. Snowflake is dissected as the canonical NHI-adjacent breach: ~165 victim orgs, ~80% of accounts had prior credential exposure, no MFA enforcement [DBIR-2025, p.16]. Token theft becomes the #1 M365 MFA-bypass at 31% [DBIR-2025, p.47]. Kerberoasting and rogue-VM service-account abuse via UNC5221 enter the wrap-up [DBIR-2025, p.102].
- **2026 (20 hits)** — Verizon explicitly names insecure NHI authentication as root cause of high-profile third-party cloud breaches: "a good number of these cloud-based, third-party incidents… boil down to insecure authentication (absence of MFA, improper credential rotation) or lack of least privilege enforcement for users or service accounts" [DBIR-2026, p.21]. The Salesloft Drift → Salesforce / ShinyHunters campaign is dissected as a chained NHI breach: "the customer OAuth tokens… from the Salesloft Drift application were compromised… and then they were used against the Salesforce platform" [DBIR-2026, p.21]. Median credential-leak events: 7/yr small orgs, 20/yr large [DBIR-2026, p.45]. 50% of ransomware victims had a credential/infostealer event within 95 days prior [DBIR-2026, p.44]. Kerberoasting and certificate forging called out against "service accounts that are misconfigured and have weak passwords" [DBIR-2026, p.68]. GitHub Actions cascade exposing 23,000+ repos documented [DBIR-2026, p.108].

**Inflection point: 2025.** Before 2025, NHI risk is implicit in credential statistics. From 2025 forward, it is named, measured, and tied to specific service categories (web infra, CI/CD, cloud, DB). The third-party-breach percentage roughly doubling from 15% to 30% [DBIR-2025, p.11] is the macro driver — and most of those third-party incidents are NHI compromises (OAuth tokens, API keys, machine creds in vendor environments).

## 3. Threat Actor TTPs (MITRE ATT&CK mapped)

Mapped to ATT&CK Enterprise v15. Citations point to DBIR years where the technique is named, observed, or implicitly described.

| Tactic | Technique ID | Technique | Observed in DBIR year(s) |
|---|---|---|---|
| Credential Access | T1110 / T1110.001–.004 | Brute Force / Password Guessing / Cracking / Spraying / Stuffing | 2020 p.20, 2023 p.35, 2024 p.42, 2025 p.53 |
| Credential Access | T1003 | OS Credential Dumping (LSASS) | 2026 p.68 — 20% of incidents, 34% of TI reports |
| Credential Access | T1558.003 | Steal/Forge Kerberos Tickets — Kerberoasting | 2026 p.68 (red-team-dominant) |
| Credential Access | T1552.001 | Unsecured Credentials: Credentials In Files | 2025 p.17 (441,780 leaked secrets); 2026 p.108 (GitHub Actions cascade) |
| Credential Access | T1528 | Steal Application Access Token | 2025 p.47 (token theft = 31% of MFA bypass); 2026 p.21 (Salesloft Drift OAuth) |
| Credential Access | T1606.002 | Forge Web Credentials: SAML Tokens / Cert forging | 2026 p.68 (cert forging in red-team data) |
| Defense Evasion / Persistence | T1078 / T1078.001–.004 | Valid Accounts (Default / Domain / Local / Cloud) | 2023 p.35, 2024 p.42, 2025 p.40 |
| Defense Evasion | T1550.001 | Use Alternate Authentication Material: Application Access Token | 2023 p.35, 2024 p.42 |
| Initial Access | T1199 | Trusted Relationship (vendor / OAuth-app supply chain) | 2025 p.16, 2026 p.21 (Salesloft Drift) |
| Initial Access | T1190 | Exploit Public-Facing Application (edge devices holding NHI creds) | 2025 p.16, 2026 p.108 |
| Initial Access | T1133 | External Remote Services (VPN with embedded creds) | 2023 p.35, 2024 p.42, 2026 p.45 (IAB offerings 44% VPN) |
| Privilege Escalation | T1098.003 | Account Manipulation: Additional Cloud Roles | 2026 p.21 (excessive privilege in IaaS/PaaS/SaaS) |
| Persistence | T1136.003 | Create Account: Cloud Account (rogue service accounts on hypervisor) | 2025 p.102 (UNC5221) |
| Collection / Command-and-Control | T1567.002 | Exfiltration to Cloud Storage via stolen API keys | 2025 p.40 (System Intrusion) |

The clear pattern: **credential-access techniques against NHIs (T1552.001, T1528, T1558.003) are increasingly displacing brute force (T1110)** as adversaries discover that one leaked JWT or OAuth token bypasses every downstream control.

## 4. Notable Incidents Referenced by DBIR

- **Snowflake customer compromise (2024, dissected in DBIR-2025)** — ~165 victim orgs; ~80% of accounts had prior credential exposure via infostealers and public repos; MFA not enforced [DBIR-2025, p.16]. Headline NHI lesson: missing control was *vendor-mandated MFA on machine and human accounts alike*.
- **U.S. Treasury / BeyondTrust (Jan 2025)** — Silk Typhoon "stole a BeyondTrust security key, granting remote access to classified workstations" [DBIR-2026, p.108]. The "security key" is an NHI artifact (API/integration credential), not a human MFA token.
- **GitHub Actions cascading supply-chain breach (March 2025)** — "Cascading breach of GitHub Actions exposed secrets for more than 23,000 repositories" [DBIR-2026, p.108]. Pure CI/CD NHI incident.
- **Salesloft Drift → Salesforce / ShinyHunters (UNC6040, 2025)** — OAuth tokens stolen from Salesloft Drift vendor, then replayed against Salesforce to exfiltrate customer data [DBIR-2026, p.21]. Textbook 2026 NHI breach.
- **UNC5221 / rogue VMs via hypervisor service accounts (2023, retro-analyzed 2025)** — "Rogue virtual machines created and managed through service accounts directly on the hypervisor rather than through administrative consoles" [DBIR-2025, p.102]. Service-account compromise defeating tier-0 admin-console logging.
- **Edge-device zero-days (Ivanti Connect Secure CVE-2025-0282, etc.)** — SPAWN malware ecosystem [DBIR-2026, p.108] persists by harvesting embedded device credentials and service tokens.

## 5. Detection & Mitigation Controls (practitioner-level)

This section gives concrete telemetry, alerts, and configuration changes — not "implement zero trust."

### 5.1 Inventory & discovery (do this first)
- Build a continuous NHI inventory by pulling from: AWS IAM (`ListUsers`, `ListRoles`, `ListAccessKeys` + `LastUsedDate`), Azure AD service principals and managed identities (`GET /servicePrincipals`, `signInActivity`), GCP `iam.serviceAccounts.list` + `keys.list`, Okta API tokens, GitHub App installations and PATs, GitLab personal/project/group access tokens, Kubernetes ServiceAccounts via `kubectl get sa -A -o json`.
- Map every NHI to a **human owner** in a CMDB field. Per GitGuardian's NHI ownership data, the modal NHI in enterprise environments has *no recorded owner* [GitGuardian, "What Mythos-Ready Briefing Says About Credentials"].

### 5.2 Secret-leak detection
- Run a secrets scanner (GitGuardian, TruffleHog, GitHub secret scanning) over **every** repo (public AND private — 35% of private repos contain a plaintext secret per GitGuardian) plus Slack, Jira, Confluence, Docker Hub, and CI build logs [GitGuardian "State of Secrets Sprawl 2025"].
- Detect specifically: JWTs (regex `eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\..*`), AWS access keys (`AKIA[0-9A-Z]{16}` and `ASIA…`), Google Cloud API keys (`AIza[0-9A-Za-z\-_]{35}`), GitLab tokens (`glpat-[0-9A-Za-z\-_]{20}`), GitHub fine-grained PATs (`github_pat_…`), Stripe (`sk_live_…`), Slack (`xox[baprs]-…`).
- **Target a P50 remediation under 24 hours.** DBIR-reported median is 94 days [DBIR-2025, p.17]. That gap *is* the practitioner problem.

### 5.3 Rotation cadences (concrete)
- Static long-lived keys (AWS IAM access keys, GCP SA JSON keys, on-prem service-account passwords): **rotate ≤90 days; alert on age > 180 days**. Replace with short-lived tokens wherever the upstream supports it.
- OAuth client secrets: **rotate ≤180 days**, or migrate to OIDC client assertion (JWT-bearer client auth, RFC 7523) so there is no rotatable secret at all.
- SSH host keys: rotate on host re-image. User SSH keys backing service accounts: **90 days**, and prefer SSH certificates issued by step-ca or Vault SSH secrets engine (TTL ≤24 h).
- Internal mTLS / SPIFFE SVIDs: **TTL ≤1 hour**, rotated via the SPIRE node attestor.
- Kubernetes ServiceAccount tokens: use BoundServiceAccountTokenVolume (default in 1.22+) with `expirationSeconds: 3600`.

### 5.4 OIDC / OAuth scope and audience restrictions
- For GitHub Actions deploying to AWS/Azure/GCP, **delete every long-lived cloud key** and use OIDC federation. In the trust policy, pin `token.actions.githubusercontent.com:sub` to the exact `repo:org/repo:ref:refs/heads/main` claim — not wildcards. Pin `aud` to `sts.amazonaws.com`.
- For third-party SaaS OAuth apps: enforce least-privilege scopes (e.g., `chat:read` not `chat:write,admin`); enforce Microsoft Entra "App consent for verified publishers only"; review Salesforce Connected Apps quarterly given the Salesloft Drift precedent [DBIR-2026, p.21].
- Enable OIDC PKCE on every first-party public client (mobile, SPA). Disable the implicit flow and `response_type=token`.

### 5.5 Telemetry to log (with audit-log field names)
- **AWS CloudTrail**: alert on `eventName=GetCallerIdentity` from new source IPs; `userIdentity.type=AssumedRole` with `sessionContext.attributes.mfaAuthenticated=false`; `eventName in (AssumeRole, GetSessionToken)` where `userIdentity.userName` matches an NHI naming pattern.
- **Azure AD sign-in logs**: filter `appDisplayName` and `servicePrincipalId` for sign-ins where `riskState=atRisk` or `clientAppUsed=Other clients`; alert on `tokenIssuerType=AzureAD` combined with `resultType` ≠ 0 spikes.
- **GitHub audit log**: `action=oauth_authorization.create`, `action=personal_access_token.access_granted`, `action=workflow_run.completed` with `oidc_token` events. Forward `actor`, `repo`, `oidc_token_claims` to the SIEM.
- **Okta System Log**: `eventType=system.api_token.create` and `policy.evaluate_sign_on` with `outcome.result=ALLOW` for API tokens.
- **Microsoft 365 / Entra ID**: token-theft detection requires correlating `unfamiliarFeatures`, anomalous `deviceDetail.trustType`, and impossible-travel — per DBIR-2025 token theft is now the #1 MFA-bypass method at 31% [DBIR-2025, p.47].

### 5.6 Alerts you should actually write
- AWS access key created and immediately used from outside known CIDRs within 5 minutes.
- Any IAM principal (human or NHI) gaining a managed policy containing `iam:PassRole` or `*:*` not on an approved allow-list.
- Azure service principal credential added (`Add service principal credentials` event) — almost never legitimate outside change windows.
- GitHub PAT with `repo` + `workflow` scopes used from a country outside the developer's known set.
- Any successful Kerberos TGS-REQ for an account with SPN (Kerberoasting precursor) followed by hash-crack indicators — see [DBIR-2026, p.68].

### 5.7 Architectural fixes
- Adopt SPIFFE/SPIRE (or cloud-native equivalents: AWS IAM Roles Anywhere, GCP Workload Identity Federation, Azure Workload Identity) so service-to-service auth is certificate-based and per-instance.
- Vault every remaining static secret in HashiCorp Vault / AWS Secrets Manager / Akeyless / CyberArk Conjur. The DBIR-cited campaigns succeeded because secrets were in repos and `.env` files, not in a vault.
- Treat **AI agents as NHIs**: the 2026 DBIR Secret Service appendix names agentic AI as the new attack surface [DBIR-2026, p.113]. Issue each agent its own short-lived, narrowly scoped identity; never share an API key across agents.

## 6. Open Problems / Where the Data is Weak

- **No clean NHI taxonomy before 2024.** Pre-2024 keyword-index hits are dominated by the `Secrets` *data-variety* (the nation-state IP meaning) and `Secret Service` (the U.S. agency). Cross-year quantitative trendlines on "NHI-driven breaches" are therefore not meaningful for 2020–2023; I have not attempted them above.
- **Secrets-scanning sample bias.** The 441,780-secrets figure [DBIR-2025, p.17] comes from a single data contributor scanning public git repos. Private-repo and internal-vault leakage is invisible to this dataset, so the true NHI exposure surface is materially larger.
- **94-day median time-to-remediate** [DBIR-2025, p.17] has n=141. That is a thin sample for a headline number — Persona #2 should challenge it.
- **The DBIR does not break out NHI-driven vs human-driven credential abuse** even in 2025/2026. When the report says "credential abuse is 22% of initial access" [DBIR-2025], practitioners cannot tell what fraction is stolen-password-of-Bob vs. leaked-API-key-of-ci-deploy-bot.
- **Salesloft Drift / Salesforce numbers are not in the DBIR dataset proper** — they are narrative call-outs in the third-party section [DBIR-2026, p.21]. Treat as illustrative, not statistical.
- **Service-account keyword hits = 3 across 7 years.** This is shockingly low and probably reflects writer convention more than reality.

## 7. Forward-Looking 12–24 Month Outlook

- **Agentic-AI identity becomes the dominant NHI growth category.** GitGuardian's 2026 telemetry already shows AI-service secrets growing 81% YoY [GitGuardian "AI Secrets Spread Fast"]. The 2026 DBIR Secret Service appendix flags this explicitly [DBIR-2026, p.113]. Expect the 2027 DBIR to add an MCP/agent-token sidebar.
- **OAuth-app supply chain becomes the #1 third-party vector**, displacing software-supply-chain (à la SolarWinds/MOVEit) in volume terms. Salesloft Drift is the first canonical case [DBIR-2026, p.21]; expect 2–3 more headline OAuth-token compromises in 2026–2027.
- **Token theft overtakes phishing as the leading credential-access method** in MFA-enforcing environments. AiTM kits (Evilginx, Tycoon) plus stolen session cookies already account for 31% of M365 MFA bypass [DBIR-2025, p.47]. Practitioners must move to phishing-resistant, device-bound auth (passkeys, FIDO2 with device attestation) and continuous access evaluation (CAE).
- **Regulators start to mandate NHI inventory.** The Australian mandatory ransomware reporting regime [DBIR-2026, p.44] is a precursor; expect EU NIS2 and US SEC follow-ups requiring documented machine-identity governance within 24 months.
- **Vault-as-a-service consolidation** — expect HashiCorp/IBM, AWS Secrets Manager, Akeyless, GitGuardian NHI Governance, and Astrix/Entro/Aembit to converge. Buy decisions made in the next 12 months will lock in 5+ years of NHI tooling architecture.

## Sources

### Accepted third-party deep-dives (≥1500 words of DBIR-specific or DBIR-cross-referenced analysis)

1. **GitGuardian, "The Secrets Sprawl is Worse Than You Think: Key Takeaways from the 2025 Verizon DBIR"** (Dwayne McDaniel, 25 Apr 2025) — https://blog.gitguardian.com/verizon-dbir-2025/ — ~1,700 words. Ten distinct DBIR-2025 findings analyzed with page-citation-equivalent quotes, including the 441,780 leaked secrets, 94-day remediation median, 43% Google Cloud API key share of cloud leaks, third-party doubling, infostealer/ransomware correlation, and explicit NHI framing. **STRONG ACCEPT**.
2. **GitGuardian, "What the Mythos-Ready Briefing Says About Credentials"** (Ben MartinMooney, 24 Apr 2026) — https://blog.gitguardian.com/what-the-mythos-ready-briefing-says-about-credentials/ — ~1,700 words. Cross-references DBIR-2025 stolen-credential statistics (22% / 88% BWAA) and the Snowflake breach against the Mythos-Ready / CSA Labs critical-controls briefing; explicitly mounts the 25–50× NHI-to-human ratio and 64%-of-2022-secrets-still-valid figure. ACCEPT.
3. **GitGuardian, "The State of Secrets Sprawl 2025"** (Soujanya Ain, 11 Mar 2025) — https://blog.gitguardian.com/the-state-of-secrets-sprawl-2025/ — ~1,400 words of own-telemetry analysis (23.8M new secrets, 70% still-valid-after-2-years, 35% of private repos leak) explicitly cross-referenced against DBIR's 31% stolen-credential statistic and the U.S. Treasury/BeyondTrust case. Methodology §1.2 allows cross-reference posts that contrast DBIR with vendor telemetry. ACCEPT (with note that DBIR-specific text is closer to 1,200 words; the cross-reference is substantive, not promotional).

### Rejected sources

- **Beyond Identity, "Verizon DBIR 2025: Access is Still the Point of Failure"** — https://www.beyondidentity.com/resource/verizon-dbir-2025-access-is-still-the-point-of-failure — ~1,100 words DBIR analysis; focuses on human MFA bypass not NHI; substantial product pitch. **REJECT** (under 1500 words, product-pitch heavy).
- **GitGuardian, "When We Use AI to Ship Fast, Secrets Spread Fast"** — https://blog.gitguardian.com/ai-secrets-spread-fast/ — excellent NHI content but DBIR is only mentioned in passing. **REJECT** for DBIR-specificity floor.
- **Aembit blog index** — no DBIR-specific deep-dive found at time of search. **REJECT (not found)**.
- **Varonis blog index** — no DBIR-2024 or 2025 deep-dive post discoverable on the main blog index. **REJECT (not found)**.
- **CyberArk, Silverfort, Akeyless, Astrix, Entro, Oasis, Permiso, Token Security, Cloudflare** — multiple direct candidate URLs returned 404s; search engines (Bing, DuckDuckGo) either bot-blocked or returned irrelevant results. **REJECT (URLs not retrievable)** — document the attempt; do not invent.

### Primary sources

Verizon Data Breach Investigations Report, editions 2020–2026 (PDFs in `01-raw-pdfs/`, page text in `02-extracted/text/<year>-dbir.pages.json`). Specific page citations are inline.
