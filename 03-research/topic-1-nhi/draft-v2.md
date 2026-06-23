# Non-Human Identities (NHI) in the Verizon DBIR, 2020–2026

> Draft v2 — Persona #1, addressing Round 1 review. Changes vs v1: Glossary added; single-vendor source problem disclosed as Unresolved Dispute with one independent corroborator (NHIMG) added; 25–50× claim downgraded with multi-source caveat; VERIS `Secrets` data variety distinguished from cryptographic secrets throughout; 94-day caveat travels with the number; regex section replaced with canonical-source references.

---

## Glossary

**AD** Active Directory · **AiTM** Adversary-in-the-Middle (Evilginx/Tycoon-class real-time MFA-interception kits) · **BWAA** Basic Web Application Attacks (DBIR pattern) · **CAE** Continuous Access Evaluation (Entra mid-session token revocation) · **CI/CD** Continuous Integration/Deployment · **CIDR** IP range notation · **CMDB** Configuration Management Database · **IaaS/PaaS/SaaS** Infra/Platform/Software-as-a-Service · **IAB** Initial Access Broker · **IAM** Identity and Access Management · **JWT** JSON Web Token (signed base64 credential for service-to-service auth) · **KEV** CISA Known Exploited Vulnerabilities · **mTLS** mutual TLS · **MFA** Multi-Factor Auth · **MTTR** Mean Time To Remediate · **OIDC** OpenID Connect (identity layer on OAuth 2.0) · **OAuth** access-token authorization framework · **PAT** Personal Access Token · **PKCE** Proof Key for Code Exchange (RFC 7636) · **SAML** XML SSO protocol · **SCIM** RFC 7644 user-provisioning standard · **SOC** Security Operations Center · **SPIFFE/SPIRE/SVID** workload-identity standard / reference implementation / the credential it issues · **SPN** Service Principal Name (AD attribute; Kerberoasting target) · **TGS-REQ** Kerberos Ticket Granting Service Request · **TTL** Time To Live · **VERIS** DBIR's data schema. **Critical:** VERIS `Secrets` *data variety* = confidential information (trade secrets, classified data) — **different from** cryptographic secrets (keys, tokens).

---

## 1. Definition & Scope

**Non-human identities (NHI)** = any authenticatable principal that isn't a person logging in interactively: service accounts (AD, Linux, K8s), workload identities (SPIFFE SVIDs, AWS IAM roles, Azure managed identities, GCP service accounts), API keys and OAuth client credentials, signing/code-signing certs, SSH private keys, DB connection strings, JWTs, CI/CD tokens (GitHub Actions OIDC, GitLab tokens, Jenkins creds), bot accounts, agentic-AI service identities.

NHIs differ from humans along four axes: (a) **they outnumber humans by a large factor in cloud-native estates** — vendor-derived industry estimate of 25–50× (NHIMG [https://nhimg.org/nhi-challenges] and GitGuardian both cite 25–50×; Microsoft Entra cites "10–50×"; DBIR does not publish this ratio); (b) long-lived static secrets, not session-bound; (c) lifecycle ownership unclear after original developer leaves; (d) MFA in phone-prompt/OTP form rarely applicable, though workload MFA via hardware-bound keys and SPIRE attestation exists.

**Taxonomy caveat.** DBIR has no named "NHI" category in 2020–2026. NHI signal is scattered across VERIS `Credentials` and `Secrets` data varieties, the `Use of stolen credentials` action, the `service account` keyword (explicit in only 3 of 7 reports), and (from 2025) leaked-secrets-in-git-repos discussion. **Critical disambiguation:** VERIS `Secrets` *data variety* means confidential information (trade secrets, classified data) — **not** cryptographic credentials. 2025 is the first edition with a non-password-credentials sidebar [DBIR-2025, p.17] and therefore the first where DBIR "secrets" means what a SecOps engineer means. Pre-2024 trendlines here are inferred from credential-abuse stats. §6 flags this.

## 2. DBIR Trendline 2020–2026

7-year arc = **gradual recognition**: NHI risk exists in every year's data, but Verizon only names and dissects it starting in 2025.

- **2020 (17 hits)** — Credential theft "ubiquitous"; >80% of Hacking breaches use brute force or stolen credentials [DBIR-2020, p.19]. Credential stuffing vs SSH/Telnet honeypots [DBIR-2020, p.20]. VERIS-`Secrets` in Cyber-Espionage [DBIR-2020, p.36] = IP theft.
- **2021 (10 hits)** — System Intrusion pattern introduced; VERIS-`Secrets` again in espionage [DBIR-2021, p.54, p.93] (still IP meaning). Brute-force/credential-stuffing in SIEM data [DBIR-2021, p.60].
- **2022 (11 hits)** — Credentials = 72% of compromised data in APAC [DBIR-2022, p.80]. VERIS-`Secrets` percentages in regional breakdowns = confidential business data, **not** cryptographic credentials, so **not used here as NHI signal**. 2FA + password-managers recommendation [DBIR-2022, p.103] does not apply to NHIs.
- **2023 (5 hits — sample-size drop)** — First explicit `service accounts` mention in CIS Control 5 mapping [DBIR-2023, p.66]. BWAA maps to MITRE T1078 Valid Accounts and T1550.001 Application Access Token [DBIR-2023, p.35].
- **2024 (10 hits)** — Credential abuse continues to dominate; credential stuffing and brute force broken out; APIs explicitly named as targets [DBIR-2024, p.44].
- **2025 (25 hits — inflection point, ~2.5× the 2024 count)** — First DBIR with a **non-password-credentials sidebar** [DBIR-2025, p.17]; "secrets" finally means cryptographic secrets. From a secrets-scanning contributor: n=441,780 leaked secrets in public git repos; web-app-infra = 39% (66% of those JWTs); cloud = 43% GCP API keys; CI/CD = 50% GitLab tokens; **median time-to-remediate a leaked GitHub secret = 94 days (n=141, public-repo-only, single contributor — see §6)** [DBIR-2025, p.17, Fig. 12 & 13]. Snowflake dissected: ~165 victim orgs, ~80% had prior credential exposure, MFA not enforced [DBIR-2025, p.16]. Token theft = #1 M365 MFA-bypass at 31% [DBIR-2025, p.47]. Kerberoasting + rogue-VM service-account abuse (UNC5221) [DBIR-2025, p.102].
- **2026 (20 hits)** — Verizon names insecure NHI authentication as root cause: "cloud-based, third-party incidents… boil down to insecure authentication (absence of MFA, improper credential rotation) or lack of least privilege enforcement for users or service accounts" [DBIR-2026, p.21]. Salesloft Drift → Salesforce / ShinyHunters (UNC6040): "customer OAuth tokens… from the Salesloft Drift application were compromised… and then used against the Salesforce platform" [DBIR-2026, p.21]. Median credential-leak events (aggregate human+machine — not NHI-specific): 7/yr small, 20/yr large [DBIR-2026, p.45]. 50% of ransomware victims had a credential or infostealer event within 95 days prior [DBIR-2026, p.44]. Kerberoasting + cert forging vs "service accounts that are misconfigured and have weak passwords" [DBIR-2026, p.68]. GitHub Actions cascade exposed secrets in 23,000+ repos [DBIR-2026, p.108].

**Inflection point: 2025.** Per-year NHI-keyword hits: 17/10/11/5/10/**25**/20 — a 2.5× jump in 2025. Pre-2025 NHI risk is implicit in credential stats; from 2025 it is named, measured, and tied to service categories (web-infra, CI/CD, cloud, DB). Third-party-breach % doubling from 15% to 30% [DBIR-2025, p.11] is the macro driver — most of those incidents are NHI compromises (OAuth tokens, API keys, machine creds in vendor environments).

## 3. Threat Actor TTPs (MITRE ATT&CK mapped)

Mapped to ATT&CK Enterprise v15. Citations point to DBIR years where the technique is named, observed, or implicitly described in the page text.

| Tactic | Technique ID | Technique | Observed in DBIR year(s) |
|---|---|---|---|
| Credential Access | T1110 / T1110.001–.004 | Brute Force / Password Guessing / Cracking / Spraying / Stuffing | 2020 p.20, 2023 p.35, 2024 p.42, 2025 p.53 |
| Credential Access | T1003 | OS Credential Dumping (LSASS) | 2026 p.68 — 20% of incidents, 34% of TI reports |
| Credential Access | T1558.003 | Steal/Forge Kerberos Tickets — Kerberoasting | 2026 p.68 (red-team-dominant) |
| Credential Access | T1552.001 | Unsecured Credentials: Credentials In Files | 2025 p.17 (441,780 leaked secrets); 2026 p.108 (GitHub Actions cascade) |
| Credential Access | T1528 | Steal Application Access Token | 2025 p.47 (token theft = 31% of MFA bypass); 2026 p.21 (Salesloft Drift OAuth) |
| Credential Access | T1606.002 | Forge Web Credentials: SAML Tokens / cert forging | 2026 p.68 (cert forging in red-team data) |
| Defense Evasion / Persistence | T1078 / T1078.001–.004 | Valid Accounts (Default / Domain / Local / Cloud) | 2023 p.35, 2024 p.42, 2025 p.40 |
| Defense Evasion | T1550.001 | Use Alternate Authentication Material: Application Access Token | 2023 p.35, 2024 p.42 |
| Initial Access | T1199 | Trusted Relationship (vendor / OAuth-app supply chain) | 2025 p.16, 2026 p.21 (Salesloft Drift) |
| Initial Access | T1190 | Exploit Public-Facing Application (edge devices holding NHI creds) | 2025 p.16, 2026 p.108 |
| Initial Access | T1133 | External Remote Services (VPN with embedded creds) | 2023 p.35, 2024 p.42, 2026 p.45 (44% of IAB offerings are VPN) |
| Privilege Escalation | T1098.003 | Account Manipulation: Additional Cloud Roles | 2026 p.21 (excessive privilege in IaaS/PaaS/SaaS) |
| Persistence | T1136.003 | Create Account: Cloud Account (rogue service accounts on hypervisor) | 2025 p.102 (UNC5221) |
| Exfiltration | T1567.002 | Exfiltration to Cloud Storage via stolen API keys | 2025 p.40 (System Intrusion) |

**Direction of travel.** NHI-targeted techniques (T1552.001, T1528, T1558.003) are **emerging alongside** brute force (T1110) — not yet displacing it. T1110 still dominates BWAA volume [DBIR-2025, p.53; DBIR-2026, p.42–45]. 2025–2026 shows these techniques moving from "rare/red-team-only" to "named real-world campaigns" (Salesloft Drift, UNC5221, GitHub Actions cascade).

## 4. Notable Incidents Referenced by DBIR

- **Snowflake customer compromise (2024, in DBIR-2025)** — ~165 victim orgs; ~80% of accounts had prior credential exposure; MFA not enforced [DBIR-2025, p.16]. Per DBIR p.16, this is *primarily* a human-credential-reuse + missing-MFA story; NHI lesson is *adjacent* — same controls (mandatory MFA, token expiration, rotation, infostealer hygiene) apply to machine principals.
- **U.S. Treasury / BeyondTrust (Jan 2025)** — Silk Typhoon "stole a BeyondTrust security key, granting remote access to classified workstations" [DBIR-2026, p.108]. The "security key" is a BeyondTrust API/integration credential — an NHI artifact, not a human FIDO2 token.
- **GitHub Actions cascading supply-chain breach (Mar 2025)** — "Cascading breach of GitHub Actions exposed secrets for more than 23,000 repositories" [DBIR-2026, p.108]. Pure CI/CD NHI incident.
- **Salesloft Drift → Salesforce / ShinyHunters (UNC6040, 2025)** — OAuth tokens stolen from the Salesloft Drift SaaS vendor, replayed against Salesforce to exfiltrate customer data [DBIR-2026, p.21]. Textbook 2026 NHI breach: vendor NHI compromise chains into customer-data exfiltration.
- **UNC5221 / rogue VMs via hypervisor service accounts (2023, retro-analyzed 2025)** — Rogue VMs "created and managed through service accounts directly on the hypervisor rather than through administrative consoles" [DBIR-2025, p.102]. Service-account compromise defeats tier-0 admin-console logging.
- **Ivanti Connect Secure zero-days (CVE-2025-0282 et al.)** — SPAWN malware ecosystem [DBIR-2026, p.108] persists by harvesting embedded device credentials and service tokens.

## 5. Detection & Mitigation Controls (practitioner-level)

Concrete telemetry, alerts, and configuration — not "implement zero trust."

### 5.1 Inventory & discovery (do this first)
- Continuous NHI inventory from: AWS IAM (`ListUsers`/`ListRoles`/`ListAccessKeys` + `LastUsedDate`); Entra service principals + managed identities (`GET /servicePrincipals`, `signInActivity`); GCP `iam.serviceAccounts.list` + `keys.list`; Okta API tokens; GitHub App installs + PATs; GitLab PATs; K8s ServiceAccounts (`kubectl get sa -A -o json`).
- Map every NHI to a **human owner** in a CMDB field. Per GitGuardian research, the modal enterprise NHI has no recorded owner [GitGuardian, "Mythos-Ready Briefing"].

### 5.2 Secret-leak detection
- Run a secrets scanner (GitGuardian, TruffleHog, GitHub secret scanning, GitLab secret detection) over **every** repo (public AND private) plus Slack, Jira, Confluence, Docker Hub, CI build logs.
- **Use canonical detector catalogs, not your own regex.** TruffleHog detectors (https://github.com/trufflesecurity/trufflehog/tree/main/pkg/detectors) and GitHub secret-scanning partner patterns (https://docs.github.com/en/code-security/secret-scanning/secret-scanning-patterns) are the practitioner references for JWTs/AWS/GCP/GitHub/GitLab/Stripe/Slack keys.
- **Target P50 remediation under 24 hours.** DBIR median = 94 days (n=141, public-repo-only, single contributor — §6) [DBIR-2025, p.17]. The 24h-vs-94d gap *is* the problem.

### 5.3 Rotation cadences
- Static long-lived keys (AWS IAM, GCP SA JSON, on-prem service-account passwords): **rotate ≤90 days; alert on age >180 days**. Replace with short-lived tokens where supported.
- OAuth client secrets: **rotate ≤180 days**, or migrate to OIDC client assertion (JWT-bearer, RFC 7523).
- SSH host keys: on host re-image. User SSH keys for service accounts: **90 days**; prefer SSH certificates from step-ca or Vault (TTL ≤24h).
- Internal mTLS / SPIFFE SVIDs: **TTL ≤1 hour** via SPIRE.
- K8s ServiceAccount tokens: BoundServiceAccountTokenVolume (default in 1.22+) with `expirationSeconds: 3600`.

### 5.4 OIDC/OAuth scope and audience restrictions
- For GitHub Actions deploying to clouds, **delete every long-lived cloud key** and use OIDC federation. AWS: pin `token.actions.githubusercontent.com:sub` to `repo:org/repo:ref:refs/heads/main` (exact) and `aud` to `sts.amazonaws.com`. Azure: federated credential on Entra app registration scoped to the same `subject` claim. GCP: Workload Identity Pool provider with attribute conditions pinning `assertion.repository` and `assertion.ref`.
- Third-party SaaS OAuth apps: least-privilege scopes (`chat:read` not `chat:write,admin`); Entra "App consent for verified publishers only"; quarterly Salesforce Connected Apps review given Salesloft Drift [DBIR-2026, p.21].
- Enable OIDC PKCE on every first-party public client. Disable implicit flow / `response_type=token`.

### 5.5 Telemetry to log (with field names)
- **AWS CloudTrail**: alert on `eventName=GetCallerIdentity` from new source IPs; `userIdentity.type=AssumedRole` with `sessionContext.attributes.mfaAuthenticated=false`; `AssumeRole`/`GetSessionToken` where `userIdentity.userName` matches an NHI naming pattern.
- **Azure Entra sign-in logs**: filter `appDisplayName`/`servicePrincipalId` for `riskState=atRisk` or `clientAppUsed=Other clients`; alert on `tokenIssuerType=AzureAD` with `resultType≠0` spikes.
- **GitHub audit log**: `oauth_authorization.create`, `personal_access_token.access_granted`, `workflow_run.completed` with `oidc_token` events. Forward `actor`, `repo`, `oidc_token_claims`.
- **Okta System Log**: `system.api_token.create` and `policy.evaluate_sign_on` with `outcome.result=ALLOW` for API tokens.
- **M365 / Entra**: token-theft detection correlates `unfamiliarFeatures`, anomalous `deviceDetail.trustType`, impossible-travel. Token theft = #1 MFA-bypass at 31% [DBIR-2025, p.47].

### 5.6 Alerts to actually write
- AWS access key created and used from outside known CIDRs within 5 minutes.
- IAM principal gaining a managed policy with `iam:PassRole` or `*:*` not on allow-list.
- Azure service-principal credential added — almost never legitimate outside change windows.
- GitHub PAT with `repo`+`workflow` scopes used from a country outside developer's known set.
- Successful Kerberos TGS-REQ for an SPN-bearing account then hash-crack indicators [DBIR-2026, p.68].

### 5.7 Architectural fixes
- Adopt SPIFFE/SPIRE (or AWS IAM Roles Anywhere, GCP Workload Identity Federation, Azure Workload Identity) so service-to-service auth is certificate-based and per-instance.
- Vault every static secret (Vault / Secrets Manager / Akeyless / Conjur). DBIR-cited campaigns succeeded because secrets lived in repos and `.env` files, not vaults.
- Treat **AI agents as NHIs**. DBIR-2026 Secret Service appendix flags agentic AI as new attack surface [DBIR-2026, p.113] (narrative, not statistical). Issue each agent its own short-lived, narrowly scoped identity; never share API keys across agents.

## 6. Open Problems / Where the Data is Weak

- **No clean NHI taxonomy before 2024.** Pre-2024 keyword hits are dominated by VERIS `Secrets` (confidential-info meaning) and "Secret Service" (the agency). Cross-year quantitative NHI trendlines are not meaningful for 2020–2023.
- **94-day median time-to-remediate: n=141, public-repo-only, single contributor** [DBIR-2025, p.17]. Caveat repeated in §2 and §5.2. Directionally useful; not load-bearing for SLA conversations.
- **441,780-secrets figure: single-contributor, public-repo-only** [DBIR-2025, p.17]. True NHI exposure surface is materially larger.
- **DBIR does not break out NHI-driven vs human-driven credential abuse**, even in 2025/2026. "Credential abuse = 22% of initial access" [DBIR-2025] and the 7/20/yr credential-leak medians [DBIR-2026, p.45] mix human + machine credentials.
- **Salesloft Drift / Salesforce details are narrative, not statistical** [DBIR-2026, p.21]. Illustrative only.
- **`service account` keyword hits = 3 across 7 years.** Likely writer convention, not reality.
- **25–50× NHI-to-human ratio is not from DBIR** — from NHIMG, GitGuardian, CyberArk (45:1), Microsoft Entra ("10–50×"). Treat as directional industry estimate.

## 7. Forward-Looking 12–24 Month Outlook

- **Agentic-AI identity becomes the dominant NHI growth category.** GitGuardian 2026 telemetry: AI-service secrets +81% YoY. DBIR-2026 Secret Service appendix flags agentic AI as new attack surface [DBIR-2026, p.113] (narrative appendix, not statistical finding). Expect a 2027 DBIR MCP/agent-token sidebar.
- **OAuth-app supply chain becomes the #1 third-party vector** in volume, displacing software-supply-chain (SolarWinds/MOVEit-style). Salesloft Drift = first canonical case [DBIR-2026, p.21]; expect 2–3 more in 2026–2027.
- **Token theft escalates as leading credential-access method in MFA environments.** AiTM kits + stolen session cookies = 31% of M365 MFA bypass [DBIR-2025, p.47]. Move to phishing-resistant, device-bound auth (passkeys, FIDO2 + device attestation) + CAE.
- **Regulators start to mandate NHI inventory.** Australia's ransomware-payment reporting regime [DBIR-2026, p.44] is a precursor; expect EU NIS2 and US SEC follow-ups within 24 months.
- **Vault/NHI-governance vendor consolidation (opinion, unsourced).** Plausible across HashiCorp/IBM, AWS Secrets Manager, Akeyless, GitGuardian, Astrix/Entro/Aembit.

## Sources

**Word-count method:** estimates from rendered article body (excluding nav/footer/related), not `wc -w` on raw HTML; ±15% error. "X min read" tag suggesting below-floor = transparent downgrade.

### Accepted (with explicit caveats)

1. **GitGuardian, "Secrets Sprawl is Worse Than You Think: 2025 DBIR Takeaways"** (D. McDaniel, 25 Apr 2025) — https://blog.gitguardian.com/verizon-dbir-2025/ — Published "5 min read" (≈1,000–1,300 words). Ten DBIR-2025 findings dissected (441,780 leaked secrets, 94-day median, 43% GCP API keys, third-party doubling, infostealer→ransomware, explicit NHI framing). **ACCEPT-WITH-CAVEAT:** v1's "~1,700 words" was an overestimate. DBIR-specific content ~1,100–1,300 words — **below §1.2 floor**. Logged below.
2. **GitGuardian, "What the Mythos-Ready Briefing Says About Credentials"** (B. MartinMooney, 24 Apr 2026) — https://blog.gitguardian.com/what-the-mythos-ready-briefing-says-about-credentials/ — "5 min read" (~1,400–1,600 words total; DBIR-2025 portion ~600–800 words). **ACCEPT-WITH-CAVEAT:** DBIR-specific portion below floor.
3. **NHIMG, "The NHI Challenge"** — https://nhimg.org/nhi-challenges — Independent (non-vendor) industry org. Corroborates 25–50× NHI ratio, 97% over-privileged, 71% non-rotation, catalog of NHI breaches (BeyondTrust, Schneider Electric). **ACCEPT for narrow purpose** (independent corroboration of §1's ratio); not DBIR-specific.

### Rejected

- **Beyond Identity, "DBIR 2025: Access is Still the Point of Failure"** — ~1,100 words; human-MFA focus, product-pitch heavy. **REJECT**.
- **GitGuardian, "When We Use AI to Ship Fast"** — DBIR mentioned only in passing. **REJECT** (DBIR-specificity floor).
- **GitGuardian, "State of Secrets Sprawl 2025"** blog — primarily own-telemetry; v1's #3, dropped per reviewer. **REJECT**.
- **CyberArk, "Unified Security…"** — does not discuss DBIR materially. **REJECT** (off-topic).
- **Aembit, Varonis blog indexes** — no DBIR-2024/2025 deep-dive in index at search time. **REJECT (not found)**.
- **CyberArk, Silverfort, Akeyless, Astrix, Entro, Oasis, Permiso, Token Security, Wiz, Coalition, Duo, Cloudflare, BleepingComputer, Help Net Security, Dark Reading, CSO Online** — multiple URLs returned 404/403; Bing/DDG search bot-blocked or irrelevant; Wayback spot-checks failed. **REJECT (URLs not retrievable)** — attempts documented; no inventions.
- **Verizon VTRAC standalone posts** — methodology §1.2 allows these; not publicly retrievable. **REJECT (not retrievable)**.

### Primary

Verizon DBIR 2020–2026 (PDFs in `01-raw-pdfs/`; page text in `02-extracted/text/`). Citations inline.

---

## Appendix: Unresolved Disputes

**#1 — Single-vendor source dependence + word-count floor (Fix #1, #2).** Methodology requires ≥3 third-party analyses of ≥1500 DBIR-specific words. Two accepted GitGuardian posts likely contain 1,100–1,500 DBIR-specific words each; NHIMG is not DBIR-specific. No non-GitGuardian vendor produced a retrievable ≥1500-word DBIR-specific NHI deep dive — URL 404s and bot-blocked search engines constrained discovery. Brief is single-vendor-corroborated on NHI-specific DBIR analysis. Quantitative DBIR claims are independently verified against primary PDFs (*factual* integrity holds); *analytical independence* per §1.2 is not met. Future revision: richer source discovery (Common Crawl, Programmable Search, Wayback API) or formal waiver.

**#2 — Primary measurement behind 25–50× ratio (Fix #4, partial).** NHIMG and GitGuardian cite the figure; underlying survey/telemetry is opaque. CyberArk publishes 45:1 (paywalled); Microsoft Entra "10–50×." Treat as directional industry estimate until a CSA/ESG/Gartner primary is located.
