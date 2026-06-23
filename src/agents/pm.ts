import type { Env, AiResponse } from '../types';
import { callAi } from '../utils/ai';
import { buildPmSystem } from '../utils/prompts';

export async function runPmSummary(
  env: Env,
  allFinals: Record<string, string>,
): Promise<AiResponse> {
  const systemPrompt = buildPmSystem();
  const finalsBlock = Object.entries(allFinals)
    .map(([slug, content]) => `--- ${slug} ---\n${content}`)
    .join('\n\n');

  const pmPrompt = `Read all four topic finals below and produce the executive brief.

TOPIC FINALS:
${finalsBlock}

Required sections:
  # Verizon DBIR 2020-2026 — Executive Brief
  ## TL;DR (5 bullets max)
  ## The Five Cross-Cutting Trends
  ## Budget Implications
  ## Tooling Shortlist
  ## Risks I'd Raise to Execs
  ## What I'm Not Doing And Why

Max 1500 words. Every claim must trace to a final.md.`;

  const result = await callAi(env, systemPrompt, pmPrompt, {
    maxTokens: 4096,
    temperature: 0.3,
  });

  return result;
}
