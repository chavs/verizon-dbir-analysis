# Cloudflare Deployment — dbir-agents

**Created:** 2026-06-02
**Worker URL:** https://dbir-agents.sainetworker.workers.dev
**Account ID:** de51d1ebafe63e59aec85f851879e40f

---

## Infrastructure Created

| Resource | Name | Status |
|----------|------|--------|
| Worker | `dbir-agents` | ✅ Live at `dbir-agents.sainetworker.workers.dev` |
| D1 Database | `dbir-analysis` | ✅ Created (ID: `901ecf8b-3425-471b-9bcf-b16171522e45`) |
| Vectorize Index | `dbir-chunks` | ✅ Created (1024 dims, cosine) |
| Workflow | `dbir-pipeline` | ✅ 7-step pipeline registered |
| Durable Object | `PipelineState` | ✅ Class registered |
| R2 Bucket | `dbir-pdfs` | ❌ Needs enablement in Cloudflare dashboard |
| Browser Rendering | — | ❌ Needs Workers Paid plan |

## Worker Bindings

| Binding | Resource |
|---------|----------|
| `env.AI` | Workers AI |
| `env.DB` | D1 Database (`dbir-analysis`) |
| `env.VECTORIZE` | Vectorize Index (`dbir-chunks`) |
| `env.DBIR_PIPELINE` | Workflow (`dbir-pipeline`) |
| `env.PIPELINE_STATE` | Durable Object |

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` or `/health` | Health check |
| POST | `/pipeline/run` | Start pipeline (body: `{"topics":["topic-1"], "mode":"sequential"}`) |
| GET | `/pipeline/:id` | Pipeline status |
| GET | `/pipeline/:id/artifacts` | List artifacts for pipeline |
| GET | `/artifacts/:id` | Get artifact content |
| GET | `/reports` | List completed reports |

## Models Used

- **Primary:** `@cf/moonshotai/kimi-k2.6` — Analyst, Reviewer, PM (Personas 1, 2, 4)
- **Fallback:** `@cf/meta/llama-3.1-8b-instruct` — Diagrammer (Persona 3), error recovery

## To Enable R2 (Required for full pipeline)

1. Go to https://dash.cloudflare.com/ → R2
2. Click "Enable R2" (free tier: 10GB storage, 10M reads/month)
3. Then uncomment the `[[r2_buckets]]` section in `wrangler.toml`
4. Run: `wrangler r2 bucket create dbir-pdfs`
5. Run: `wrangler deploy`

## Deploy Commands

```powershell
$env:CLOUDFLARE_API_TOKEN=""   # if set
wrangler deploy                 # deploys worker
wrangler d1 migrations apply dbir-analysis --remote  # apply DB schema
```
