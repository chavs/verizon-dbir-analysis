import type { Env, AiResponse } from '../types';
import { callAi } from '../utils/ai';
import { buildAnalystSystem } from '../utils/prompts';

export async function runAnalyst(
  env: Env,
  slug: string,
  topicName: string,
  version: 'draft-v1' | 'draft-v2',
  previousReview: string | null,
  existingDraft?: string | null,
): Promise<AiResponse> {
  const systemPrompt = buildAnalystSystem();

  if (version === 'draft-v2' && previousReview && existingDraft) {
    const revisionPrompt = `Topic: ${topicName} (slug: ${slug})\nDraft version: ${version} — REVISION based on reviewer feedback.\n\nEXISTING DRAFT (draft-v1):\n${existingDraft}\n\nREVIEWER FEEDBACK TO ADDRESS:\n${previousReview}\n\nRevise the existing draft to address ALL blocking issues from the review. Keep the same structure. Stay under 3000 words. Mark changes vs v1 in a header comment.`;

    return callAi(env, systemPrompt, revisionPrompt, { model: env.PRIMARY_MODEL });
  }

  const analystPrompt = `Topic: ${topicName} (slug: ${slug})\n\nWrite this topic as a draft document based on research. Structure it appropriately with headings. Keep it under 3000 words.`;

  return callAi(env, systemPrompt, analystPrompt, { model: env.PRIMARY_MODEL });
}
