# Verizon DBIR Multi-Agent Analysis Pipeline

> AI-powered multi-agent pipeline for analyzing Verizon Data Breach Investigations Reports (DBIR) 2020–2026 on Cloudflare Workers.

## What This Project Does

This pipeline uses multiple AI agents to analyze DBIR topics of interest:

1. **Analyst Agent** — Produces research drafts with DBIR citations, MITRE ATT&CK mapping, and third-party source evaluation
2. **Reviewer Agent** — Critical review with blocking issues and suggested fixes
3. **Diagrammer Agent** — Mermaid diagrams for non-security audiences
4. **PM Agent** — Executive brief for CISO/CTO budget decisions

### Completed Research Topics

| Topic | Slug | Key Finding |
|-------|------|-------------|
| **Non-Human Identities (NHI)** | `topic-1-nhi` | 441K leaked secrets/year; 94-day median remediation; OAuth-app supply chain attacks |
| **Supply Chain Security** | `topic-2-supply-chain` | Third-party involvement exploded from sub-pattern → **48% of breaches by 2026** |
| **Application Security** | `topic-3-appsec` | Web-app attacks never declined; taxonomy just splintered the metrics |
| **Vulnerability Remediation** | `topic-4-vuln-remediation` | Patch capacity collapsing: 26% KEV remediated, 43-day median, 184M open at Day 28 |

See the final reports in [`03-research/`](03-research/) and executive summary in [`05-executive-summary/pm-brief.md`](05-executive-summary/pm-brief.md).

---

## Quick Start for New Users

### Prerequisites

- [Cloudflare account](https://dash.cloudflare.com) (free tier works)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) installed

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/chavs/verizon-dbir-analysis.git
cd verizon-dbir-analysis

# 2. Install dependencies
npm install

# 3. Copy config template and fill in your values
cp wrangler.toml.example wrangler.toml
# Edit wrangler.toml:
# - Add your account_id (from Cloudflare dashboard)
# - Create a D1 database: wrangler d1 create dbir-analysis
# - Add the returned database_id to wrangler.toml

# 4. Set secrets
wrangler secret put PRIMARY_MODEL
# Enter: @cf/moonshotai/kimi-k2.6

# 5. Create database tables
wrangler d1 execute dbir-analysis --remote --file=./migrations/0001_001_create_tables.sql

# 6. Deploy
wrangler deploy
```

### Running the Pipeline

```bash
# Trigger via POST
POST https://your-worker.your-subdomain.workers.dev/pipeline/run
Content-Type: application/json

{
  "topics": ["Non-Human Identities", "Supply Chain Security", "Application Security", "Vulnerability Remediation"]
}
```

---

## Customizing for Your Own Topics

### Option 1: Use Different Topics

Edit the topics in the API call. The pipeline will:
1. Extract keywords from DBIR PDFs
2. Generate draft → review → revise cycle
3. Produce final report with diagrams

### Option 2: Customize Agent Personas

See [`00-process/agent-personas.md`](00-process/agent-personas.md) for how to define new analyst/reviewer personas and focus areas.

### Option 3: Adjust AI Models

The pipeline has a **5-model fallback chain** with response caching:

| Priority | Model | Best For |
|----------|-------|----------|
| 1 | `@cf/moonshotai/kimi-k2.6` | Primary (262K context) |
| 2 | `@cf/meta/llama-3.1-8b-instruct` | Fallback (8K context) |
| 3 | `@cf/meta/llama-3.2-1b-instruct` | Cost-saving |
| 4 | `@cf/meta/llama-3.2-3b-instruct` | Balanced |
| 5 | `@cf/meta/phi-3-mini-4k-instruct` | Ultra-small |

Caching is automatic via D1 with 24-hour TTL.

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                     Cloudflare Workers                      │
│  ┌────────────┐  ┌────────────┐  ┌─────────────────────┐  │
│  │AI Gateway  │  │D1 Cache    │  │Pipeline Controller  │  │
│  │(5 models)  │  │(24h TTL)   │  │(Workflow.ts)        │  │
│  └────────────┘  └────────────┘  └─────────────────────┘  │
│         ┌──────────────────────────────────────┐           │
│         │    Multi-Agent Pipeline (Parallel)   │           │
│         │  ┌─────────┐  ┌─────────┐  ┌──────┐  │           │
│         │  │Analyst  │  │Reviewer │  │ PM   │  │           │
│         │  │Agent    │  │Agent    │  │Brief │  │           │
│         │  └─────────┘  └─────────┘  └──────┘  │           │
│         └──────────────────────────────────────┘           │
└────────────────────────────────────────────────────────────┘
```

See [`00-process/methodology.md`](00-process/methodology.md) for full pipeline documentation.

---

## File Structure

```
verizon-dbir-analysis/
├── src/                          # Pipeline source code
│   ├── agents/                   # Analyst, Reviewer, Diagrammer, PM
│   ├── utils/                    # AI caching, prompts, R2 helpers
│   ├── index.ts                  # Worker entry point
│   └── workflow.ts               # Pipeline orchestration
├── 00-process/                   # Methodology, personas, setup docs
├── 03-research/                  # Generated topic research
│   ├── topic-1-nhi/final.md
│   ├── topic-2-supply-chain/final.md
│   ├── topic-3-appsec/final.md
│   └── topic-4-vuln-remediation/final.md
├── 04-diagrams/                  # Mermaid diagram sources
├── 05-executive-summary/         # PM brief
├── migrations/                   # D1 database schema
├── wrangler.toml.example         # Config template (copy and customize)
└── README.md                     # This file
```

---

## License

MIT — feel free to fork and adapt for your own DBIR research or other longitudinal report analysis.

---

## Credits

- Built with [Cloudflare Workers](https://workers.cloudflare.com) and [Workers AI](https://ai.cloudflare.com)
- Data source: [Verizon DBIR](https://www.verizon.com/business/resources/reports/dbir/) 2020–2026
