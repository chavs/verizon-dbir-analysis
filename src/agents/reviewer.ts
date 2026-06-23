import type { Env, AiResponse } from '../types';
import { callAi } from '../utils/ai';
import { buildReviewerSystem } from '../utils/prompts';

export async function runReviewer(
  env: Env,
  slug: string,
  topicName: string,
  draft: string,
  round: 1 | 2,
): Promise<AiResponse> {
  const systemPrompt = buildReviewerSystem();
  const reviewPrompt = `Review Round ${round} for topic: ${topicName} (slug: ${slug})

DRAFT TO REVIEW:
${draft}

Apply the full review checklist. Verdict must be one of: APPROVE, APPROVE WITH NITS, or REVISE.
${round === 2 ? 'This is Round 2. The author has addressed Round 1 feedback. Be strict but fair. If unresolved issues remain, require an "Unresolved Disputes" appendix in final.md.' : ''}`;

  const result = await callAi(env, systemPrompt, reviewPrompt, {
    maxTokens: 4096,
    temperature: 0.3,
  });

  return result;
}
