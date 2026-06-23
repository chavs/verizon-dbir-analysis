import type { Env, AiResponse } from '../types';
import { callAi } from '../utils/ai';
import { buildDiagrammerSystem } from '../utils/prompts';

export async function runDiagrammer(
  env: Env,
  slug: string,
  topicName: string,
  finalDraft: string,
): Promise<AiResponse> {
  const systemPrompt = buildDiagrammerSystem();
  const diagramPrompt = `Topic: ${topicName} (slug: ${slug})

FINAL ANALYSIS:
${finalDraft}

Produce Mermaid diagrams (as Mermaid code blocks in your response) for the key relationships and trends in this analysis. Each diagram should convey its point in <10 seconds for a non-security reader.

For each diagram, provide:
1. The Mermaid source code in a \`\`\`mermaid code block
2. A one-line plain-English caption
3. Which section of the analysis it supports`;

  const result = await callAi(env, systemPrompt, diagramPrompt, {
    maxTokens: 4096,
    temperature: 0.5,
    model: env.FALLBACK_MODEL, // cheaper model for diagrams
  });

  return result;
}
