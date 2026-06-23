# DBIR Diagrams Index

## Diagram Files

Diagrams are organized by topic with `.mmd` source files and `.caption.txt` descriptions.
Render to PNG using `mmdc` or paste into https://mermaid.live.

---

## Topic 1: Non-Human Identities

| File | Description |
|------|-------------|
| `custom/topic-1-nhi/nhi-attack-flow.mmd` | NHI compromise paths: leaked secrets lead to OAuth replay; weak service accounts enable Kerberoasting; CI/CD pipelines amplify blast radius. |

---

## Topic 2: Supply Chain Security

| File | Description |
|------|-------------|
| `custom/topic-2-supply-chain/supply-chain-archetypes.mmd` | Three vendor archetypes converge on customer breach: code compromise, data-hosting credential abuse, or direct network pivot. |

---

## Topic 3: Application Security

| File | Description |
|------|-------------|
| `custom/topic-3-appsec/appsec-taxonomy-evolution.mmd` | BWAA "decline" is taxonomy illusion — incidents moved to Supply Chain and System Intrusion, not disappeared. |

---

## Topic 4: Vulnerability Remediation

| File | Description |
|------|-------------|
| `custom/topic-4-vuln-remediation/exploit-vs-patch-race.mmd` | Defenders lose the race: 29% of edge CVEs exploited on/before publication day; median patch takes 43 days with only 26% fully remediated. |

---

## Executive Summary

| File | Description |
|------|-------------|
| `custom/exec-summary/cross-trend-convergence.mmd` | All four trends converge on one architectural principle: replace long-lived shared credentials with short-lived, narrowly scoped, attestable identities for every workload, human, and AI agent. |

---

## How to Render

### Option 1: Mermaid CLI (Node.js)
```bash
npx @mermaid-js/mermaid-cli mmdc -i custom/topic-1-nhi/nhi-attack-flow.mmd -o custom/topic-1-nhi/nhi-attack-flow.png
```

### Option 2: Mermaid Live Editor
Paste `.mmd` contents into https://mermaid.live and export PNG/SVG.

### Option 3: VS Code Extension
Install "Markdown Preview Mermaid Support" or "Mermaid Chart" extensions.
